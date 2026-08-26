"use server";

import { revalidatePath } from "next/cache";
import { MaintenanceService } from "@/services/maintenance.service";
import { NotificationService } from "@/services/notification.service";
import { createAuditLog } from "@/actions/audit";
import { ActionResult } from "@/types";
import { withAuth } from "@/lib/safe-action";
import { hasPermission, unauthorizedResponse } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

/**
 * 5.1 Patrón: Aprobar Orden de Servicio y registrar mantenimiento
 */
export const aprobarOrdenServicio = withAuth(
    async (session, ordenIdInput: unknown): Promise<ActionResult> => {
        // 1. RBAC
        if (!hasPermission(session.user.rol, "MANTENIMIENTO", "UPDATE")) {
            return unauthorizedResponse();
        }

        const ordenId = ordenIdInput as string;
        // 2. Logic (Delegar a Service)
        const result = await MaintenanceService.approveOrder(ordenId, session.user.id);
        if (!result.success || !result.data) return result;

        const orden = result.data as
            | { id: string; codigo: string; vehiculoId: string }
            | undefined;
        if (!orden) return { success: false, error: "Orden inválida"  };
        // 3. Notificaciones auxiliares
        const vinculacion = await prisma.vinculacion.findFirst({
            where: { vehiculoId: orden.vehiculoId, activo: true },
        });

        if (vinculacion) {
            await NotificationService.crear({
                usuarioId: vinculacion.conductorId,
                titulo: "Mantenimiento Aprobado",
                mensaje: `El comprobante de la orden ${orden.codigo} ha sido aprobado.`,
                tipo: "SUCCESS",
                vinculo: "/dashboard/perfil",
            });
        }

        // 4. Audit + Revalidate
        await createAuditLog(
            session.user.id,
            "ACTUALIZAR",
            "OrdenServicio",
            orden.id,
            `Aprobación de OS ${orden.codigo} y registro de mantenimiento`,
            session.user.lastIp,
            session.user.lastUserAgent,
        );

        revalidatePath("/dashboard/mantenimiento");
        revalidatePath("/dashboard/perfil");
        return { success: true };
    },
);

/**
 * 5.1 Patrón: Rechazar un comprobante de orden
 */
export const rechazarOrdenServicio = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        // 1. RBAC
        if (!hasPermission(session.user.rol, "MANTENIMIENTO", "UPDATE")) {
            return unauthorizedResponse();
        }

        const typedInput = dataInput as { id: string; motivo: string };
        const { id, motivo } = typedInput;
        if (!id || !motivo)
            return { success: false, error: "ID y motivo obligatorios"  };
        // 2. Logic
        const result = await MaintenanceService.rejectOrder(id, motivo);
        if (!result.success || !result.data) return result;
        const orden = result.data as
            | { id: string; codigo: string; vehiculoId: string }
            | undefined;
        if (!orden) return { success: false, error: "Orden inválida"  };
        // 3. Notificaciones
        const vinculacion = await prisma.vinculacion.findFirst({
            where: { vehiculoId: orden.vehiculoId, activo: true },
        });

        if (vinculacion) {
            await NotificationService.crear({
                usuarioId: vinculacion.conductorId,
                titulo: "Comprobante Rechazado",
                mensaje: `El comprobante de la orden ${orden.codigo} ha sido rechazado. Motivo: ${motivo}`,
                tipo: "ERROR",
                vinculo: "/dashboard/perfil",
            });
        }

        // 4. Audit + Revalidate
        await createAuditLog(
            session.user.id,
            "ACTUALIZAR",
            "OrdenServicio",
            orden.id,
            `Rechazo de comprobante OS ${orden.codigo}. Motivo: ${motivo}`,
            session.user.lastIp,
            session.user.lastUserAgent,
        );

        revalidatePath("/dashboard/mantenimiento");
        revalidatePath("/dashboard/perfil");
        return { success: true };
    },
);
