"use server";

import { NotificationService } from "@/services/notification.service";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { withAuth } from "@/lib/safe-action";

/**
 * Gets the current user's notifications (Recent/Unread).
 */
export const getMisNotificaciones = withAuth(
    "ALL",
    async (): Promise<ActionResult> => {
        const { auth } = await import("@/auth");
        const session = await auth();
        // Solo traemos las 20 más recientes para el dropdown
        return await NotificationService.getPorUsuario(session!.user.id, false, 20);
    },
    "getMisNotificaciones",
);

/**
 * Gets the current user's full notification history (Auditable).
 */
export const getMisNotificacionesHistorial = withAuth(
    "ALL",
    async (params: { limit?: number; offset?: number }): Promise<ActionResult> => {
        const { auth } = await import("@/auth");
        const session = await auth();
        return await NotificationService.getPorUsuario(
            session!.user.id, 
            false, 
            params.limit || 50, 
            params.offset || 0
        );
    },
    "getMisNotificacionesHistorial",
);

/**
 * Gets the count of unread notifications for the bell indicator.
 */
export const getMisNotificacionesCount = withAuth(
    "ALL",
    async (): Promise<ActionResult> => {
        const { auth } = await import("@/auth");
        const session = await auth();
        return await NotificationService.getConteoPorUsuario(session!.user.id, true);
    },
    "getMisNotificacionesCount",
);

/**
 * Marks a notification as read.
 */
export const markNotificationAsRead = withAuth(
    "ALL",
    async (id: string): Promise<ActionResult> => {
        const result = await NotificationService.marcarComoLeida(id);
        if (result.success) {
            revalidatePath("/");
        }
        return result;
    },
    "markNotificationAsRead",
);

/**
 * Marks all notifications as read for the current user.
 */
export const markAllNotificationsAsRead = withAuth(
    "ALL",
    async (): Promise<ActionResult> => {
        const { auth } = await import("@/auth");
        const session = await auth();
        const result = await NotificationService.marcarTodasComoLeidas(
            session!.user.id,
        );
        if (result.success) {
            revalidatePath("/");
        }
        return result;
    },
    "markAllNotificationsAsRead",
);
