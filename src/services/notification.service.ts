import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";

export class NotificationService {
    /**
     * Creates a new notification for a specific user.
     */
    static async crear(data: {
        usuarioId: string;
        titulo: string;
        mensaje: string;
        tipo?: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
        vinculo?: string;
    }): Promise<ActionResult> {
        try {
            const notificacion = await prisma.notificacion.create({
                data: {
                    usuarioId: data.usuarioId,
                    titulo: data.titulo,
                    mensaje: data.mensaje,
                    tipo: data.tipo || "INFO",
                    vinculo: data.vinculo,
                },
            });

            return { success: true, data: notificacion };
        } catch (error) {
            logger.error(error, "Error al crear notificación");
            return {
                success: false,
                error: "No se pudo crear la notificación",
            };
        }
    }

    /**
     * Gets all notifications for a user, ordered by creation date.
     * With optional pagination for history.
     */
    static async getPorUsuario(
        usuarioId: string,
        soloNoLeidas = false,
        limit = 20,
        offset = 0
    ): Promise<ActionResult> {
        try {
            const notificaciones = await prisma.notificacion.findMany({
                where: {
                    usuarioId,
                    ...(soloNoLeidas ? { leida: false } : {}),
                },
                orderBy: { creadoEn: "desc" },
                take: limit,
                skip: offset
            });

            return { success: true, data: notificaciones };
        } catch (error) {
            logger.error(error, "Error al obtener notificaciones");
            return {
                success: false,
                error: "No se pudieron obtener las notificaciones",
            };
        }
    }

    /**
     * Gets total count of notifications for a user.
     */
    static async getConteoPorUsuario(
        usuarioId: string,
        soloNoLeidas = false
    ): Promise<ActionResult> {
        try {
            const count = await prisma.notificacion.count({
                where: {
                    usuarioId,
                    ...(soloNoLeidas ? { leida: false } : {}),
                }
            });
            return { success: true, data: count };
        } catch (error) {
            return { success: false, error: "Error al contar notificaciones" };
        }
    }

    /**
     * Marks a notification as read.
     */
    static async marcarComoLeida(
        notificacionId: string,
    ): Promise<ActionResult> {
        try {
            await prisma.notificacion.update({
                where: { id: notificacionId },
                data: { leida: true },
            });

            return { success: true };
        } catch (error) {
            logger.error(error, "Error al marcar notificación como leida");
            return {
                success: false,
                error: "Error al actualizar la notificación",
            };
        }
    }

    /**
     * Marks all notifications as read for a user.
     */
    static async marcarTodasComoLeidas(
        usuarioId: string,
    ): Promise<ActionResult> {
        try {
            await prisma.notificacion.updateMany({
                where: { usuarioId, leida: false },
                data: { leida: true },
            });

            return { success: true };
        } catch (error) {
            logger.error(
                error,
                "Error al marcar todas las notificaciones como leidas",
            );
            return {
                success: false,
                error: "Error al actualizar las notificaciones",
            };
        }
    }
}
