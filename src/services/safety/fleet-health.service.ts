import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import { Vehiculo, Preoperacional } from "@prisma/client";

export class FleetHealthService {
    static async getStatus(): Promise<ActionResult> {
        try {
            const vehiculos = await prisma.vehiculo.findMany({
                where: { eliminadoEn: null },
                include: {
                    preoperacionales: {
                        orderBy: { fecha: "desc"  },
                        take: 1,
                        include: {
                            conductor: {
                                select: { nombres: true, apellidos: true },
                            },
                        },
                    },
                },
            });

            const fleetStatus = vehiculos.map(
                (
                    v: Vehiculo & {
                        preoperacionales: (Preoperacional & {
                            conductor: { nombres: string; apellidos: string };
                        })[];
                    },
                ) => {
                    const lastPreop = v.preoperacionales[0];
                    let status: "GREEN" | "YELLOW" | "RED" | "OVERRIDE" =
                        "GREEN";
                    let reason = "Operativo";
                    let isOverride = false;

                    if (v.overrideActivo) {
                        status = "OVERRIDE";
                        reason =
                            v.justificacionOverride ||
                            "Habilitado por Super-Usuario";
                        isOverride = true;
                    } else if (!v.activo) {
                        status = "RED";
                        reason = "BLOQUEADO (Administrativo)";
                    } else if (!lastPreop) {
                        status = "RED";
                        reason = "Sin inspección registrada";
                    } else {
                        // ... rest of the logic
                        const lastDate = new Date(
                            lastPreop.fecha || Date.now(),
                        );
                        const now = new Date();
                        const diffHours =
                            (now.getTime() - lastDate.getTime()) /
                            (1000 * 60 * 60);

                        if (lastPreop.resultado === "RECHAZADO") {
                            status = "RED";
                            reason = "FALLA CRÍTICA DETECTADA";
                        } else if (diffHours > 24) {
                            status = "YELLOW";
                            reason = "Inspección vencida (>24h)";
                        } else if (
                            lastPreop.observaciones &&
                            lastPreop.observaciones.length > 5
                        ) {
                            status = "YELLOW";
                            reason = "Con observaciones preventivas";
                        }
                    }

                    return {
                        id: v.id,
                        placa: v.placa,
                        marca: v.marca,
                        modelo: v.modelo,
                        kilometraje: v.kilometrajeActual,
                        status,
                        reason,
                        isOverride,
                        justificacion: v.justificacionOverride,
                        lastInspection: lastPreop
                            ? {
                                  id: lastPreop.id,
                                  fecha: lastPreop.fecha,
                                  conductor: `${lastPreop.conductor.nombres} ${lastPreop.conductor.apellidos}`,
                                  resultado: lastPreop.resultado,
                              }
                            : null,
                    };
                },
            );

            return {
                success: true,
                data: fleetStatus,
            };
        } catch (error) {
            logger.error({ error }, "FleetHealthService.getStatus error");
            return {
                success: false,
                error: "Error al obtener estado de flota",
            };
        }
    }
}
