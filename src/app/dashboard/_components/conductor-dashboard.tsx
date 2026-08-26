"use client";

import React from "react";
import { ConductorData } from "@/lib/types";
import {
    Shield,
    Car,
    FileText,
    Clock,
    ArrowRight,
    UserCheck,
    MapPin,
    Activity,
    ShieldCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ConductorDashboardProps {
    conductorData: ConductorData;
    theme?: string;
}

export function ConductorDashboard({ conductorData, theme }: ConductorDashboardProps) {
    const activeVinculacion = conductorData.vinculaciones?.[0];
    const vehiculo = activeVinculacion?.vehiculo;
    const fuec = conductorData.fuecActivo;

    const initials = `${conductorData.nombres.charAt(0)}${conductorData.apellidos.charAt(0)}`;

    if (theme === "hybrid-premium") {
        return (
            <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-700">
                {/* Premium Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b-2 border-slate-900">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 bg-slate-900 flex items-center justify-center text-2xl font-black text-accent rotate-0">
                            {initials}
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                                    {conductorData.nombres} <span className="text-accent italic">{conductorData.apellidos}</span>
                                </h1>
                            </div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                                Operador de Flota — ID: {conductorData.id.slice(-8).toUpperCase()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-2 border border-slate-200/50">
                        <div className="px-4 py-2 bg-white border border-slate-900 flex items-center gap-3">
                            <UserCheck className="h-4 w-4 text-emerald-500" />
                            <span className="text-[10px] font-black text-slate-900 tabular-nums uppercase">OPERADOR: ACTIVO</span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Vehicle Box */}
                    <div className="lg:col-span-1 bg-white border-4 border-slate-900 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-slate-50">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Vehículo Asignado</h3>
                            <Car className="h-4 w-4 text-accent" />
                        </div>
                        {vehiculo ? (
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-5xl font-black font-mono text-slate-900 italic tracking-tighter mb-2">{vehiculo.placa}</h4>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{vehiculo.marca} {vehiculo.modelo}</p>
                                </div>
                                <Link href={`/dashboard/vehiculos/${vehiculo.id}`}>
                                    <Button className="w-full h-10 border-2 border-slate-900 bg-slate-900 text-white hover:bg-white hover:text-slate-900 rounded-none transition-all uppercase font-black text-[10px] tracking-widest">
                                        DETALLES TÉCNICOS
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="py-12 bg-slate-50 flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                                <Car className="h-8 w-8 text-slate-200 mb-4" />
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sin asignación detectada</p>
                            </div>
                        )}
                    </div>

                    {/* FUEC Box */}
                    <div className="lg:col-span-2 bg-white border-4 border-slate-900 p-8 shadow-[8px_8px_0px_0px_rgba(1,135,144,0.1)]">
                         <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-slate-50">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Planilla de Viaje Activa</h3>
                            <FileText className="h-4 w-4 text-accent" />
                        </div>
                        {fuec ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Consecutivo FUEC</p>
                                        <h4 className="text-4xl font-black font-mono text-slate-900">{fuec.consecutivo}</h4>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge className="bg-emerald-500 text-white rounded-none border-none py-1.5 font-black text-[9px] tracking-widest uppercase">EN CURSO</Badge>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-900">
                                            <Clock className="h-4 w-4 text-accent" />
                                            EXPIRA: {new Date(fuec.fechaFin).toLocaleDateString("es-CO")}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-6 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-4 w-4 text-slate-900 mt-1" />
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Ruta Autorizada</p>
                                            <p className="text-[11px] font-black text-slate-900 uppercase">{fuec.ruta?.origen} <ArrowRight className="h-3 w-3 inline mx-1" /> {fuec.ruta?.destino}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Activity className="h-4 w-4 text-slate-900 mt-1" />
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Pasajeros</p>
                                            <p className="text-[11px] font-black text-slate-900 uppercase">Capacidad Técnica OK</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 bg-slate-50 flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                                <FileText className="h-10 w-10 text-slate-200 mb-4" />
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">No hay planillas de viaje activas</p>
                                <Link href="/dashboard/fuec" className="mt-6 text-[9px] font-black text-accent hover:underline uppercase tracking-widest">Ver Historial de Viajes</Link>
                            </div>
                        )}
                    </div>

                    {/* Footer Info */}
                    <div className="lg:col-span-3 bg-slate-50 border-2 border-slate-200 p-6 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <ShieldCheck className="h-5 w-5 text-emerald-600" />
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                Tu perfil operativo y documentos de ley están vigentes y bajo monitoreo preventivo.
                            </p>
                        </div>
                        <Badge className="bg-white border-2 border-slate-900 text-slate-900 rounded-none font-black text-[9px] uppercase tracking-widest py-1.5 px-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                            CC {conductorData.numeroDocumento}
                        </Badge>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Executive Header */}
            <div className="relative bg-gradient-to-br from-primary via-primary to-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-[0.06]" style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                    backgroundSize: "40px 40px"
                }} />
                <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="h-16 w-16 bg-accent/20 border border-white/20 flex items-center justify-center text-2xl font-black text-accent">
                            {initials}
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none">
                                {conductorData.nombres} {conductorData.apellidos}
                            </h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mt-1">
                                Panel de Conductor — CC {conductorData.numeroDocumento}
                            </p>
                        </div>
                    </div>
                    <Badge className="bg-white/10 border border-white/20 text-accent rounded-none font-black text-[10px] uppercase tracking-widest px-4 py-2">
                        <UserCheck className="h-4 w-4 mr-2" /> OPERADOR ACTIVO
                    </Badge>
                </div>
            </div>

            {/* Vehicle Assignment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-primary/10 p-6">
                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-primary/5">
                        <Car className="h-4 w-4 text-slate-900" />
                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                            Vehículo Asignado
                        </h3>
                    </div>
                    {vehiculo ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-primary/5 border border-primary/10 flex items-center justify-center">
                                    <Car className="h-6 w-6 text-slate-900" />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-primary uppercase tracking-tight">{vehiculo.placa}</p>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{vehiculo.marca} {vehiculo.modelo}</p>
                                </div>
                            </div>
                            <Link href={`/dashboard/vehiculos/${vehiculo.id}`}>
                                <Button variant="outline" size="sm" className="h-8 rounded-none text-[8px] font-black uppercase tracking-widest border-primary/10 hover:bg-primary hover:text-white gap-1 transition-all">
                                    VER <ArrowRight className="h-3 w-3" />
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="py-8 flex flex-col items-center justify-center border border-dashed border-primary/10 bg-slate-50">
                            <Car className="h-6 w-6 text-primary mb-2" />
                            <p className="text-[9px] font-black text-primary uppercase tracking-widest">Sin vehículo asignado</p>
                        </div>
                    )}
                </div>

                {/* FUEC Active */}
                <div className="bg-white border border-primary/10 p-6">
                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-primary/5">
                        <FileText className="h-4 w-4 text-accent" />
                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                            FUEC Activo
                        </h3>
                    </div>
                    {fuec ? (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-black text-primary font-mono tracking-tighter">{fuec.consecutivo}</span>
                                <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-500/20 rounded-none text-[8px] font-black uppercase">VIGENTE</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                <MapPin className="h-3 w-3" />
                                {fuec.ruta?.origen} → {fuec.ruta?.destino}
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                <Clock className="h-3 w-3" />
                                Hasta: {new Date(fuec.fechaFin).toLocaleDateString("es-CO")}
                            </div>
                        </div>
                    ) : (
                        <div className="py-8 flex flex-col items-center justify-center border border-dashed border-primary/10 bg-slate-50">
                            <FileText className="h-6 w-6 text-primary mb-2" />
                            <p className="text-[9px] font-black text-primary uppercase tracking-widest">Sin planilla activa</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Document Monitoring */}
            <div className="bg-white border border-primary/10 p-6">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-primary/5">
                    <Shield className="h-4 w-4 text-accent" />
                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                        Estado Documental
                    </h3>
                </div>
                <div className="bg-emerald-50 border border-emerald-500/20 p-4 flex items-center gap-4">
                    <Shield className="h-5 w-5 text-emerald-600" />
                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                        Tus documentos están siendo monitoreados por el motor de alerta preventiva SGIT.
                    </p>
                </div>
            </div>
        </div>
    );
}
