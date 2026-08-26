"use client";

import React from "react";
import { 
    DashboardVehicle, 
    ExpiryProjection, 
    AdminDashboardStats 
} from "@/lib/types";
import type { DashboardOverviewData } from "@/actions/dashboard-overview";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { 
    Zap, 
    TrendingUp, 
    Activity, 
    ShieldCheck, 
    Clock, 
    ArrowUpRight,
    Car,
    Users,
    FileText,
    AlertCircle,
    Package,
    Calendar,
    ChevronRight,
    MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface HybridPremiumDashboardProps {
    vehicles: DashboardVehicle[];
    projections: ExpiryProjection[];
    stats?: AdminDashboardStats;
    overview?: DashboardOverviewData;
}

export function HybridPremiumDashboard(props: HybridPremiumDashboardProps) {
    const data = useDashboardData(props);

    return (
        <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-700">
            {/* ─── Cabecera Inteligente ─── */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b-2 border-slate-900">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-1 bg-accent" />
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                            Premium <span className="text-accent italic">Hybrid</span>
                        </h1>
                    </div>
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] pl-3">
                        Terminal Inteligente de Auditoría & Control
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-2 border border-slate-200/50">
                    <div className="px-4 py-2 bg-white border border-slate-900 flex items-center gap-3">
                        <Activity className="h-4 w-4 text-emerald-700 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-900 tabular-nums uppercase">ESTADO: 100% OPERATIVO</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* ─── Panel Principal de Métricas (Bento-Grid Style) ─── */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Tarjeta de Recaudo Premium */}
                    <div className="md:col-span-2 relative border-4 border-slate-900 bg-white p-10 group shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)]">
                        <div className="absolute top-0 right-0 p-10">
                            <TrendingUp className="h-20 w-20 text-slate-900/5 -rotate-12 transition-transform group-hover:scale-110 duration-700" />
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                            <div className="flex items-center justify-between">
                                <Badge className="bg-slate-900 text-white rounded-none px-4 py-1.5 font-bold uppercase tracking-widest text-[9px]">
                                    Flujo de Caja Mensual
                                </Badge>
                                <div className="h-10 w-10 bg-slate-900 flex items-center justify-center">
                                    <Zap className="h-5 w-5 text-accent" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-7xl font-black tracking-tighter leading-none mb-4 font-mono text-slate-900">
                                    {data.formatCurrency(data.recaudoMes)}
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-emerald-700 font-black text-xs uppercase tracking-widest">
                                        <ArrowUpRight className="h-4 w-4" />
                                        <span>+12.5%</span>
                                    </div>
                                    <span className="text-slate-900 text-[10px] font-black uppercase tracking-widest">Crecimiento vs mes anterior</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alertas Críticas Vertical */}
                    <div className="bg-accent p-10 text-slate-900 border-4 border-slate-900 flex flex-col justify-between group shadow-[10px_10px_0px_0px_rgba(0,128,128,0.1)]">
                        <div className="space-y-4">
                            <div className="h-12 w-12 bg-slate-900 flex items-center justify-center">
                                <AlertCircle className="h-6 w-6 text-accent" />
                            </div>
                            <h3 className="text-2xl font-black leading-[1.1] uppercase tracking-tighter">
                                Alertas en<br/>la Flota
                            </h3>
                        </div>
                        <div>
                            <div className="text-8xl font-black tracking-tighter font-mono mb-2 leading-none">
                                {data.vehiculosConAlertaRoja}
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900/60 mt-4">
                                Unidades Críticas
                            </p>
                        </div>
                    </div>

                    {/* Mini Stats Grid */}
                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatItem icon={Car} label="Flota Total" value={data.totalVehiculos} borderColor="border-blue-500" />
                        <StatItem icon={Users} label="Talento Humano" value={data.totalConductores} borderColor="border-indigo-500" />
                        <StatItem icon={FileText} label="FUECs Activos" value={data.totalFuecActivos} borderColor="border-emerald-500" />
                        <StatItem icon={Package} label="Contratos" value={data.totalContratos} borderColor="border-slate-900" />
                    </div>

                    {/* Timeline de Vencimientos */}
                    <div className="md:col-span-3 bg-white border-2 border-slate-100 p-8">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div className="h-8 w-1.5 bg-accent" />
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
                                    Radar de Vencimientos
                                </h3>
                            </div>
                            <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2">
                                Auditoría Completa <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            {data.upcomingExpiries.slice(0, 4).map((exp, i) => (
                                <div key={i} className="flex items-center gap-5 p-4 border border-slate-50 hover:border-slate-200 transition-all group">
                                    <div className={cn(
                                        "h-14 w-14 flex flex-col items-center justify-center border-2 transition-transform group-hover:scale-105 duration-300",
                                        exp.diasRestantes <= 5 ? "bg-red-50 border-red-500 text-red-600" :
                                        exp.diasRestantes <= 15 ? "bg-amber-50 border-amber-500 text-amber-600" :
                                        "bg-emerald-50 border-emerald-500 text-emerald-600"
                                    )}>
                                        <span className="text-xl font-black leading-none">{exp.diasRestantes}</span>
                                        <span className="text-[7px] font-black uppercase">DÍAS</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <span className="text-[11px] font-black text-slate-900 uppercase truncate font-mono">{exp.vehiculoPlaca}</span>
                                            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest rounded-none border-slate-900">{exp.tipo}</Badge>
                                        </div>
                                        <div className="relative w-full h-2 bg-slate-100 overflow-hidden">
                                            <div 
                                                className={cn(
                                                    "h-full transition-all duration-1000",
                                                    exp.diasRestantes <= 5 ? "bg-red-500" : "bg-accent"
                                                )} 
                                                style={{ width: `${Math.max(5, 100 - (exp.diasRestantes * 3.3))}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ─── Columna Lateral: Radar Ético y Rapidez ─── */}
                <div className="space-y-8">
                    {/* Cartera Total Widget */}
                    <div className="bg-white border-2 border-slate-900 p-8 shadow-[8px_8px_0px_0px_#fca311] relative overflow-hidden group">
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-orange-500" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Estado de Cartera</p>
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 leading-tight tracking-tighter uppercase">
                                Saldo Pendiente de Recaudo
                            </h4>
                            <div>
                                <div className="text-4xl font-black text-slate-900 font-mono tracking-tighter mb-3">
                                    {data.formatCurrency(data.carteraTotal)}
                                </div>
                                <div className="flex items-center gap-2 bg-red-50 p-2 border border-red-100">
                                    <div className="h-2 w-2 bg-red-600 rounded-none animate-pulse" />
                                    <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">Ejecución de Cobro Requerida</span>
                                </div>
                            </div>
                            <div className="h-4 bg-slate-50 border border-slate-100">
                                <div className="h-full bg-slate-900 w-[65%]" />
                            </div>
                        </div>
                    </div>

                    {/* Quick Access List */}
                    <div className="bg-slate-50 border border-slate-200 p-8 space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Operaciones Root</h3>
                            <div className="h-2 w-2 bg-accent" />
                        </div>
                        <div className="space-y-2">
                            <QuickLink icon={ShieldCheck} label="Centro Operativo" href="/dashboard" />
                            <QuickLink icon={Calendar} label="Agenda de Flota" href="/dashboard/mantenimiento" />
                            <QuickLink icon={Users} label="Gestión de Talento" href="/dashboard/usuarios" />
                            <QuickLink icon={Activity} label="Logs de Auditoría" href="/dashboard/auditoria" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatItem({ icon: Icon, label, value, borderColor }: { icon: any, label: string, value: number, borderColor: string }) {
    return (
        <div className={cn("bg-white border-2 p-6 flex flex-col gap-4 group transition-all", borderColor)}>
            <div className="h-10 w-10 bg-slate-900 flex items-center justify-center text-white">
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-900 mb-1 leading-none">{label}</p>
                <p className="text-3xl font-black text-slate-900 font-mono tracking-tighter leading-none">{value}</p>
            </div>
        </div>
    );
}

function QuickLink({ icon: Icon, label, href }: { icon: any, label: string, href: string }) {
    return (
        <a href={href} className="flex items-center justify-between p-4 bg-white border border-slate-100 hover:border-slate-900 transition-all group">
            <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-slate-900 group-hover:text-slate-900 transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-950 group-hover:text-slate-900 transition-colors">{label}</span>
            </div>
            <ArrowUpRight className="h-3 w-3 text-slate-900 group-hover:text-slate-900 transition-colors" />
        </a>
    );
}
