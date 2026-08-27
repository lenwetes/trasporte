"use client";

import React from "react";
import Link from "next/link";
import { DashboardVehicle } from "@/lib/types";
import {
    Shield,
    AlertTriangle,
    Car,
    ChevronRight,
    ArrowRight,
    Building2,
    Activity,
    ActivityIcon,
    ShieldAlert,
    Clock,
    User
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PropietarioDashboardProps {
    vehicles: DashboardVehicle[];
    userName: string;
    theme?: string;
}

export function PropietarioDashboard({
    vehicles,
    userName,
    theme
}: PropietarioDashboardProps) {
    const redCount = vehicles.filter((v) => v.alertLevel === "red").length;
    const yellowCount = vehicles.filter((v) => v.alertLevel === "yellow").length;

    if (theme === "hybrid-premium") {
        return (
            <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-700">
                {/* Premium Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b-2 border-slate-900">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-1 bg-accent" />
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                                Portal <span className="text-accent italic">Propietario</span>
                            </h1>
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-3">
                            Bienvenido, {userName} — Control de Activos
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-2 border border-slate-200/50">
                        <div className="px-4 py-2 bg-white border border-slate-900 flex items-center gap-3">
                            <User className="h-4 w-4 text-emerald-500" />
                            <span className="text-[10px] font-black text-slate-900 tabular-nums uppercase">PERFIL: VERIFICADO</span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white border-4 border-slate-900 p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)]">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">Unidades Registradas</p>
                                <div className="flex items-end justify-between">
                                    <span className="text-6xl font-black font-mono leading-none text-slate-900">{vehicles.length}</span>
                                    <Car className="h-8 w-8 text-slate-200" />
                                </div>
                            </div>

                            <div className={cn(
                                "border-4 p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)]",
                                redCount > 0 ? "bg-red-50 border-red-500" : "bg-white border-slate-900 opacity-40"
                            )}>
                                <p className={cn("text-[9px] font-black uppercase tracking-widest mb-4", redCount > 0 ? "text-red-600" : "text-slate-400")}>
                                    Bloqueo Operativo
                                </p>
                                <div className="flex items-end justify-between">
                                    <span className={cn("text-6xl font-black font-mono leading-none", redCount > 0 ? "text-red-600" : "text-slate-900")}>{redCount}</span>
                                    <ShieldAlert className={cn("h-8 w-8", redCount > 0 ? "text-red-400" : "text-slate-200")} />
                                </div>
                            </div>

                            <div className="bg-white border-4 border-slate-900 p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)]">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">Vigilancia Técnica</p>
                                <div className="flex items-end justify-between">
                                    <span className="text-6xl font-black font-mono leading-none text-slate-900">{yellowCount}</span>
                                    <ActivityIcon className="h-8 w-8 text-amber-200" />
                                </div>
                            </div>
                        </div>

                        {/* Property List */}
                        <div className="bg-white border-2 border-slate-900">
                             <div className="flex items-center justify-between p-6 border-b-2 border-slate-900 bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="h-4 w-1 bg-accent" />
                                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Inventario de Activos</h3>
                                </div>
                                <Link href="/dashboard/vehiculos">
                                    <Button variant="outline" className="h-7 border-slate-900 rounded-none text-[8px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                                        DETALLE COMPLETO
                                    </Button>
                                </Link>
                            </div>
                            <div className="divide-y-2 divide-slate-100">
                                {vehicles.length > 0 ? (
                                    vehicles.map((v, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-all group">
                                            <div className="flex items-center gap-6">
                                                <div className="h-12 w-12 bg-slate-900 flex flex-col items-center justify-center text-white">
                                                    <span className="text-[10px] font-black leading-none">VEH</span>
                                                    <div className="h-px w-4 bg-accent my-1" />
                                                    <span className="text-[8px] font-bold opacity-50">{i + 1}</span>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="text-lg font-black text-slate-900 font-mono italic">{v.placa}</span>
                                                        <Badge className={cn(
                                                            "rounded-none border-none text-[8px] font-black px-2 tracking-widest",
                                                            v.alertLevel === "red" ? "bg-red-500 text-white" :
                                                            v.alertLevel === "yellow" ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"
                                                        )}>
                                                            {v.alertLevel.toUpperCase()}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{v.marca} — {v.vin ? `VIN: ${v.vin.slice(-6)}` : "SIN VIN"}</p>
                                                </div>
                                            </div>
                                            <Link href={`/dashboard/vehiculos/${v.id}`}>
                                                <div className="h-10 w-10 border border-slate-200 flex items-center justify-center hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all cursor-pointer">
                                                    <ArrowRight className="h-4 w-4" />
                                                </div>
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-20 text-center flex flex-col items-center">
                                        <Building2 className="h-12 w-12 text-slate-100 mb-4" />
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Sin propiedades asignadas</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Access Column */}
                    <div className="space-y-6">
                        <div className="bg-slate-50 border-2 border-slate-900 p-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-6 flex items-center justify-between">
                                Radar Operativo
                                <Clock className="h-4 w-4 text-slate-400" />
                            </h4>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-500">
                                        <span>Salud de Flota</span>
                                        <span>{(vehicles.filter(v => v.alertLevel === "green").length / (vehicles.length || 1) * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-200">
                                        <div className="h-full bg-emerald-500" style={{ width: `${(vehicles.filter(v => v.alertLevel === "green").length / (vehicles.length || 1) * 100)}%` }} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-500">
                                        <span>Riesgos Legales</span>
                                        <span>{(redCount / (vehicles.length || 1) * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-200">
                                        <div className="h-full bg-red-500" style={{ width: `${(redCount / (vehicles.length || 1) * 100)}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 p-8 text-white">
                            <h4 className="text-[9px] font-black uppercase tracking-widest text-accent mb-4">Enlaces Rápidos</h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/dashboard/perfil" className="text-[10px] font-bold text-white/70 hover:text-white hover:pl-2 transition-all flex items-center gap-2">
                                        <div className="h-1 w-1 bg-accent" /> MI PERFIL FISCAL
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard/gestion-documental" className="text-[10px] font-bold text-white/70 hover:text-white hover:pl-2 transition-all flex items-center gap-2">
                                        <div className="h-1 w-1 bg-accent" /> ARCHIVO DOCUMENTAL
                                    </Link>
                                </li>
                            </ul>
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
                <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-white/10 border border-white/20 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tight leading-none">
                                Portal de Propietario
                            </h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mt-1">
                                Bienvenido, {userName}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white/10 border border-white/20 px-5 py-3 text-center">
                            <p className="text-2xl font-black font-mono tracking-tighter text-accent">{vehicles.length}</p>
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white">ACTIVOS</p>
                        </div>
                        {redCount > 0 && (
                            <div className="bg-red-500/20 border border-red-500/30 px-5 py-3 text-center">
                                <p className="text-2xl font-black font-mono tracking-tighter text-red-400">{redCount}</p>
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-red-300/60">ALERTAS</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Vehicle List */}
            <div className="bg-white border border-primary/10">
                <div className="flex items-center justify-between p-6 border-b border-primary/5">
                    <div className="flex items-center gap-3">
                        <Car className="h-4 w-4 text-slate-900" />
                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Mis Vehículos Registrados</h3>
                    </div>
                    <Link href="/dashboard/vehiculos">
                        <Button variant="outline" size="sm" className="h-7 rounded-none text-[8px] font-black uppercase tracking-widest border-primary/10 hover:bg-primary hover:text-white px-3 gap-1 transition-all">
                            VER TODOS <ArrowRight className="h-3 w-3" />
                        </Button>
                    </Link>
                </div>

                {vehicles.length > 0 ? (
                    <div className="divide-y divide-primary/5">
                        {vehicles.map((v, idx) => (
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
                ) : (
                    <div className="py-16 flex flex-col items-center justify-center bg-slate-50 border-t">
                        <Car className="h-8 w-8 text-primary mb-3" />
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                            No hay vehículos registrados a su nombre
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
