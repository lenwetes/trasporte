import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import { IntegrationService } from "../integration.service";
import { CacheService } from "@/lib/cache";
import { serializeDecimal } from "@/lib/utils";
import { OrdenServicio } from "@prisma/client";

export class MaintenanceOrderCompletionService {
    static async completeOrder(data: {
        ordenId: string;
        kilometraje: number;
        costo: number;
        userId: string;
        observaciones?: string;
        archivoId?: string;
    }): Promise<ActionResult<OrdenServicio>> {
        const result = await prisma.$transaction(async (tx) => {
            const orden = await tx.ordenServicio.findUnique({
                where: { id: data.ordenId },
                include: { vehiculo: true },
            });
            if (!orden) throw new Error("Orden no encontrada");

            await tx.mantenimientoRealizado.create({
                data: {
                    vehiculoId: orden.vehiculoId,
                    planId: orden.planId,
                    fecha: new Date(),
                    kilometraje: data.kilometraje,
                    costo: data.costo,
                    observaciones:
                        data.observaciones || "Completado directamente",
                    archivoId: data.archivoId || null,
                    ordenServicioId: orden.id,
                },
            });

            const integrationResult = await IntegrationService.processEvent(
                "ORDEN_SERVICIO_CERRADA",
                {
                    monto: data.costo,
                    descripcion: `Cierre Orden Servicio #${orden.codigo}`,
                    creadoPorId: data.userId,
                    vehiculoId: orden.vehiculoId,
                    terceroId: orden.vehiculo?.propietarioId || undefined,
                },
                tx,
            );
            if (!integrationResult.success)
                throw new Error(
                    `Error Integración Contable: ${integrationResult.error}`,
                );

            const updatedOrder = await tx.ordenServicio.update({
                where: { id: orden.id },
                data: {
                    estado: "COMPLETADA",
                    transaccionId: integrationResult.transaccion?.id,
                },
            });

            if (data.kilometraje > (orden.vehiculo.kilometrajeActual || 0)) {
                await tx.vehiculo.update({
                    where: { id: orden.vehiculoId },
                    data: { kilometrajeActual: data.kilometraje },
                });
            }
            return { success: true, data: updatedOrder };
        });

        if (result.success) {
            await CacheService.invalidate("maint");
            const ord = result.data as { vehiculoId?: string } | undefined;
            if (ord?.vehiculoId)
                await CacheService.invalidate(
                    `maint:predict:veh:${ord.vehiculoId}`,
                );
        }
        return serializeDecimal(result);
    }

    static async approveOrder(id: string, userId: string = "SYSTEM_VALIDATION"): Promise<ActionResult<OrdenServicio>> {
        const result = await prisma.$transaction(async (tx) => {
            const orden = await tx.ordenServicio.findUnique({
                where: { id },
                include: { vehiculo: true },
            });
            if (!orden) throw new Error("Orden no encontrada");

            await tx.mantenimientoRealizado.create({
                data: {
                    vehiculoId: orden.vehiculoId,
                    planId: orden.planId,
                    fecha: new Date(),
                    kilometraje: orden.kilometrajeReportado || 0,
                    costo: orden.costoReportado || 0,
                    observaciones: `Completado vía Orden ${orden.codigo}. ${orden.observacionesConductor || ""}`,
                    archivoId: orden.comprobanteId,
                    ordenServicioId: orden.id,
                },
            });

            const integrationResult = await IntegrationService.processEvent(
                "ORDEN_SERVICIO_CERRADA",
                {
                    monto: orden.costoReportado || 0,
                    descripcion: `Cierre Orden Servicio #${orden.codigo} (Validación)`,
                    creadoPorId: userId,
                    vehiculoId: orden.vehiculoId,
                    terceroId: orden.vehiculo?.propietarioId || undefined,
                },
                tx,
            );

            if (!integrationResult.success) {
                throw new Error(`Error Integración Contable: ${integrationResult.error}`);
            }

            const updatedOrder = await tx.ordenServicio.update({
                where: { id: orden.id },
                data: { 
                    estado: "COMPLETADA",
                    transaccionId: integrationResult.transaccion?.id
                },
            });

            if (
                orden.kilometrajeReportado &&
                orden.kilometrajeReportado >
                    (orden.vehiculo.kilometrajeActual || 0)
            ) {
                await tx.vehiculo.update({
                    where: { id: orden.vehiculoId },
                    data: { kilometrajeActual: orden.kilometrajeReportado },
                });
            }
            return { success: true, data: updatedOrder };
        });

        if (result.success) {
            await CacheService.invalidate("maint");
            const ord = result.data as { vehiculoId?: string } | undefined;
            if (ord?.vehiculoId)
                await CacheService.invalidate(
                    `maint:predict:veh:${ord.vehiculoId}`,
                );
        }
        return serializeDecimal(result);
    }

    static async submitComprobante(data: {
        ordenId: string;
        kilometraje: number;
        costo: number;
        observaciones?: string;
        archivoId: string;
    }): Promise<ActionResult<OrdenServicio>> {
        try {
            const result = await prisma.ordenServicio.update({
                where: { id: data.ordenId },
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
            await CacheService.invalidate("maint");
            return serializeDecimal({ success: true, data: result });
        } catch (error) {
            logger.error(
                { data, error },
                "MaintenanceOrderCompletionService.submitComprobante error",
            );
            return { success: false, error: "Error al subir comprobante"  };
        }
    }
}

