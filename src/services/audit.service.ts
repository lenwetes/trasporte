import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";
import { ActionResult } from "@/types";
import { Prisma } from "@prisma/client";

export class AuditService {
    /**
     * Crea un registro de auditoría
     */
    static async create(data: {
        actorId: string;
        accion:
            | "CREAR"
            | "ACTUALIZAR"
            | "ELIMINAR"
            | "LOGIN"
            | "LOGOUT"
            | "EXPORTAR";
        entidadTipo: string;
        entidadId?: string | null;
        detalles?: string | Record<string, unknown> | null;
        ipAddress?: string | null;
        userAgent?: string | null;
    }) {
        try {
            const detailsString =
                typeof data.detalles === "object"
                    ? JSON.stringify(data.detalles)
                    : data.detalles;
            await prisma.auditLog.create({
                data: {
                    actorId: data.actorId,
                    accion: data.accion,
                    entidadTipo: data.entidadTipo,
                    entidadId: data.entidadId || null,
                    detalles: detailsString || null,
                    ipAddress: data.ipAddress || null,
                    userAgent: data.userAgent || null,
                },
            });
        } catch (error) {
            logger.error({ error, data }, "AuditService.create error");
        }
    }

    /**
     * Lista logs de auditoría con paginación
     */
    static async getAll({
        page = 1,
        pageSize = 50,
        where,
    }: {
        page?: number;
        pageSize?: number;
        where?: Prisma.AuditLogWhereInput;
    } = {}): Promise<ActionResult> {
        try {
            const skip = (page - 1) * pageSize;

            const [logs, total] = await Promise.all([
                prisma.auditLog.findMany({
                    where,
                    skip,
                    take: pageSize,
                    orderBy: { creadoEn: "desc" },
                    include: {
                        actor: {
                            select: {
                                nombres: true,
                                apellidos: true,
                                email: true,
                                rol: true,
                                id: true,
                            },
                        },
                    },
                }),
                prisma.auditLog.count({ where }),
            ]);

            return {
                success: true,
                data: logs,
                metadata: {
                    total,
                    page,
                    totalPages: Math.ceil(total / pageSize),
                },
            };
        } catch (error) {
            logger.error(
                { page, pageSize, error },
                "AuditService.getAll error",
            );
            return {
                success: false,
                error: "Error al obtener registros de auditoría",
            };
        }
    }

    /**
     * Registra el inicio de sesión de un usuario
     */
    static async registerLogin(
        userId: string,
        ip: string | null,
        ua: string | null,
    ) {
        try {
            await Promise.all([
                prisma.usuario.update({
                    where: { id: userId },
                    data: { ultimoLogin: new Date() },
                }),
                this.create({
                    actorId: userId,
                    accion: "LOGIN",
                    entidadTipo: "Usuario",
                    entidadId: userId,
                    detalles: "Inicio de sesión exitoso",
                    ipAddress: ip,
                    userAgent: ua,
                }),
            ]);
            return { success: true };
        } catch (error) {
            logger.error({ userId, error }, "AuditService.registerLogin error");
            return { success: false };
        }
    }
}
