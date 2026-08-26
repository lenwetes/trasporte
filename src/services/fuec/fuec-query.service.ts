import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import { EstadoFUEC, Prisma } from "@prisma/client";
import { CacheService } from "@/lib/cache";
import {
    PaginationParams,
    PaginatedResponse,
    parsePaginationParams,
    calculatePagination,
    calculateSkip,
} from "@/types/pagination";

export class FuecQueryService {
    /**
     * Obtiene el listado de FUECs con filtros
     */
    static async list(
        filters: {
            vehiculoId?: string;
            conductor1Id?: string;
            contratoId?: string;
            estado?: EstadoFUEC;
        } & PaginationParams = {},
    ): Promise<
        ActionResult<
            PaginatedResponse<
                Prisma.PlanillaFUECGetPayload<{
                    include: {
                        vehiculo: true;
                        conductor1: true;
                        conductor2: true;
                        conductor3: true;
                        contrato: true;
                        resolucion: true;
                    };
                }>
            >
        >
    > {
        const {
            vehiculoId,
            conductor1Id,
            contratoId,
            estado,
            ...paginationParams
        } = filters;
        const options = parsePaginationParams(paginationParams);
        const skip = calculateSkip(options);
        const cacheKey = `fuec:list:${JSON.stringify({ vehiculoId, conductor1Id, contratoId, estado })}:${options.page}:${options.pageSize}`;

        return await CacheService.remember(cacheKey, 300, async () => {
            try {
                const where: Prisma.PlanillaFUECWhereInput = {};
                if (vehiculoId) where.vehiculoId = vehiculoId;
                if (conductor1Id) where.conductor1Id = conductor1Id;
                if (contratoId) where.contratoId = contratoId;
                if (estado) where.estado = estado;

                const [planillas, total] = await Promise.all([
                    prisma.planillaFUEC.findMany({
                        where,
                        skip,
                        take: options.pageSize,
                        orderBy: { creadoEn: "desc"  },
                        include: {
                            vehiculo: true,
                            conductor1: true,
                            conductor2: true,
                            conductor3: true,
                            contrato: true,
                            resolucion: true,
                        },
                    }),
                    prisma.planillaFUEC.count({ where }),
                ]);

                return {
                    success: true,
                    data: {
                        data: planillas,
                        pagination: calculatePagination(total, options),
                    },
                };
            } catch (error) {
                logger.error({ error, filters }, "FuecQueryService.list error");
                return {
                    success: false,
                    error: "Error al listar planillas FUEC",
                };
            }
        });
    }

    /**
     * Obtiene el conductor principal activo de un vehículo
     */
    static async getVehiculoConductor(
        vehiculoId: string,
    ): Promise<ActionResult> {
        try {
            const vinculacion = await prisma.vinculacion.findFirst({
                where: { vehiculoId, activo: true },
                include: {
                    conductor: {
                        select: {
                            id: true,
                            nombres: true,
                            apellidos: true,
                            numeroDocumento: true,
                        },
                    },
                },
            });

            if (!vinculacion) {
                return {
                    success: false,
                    error: "No hay un conductor activo para este vehículo",
                };
            }

            return {
                success: true,
                data: {
                    id: vinculacion.conductor.id,
                    nombre: `${vinculacion.conductor.nombres} ${vinculacion.conductor.apellidos}`,
                    documento: vinculacion.conductor.numeroDocumento,
                },
            };
        } catch (error) {
            logger.error(
                { error, vehiculoId },
                "FuecQueryService.getVehiculoConductor error",
            );
            return { success: false, error: "Error al obtener conductor"  };
        }
    }

    /**
     * Busca conductores activos
     */
    static async searchConductores(
        query: string,
        limit = 5,
    ): Promise<ActionResult> {
        try {
            const conductores = await prisma.usuario.findMany({
                where: {
                    rol: "CONDUCTOR",
                    activo: true,
                    OR: [
                        { nombres: { contains: query, mode: "insensitive" } },
                        { apellidos: { contains: query, mode: "insensitive" } },
                        { numeroDocumento: { contains: query } },
                    ],
                },
                select: {
                    id: true,
                    nombres: true,
                    apellidos: true,
                    numeroDocumento: true,
                },
                take: limit,
            });

            return {
                success: true,
                data: conductores.map((c) => ({
                    id: c.id,
                    nombre: `${c.nombres} ${c.apellidos}`,
                    documento: c.numeroDocumento,
                })),
            };
        } catch (error) {
            logger.error(
                { error, query },
                "FuecQueryService.searchConductores error",
            );
            return { success: false, error: "Error en la búsqueda" };
        }
    }
    /**
     * Obtiene los detalles de validación de un FUEC (Auditoría)
     */
    static async getValidationDetails(fuecId: string): Promise<ActionResult> {
        try {
            const audit = await prisma.auditLog.findFirst({
                where: {
                    entidadTipo: "PlanillaFUEC",
                    entidadId: fuecId,
                    accion: "CREAR",
                },
                include: {
                    actor: {
                        select: {
                            nombres: true,
                            apellidos: true,
                            rol: true,
                        },
                    },
                },
            });

            if (!audit) {
                return { success: false, error: "Validación no encontrada"  };
            }

            const detalles =
                typeof audit.detalles === "string"
                    ? JSON.parse(audit.detalles)
                    : (audit.detalles as unknown as Record<string, unknown>) ||
                      {};

            return {
                success: true,
                data: {
                    forzado: detalles.forzado || false,
                    justificacion: detalles.justificacion || null,
                    fecha: audit.creadoEn,
                    actor: audit.actor,
                },
            };
        } catch (error) {
            logger.error(
                { error, fuecId },
                "FuecQueryService.getValidationDetails error",
            );
            return { success: false, error: "Error al obtener detalles"  };
        }
    }
}
