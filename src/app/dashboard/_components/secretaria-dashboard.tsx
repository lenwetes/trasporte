"use client";

import React from "react";
import Link from "next/link";
import { DashboardVehicle } from "@/lib/types";
import { 
    Shield, 
    AlertTriangle, 
    Car, 
    ChevronRight, 
    Truck, 
    FileText, 
    ArrowRight,
    TrendingUp,
    Clock,
    Activity,
    Plus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SecretariaDashboardProps {
    vehicles: DashboardVehicle[];
    theme?: string;
}

export function SecretariaDashboard({ vehicles, theme }: SecretariaDashboardProps) {
    const redCount = vehicles.filter((v) => v.alertLevel === "red").length;
    const yellowCount = vehicles.filter((v) => v.alertLevel === "yellow").length;
    const greenCount = vehicles.filter((v) => v.alertLevel === "green").length;

    if (theme === "hybrid-premium") {
        return (
            <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-700">
                {/* Premium Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b-2 border-slate-900">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-1 bg-accent" />
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                                Gestión <span className="text-accent italic">Documental</span>
                            </h1>
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-3">
                            Terminal Operativa — Control de Flota & Cumplimiento
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-2 border border-slate-200/50">
                        <div className="px-4 py-2 bg-white border border-slate-900 flex items-center gap-3">
                            <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-slate-900 tabular-nums uppercase">ESTADO: 100% OPERATIVO</span>
                        </div>
                    </div>
                </header>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Stats */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Flota Total Card */}
                        <div className="relative border-4 border-slate-900 bg-white p-8 group shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
                            <div className="flex items-center justify-between mb-8">
                                <div className="h-10 w-10 bg-slate-900 flex items-center justify-center">
                                    <Truck className="h-5 w-5 text-accent" />
                                </div>
                                <Badge className="bg-slate-100 text-slate-600 rounded-none border-none py-1 font-black text-[8px] tracking-widest uppercase">
                                    Consolidado Global
                                </Badge>
                            </div>
                            <div>
                                <h3 className="text-6xl font-black tracking-tighter leading-none mb-1 font-mono text-slate-900">
                                    {vehicles.length}
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Vehículos Registrados</p>
                            </div>
                        </div>

                        {/* Alertas Card */}
                        <div className="relative border-4 border-red-500 bg-white p-8 group shadow-[8px_8px_0px_0px_rgba(239,68,68,0.1)]">
                            <div className="flex items-center justify-between mb-8">
                                <div className="h-10 w-10 bg-red-600 flex items-center justify-center">
                                    <AlertTriangle className="h-5 w-5 text-white" />
                                </div>
                                <Badge className="bg-red-50 text-red-600 rounded-none border-red-200 py-1 font-black text-[8px] tracking-widest uppercase">
                                    Revisión Mandatoria
                                </Badge>
                            </div>
                            <div>
                                <h3 className="text-6xl font-black tracking-tighter leading-none mb-1 font-mono text-red-600">
                                    {redCount}
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">Faltas Críticas de Ley</p>
                            </div>
                        </div>

                        {/* Recent Activity / Quick Summary */}
                        <div className="md:col-span-2 bg-white border-2 border-slate-100 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="h-4 w-1 bg-accent" />
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Vehículos Críticos (Prioridad Alta)</h4>
                                </div>
                                <Link href="/dashboard/vehiculos">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors cursor-pointer">Gestionar Todos</span>
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {vehicles.filter(v => v.alertLevel === "red").slice(0, 5).map((v, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 border border-slate-50 hover:border-slate-900 bg-slate-50/30 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <span className="text-[11px] font-mono font-black text-slate-900">{v.placa}</span>
                                            <div className="h-1 w-1 bg-slate-200 rounded-full" />
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{v.marca}</span>
                                        </div>
                                        <Badge className="bg-red-100 text-red-700 border-none rounded-none text-[8px] font-black uppercase tracking-[0.1em]">ALERTA ROJA</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 p-8 shadow-[8px_8px_0px_0px_#018790]">
                            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6 border-b border-white/10 pb-4 flex items-center justify-between">
                                Acciones Maestras
                                <Activity className="h-4 w-4 text-accent" />
                            </h4>
                            <div className="space-y-3">
                                <RoleQuickLink icon={Plus} label="Nueva Planilla" href="/dashboard/fuec/nueva" />
                                <RoleQuickLink icon={FileText} label="Emitir FUEC" href="/dashboard/fuec" />
                                <RoleQuickLink icon={Car} label="Registrar Unidad" href="/dashboard/vehiculos/nuevo" />
                                <RoleQuickLink icon={Shield} label="Ver Auditoría" href="/dashboard/auditoria" />
                            </div>
                        </div>

                        <div className="bg-emerald-50 border-2 border-emerald-500/20 p-8">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-900 mb-2">Salud de la Flota</h4>
                            <div className="text-3xl font-black text-emerald-600 font-mono tracking-tighter mb-4">{greenCount}</div>
                            <p className="text-[9px] font-bold text-emerald-800/60 leading-relaxed uppercase tracking-wider">Vehículos con documentación al día y sin riesgos legales detectados.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="relative bg-gradient-to-br from-primary via-primary to-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-[0.06]" style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                    backgroundSize: "40px 40px"
                }} />
                <div className="relative z-10 p-8 md:p-10">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-white/10 border border-white/20 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tight leading-none">
                                Panel de Gestión Documental
                            </h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mt-1">
                                Monitoreo de Flota — Secretaría Operativa
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-primary/10 p-6 flex items-center gap-5">
                    <div className="h-14 w-14 bg-slate-50 border border-primary/10 flex items-center justify-center text-slate-900">
                        <Truck className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-3xl font-black text-primary font-mono tracking-tighter">{vehicles.length}</p>
                        <p className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em]">Total Flota</p>
                    </div>
                </div>
                <div className="bg-white border border-red-500/20 p-6 flex items-center gap-5">
                    <div className="h-14 w-14 bg-red-50 border border-red-500/20 flex items-center justify-center text-red-600">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-3xl font-black text-red-600 font-mono tracking-tighter">{redCount}</p>
                        <p className="text-[9px] font-black text-red-600/60 uppercase tracking-[0.2em]">Alertas Críticas</p>
                    </div>
                </div>
                <div className="bg-white border border-emerald-500/20 p-6 flex items-center gap-5">
                    <div className="h-14 w-14 bg-emerald-50 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                        <Shield className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-3xl font-black text-emerald-600 font-mono tracking-tighter">{greenCount}</p>
                        <p className="text-[9px] font-black text-emerald-600/60 uppercase tracking-[0.2em]">En Regla</p>
                    </div>
                </div>
            </div>

            {/* Vehicle Table */}
            <div className="bg-white border border-primary/10 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-primary/5">
                    <div className="flex items-center gap-3">
                        <Car className="h-4 w-4 text-slate-900" />
                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Estado de Flota (Top 10)</h3>
                    </div>
                    <Link href="/dashboard/vehiculos">
                        <Button variant="outline" size="sm" className="h-7 rounded-none text-[8px] font-black uppercase tracking-widest border-primary/10 hover:bg-primary hover:text-white px-3 gap-1 transition-all">
                            VER TODOS <ArrowRight className="h-3 w-3" />
                        </Button>
                    </Link>
                </div>
                <div className="divide-y divide-primary/5">
                    {vehicles.slice(0, 10).map((v, idx) => (
                        <Link key={idx} href={`/dashboard/vehiculos/${v.id}`}>
                            <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-all cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "h-2 w-2",
                                        v.alertLevel === "red" ? "bg-red-500" :
                                        v.alertLevel === "yellow" ? "bg-amber-500" : "bg-emerald-500"
                                    )} />
                                    <div>
                                        <span className="text-[11px] font-black text-primary uppercase tracking-tight">{v.placa}</span>
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-3">{v.marca}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge className={cn(
                                        "rounded-none text-[8px] font-black uppercase tracking-widest",
                                        v.alertLevel === "red" ? "bg-red-50 text-red-600 border-red-500/20" :
                                        v.alertLevel === "yellow" ? "bg-amber-50 text-amber-600 border-amber-500/20" :
                                        "bg-emerald-50 text-emerald-600 border-emerald-500/20"
                                    )}>
                                        {v.alertLevel === "red" ? "CRÍTICO" : v.alertLevel === "yellow" ? "ALERTA" : "OK"}
                                    </Badge>
                                    <ChevronRight className="h-4 w-4 text-primary/20 group-hover:text-accent transition-colors" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

function RoleQuickLink({ icon: Icon, label, href }: { icon: any, label: string, href: string }) {
    return (
        <Link href={href}>
            <div className="flex items-center justify-between p-4 border border-white/5 hover:bg-white/5 hover:border-accent transition-all group cursor-pointer">
                <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-white/40 group-hover:text-accent transition-colors" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">{label}</span>
                </div>
                <ArrowRight className="h-3 w-3 text-white/20 group-hover:text-accent transition-colors" />
            </div>
        </Link>
    );
}
