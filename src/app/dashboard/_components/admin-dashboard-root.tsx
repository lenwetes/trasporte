"use client";

import { Truck, Users, FileText, AlertTriangle, Activity } from "lucide-react";
import { DashboardVehicle, ExpiryProjection, AdminDashboardStats } from "@/lib/types";
import type { DashboardOverviewData } from "@/actions/dashboard-overview";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { ExecutiveHeader } from "./executive-header";
import { KpiCard } from "./kpi-card";
import { QuickActionsWidget } from "./quick-actions-widget";
import { UpcomingExpiriesWidget } from "./upcoming-expiries-widget";
import { MiniVehicleList, MiniConductorList } from "./mini-entity-lists";
import { FleetStatusStrip, ExpiryProjectionChart } from "./fleet-widgets";
import { FinancialMiniDashboard } from "./financial-mini-dashboard";
import { CalendarWidget } from "./calendar-widget";

interface AdminDashboardProps {
    vehicles: DashboardVehicle[];
    projections: ExpiryProjection[];
    stats?: AdminDashboardStats;
    overview?: DashboardOverviewData;
}

export function AdminDashboardRoot({ vehicles, projections, stats, overview }: AdminDashboardProps) {
    const data = useDashboardData({ vehicles, projections, stats, overview });

    const {
        totalVehiculos, totalConductores, totalContratos,
        totalSiniestros, totalNovedades, totalFuecActivos,
        vehiculosConAlertaRoja, recaudoMes, carteraTotal,
        recentVehicles, recentConductores, upcomingExpiries,
        formatCurrency,
    } = data;

    return (
        <div className="pb-20">
            {/* ACTION HUB - POSITIONED AT THE VERY TOP (AS REQUESTED) */}
            <QuickActionsWidget />

            <ExecutiveHeader />

            <div className="px-10 space-y-12 mt-12">
                {/* DOUBLE LISTS - SIDE BY SIDE (SYMMETRIC) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
                    <MiniVehicleList vehicles={recentVehicles || []} />
                    <MiniConductorList conductores={recentConductores || []} />
                </div>

                {/* SECTOR A: INTELIGENCIA FINANCIERA (MOVED DOWN) */}
                <div className="space-y-6 pt-10 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="h-4 w-1 bg-accent" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Inteligencia Financiera</h2>
                    </div>

                    <FinancialMiniDashboard />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border border-slate-100 p-6 flex flex-col justify-center gap-1 shadow-sm border-l-4 border-l-emerald-500 hover:shadow-lg transition-all">
                            <p className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em]">RECAUDO MES ACTUAL</p>
                            <p className="text-2xl font-black text-emerald-600 font-mono tracking-tighter leading-none">{formatCurrency(recaudoMes)}</p>
                        </div>
                        <div className="bg-white border border-slate-100 p-6 flex flex-col justify-center gap-1 shadow-sm border-l-4 border-l-red-500 hover:shadow-lg transition-all">
                            <p className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em]">CARTERA TOTAL PENDIENTE</p>
                            <p className="text-2xl font-black text-red-600 font-mono tracking-tighter leading-none">{formatCurrency(carteraTotal)}</p>
                        </div>
                    </div>
                </div>

                {/* FLOTA & OPERACIONES KPI STRIP */}
                <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <KpiCard label="FLOTA ACTIVA" value={totalVehiculos} icon={Truck} accent />
                        <KpiCard label="CONDUCTORES" value={totalConductores} icon={Users} />
                        <KpiCard label="VINCULACIONES" value={totalContratos} icon={FileText} />
                        <KpiCard label="FUEC CORRIENDO" value={totalFuecActivos} icon={Activity} accent />
                        <KpiCard label="ALERTAS ROJAS" value={vehiculosConAlertaRoja} icon={AlertTriangle} danger={vehiculosConAlertaRoja > 0} />
                    </div>
                    <FleetStatusStrip vehicles={vehicles} />
                </div>

                {/* SECONDARY WIDGETS AT BOTTOM */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-100">
                    <UpcomingExpiriesWidget expiries={upcomingExpiries} />
                    <ExpiryProjectionChart projections={projections} />
                    <CalendarWidget />
                </div>
            </div>
        </div>
    );
}
