import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import { CacheService } from "@/lib/cache";
import { MaintenancePrediction } from "./prediction-engine";

export interface FleetMaintenancePrediction extends MaintenancePrediction {
    vehiculoId: string;
    placa: string;
    daysRemaining: number;
}

export class FleetPredictionService {
    static async predictFleetMaintenance(
        userId: string,
        userRole: string,
    ): Promise<ActionResult<unknown>> {return await CacheService.remember(
            `maint:predict:fleet:${userRole}:${userId}`,
            3600,
            async () => {
                try {
                    const plans = await prisma.planMantenimiento.findMany();
                    const vehicleWhere: Prisma.VehiculoWhereInput = {
                        activo: true,
                    };

                    if (userRole === "CONDUCTOR") {
                        vehicleWhere.vinculaciones = {
                            some: { conductorId: userId, activo: true },
                        };
                    }

                    const vehicles = await prisma.vehiculo.findMany({
                        where: vehicleWhere,
                        include: {
                            mantenimientos: {
                                orderBy: { fecha: "desc"  },
                                select: {
                                    planId: true,
                                    fecha: true,
                                    kilometraje: true,
                                },
                            },
                        },
                    });

                    const usageStatsRaw = await prisma.preoperacional.groupBy({
                        by: ["vehiculoId"],
                        _min: { fecha: true, kilometraje: true },
                    });

                    const usageMap = new Map<string, { dailyKm: number }>();
                    const now = new Date();

                    usageStatsRaw.forEach((stat) => {
                        const minDate = stat._min.fecha;
                        const minKm = stat._min.kilometraje;

                        if (minDate && minKm !== null) {
                            const daysDiff =
                                (now.getTime() - minDate.getTime()) /
                                (1000 * 3600 * 24);
                            const vehicle = vehicles.find(
                                (v) => v.id === stat.vehiculoId,
                            );
                            if (
                                vehicle &&
                                vehicle.kilometrajeActual &&
                                daysDiff > 0
                            ) {
                                const kmDiff =
                                    vehicle.kilometrajeActual - minKm;
                                if (kmDiff > 0)
                                    usageMap.set(stat.vehiculoId, {
                                        dailyKm: kmDiff / daysDiff,
                                    });
                            }
                        }
                    });

                    const allPredictions: FleetMaintenancePrediction[] = [];

                    for (const vehicle of vehicles) {
                        const dailyKm = usageMap.get(vehicle.id)?.dailyKm || 0;

                        for (const plan of plans) {
                            const lastMaint = vehicle.mantenimientos.find(
                                (m) => m.planId === plan.id,
                            );
                            let predictedDate: Date | null = null;
                            let reason = "";

                            if (
                                plan.frecuencia === "TIEMPO" ||
                                plan.frecuencia === "AMBOS"
                            ) {
                                if (plan.mesesIntervalo) {
                                    const lastDate = lastMaint
                                        ? lastMaint.fecha
                                        : vehicle.creadoEn;
                                    const target = new Date(lastDate);
                                    target.setMonth(
                                        target.getMonth() + plan.mesesIntervalo,
                                    );
                                    predictedDate = target;
                                    reason = "Tiempo";
                                }
                            }

                            if (
                                (plan.frecuencia === "KILOMETROS" ||
                                    plan.frecuencia === "AMBOS") &&
                                dailyKm > 0
                            ) {
                                if (plan.kmIntervalo) {
                                    const lastKm = lastMaint
                                        ? lastMaint.kilometraje
                                        : 0;
                                    const remaining =
                                        plan.kmIntervalo -
                                        ((vehicle.kilometrajeActual || 0) -
                                            lastKm);
                                    const target = new Date();
                                    target.setDate(
                                        target.getDate() + remaining / dailyKm,
                                    );

                                    if (
                                        !predictedDate ||
                                        target.getTime() <
                                            predictedDate.getTime()
                                    ) {
                                        predictedDate = target;
                                        reason = "Uso (KM)";
                                    }
                                }
                            }

                            if (predictedDate) {
                                const daysUntil = Math.ceil(
                                    (predictedDate.getTime() - now.getTime()) /
                                        (1000 * 3600 * 24),
                                );
                                if (daysUntil > 0 && daysUntil <= 60) {
                                    allPredictions.push({
                                        vehiculoId: vehicle.id,
                                        placa: vehicle.placa,
                                        planId: plan.id,
                                        planNombre: plan.nombre,
                                        predictedDate,
                                        daysRemaining: daysUntil,
                                        dailyKmAvg: dailyKm,
                                        reason,
                                    });
                                }
                            }
                        }
                    }

                    return {
                        success: true,
                        data: allPredictions.sort(
                            (a, b) => a.daysRemaining - b.daysRemaining,
                        ),
                    };
                } catch (error) {
                    logger.error(
                        { error },
                        "Error predicting fleet maintenance",
                    );
                    return { success: false, error: "Error de cálculo masivo"  };
                }
            },
        );
    }
}
