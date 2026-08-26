"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ActionResult } from "@/types";
import { AnalyticsService, ReportFilters } from "@/services/analytics.service";
import { withAuth } from "@/lib/safe-action";

/**
 * Get data for reports with optional filters
 */
export const getReportingData = withAuth(
    "ALL",
    async (...args: unknown[]): Promise<ActionResult> => {
        const type = args[0] as
            | "fleet"
            | "expiry"
            | "conductors"
            | "novedades"
            | "siniestros";
        const filters = args[1] as ReportFilters | undefined;
        const page = args[2] as number | undefined;
        const pageSize = args[3] as number | undefined;

        const { auth } = await import("@/auth");
        const session = await auth();
        const role = session!.user.rol;
        const userId = session!.user.id;

        const isAdminOrSecretary = role === "ADMIN" || role === "SECRETARIA";
        const skip = page && pageSize ? (page - 1) * pageSize : undefined;
        const take = pageSize;

        if (type === "fleet" || type === "expiry") {
            const vehicleWhere: Prisma.VehiculoWhereInput = { activo: true };
            if (!isAdminOrSecretary) {
                if (role === "CONDUCTOR")
                    vehicleWhere.vinculaciones = {
                        some: { conductorId: userId, activo: true },
                    };
                else if (role === "PROPIETARIO")
                    vehicleWhere.propietarioId = userId;
            }
            if (filters?.vehiculoId) vehicleWhere.id = filters.vehiculoId;
            if (filters?.conductorId)
                vehicleWhere.vinculaciones = {
                    some: { conductorId: filters.conductorId, activo: true },
                };

            return type === "fleet"
                ? AnalyticsService.getFleetReport(vehicleWhere, {
                      page,
                      pageSize,
                  })
                : AnalyticsService.getExpiryReport(vehicleWhere);
        }

        if (type === "conductors") {
            if (!isAdminOrSecretary)
                return { success: false, error: "No autorizado" };
            const conductorWhere: Prisma.UsuarioWhereInput = {
                rol: "CONDUCTOR",
                activo: true,
            };
            if (filters?.conductorId) conductorWhere.id = filters.conductorId;
            if (filters?.vehiculoId)
                conductorWhere.vinculaciones = {
                    some: { vehiculoId: filters.vehiculoId, activo: true },
                };
            return AnalyticsService.getConductorsReport(conductorWhere, {
                page,
                pageSize,
            });
        }

        if (type === "novedades") {
            const novedadWhere: Prisma.NovedadWhereInput = !isAdminOrSecretary
                ? {
                      OR: [
                          { conductorId: userId },
                          {
                              vehiculo: {
                                  vinculaciones: {
                                      some: {
                                          conductorId: userId,
                                          activo: true,
                                      },
                                  },
                              },
                          },
                      ],
                  }
                : {};
            if (filters?.conductorId)
                novedadWhere.conductorId = filters.conductorId;
            if (filters?.vehiculoId)
                novedadWhere.vehiculoId = filters.vehiculoId;
            if (filters?.fechaInicio || filters?.fechaFin) {
                novedadWhere.fecha = {
                    gte: filters.fechaInicio
                        ? new Date(filters.fechaInicio)
                        : undefined,
                    lte: filters.fechaFin
                        ? new Date(filters.fechaFin)
                        : undefined,
                };
            }
            return AnalyticsService.getNovedadesReport(novedadWhere, {
                page,
                pageSize,
            });
        }

        if (type === "siniestros") {
            const siniestroWhere: Prisma.SiniestroWhereInput =
                !isAdminOrSecretary
                    ? {
                          OR: [
                              { conductorId: userId },
                              {
                                  vehiculoId: {
                                      in: (
                                          await prisma.vinculacion.findMany({
                                              where: {
                                                  conductorId: userId,
                                                  activo: true,
                                              },
                                              select: { vehiculoId: true },
                                          })
                                      ).map((v) => v.vehiculoId),
                                  },
                              },
                          ],
                      }
                    : {};
            if (filters?.conductorId)
                siniestroWhere.conductorId = filters.conductorId;
            if (filters?.vehiculoId)
                siniestroWhere.vehiculoId = filters.vehiculoId;
            if (filters?.fechaInicio || filters?.fechaFin) {
                siniestroWhere.fecha = {
                    gte: filters.fechaInicio
                        ? new Date(filters.fechaInicio)
                        : undefined,
                    lte: filters.fechaFin
                        ? new Date(filters.fechaFin)
                        : undefined,
                };
            }
            return AnalyticsService.getSiniestrosReport(siniestroWhere, {
                page,
                pageSize,
            });
        }

        return { success: false, error: "Tipo de reporte no válido" };
    },
    "getReportingData",
);

export const getReportingSession = withAuth(
    "ALL",
    async (): Promise<ActionResult> => {
        const { auth } = await import("@/auth");
        const session = await auth();
        return {
            success: true,
            data: {
                role: session!.user.rol,
                userId: session!.user.id,
                name: session!.user.name,
            },
        };
    },
    "getReportingSession",
);

export const getExpiryProjections = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (): Promise<ActionResult> => {
        const today = new Date();
        const projections = [];
        for (let i = 0; i < 6; i++) {
            const startDate = new Date(
                today.getFullYear(),
                today.getMonth() + i,
                1,
            );
            const endDate = new Date(
                today.getFullYear(),
                today.getMonth() + i + 1,
                0,
            );
            const count = await prisma.documentoVehiculo.count({
                where: {
                    fechaVencimiento: { gte: startDate, lte: endDate },
                    vehiculo: { is: { activo: true } },
                },
            });
            projections.push({
                label: startDate.toLocaleString("es-ES", { month: "short" }),
                month: startDate.getMonth(),
                year: startDate.getFullYear(),
                count,
            });
        }
        return { success: true, data: projections };
    },
    "getExpiryProjections",
);

export const getAdminDashboardStats = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (): Promise<ActionResult> => {
        const [v, c, ct, s, n] = await Promise.all([
            prisma.vehiculo.count({ where: { activo: true } }),
            prisma.usuario.count({ where: { rol: "CONDUCTOR", activo: true } }),
            prisma.vinculacion.count({ where: { activo: true } }),
            prisma.siniestro.count(),
            prisma.novedad.count(),
        ]);
        return {
            success: true,
            data: {
                totalVehiculos: v,
                totalConductores: c,
                totalContratos: ct,
                totalSiniestros: s,
                totalNovedades: n,
            },
        };
    },
    "getAdminDashboardStats",
);
