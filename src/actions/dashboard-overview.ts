"use server";

import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { withAuth } from "@/lib/safe-action";

/**
 * Compact vehicle snapshot for Dashboard widgets
 */
export interface DashboardVehicleSnapshot {
    id: string;
    placa: string;
    marca: string;
    modelo: string | null;
    propietario: string;
    activo: boolean;
}

/**
 * Compact conductor snapshot for Dashboard widgets
 */
export interface DashboardConductorSnapshot {
    id: string;
    nombres: string;
    apellidos: string;
    numeroDocumento: string;
    activo: boolean;
}

/**
 * Upcoming expiry for any document
 */
export interface UpcomingExpiry {
    id: string;
    tipo: string;
    fechaVencimiento: string;
    vehiculoPlaca: string;
    vehiculoId: string;
    diasRestantes: number;
}

export interface FleetStats {
    totalVehiculos: number;
    totalConductores: number;
    totalContratos: number;
    totalSiniestros: number;
    totalNovedades: number;
    totalFuecActivos: number;
    vehiculosConAlertaRoja: number;
}

export interface FinancialStats {
    carteraTotal: number;
    recaudoMes: number;
    cajaBalance: number;
}

export interface RecentActivity {
    recentVehicles: DashboardVehicleSnapshot[];
    recentConductores: DashboardConductorSnapshot[];
}

export interface ExpiringDocsOverview {
    upcomingExpiries: UpcomingExpiry[];
}

/**
 * Full dashboard overview payload
 */
export interface DashboardOverviewData extends FleetStats, FinancialStats, RecentActivity, ExpiringDocsOverview {}

export const getDashboardOverview = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (): Promise<ActionResult<DashboardOverviewData>> => {
        // Legacy wrapper that combines all for backward compatibility if needed
        const [stats, finance, activity, expiries] = await Promise.all([
            getFleetStats(),
            getFinancialStats(),
            getRecentActivity(),
            getExpiringDocumentsOverview()
        ]);

        return {
            success: true,
            data: {
                ...(stats.data as FleetStats),
                ...(finance.data as FinancialStats),
                ...(activity.data as RecentActivity),
                ...(expiries.data as ExpiringDocsOverview)
            } as DashboardOverviewData
        };
    },
    "getDashboardOverview",
);

export const getFleetStats = withAuth(
    ["ADMIN", "SECRETARIA", "PROPIETARIO"],
    async (): Promise<ActionResult<FleetStats>> => {
        const today = new Date();
        const [
            totalVehiculos,
            totalConductores,
            totalContratos,
            totalSiniestros,
            totalNovedades,
            totalFuecActivos,
            vehiculosConAlertaRoja,
        ] = await Promise.all([
            prisma.vehiculo.count({ where: { activo: true } }),
            prisma.usuario.count({ where: { rol: "CONDUCTOR", activo: true } }),
            prisma.vinculacion.count({ where: { activo: true } }),
            prisma.siniestro.count(),
            prisma.novedad.count(),
            prisma.planillaFUEC.count({
                where: { estado: "ACTIVO", fechaFin: { gte: today } },
            }),
            prisma.vehiculo.count({
                where: {
                    activo: true,
                    documentos: {
                        some: {
                            fechaVencimiento: { lt: today },
                        },
                    },
                },
            }),
        ]);

        return {
            success: true,
            data: {
                totalVehiculos,
                totalConductores,
                totalContratos,
                totalSiniestros,
                totalNovedades,
                totalFuecActivos,
                vehiculosConAlertaRoja,
            }
        };
    },
    "getFleetStats"
);

export const getFinancialStats = withAuth(
    ["ADMIN"],
    async (): Promise<ActionResult<FinancialStats>> => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const [
            carteraTotalAgg,
            recaudoMesAgg,
            cajaBalanceResult,
        ] = await Promise.all([
            prisma.obligacionFinanciera.aggregate({
                _sum: { saldoPendiente: true },
                where: { estado: { not: "PAGADO" } },
            }),
            prisma.asientoContable.aggregate({
                _sum: { debito: true },
                where: {
                    cuenta: { codigo: { in: ["1105", "1110"] } },
                    transaccion: {
                        fecha: { gte: startOfMonth },
                        tipo: "INGRESO",
                    },
                },
            }),
            prisma.asientoContable.aggregate({
                _sum: { debito: true, credito: true },
                where: { cuenta: { codigo: "110505" } },
            }),
        ]);

        return {
            success: true,
            data: {
                carteraTotal: Number(carteraTotalAgg._sum.saldoPendiente || 0),
                recaudoMes: Number(recaudoMesAgg._sum.debito || 0),
                cajaBalance: Number(cajaBalanceResult._sum.debito || 0) - Number(cajaBalanceResult._sum.credito || 0),
            }
        };
    },
    "getFinancialStats"
);

export const getRecentActivity = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (): Promise<ActionResult<RecentActivity>> => {
        const [vehiclesSnap, conductorsSnap] = await Promise.all([
            prisma.vehiculo.findMany({
                where: { activo: true },
                select: {
                    id: true,
                    placa: true,
                    marca: true,
                    modelo: true,
                    activo: true,
                    propietarioId: true,
                    propietarioUser: { select: { nombres: true, apellidos: true } },
                },
                orderBy: { creadoEn: "desc" },
                take: 6,
            }),
            prisma.usuario.findMany({
                where: { rol: "CONDUCTOR", activo: true },
                select: {
                    id: true,
                    nombres: true,
                    apellidos: true,
                    numeroDocumento: true,
                    activo: true,
                },
                orderBy: { creadoEn: "desc" },
                take: 6,
            }),
        ]);

        return {
            success: true,
            data: {
                recentVehicles: vehiclesSnap.map(v => ({
                    id: v.id,
                    placa: v.placa,
                    marca: v.marca ?? "N/A",
                    modelo: v.modelo,
                    propietario: v.propietarioUser ? `${v.propietarioUser.nombres} ${v.propietarioUser.apellidos}` : "N/A",
                    activo: v.activo,
                })),
                recentConductores: conductorsSnap.map(c => ({
                    id: c.id,
                    nombres: c.nombres,
                    apellidos: c.apellidos,
                    numeroDocumento: c.numeroDocumento ?? "N/A",
                    activo: c.activo,
                }))
            }
        };
    },
    "getRecentActivity"
);

export const getExpiringDocumentsOverview = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (): Promise<ActionResult<ExpiringDocsOverview>> => {
        const today = new Date();
        const in30Days = new Date();
        in30Days.setDate(today.getDate() + 30);

        const upcomingDocs = await prisma.documentoVehiculo.findMany({
            where: {
                fechaVencimiento: { gte: today, lte: in30Days },
                vehiculo: { activo: true },
            },
            select: {
                id: true,
                tipo: true,
                fechaVencimiento: true,
                vehiculo: { select: { placa: true, id: true } },
            },
            orderBy: { fechaVencimiento: "asc" },
            take: 8,
        });

        return {
            success: true,
            data: {
                upcomingExpiries: upcomingDocs.map(d => {
                    const expDate = new Date(d.fechaVencimiento!);
                    const diffTime = expDate.getTime() - today.getTime();
                    return {
                        id: d.id,
                        tipo: d.tipo,
                        fechaVencimiento: expDate.toISOString(),
                        vehiculoPlaca: d.vehiculo.placa,
                        vehiculoId: d.vehiculo.id,
                        diasRestantes: Math.ceil(diffTime / (1000 * 60 * 60 * 24)),
                    };
                })
            }
        };
    },
    "getExpiringDocumentsOverview"
);
