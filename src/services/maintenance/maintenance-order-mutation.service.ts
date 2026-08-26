import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import { CacheService } from "@/lib/cache";
import { MantenimientoRealizado, OrdenServicio, Prisma } from "@prisma/client";
import { serializeDecimal } from "@/lib/utils";
import { MaintenanceOrderCreationService } from "./maintenance-order-creation.service";
import { MaintenanceOrderCompletionService } from "./maintenance-order-completion.service";

/**
 * MaintenanceOrderMutationService
 * Facade for maintenance order operations.
 */
export class MaintenanceOrderMutationService {
    static async createRecord(
        data: Prisma.MantenimientoRealizadoCreateInput,
    ): Promise<ActionResult<MantenimientoRealizado>> {
        const result = await prisma.$transaction(async (tx) => {
            const m = await tx.mantenimientoRealizado.create({
                data,
                include: { vehiculo: true, plan: true },
            });
            if (data.kilometraje > (m.vehiculo.kilometrajeActual || 0)) {
                await tx.vehiculo.update({
                    where: { id: m.vehiculoId },
                    data: { kilometrajeActual: data.kilometraje },
                });
            }
            return { success: true, data: serializeDecimal(m) as MantenimientoRealizado };
        });

        if (result.success) {
            await CacheService.invalidate("maint");
            const m = result.data as { vehiculoId?: string } | undefined;
            if (m?.vehiculoId)
                await CacheService.invalidate(
                    `maint:predict:veh:${m.vehiculoId}`,
                );
        }
        return result;
    }

    static async createOrder(data: {
        vehiculoId: string;
        planId: string;
        observaciones?: string;
    }) {
        return MaintenanceOrderCreationService.createOrder(data);
    }

    static async solicitarRevision(data: {
        vehiculoId: string;
        planId: string;
        kilometraje: number;
        costo: number;
        observaciones?: string;
        archivoId: string;
    }) {
        return MaintenanceOrderCreationService.solicitarRevision(data);
    }

    static async completeOrder(data: {
        ordenId: string;
        kilometraje: number;
        costo: number;
        userId: string;
        observaciones?: string;
        archivoId?: string;
    }) {
        return MaintenanceOrderCompletionService.completeOrder(data);
    }

    static async approveOrder(id: string, userId?: string) {
        return MaintenanceOrderCompletionService.approveOrder(id, userId);
    }

    static async submitComprobante(data: {
        ordenId: string;
        kilometraje: number;
        costo: number;
        observaciones?: string;
        archivoId: string;
    }) {
        return MaintenanceOrderCompletionService.submitComprobante(data);
    }

    static async updateOrder(
        id: string,
        data: Prisma.OrdenServicioUpdateInput,
    ): Promise<ActionResult<OrdenServicio>> {
        try {
            const version = typeof data.version === 'number' ? data.version : undefined;
            const { version: _v, ...updateData } = data;
            
            const result = await prisma.ordenServicio.updateMany({
                where: { 
                    id,
                    ...(version !== undefined ? { version } : {})
                },
                data: {
                    ...updateData,
                    version: { increment: 1 }
                },
            });

            if (result.count === 0) {
                const exists = await prisma.ordenServicio.findUnique({ where: { id } });
                if (!exists) return { success: false, error: "Orden no encontrada" };
                return { success: false, error: "Conflicto de concurrencia: La orden fue modificada recientemente." };
            }

            const orden = await prisma.ordenServicio.findUnique({ where: { id } });
            await CacheService.invalidate("maint");
            return { success: true, data: serializeDecimal(orden) as OrdenServicio };
        } catch (error) {
            logger.error(
                { id, data, error },
                "MaintenanceOrderMutationService.updateOrder error",
            );
            return { success: false, error: "Error al actualizar orden" };
        }
    }

    static async rejectOrder(
        id: string,
        motivo: string,
        currentVersion?: number,
    ): Promise<ActionResult<OrdenServicio>> {
        try {
            const result = await prisma.ordenServicio.updateMany({
                where: { 
                    id,
                    ...(currentVersion !== undefined ? { version: currentVersion } : {})
                },
                data: { 
                    estado: "RECHAZADA", 
                    motivoRechazo: motivo,
                    version: { increment: 1 }
                },
            });

            if (result.count === 0) {
                const exists = await prisma.ordenServicio.findUnique({ where: { id } });
                if (!exists) return { success: false, error: "Orden no encontrada" };
                return { success: false, error: "Conflicto de concurrencia: La orden fue modificada recientemente." };
            }

            const orden = await prisma.ordenServicio.findUnique({ where: { id } });
            await CacheService.invalidate("maint");
            return { success: true, data: serializeDecimal(orden) as OrdenServicio };
        } catch (error) {
            logger.error(
                { id, motivo, error },
                "MaintenanceOrderMutationService.rejectOrder error",
            );
            return { success: false, error: "Error al rechazar orden" };
        }
    }
}

