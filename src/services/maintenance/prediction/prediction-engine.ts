import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import { CacheService } from "@/lib/cache";
import { UsageStatsService } from "./usage-stats";

export interface MaintenancePrediction {
    planId: string;
    planNombre: string;
    predictedDate: Date;
    reason: string;
    dailyKmAvg: number;
}

export class PredictionEngine {
    static async predictNextMaintenance(
        vehiculoId: string,
    ): Promise<ActionResult<unknown>> {return await CacheService.remember(
            `maint:predict:veh:${vehiculoId}`,
            3600,
            async () => {
                try {
                    const vehiculo = await prisma.vehiculo.findUnique({
                        where: { id: vehiculoId },
                    });

                    if (!vehiculo)
                        return {
                            success: false,
                            error: "Vehículo no encontrado",
                        };

                    const stats = await UsageStatsService.calculateUsageStats(
                        vehiculoId,
                        vehiculo.kilometrajeActual || 0,
                    );
                    const dailyKm = stats.dailyKm;

                    const plans = await prisma.planMantenimiento.findMany();
                    const predictions: MaintenancePrediction[] = [];

                    for (const plan of plans) {
                        const lastMaint =
                            await prisma.mantenimientoRealizado.findFirst({
                                where: { vehiculoId, planId: plan.id },
                                orderBy: { fecha: "desc"  },
                            });

                        let predictedDate: Date | null = null;
                        let reason = "Estimación basada en uso";

                        // Time-based prediction
                        if (
                            plan.frecuencia === "TIEMPO" ||
                            plan.frecuencia === "AMBOS"
                        ) {
                            if (plan.mesesIntervalo) {
                                const lastDate = lastMaint
                                    ? lastMaint.fecha
                                    : vehiculo.creadoEn;
                                const targetDate = new Date(lastDate);
                                targetDate.setMonth(
                                    targetDate.getMonth() + plan.mesesIntervalo,
                                );

                                predictedDate = targetDate;
                                reason = "Basado en intervalo de tiempo";
                            }
                        }

                        // Distance-based prediction
                        if (
                            (plan.frecuencia === "KILOMETROS" ||
                                plan.frecuencia === "AMBOS") &&
                            dailyKm > 0
                        ) {
                            if (plan.kmIntervalo) {
                                const lastKm = lastMaint
                                    ? lastMaint.kilometraje
                                    : 0;
                                const kmSinceLast =
                                    (vehiculo.kilometrajeActual || 0) - lastKm;
                                const kmRemaining =
                                    plan.kmIntervalo - kmSinceLast;

                                const daysToCover = kmRemaining / dailyKm;
                                const targetDate = new Date();
                                targetDate.setDate(
                                    targetDate.getDate() + daysToCover,
                                );

                                if (
                                    !predictedDate ||
                                    targetDate.getTime() <
                                        predictedDate.getTime()
                                ) {
                                    predictedDate = targetDate;
                                    reason = `Basado en promedio diario de ${Math.round(dailyKm)}km`;
                                }
                            }
                        }

                        if (predictedDate) {
                            predictions.push({
                                planId: plan.id,
                                planNombre: plan.nombre,
                                predictedDate,
                                reason,
                                dailyKmAvg: dailyKm,
                            });
                        }
                    }

                    return {
                        success: true,
                        data: predictions.sort(
                            (a, b) =>
                                a.predictedDate.getTime() -
                                b.predictedDate.getTime(),
                        ),
                    };
                } catch (error) {
                    logger.error(
                        { vehiculoId, error },
                        "Error predicting maintenance",
                    );
                    return {
                        success: false,
                        error: "Error al calcular predicciones",
                    };
                }
            },
        );
    }
}
