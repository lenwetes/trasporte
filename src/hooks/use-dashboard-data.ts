import type { DashboardOverviewData } from "@/actions/dashboard-overview";
import type { AdminDashboardStats, DashboardVehicle, ExpiryProjection } from "@/lib/types";
import { useMemo } from "react";

export interface DashboardDataInput {
    vehicles: DashboardVehicle[];
    projections: ExpiryProjection[];
    stats?: AdminDashboardStats;
    overview?: DashboardOverviewData;
}

export interface DashboardComputedData {
    // Totales Operativos
    totalVehiculos: number;
    totalConductores: number;
    totalContratos: number;
    totalSiniestros: number;
    totalNovedades: number;
    totalFuecActivos: number;
    vehiculosConAlertaRoja: number;
    
    // Datos Financieros
    carteraTotal: number;
    recaudoMes: number;
    cajaBalance: number;
    
    // Listas y Widgets
    recentVehicles: DashboardOverviewData["recentVehicles"];
    recentConductores: DashboardOverviewData["recentConductores"];
    upcomingExpiries: DashboardOverviewData["upcomingExpiries"];
    
    // Utilidades
    formatCurrency: (val: number) => string;
}

/**
 * Hook para centralizar la computación de datos del Dashboard.
 * Permite que diferentes temas visuales consuman la misma lógica de negocio.
 */
export function useDashboardData(input: DashboardDataInput): DashboardComputedData {
    const { vehicles, stats, overview } = input;

    // Utilidad de formateo de moneda colombiana
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
        }).format(val);
    };

    return useMemo(() => {
        return {
            totalVehiculos: overview?.totalVehiculos ?? stats?.totalVehiculos ?? vehicles.length,
            totalConductores: overview?.totalConductores ?? stats?.totalConductores ?? 0,
            totalContratos: overview?.totalContratos ?? stats?.totalContratos ?? 0,
            totalSiniestros: overview?.totalSiniestros ?? stats?.totalSiniestros ?? 0,
            totalNovedades: overview?.totalNovedades ?? stats?.totalNovedades ?? 0,
            totalFuecActivos: overview?.totalFuecActivos ?? 0,
            vehiculosConAlertaRoja: overview?.vehiculosConAlertaRoja ?? 
                                    vehicles.filter((v) => v.alertLevel === "red").length,

            carteraTotal: overview?.carteraTotal ?? 0,
            recaudoMes: overview?.recaudoMes ?? 0,
            cajaBalance: overview?.cajaBalance ?? 0,

            recentVehicles: overview?.recentVehicles ?? [],
            recentConductores: overview?.recentConductores ?? [],
            upcomingExpiries: overview?.upcomingExpiries ?? [],
            
            formatCurrency,
        };
    }, [vehicles, stats, overview]);
}
