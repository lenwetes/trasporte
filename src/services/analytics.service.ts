import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { calculateVehicleAlerts } from "@/lib/alerts";
import { ActionResult } from "@/types";
import { CacheService } from "@/lib/cache";
import {
    PaginationParams,
    PaginatedResponse,
    parsePaginationParams,
    calculatePagination,
    calculateSkip,
} from "@/types/pagination";

export interface ReportFilters {
    fechaInicio?: string;
    fechaFin?: string;
    conductorId?: string;
    vehiculoId?: string;
}

export class AnalyticsService {
    static async getFleetReport(
        where: Prisma.VehiculoWhereInput,
        params: PaginationParams = {},
    ): Promise<ActionResult<unknown>> {
        const options = parsePaginationParams(params);
        const skip = calculateSkip(options);
        const cacheKey = `analytics:fleet:${JSON.stringify(where)}:${options.page}:${options.pageSize}`;

        return await CacheService.remember(cacheKey, 300, async () => {
            const [vehicles, total] = await Promise.all([
                prisma.vehiculo.findMany({
                    where,
                    skip,
                    take: options.pageSize,
                    include: {
                        documentos: true,
                        vinculaciones: {
                            where: { activo: true },
                            include: { conductor: true },
                        },
                    },
                }),
                prisma.vehiculo.count({ where }),
            ]);
            return {
                success: true,
                data: {
                    data: vehicles,
                    pagination: calculatePagination(total, options),
                },
            };
        });
    }

    static async getExpiryReport(
        where: Prisma.VehiculoWhereInput,
    ): Promise<ActionResult> {
        const cacheKey = `analytics:expiry:${JSON.stringify(where)}`;
        return await CacheService.remember(cacheKey, 300, async () => {
            const rules = await prisma.reglaAlerta.findMany({
                where: { activo: true },
            });
            const vehicles = await prisma.vehiculo.findMany({
                where,
                include: { documentos: { include: { archivo: true } } },
            });

            const expiringDocs = vehicles.flatMap((v) => {
                const alerts = calculateVehicleAlerts(v, rules).alerts;
                return alerts
                    .filter((a) => a.status === "red" || a.status === "yellow")
                    .map((a) => ({
                        placa: v.placa,
                        tipo: a.tipo,
                        dias: a.daysUntilExpiry,
                        estado: a.status === "red" ? "VENCIDO" : "POR VENCER",
                    }));
            });
            return { success: true, data: expiringDocs };
        });
    }

    static async getConductorsReport(
        where: Prisma.UsuarioWhereInput,
        params: PaginationParams = {},
    ): Promise<ActionResult<unknown>> {
        const options = parsePaginationParams(params);
        const skip = calculateSkip(options);
        const cacheKey = `analytics:conductors:${JSON.stringify(where)}:${options.page}:${options.pageSize}`;

        return await CacheService.remember(cacheKey, 300, async () => {
            const [conductors, total] = await Promise.all([
                prisma.usuario.findMany({
                    where,
                    skip,
                    take: options.pageSize,
                    include: {
                        vinculaciones: {
                            where: { activo: true },
                            include: { vehiculo: true },
                        },
                    },
                }),
                prisma.usuario.count({ where }),
            ]);
            return {
                success: true,
                data: {
                    data: conductors,
                    pagination: calculatePagination(total, options),
                },
            };
        });
    }

    static async getNovedadesReport(
        where: Prisma.NovedadWhereInput,
        params: PaginationParams = {},
    ): Promise<ActionResult<unknown>> {
        const options = parsePaginationParams(params);
        const skip = calculateSkip(options);
        const cacheKey = `analytics:novedades:${JSON.stringify(where)}:${options.page}:${options.pageSize}`;

        return await CacheService.remember(cacheKey, 300, async () => {
            const [novedades, total] = await Promise.all([
                prisma.novedad.findMany({
                    where,
                    skip,
                    take: options.pageSize,
                    include: { vehiculo: true, conductor: true },
                    orderBy: { fecha: "desc" },
                }),
                prisma.novedad.count({ where }),
            ]);
            return {
                success: true,
                data: {
                    data: novedades,
                    pagination: calculatePagination(total, options),
                },
            };
        });
    }

    static async getSiniestrosReport(
        where: Prisma.SiniestroWhereInput,
        params: PaginationParams = {},
    ): Promise<ActionResult<unknown>> {
        const options = parsePaginationParams(params);
        const skip = calculateSkip(options);
        const cacheKey = `analytics:siniestros:${JSON.stringify(where)}:${options.page}:${options.pageSize}`;

        return await CacheService.remember(cacheKey, 300, async () => {
            const [siniestros, total] = await Promise.all([
                prisma.siniestro.findMany({
                    where,
                    skip,
                    take: options.pageSize,
                    include: { vehiculo: true, conductor: true, fotos: true },
                    orderBy: { fecha: "desc" },
                }),
                prisma.siniestro.count({ where }),
            ]);
            return {
                success: true,
                data: {
                    data: siniestros,
                    pagination: calculatePagination(total, options),
                },
            };
        });
    }
}
