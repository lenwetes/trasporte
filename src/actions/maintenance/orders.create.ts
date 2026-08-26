"use server";

import { createAuditLog } from "@/actions/audit";
import { revalidatePath } from "next/cache";
import { NotificationService } from "@/services/notification.service";
import { MaintenanceService } from "@/services/maintenance.service";
import { ActionResult } from "@/types";
import { withAuth } from "@/lib/safe-action";
import { hasPermission, unauthorizedResponse } from "@/lib/permissions";
import logger from "@/lib/logger";
import {
    CreateOrdenServicioSchema,
    SubmitComprobanteOrdenSchema,
    SolicitarRevisionSchema,
    CreateOrdenServicio,
    SubmitComprobanteOrden,
    SolicitarRevision,
} from "@/lib/validations/maintenance";
import { prisma } from "@/lib/prisma";

/**
 * 5.1 Patrón: Crear Orden de Servicio
 */
export const createOrdenServicio = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        // 1. RBAC
        if (!hasPermission(session.user.rol, "MANTENIMIENTO", "CREATE")) {
            return unauthorizedResponse();
        }

        const dataInputCast = dataInput as CreateOrdenServicio;

        // 2. Zod
        const validation = CreateOrdenServicioSchema.safeParse(dataInputCast);
        if (!validation.success) {
            return {
                success: false,
                error: "Datos de orden inválidos",
                errors: validation.error.flatten().fieldErrors,
            };
        }

        const data = validation.data;

        // 3. Logic + Audit + Revalidate
        try {
            const result = await MaintenanceService.createOrder(data);
            if (!result.success || !result.data) return result;

            const orden = result.data as
                | { id: string; codigo: string; vehiculoId: string }
                | undefined;
            if (!orden) return { success: false, error: "Orden inválida"  };
            // Notificaciones auxiliares
            const vinculacion = await prisma.vinculacion.findFirst({
                where: { vehiculoId: data.vehiculoId, activo: true },
                include: { vehiculo: true },
            });

            if (vinculacion) {
                await NotificationService.crear({
                    usuarioId: vinculacion.conductorId,
                    titulo: "Nueva Orden de Servicio",
                    mensaje: `Se ha emitido la orden ${orden.codigo} para el vehículo ${vinculacion.vehiculo.placa}.`,
                    tipo: "INFO",
                    vinculo: "/dashboard/perfil",
                });
            }

            await createAuditLog(
                session.user.id,
                "CREAR",
                "OrdenServicio",
                orden.id,
                `Emisión de orden de servicio ${orden.codigo}`,
                session.user.lastIp,
                session.user.lastUserAgent,
            );

            revalidatePath("/dashboard/mantenimiento");
            return result;
        } catch (error) {
            logger.error(
                { error, userId: session.user.id },
                "Error en createOrdenServicio",
            );
            return { success: false, error: "Error interno del servidor"  };
        }
    },
);

/**
 * 5.1 Patrón: Enviar Comprobante de Orden
 */
export const submitComprobanteOrden = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        const dataInputCast = dataInput as SubmitComprobanteOrden;
        // 1. Zod
        const validation =
            SubmitComprobanteOrdenSchema.safeParse(dataInputCast);
        if (!validation.success) {
            return {
                success: false,
                error: "Datos de comprobante inválidos",
                errors: validation.error.flatten().fieldErrors,
            };
        }

        const data = validation.data;

        try {
            const result = await MaintenanceService.submitComprobante(data);
            if (!result.success || !result.data) return result;

            const orden = result.data as
                | { id: string; codigo: string }
                | undefined;
            if (!orden) return { success: false, error: "Orden inválida"  };
            await createAuditLog(
                session.user.id,
                "ACTUALIZAR",
                "OrdenServicio",
                orden.id,
                `Conductor subió comprobante para OS ${orden.codigo}`,
                session.user.lastIp,
                session.user.lastUserAgent,
            );

            // Notificar a los administradores
            const admins = await prisma.usuario.findMany({
                where: { rol: "ADMIN", activo: true },
                select: { id: true },
            });

            for (const admin of admins) {
                await NotificationService.crear({
                    usuarioId: admin.id,
                    titulo: "Revisión de Mantenimiento",
                    mensaje: `Se ha subido un comprobante para la orden ${orden.codigo}. Requiere su revisión.`,
                    tipo: "WARNING",
                    vinculo: "/dashboard/mantenimiento",
                });
            }

            revalidatePath("/dashboard/perfil");
            revalidatePath("/dashboard/mantenimiento");
            return result;
        } catch (error) {
            logger.error(
                { error, userId: session.user.id },
                "Error en submitComprobanteOrden",
            );
            return { success: false, error: "Error interno del servidor"  };
        }
    },
);

/**
 * 5.1 Patrón: Solicitar Revisión (Crea OS directamente EN_REVISION)
 */
export const solicitarRevisionMantenimiento = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        const dataInputCast = dataInput as SolicitarRevision;
        // 1. Zod
        const validation = SolicitarRevisionSchema.safeParse(dataInputCast);
        if (!validation.success) {
            return {
                success: false,
                error: "Datos de revisión inválidos",
                errors: validation.error.flatten().fieldErrors,
            };
        }

        const data = validation.data;

        try {
            const result = await MaintenanceService.solicitarRevision(data);
            if (!result.success) return result;

            await createAuditLog(
                session.user.id,
                "CREAR",
                "OrdenServicio",
                null,
                `Solicitud de revisión de mantenimiento`,
                session.user.lastIp,
                session.user.lastUserAgent,
            );

            revalidatePath("/dashboard/mantenimiento");
            return result;
        } catch (error) {
            logger.error(
                { error, userId: session.user.id },
                "Error en solicitarRevisionMantenimiento",
            );
            return { success: false, error: "Error interno del servidor"  };
        }
    },
);
