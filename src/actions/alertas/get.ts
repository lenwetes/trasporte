"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { ActionResult } from "@/types";
import { AlertNotification } from "@/lib/alerts";
import { withAuth } from "@/lib/safe-action";

// Cached data fetchers
export const getCachedAlertRules = unstable_cache(
    async () => {
        return await prisma.reglaAlerta.findMany({
            where: { activo: true },
        });
    },
    ["alert-rules-active"],
    { tags: ["alert-rules"] },
);

/**
 * Get all alert rules
 */
export const getReglasAlerta = withAuth(
    "ALL",
    async (): Promise<ActionResult> => {
        const reglas = await prisma.reglaAlerta.findMany({
            orderBy: { tipoDocumento: "asc" }
        });
        return { success: true, data: reglas };
    },
    "getReglasAlerta",
);

/**
 * Get a summary of all active alerts (Red and Yellow)
 */
export const getResumenAlertas = withAuth(
    "ALL",
    async (): Promise<ActionResult<unknown>> => {
        const { auth } = await import("@/auth");
        const session = await auth();
        const userRole = session!.user.rol;
        const userId = session!.user.id;

        const rules = await prisma.reglaAlerta.findMany({
            where: { activo: true },
        });
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        // Fetch LICENCIA rule (or use default)
        let licenciaRule: import("@prisma/client").ReglaAlerta | null =
            rules.find((r) => r.tipoDocumento === "LICENCIA") || null;
        if (!licenciaRule) {
            licenciaRule = {
                id: "default-license",
                tipoDocumento: "LICENCIA",
                diasAnticipacion: 30,
                activo: true,
                creadoEn: new Date(),
                actualizadoEn: new Date(),
            } as import("@prisma/client").ReglaAlerta;
        }

        const otherRules = rules.filter((r) => r.tipoDocumento !== "LICENCIA");
        const docFilters: Prisma.DocumentoVehiculoWhereInput[] = otherRules.map(
            (rule) => {
                const threshold = new Date(now);
                threshold.setDate(now.getDate() + rule.diasAnticipacion);
                return {
                    tipo: rule.tipoDocumento,
                    fechaVencimiento: { lte: threshold },
                };
            },
        );

        const baseWhere: Prisma.DocumentoVehiculoWhereInput = {};
        if (userRole === "CONDUCTOR") {
            baseWhere.vehiculo = {
                vinculaciones: {
                    some: {
                        conductorId: userId,
                        activo: true,
                    },
                },
            };
        } else if (userRole === "PROPIETARIO") {
            baseWhere.vehiculo = {
                propietarioId: userId,
            };
        }

        const documents =
            docFilters.length > 0
                ? await prisma.documentoVehiculo.findMany({
                      where: {
                          ...baseWhere,
                          OR: docFilters,
                      },
                      include: {
                          vehiculo: {
                              select: {
                                  id: true,
                                  placa: true,
                              },
                          },
                      },
                      orderBy: {
                          fechaVencimiento: "asc",
                      },
                  })
                : [];

        const documentAlerts: AlertNotification[] = documents
            .map((doc) => {
                if (!doc.fechaVencimiento) return null;
                const days = Math.ceil(
                    (doc.fechaVencimiento.getTime() - now.getTime()) /
                        (1000 * 60 * 60 * 24),
                );
                const rule = otherRules.find(
                    (r) => r.tipoDocumento === doc.tipo,
                );
                const status =
                    days < 0
                        ? "red"
                        : rule && days <= rule.diasAnticipacion
                          ? "yellow"
                          : "green";

                return {
                    documentId: doc.id,
                    vehiculoId: doc.vehiculo.id,
                    vehiculoPlaca: doc.vehiculo.placa,
                    tipo: doc.tipo,
                    fechaVencimiento: doc.fechaVencimiento,
                    daysUntilExpiry: days,
                    status: status as "red" | "yellow" | "green",
                } as AlertNotification;
            })
            .filter((a): a is AlertNotification => a !== null && a.status !== "green");

        let licenseAlerts: AlertNotification[] = [];

        if (licenciaRule && licenciaRule.activo) {
            let userWhere: Prisma.UsuarioWhereInput = {
                licencias: { some: {} },
                activo: true,
            };

            if (userRole === "CONDUCTOR") {
                userWhere = { id: userId, activo: true };
            } else if (userRole === "PROPIETARIO") {
                userWhere = { id: userId, activo: true };
            }

            const thresholdDate = new Date();
            thresholdDate.setDate(
                thresholdDate.getDate() + licenciaRule.diasAnticipacion,
            );

            const licenses = await prisma.detalleLicencia.findMany({
                where: {
                    usuario: userWhere,
                    fechaVencimiento: {
                        lte: thresholdDate,
                    },
                },
                include: {
                    usuario: {
                        select: {
                            id: true,
                            nombres: true,
                            apellidos: true,
                        },
                    },
                },
            });

            licenseAlerts = licenses.map((lic) => {
                if (!lic.fechaVencimiento) return null;
                const days = Math.ceil(
                    (lic.fechaVencimiento.getTime() - now.getTime()) /
                        (1000 * 60 * 60 * 24),
                );
                const status = days < 0 ? "red" : "yellow";
                return {
                    documentId: lic.id,
                    vehiculoId: "N/A",
                    vehiculoPlaca: `${lic.usuario.nombres} ${lic.usuario.apellidos}`,
                    tipo: `LICENCIA ${lic.categoria}`,
                    fechaVencimiento: lic.fechaVencimiento,
                    daysUntilExpiry: days,
                    status,
                };
            }).filter((a): a is AlertNotification => a !== null);
        }

        const blockedVehicles = await prisma.vehiculo.findMany({
            where: {
                ...(baseWhere.vehiculo as Prisma.VehiculoWhereInput),
                activo: false,
            },
            select: {
                id: true,
                placa: true,
                preoperacionales: {
                    where: { resultado: "RECHAZADO" },
                    orderBy: { fecha: "desc" },
                    take: 1,
                    select: {
                        id: true,
                        fecha: true,
                        detalles: {
                            where: { estado: false, criticidad: "ALTA" },
                            select: { item: true },
                        },
                    },
                },
            },
        });

        const preopAlerts: AlertNotification[] = blockedVehicles
            .filter((v) => v.preoperacionales.length > 0)
            .map((v) => {
                const lastPreop = v.preoperacionales[0];
                const failures = lastPreop.detalles
                    .map((d) => d.item)
                    .join(", ");
                return {
                    documentId: lastPreop.id,
                    vehiculoId: v.id,
                    vehiculoPlaca: v.placa,
                    tipo: `VEHÍCULO BLOQUEADO: ${failures}`,
                    fechaVencimiento: lastPreop.fecha,
                    daysUntilExpiry: 0,
                    status: "red" as const,
                };
            });

        const allAlerts: AlertNotification[] = [
            ...documentAlerts,
            ...licenseAlerts,
            ...preopAlerts,
        ].sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

        return { success: true, data: allAlerts };
    },
    "getResumenAlertas",
);

/**
 * Get all alert rules
 */
export const getReglasAlertas = withAuth(
    "ALL",
    async (): Promise<ActionResult> => {
        const reglas = await prisma.reglaAlerta.findMany({
            where: { activo: true },
        });
        return { success: true, data: reglas };
    },
    "getReglasAlertas",
);
