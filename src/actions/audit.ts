"use server";

import logger from "@/lib/logger";
import { withAuth } from "@/lib/safe-action";
import { hasPermission, unauthorizedResponse } from "@/lib/permissions";
import { ActionResult } from "@/types";
import { AuditService } from "@/services/audit.service";

/**
 * Audit Log Helper (Función interna, no Action, para otros Actions)
 */
export async function createAuditLog(
    actorId: string,
    accion:
        | "CREAR"
        | "ACTUALIZAR"
        | "ELIMINAR"
        | "LOGIN"
        | "LOGOUT"
        | "EXPORTAR",
    entidadTipo: string,
    entidadId: string | null = null,
    detalles: string | Record<string, unknown> | null = null,
    ipAddress: string | null = null,
    userAgent: string | null = null,
) {
    return await AuditService.create({
        actorId,
        accion,
        entidadTipo,
        entidadId,
        detalles,
        ipAddress,
        userAgent,
    });
}

interface AuditLogsParams {
    page?: number;
    limit?: number;
    search?: string;
}

/**
 * 5.1 Patrón: Listar Logs de Auditoría
 */
export const getAuditLogs = withAuth(
    async (session, params: unknown): Promise<ActionResult> => {
        // 1. RBAC
        if (!hasPermission(session.user.rol, "USUARIOS", "DELETE")) {
            // ADMIN only check
            if (session.user.rol !== "ADMIN") return unauthorizedResponse();
        }

        const typedParams = (params as AuditLogsParams) || {};
        const { page = 1, limit = 50, search } = typedParams;

        try {
            const result = await AuditService.getAll({
                page,
                pageSize: limit,
                where: search
                    ? {
                          OR: [
                              {
                                  actor: {
                                      nombres: {
                                          contains: search,
                                          mode: "insensitive",
                                      },
                                  },
                              },
                              {
                                  actor: {
                                      apellidos: {
                                          contains: search,
                                          mode: "insensitive",
                                      },
                                  },
                              },
                              {
                                  entidadTipo: {
                                      contains: search,
                                      mode: "insensitive",
                                  },
                              },
                          ],
                      }
                    : undefined,
            });
            return result;
        } catch (error) {
            logger.error(
                { error, page, limit },
                "Error fetching audit logs in action",
            );
            return {
                success: false,
                error: "Error al obtener registros de auditoría",
            };
        }
    },
);

/**
 * Registra el inicio de sesión
 */
export async function registerLogin(
    userId: string,
    ip: string | null,
    ua: string | null,
) {
    return await AuditService.registerLogin(userId, ip, ua);
}

/**
 * Patrón 5.1: Rastrear Exportaciones
 */
export const trackExport = withAuth(
    async (session, data: unknown): Promise<ActionResult> => {
        const typedData =
            (data as {
                tipo: string;
                entidadId?: string;
                detalles?: string;
            }) || {};
        const { tipo, entidadId = null, detalles = null } = typedData;
        await createAuditLog(
            session.user.id,
            "EXPORTAR",
            tipo,
            entidadId,
            detalles,
        );
        return { success: true };
    },
);
