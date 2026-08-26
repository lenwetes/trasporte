import { prisma } from "@/lib/prisma";
import { AlertsEngine } from "@/lib/alerts-engine";
import { getCachedAlertRules } from "@/actions/alertas";
import { AlertRule, MaintenancePlan } from "@/lib/alerts";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import { CacheService } from "@/lib/cache";

export class VehicleHealthService {
    static async getVehiclesHealth(): Promise<ActionResult> {
        return await CacheService.remember("fleet:health", 600, async () => {
            try {
                const alertRules = await getCachedAlertRules();

                const vehiclesWithAlerts = await prisma.vehiculo.findMany({
                    where: { activo: true },
                    select: {
                        id: true,
                        placa: true,
                        marca: true,
                        propietario: true,
                        modalidad: true,
                        documentos: {
                            select: {
                                id: true,
                                tipo: true,
                                fechaVencimiento: true,
                                archivo: {
                                    select: { id: true, nombreUnico: true },
                                },
                            },
                        },
                        vinculaciones: {
                            where: { activo: true },
                            select: {
                                id: true,
                                conductor: {
                                    select: { nombres: true, apellidos: true },
                                },
                            },
                        },
                        mantenimientos: {
                            orderBy: { fecha: "desc"  },
                            take: 10,
                            include: { plan: true },
                        },
                    },
                    orderBy: { creadoEn: "desc"  },
                });

                const maintenancePlans = await prisma.planMantenimiento.findMany();

                const vehiclesWithStatus = vehiclesWithAlerts.map((vehiculo) => {
                    const health = AlertsEngine.evaluateVehicle(
                        vehiculo as Parameters<
                            typeof AlertsEngine.evaluateVehicle
                        >[0],
                        alertRules as AlertRule[],
                        maintenancePlans as unknown as MaintenancePlan[],
                    );

                    return {
                        ...vehiculo,
                        alertLevel: health.status,
                        alerts: health.details.documents,
                        maintenanceAlerts: health.details.maintenance,
                        healthSummary: health.summary,
                    };
                });

                return { success: true, data: vehiclesWithStatus };
            } catch (error) {
                logger.error(
                    { error, context: "VehicleHealthService.getVehiclesHealth"  },
                    "Error al evaluar salud de flota",
                );
                return { success: false, error: "Error al evaluar salud de flota"  };
            }
        });
    }
}
