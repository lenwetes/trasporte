import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import { CacheService } from "@/lib/cache";

export class MaintenanceStatsService {
    static async getStats(
        filters: {
            conductorId?: string;
        } = {},
    ): Promise<ActionResult> {
        const cacheKey = `maint:stats:${JSON.stringify(filters)}`;
        return await CacheService.remember(cacheKey, 3600, async () => {
            try {
                const baseWhere = filters.conductorId
                    ? {
                          vehiculo: {
                              vinculaciones: {
                                  some: {
                                      conductorId: filters.conductorId,
                                      activo: true,
                                  },
                              },
                          },
                      }
                    : {};

                const maintWhere =
                    baseWhere as Prisma.MantenimientoRealizadoWhereInput;
                const orderWhere = baseWhere as Prisma.OrdenServicioWhereInput;

                const [total, pendientes, revision] = await Promise.all([
                    prisma.mantenimientoRealizado.count({ where: maintWhere }),
                    prisma.ordenServicio.count({
                        where: { ...orderWhere, estado: "PENDIENTE" },
                    }),
                    prisma.ordenServicio.count({
                        where: { ...orderWhere, estado: "EN_REVISION" },
                    }),
                ]);

                return {
                    success: true,
                    data: {
                        totalRealizados: total,
                        ordenesPendientes: pendientes,
                        enRevision: revision,
                    },
                };
            } catch (error) {
                logger.error(
                    { filters, error },
                    "MaintenanceStatsService.getStats error",
                );
                return {
                    success: false,
                    error: "Error al obtener estadísticas",
                };
            }
        });
    }
}
