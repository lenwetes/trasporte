import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import { CacheService } from "@/lib/cache";
import { EstadoOrdenServicio } from "@prisma/client";
import { serializeDecimal } from "@/lib/utils";

export class MaintenanceOrderCreationService {
    static async createOrder(data: {
        vehiculoId: string;
        planId: string;
        observaciones?: string;
    }): Promise<ActionResult> {
        try {
            const year = new Date().getFullYear();
            const count = await prisma.ordenServicio.count({
                where: { codigo: { startsWith: `OS-${year}` } },
            });
            const codigo = `OS-${year}-${(count + 1).toString().padStart(4, "0")}`;

            const orden = await prisma.ordenServicio.create({
                data: {
                    codigo,
                    vehiculoId: data.vehiculoId,
                    planId: data.planId,
                    observaciones: data.observaciones,
                    estado: "PENDIENTE",
                },
            });

            await CacheService.invalidate("maint");
            return { success: true, data: serializeDecimal(orden) };
        } catch (error) {
            logger.error(
                { data, error },
                "MaintenanceOrderCreationService.createOrder error",
            );
            return {
                success: false,
                error: "Error al crear orden de servicio",
            };
        }
    }

    static async solicitarRevision(data: {
        vehiculoId: string;
        planId: string;
        kilometraje: number;
        costo: number;
        observaciones?: string;
        archivoId: string;
    }): Promise<ActionResult> {
        try {
            const ordenExistente = await prisma.ordenServicio.findFirst({
                where: {
                    vehiculoId: data.vehiculoId,
                    planId: data.planId,
                    estado: {
                        in: [
                            "PENDIENTE",
                            "EN_REVISION",
                            "RECHAZADA",
                        ] as EstadoOrdenServicio[],
                    },
                },
            });

            if (ordenExistente) {
                await prisma.ordenServicio.update({
                    where: { id: ordenExistente.id },
                    data: {
                        estado: "EN_REVISION",
                        kilometrajeReportado: data.kilometraje,
                        costoReportado: data.costo,
                        observacionesConductor: data.observaciones,
                        comprobanteId: data.archivoId,
                        fechaComprobante: new Date(),
                        motivoRechazo: null,
                    },
                });
            } else {
                const year = new Date().getFullYear();
                const count = await prisma.ordenServicio.count({
                    where: { codigo: { startsWith: `OS-${year}` } },
                });
                const codigo = `OS-${year}-${(count + 1).toString().padStart(4, "0")}`;

                await prisma.ordenServicio.create({
                    data: {
                        codigo,
                        vehiculoId: data.vehiculoId,
                        planId: data.planId,
                        estado: "EN_REVISION",
                        kilometrajeReportado: data.kilometraje,
                        costoReportado: data.costo,
                        observacionesConductor: data.observaciones,
                        comprobanteId: data.archivoId,
                        fechaComprobante: new Date(),
                    },
                });
            }

            await CacheService.invalidate("maint");
            return { success: true };
        } catch (error) {
            logger.error(
                { data, error },
                "MaintenanceOrderCreationService.solicitarRevision error",
            );
            return { success: false, error: "Error al solicitar revisión"  };
        }
    }
}
