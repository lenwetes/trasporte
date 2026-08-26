"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Plus, 
    Pencil, 
    FileText, 
    Calendar, 
    Hash, 
    ShieldCheck, 
    Archive
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

interface Resolucion {
    id: string;
    tipo: string;
    prefijo: string | null;
    numero: string;
    consecutivoDesde: number;
    consecutivoHasta: number;
    actual: number;
    fechaInicio?: Date | string;
    fechaFin?: Date | string;
    activa: boolean;
}

interface ResolucionesTabProps {
    resoluciones: Resolucion[];
    handleEditResolucion: (resolucion: Resolucion) => void;
    handleNewResolucion: () => void;
}

export function ResolucionesTab({
    resoluciones,
    handleEditResolucion,
    handleNewResolucion,
}: ResolucionesTabProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <DashboardHeader 
                title="Resoluciones Fiscales"
                tagline="Legal & Resoluciones"
                subtitle="Administre los consecutivos autorizados y las resoluciones vigentes de la DIAN para documentos financieros."
                icon={FileText}
                actions={
                    <Button 
                        onClick={handleNewResolucion}
                        className="rounded-none bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl h-12 px-8 hover:-translate-y-1 transition-all"
                    >
                        <Plus className="h-4 w-4 text-accent" />
                        Registrar Resolución
                    </Button>
                }
            />

            <div className="grid grid-cols-1 gap-10">
                {resoluciones.map((r) => (
                    <Card key={r.id} className="rounded-none border-none shadow-2xl overflow-hidden ring-1 ring-slate-100 group">
                        <CardContent className="p-0 flex flex-col lg:flex-row bg-white">
                            {/* Lateral Visual Info */}
                            <div className={cn(
                                "lg:w-48 p-10 flex flex-col items-center justify-between gap-6 border-b lg:border-b-0 lg:border-r border-slate-100 transition-colors duration-500",
                                r.activa ? "bg-slate-50 group-hover:bg-primary/[0.02]" : "bg-slate-50/30 opacity-60"
                            )}>
                                <div className="h-16 w-16 bg-white border-2 border-primary/10 flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 group-hover:border-primary/40 transition-all rounded-none">
                                    <FileText className={cn("h-8 w-8", r.activa ? "text-primary" : "text-slate-900")} />
                                </div>
                                <div className="pt-8 text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <div className={cn("h-1.5 w-1.5 rounded-none", r.activa ? "bg-emerald-500" : "bg-slate-400")}></div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">{r.activa ? "Vigente" : "Inactiva"}</span>
                                    </div>
                                    <Badge className={cn(
                                        "rounded-none px-6 py-1.5 text-[10px] font-black uppercase tracking-[0.4em] shadow-lg",
                                        r.activa ? "bg-primary text-white" : "bg-slate-200 text-slate-900 shadow-none"
                                    )}>
                                        {r.prefijo || "—"}
                                    </Badge>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 p-10 md:p-12 space-y-12">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black uppercase text-slate-900 tracking-[0.4em] block mb-1">N° Resolución</p>
                                        <p className="text-[12px] font-black text-primary uppercase font-mono tracking-wider">{r.numero}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black uppercase text-slate-900 tracking-[0.4em] block mb-1">Folio Actual</p>
                                        <p className="text-2xl font-black text-primary tracking-tighter font-mono">{r.actual}</p>
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <p className="text-[9px] font-black uppercase text-slate-900 tracking-[0.4em] block mb-1">Rango Habilitado</p>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[14px] font-black text-primary font-mono bg-slate-50 px-3 py-1 border border-slate-100">{r.consecutivoDesde}</span>
                                            <div className="flex-1 h-px bg-slate-200 relative">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                                                    <Hash size={12} className="text-slate-900" />
                                                </div>
                                            </div>
                                            <span className="text-[14px] font-black text-primary font-mono bg-slate-50 px-3 py-1 border border-slate-100">{r.consecutivoHasta}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-10 border-t border-slate-50">
                                    <div className="flex items-center gap-12">
                                        <div className="flex items-center gap-4">
                                            <div className="h-8 w-8 bg-slate-50 flex items-center justify-center text-slate-900 rounded-none border border-slate-100">
                                                <Calendar size={14} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-black text-slate-900 uppercase tracking-widest">Desde</p>
                                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{formatDate(r.fechaInicio)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="h-8 w-8 bg-slate-50 flex items-center justify-center text-slate-900 rounded-none border border-slate-100">
                                                <ShieldCheck size={14} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-black text-slate-900 uppercase tracking-widest">Hasta</p>
                                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{formatDate(r.fechaFin)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <Button 
                                        variant="outline" 
                                        onClick={() => handleEditResolucion(r)}
                                        className="rounded-none border-primary/10 text-primary font-black uppercase text-[10px] tracking-widest h-12 px-10 hover:bg-primary hover:text-white hover:border-primary italic transition-all shadow-sm hover:shadow-xl hover:-translate-y-1"
                                    >
                                        Ajustar Parámetros
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                
                {resoluciones.length === 0 && (
                     <div className="p-32 bg-slate-50/50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center italic opacity-30 shadow-inner">
                        <Archive size={48} className="mb-6" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">No hay registros de resoluciones fiscales en el sistema</p>
                     </div>
                )}
            </div>
        </div>
    );
}
