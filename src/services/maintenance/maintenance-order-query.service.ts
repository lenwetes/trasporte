import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import { CacheService } from "@/lib/cache";
import {
    PaginationParams,
    parsePaginationParams,
    calculatePagination,
    calculateSkip,
} from "@/types/pagination";
import { EstadoOrdenServicio, OrdenServicio, Prisma } from "@prisma/client";
import { serializeDecimal } from "@/lib/utils";

export class MaintenanceOrderQueryService {
    /**
     * Gestión de Órdenes de Servicio
     */
    static async getOrders(
        filters: {
            vehiculoId?: string;
            estado?: EstadoOrdenServicio | EstadoOrdenServicio[];
            conductorId?: string;
        } & PaginationParams = {},
    ): Promise<ActionResult<unknown>> {
        const { vehiculoId, estado, conductorId, ...paginationParams } = filters;
        const options = parsePaginationParams(paginationParams);
        const skip = calculateSkip(options);
        const cacheKey = `maint:orders:list:${JSON.stringify({ vehiculoId, estado, conductorId })}:${options.page}:${options.pageSize}`;

        return await CacheService.remember(cacheKey, 600, async () => {
            try {
                const where: Prisma.OrdenServicioWhereInput = {};
                if (vehiculoId) where.vehiculoId = vehiculoId;
                if (estado !== undefined) {
                    where.estado = Array.isArray(estado) ? { in: estado } : estado;
                }
                if (conductorId) {
                    where.vehiculo = {
                        vinculaciones: {
                            some: { conductorId, activo: true },
                        },
                    };
                }

                const [ordenes, total] = await Promise.all([
                    prisma.ordenServicio.findMany({
                        where,
                        skip,
                        take: options.pageSize,
                        orderBy: { fechaCreacion: "desc" },
                        include: {
                            vehiculo: {
                                select: {
                                    placa: true,
                                    marca: true,
                                    modelo: true,
                                },
                            },
                            plan: {
                                select: { nombre: true, frecuencia: true },
                            },
                            comprobante: true,
                        },
                    }),
                    prisma.ordenServicio.count({ where }),
                ]);

                return {
                    success: true,
                    data: serializeDecimal({
                        data: ordenes,
                        pagination: calculatePagination(total, options),
                    }),
                };
            } catch (error) {
                logger.error(
                    { filters, error },
                    "MaintenanceOrderQueryService.getOrders error",
                );
                return {
                    success: false,
                    error: "Error al obtener órdenes de servicio",
                };
            }
        });
    }

    /**
     * Gestión de Historial de Mantenimientos
     */
    static async getHistory(
        filters: {
            vehiculoId?: string;
            conductorId?: string;
        } & PaginationParams = {},
    ): Promise<ActionResult<unknown>> {
        const { vehiculoId, conductorId, ...paginationParams } = filters;
        const options = parsePaginationParams(paginationParams);
        const skip = calculateSkip(options);
        const cacheKey = `maint:history:list:${JSON.stringify({ vehiculoId, conductorId })}:${options.page}:${options.pageSize}`;

        return await CacheService.remember(cacheKey, 600, async () => {
            try {
                const where: Prisma.MantenimientoRealizadoWhereInput = {};
                if (vehiculoId) where.vehiculoId = vehiculoId;
                if (conductorId) {
                    where.vehiculo = {
                        vinculaciones: { some: { conductorId, activo: true } },
                    };
                }

                const [history, total] = await Promise.all([
                    prisma.mantenimientoRealizado.findMany({
                        where,
                        skip,
                        take: options.pageSize,
                        orderBy: { fecha: "desc" },
                        include: {
                            vehiculo: {
                                select: {
                                    placa: true,
                                    marca: true,
                                    modelo: true,
                                },
                            },
                            plan: { select: { nombre: true } },
                            factura: true,
                            ordenServicio: {
                                select: {
                                    transaccion: {
                                        select: { id: true, consecutivo: true },
                                    },
                                },
                            },
                        },
                    }),
                    prisma.mantenimientoRealizado.count({ where }),
                ]);

                return {
                    success: true,
                    data: serializeDecimal({
                        data: history,
                        pagination: calculatePagination(total, options),
                    }),
                };
            } catch (error) {
                logger.error(
                    { filters, error },
                    "MaintenanceOrderQueryService.getHistory error",
                );
                return { success: false, error: "Error al obtener historial" };
            }
        });
    }

    static async getOrderById(id: string): Promise<ActionResult<unknown>> {
        try {
            const [orden, config] = await Promise.all([
                prisma.ordenServicio.findUnique({
                    where: { id },
                    include: {
                        vehiculo: {
                            include: {
                                propietarioUser: true
                            }
                        },
                        plan: true,
                        comprobante: true,
                    },
                }),
                prisma.configuracionGlobal.findFirst(),
            ]);

            if (!orden) return { success: false, error: "Orden no encontrada" };

            return { success: true, data: serializeDecimal({ orden, config }) };
        } catch (error) {
            logger.error(
                { id, error },
                "MaintenanceOrderQueryService.getOrderById error",
            );
            return {
                success: false,
                error: "Error al cargar detalle de la orden",
            };
        }
    }
}

