import { prisma } from "@/lib/prisma";
import { Prisma, Vehiculo } from "@prisma/client";
import { ActionResult, VehiculoWithRelations } from "@/types";
import logger from "@/lib/logger";
import { DebtService } from "../debt.service";
import {
    PaginationParams,
    PaginatedResponse,
    parsePaginationParams,
    calculatePagination,
    calculateSkip,
} from "@/types/pagination";
import { CacheService } from "@/lib/cache";

export class VehicleQueryService {
    /**
     * Get vehicle by ID with relations
     */
    static async getById(id: string): Promise<ActionResult<unknown>> {
        return await CacheService.remember(
            `vehicle:id:${id}`,
            3600,
            async () => {
                try {
                    const vehiculo = await prisma.vehiculo.findUnique({
                        where: { id },
                        include: {
                            documentos: {
                                include: { archivo: true },
                            },
                            vinculaciones: {
                                include: { conductor: true },
                                orderBy: { fechaInicio: "desc" },
                            },
                            mantenimientos: {
                                include: { plan: true, factura: true },
                                orderBy: { fecha: "desc" },
                            },
                            ordenesServicio: {
                                include: { plan: true },
                                orderBy: { fechaCreacion: "desc" },
                                where: { estado: "PENDIENTE" },
                            },
                            siniestros: {
                                include: {
                                    conductor: true,
                                    vehiculo: true,
                                    fotos: true,
                                    investigacion: true,
                                },
                                orderBy: { fecha: "desc" },
                            },
                            propietarioUser: true,
                            _count: {
                                select: {
                                    documentos: true,
                                    vinculaciones: true,
                                    siniestros: true,
                                },
                            },
                        },
                    });

                    if (!vehiculo)
                        return {
                            success: false,
                            error: "Vehículo no encontrado",
                        };

                    const activeVinculacion = vehiculo.vinculaciones?.find(
                        (v) => v.activo,
                    );
                    const vehiculoConMeta =
                        vehiculo as unknown as VehiculoWithRelations & {
                            metadata?: Record<string, unknown>;
                        };

                    if (activeVinculacion?.conductorId) {
                        const debtStatus = await DebtService.canOperate(
                            activeVinculacion.conductorId,
                        );
                        if (debtStatus.success) {
                            vehiculoConMeta.metadata = {
                                ...(vehiculoConMeta.metadata || {}),
                                operatividadFinanciera: debtStatus.data,
                                bloqueadoPorMora: !debtStatus.data?.canOperate,
                                deudaConductor: debtStatus.data?.saldoPendiente,
                            };
                        }
                    }

                    return {
                        success: true,
                        data: vehiculoConMeta as VehiculoWithRelations,
                    };
                } catch (error) {
                    logger.error(
                        { id, error },
                        "VehicleQueryService.getById error",
                    );
                    return {
                        success: false,
                        error: "Error al obtener vehículo",
                    };
                }
            },
        );
    }

    /**
     * Paginated list of vehicles
     */
    static async getAll(
        params: PaginationParams & { where?: Prisma.VehiculoWhereInput } = {},
    ): Promise<ActionResult<unknown>> {
        const { where = { activo: true }, ...paginationParams } = params;
        const options = parsePaginationParams(paginationParams);
        const skip = calculateSkip(options);
        const cacheKey = `vehicle:list:${JSON.stringify(where)}:${options.page}:${options.pageSize}`;

        return await CacheService.remember(cacheKey, 600, async () => {
            try {
                const [vehiculos, total, totalBlocked] = await Promise.all([
                    prisma.vehiculo.findMany({
                        where,
                        skip,
                        take: options.pageSize,
                        orderBy: { creadoEn: "desc" },
                        include: {
                            _count: {
                                select: {
                                    documentos: true,
                                    vinculaciones: true,
                                },
                            },
                        },
                    }),
                    prisma.vehiculo.count({ where }),
                    prisma.vehiculo.count({
                        where: { ...where, bloqueadoManualmente: true },
                    }),
                ]);

                const pagination = {
                    ...calculatePagination(total, options),
                    totalBlocked,
                };

                return {
                    success: true,
                    data: {
                        data: vehiculos,
                        pagination,
                    },
                };
            } catch (error) {
                logger.error(
                    { params, error },
                    "VehicleQueryService.getAll error",
                );
                return {
                    success: false,
                    error: "Error al obtener los vehículos",
                };
            }
        });
    }

    /**
     * Search vehicles by plate
     */
    static async search(
        query: string,
        limit = 20,
    ): Promise<ActionResult<unknown>> {
        try {
            const vehicles = await prisma.vehiculo.findMany({
                where: {
                    placa: { contains: query, mode: "insensitive" },
                    activo: true,
                },
                take: limit,
                orderBy: { placa: "asc" },
            });

            return { success: true, data: vehicles };
        } catch (error) {
            logger.error({ query, error }, "VehicleQueryService.search error");
            return { success: false, error: "Error al buscar vehículos" };
        }
    }
}
