import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
    AlertTriangle, Clock, CheckCircle2, FileText, 
    ShieldAlert, Activity, User, Printer, Navigation, Calculator 
} from "lucide-react";
import type { MaintenanceAlert, OrdenRevision } from "../types";
import { VehicleOperation } from "./operations.types";

export interface VehicleDetailPanelProps {
    operation: VehicleOperation;
    onIssueOrder: (vehiculoId: string, planId: string) => void;
    onCompleteOrder: (ordenId: string) => void;
    onPrintOrder: (ordenId: string) => void;
    onDirectRegister: (alerta: MaintenanceAlert) => void;
}

export function VehicleDetailPanel({
    operation,
    onIssueOrder,
    onCompleteOrder,
    onPrintOrder,
    onDirectRegister,
}: VehicleDetailPanelProps) {
    if (operation.tipo === "alerta") {
        const alerta = operation.data as MaintenanceAlert;
        const isCritical = operation.criticidad === "critico";
        
        return (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="p-12 border-b border-primary/5 bg-slate-50/50">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-20 w-32 bg-slate-900 border-4 border-primary text-white flex flex-col items-center justify-center shadow-2xl">
                                    <span className="text-[10px] font-black uppercase text-white leading-none mb-1">UNIT_ID</span>
                                    <h2 className="text-3xl font-black tracking-tighter italic">{alerta.placa}</h2>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Especificación Técnica</p>
                                    <p className="text-xs font-black text-primary uppercase tracking-widest italic">{alerta.marca} {alerta.modelo} • MODELO {alerta.anho}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className={cn(
                            "px-6 py-2 border-2 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 shadow-sm",
                            isCritical ? "bg-red-50 text-red-700 border-red-600/20 shadow-red-500/10" : "bg-amber-50 text-amber-700 border-amber-500/20 shadow-amber-500/10"
                        )}>
                            <ShieldAlert size={14} className="animate-pulse" />
                            Estatus {operation.criticidad} Identificado
                        </div>
                    </div>
                </div>

                <div className="flex-grow p-12 space-y-12">
                    <div className="flex gap-8 group">
                        <div className={cn(
                            "h-16 w-16 shrink-0 border-2 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform",
                            isCritical ? "bg-red-50 border-red-600/20 text-red-600" : "bg-amber-50 border-amber-600/20 text-amber-600"
                        )}>
                            <AlertTriangle size={32} />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-lg font-black text-primary uppercase tracking-widest">{alerta.planNombre}</h3>
                            <p className="text-xs font-bold text-slate-900 leading-relaxed uppercase tracking-widest italic max-w-2xl">{alerta.planDescripcion}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-12 border-t border-primary/5">
                        <div className="p-8 bg-slate-50 border-2 border-primary/5 shadow-inner">
                            <span className="text-[10px] font-black text-primary/20 uppercase tracking-[0.3em] block mb-4">Métrica de Retraso</span>
                            <div className="flex items-end gap-3">
                                <h4 className={cn("text-5xl font-black italic tracking-tighter leading-none", isCritical ? "text-red-600" : "text-amber-600")}>{alerta.diasRetraso}</h4>
                                <span className="text-[11px] font-black text-primary uppercase tracking-widest mb-1.5 underline decoration-primary/20 underline-offset-4 pointer-events-none">Días de Mora Técnica</span>
                            </div>
                        </div>
                        <div className="p-8 bg-slate-50 border-2 border-primary/5 shadow-inner">
                            <span className="text-[10px] font-black text-primary/20 uppercase tracking-[0.3em] block mb-4">Registro Odómetro</span>
                            <div className="flex items-end gap-3">
                                <h4 className="text-5xl font-black italic tracking-tighter leading-none text-primary">{alerta.kilometrajeActual?.toLocaleString() ?? "0"}</h4>
                                <span className="text-[11px] font-black text-primary uppercase tracking-widest mb-1.5 underline decoration-primary/20 underline-offset-4 pointer-events-none">KM Operativos</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-slate-50 border-t border-primary/5 flex flex-col sm:flex-row gap-6">
                    <Button 
                        onClick={() => onIssueOrder(alerta.vehiculoId, alerta.planId)}
                        className="h-16 flex-1 bg-primary text-white hover:bg-slate-800 rounded-none text-[11px] font-black uppercase tracking-[0.4em] gap-4 shadow-xl border-none shadow-primary/20"
                    >
                        <FileText size={20} className="text-accent" />
                        Autorizar Orden de Servicio
                    </Button>
                    <Button 
                        variant="outline"
                        onClick={() => onDirectRegister(alerta)}
                        className="h-16 flex-1 bg-white border-2 border-primary/10 text-primary hover:bg-slate-50 rounded-none text-[11px] font-black uppercase tracking-[0.3em] gap-4"
                    >
                        <CheckCircle2 size={20} className="text-secondary" />
                        Validación Express
                    </Button>
                </div>
            </div>
        );
    } else {
        const orden = operation.data as OrdenRevision;
        return (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="p-12 border-b border-primary/5 bg-slate-50/50">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-20 w-32 bg-blue-600 border-4 border-blue-700 text-white flex flex-col items-center justify-center shadow-2xl">
                                    <span className="text-[10px] font-black uppercase text-white leading-none mb-1">IN_PROG</span>
                                    <h2 className="text-3xl font-black tracking-tighter italic">{orden.placa}</h2>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Certificado Auditoría</p>
                                    <p className="text-xs font-black text-primary font-mono tracking-tighter uppercase">{orden.codigo}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="px-6 py-2 border-2 bg-blue-50 text-blue-700 border-blue-600/20 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 shadow-sm shadow-blue-500/10 italic">
                            <Clock size={14} className="animate-spin-slow" />
                            Garantía Técnica de Servicio
                        </div>
                    </div>
                </div>

                <div className="flex-grow p-12 space-y-10">
                    <div className="flex gap-8">
                        <div className="h-16 w-16 shrink-0 bg-blue-50 border-2 border-blue-600/20 text-blue-600 flex items-center justify-center shadow-xl">
                            <Activity size={32} />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-lg font-black text-primary uppercase tracking-widest">{orden.planNombre}</h3>
                            <p className="text-xs font-bold text-slate-900 leading-relaxed uppercase tracking-widest italic max-w-2xl">Unidad en proceso de intervención mecánica programada bajo protocolos de seguridad Coopetraes.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-slate-50 border-2 border-primary/5 shadow-inner space-y-2">
                            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 italic">
                                <User size={12} className="text-blue-600" /> Responsable
                            </span>
                            <p className="text-sm font-black text-primary uppercase tracking-tighter truncate">{orden.conductorNombre?.toUpperCase() || "SIN OPERADOR"}</p>
                        </div>
                        <div className="p-6 bg-slate-50 border-2 border-primary/5 shadow-inner space-y-2">
                            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 italic">
                                <Navigation size={12} className="text-blue-600" /> Punto Control
                            </span>
                            <p className="text-sm font-black text-primary font-mono tracking-tighter">{orden.kilometraje?.toLocaleString() ?? "0"} KM</p>
                        </div>
                        <div className="p-6 bg-slate-50 border-2 border-primary/5 shadow-inner space-y-2">
                            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 italic">
                                <Calculator size={12} className="text-blue-600" /> Presupuesto
                            </span>
                            <p className="text-sm font-black text-primary font-mono tracking-tighter text-blue-700 italic">
                                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(orden.costo || 0)}
                            </p>
                        </div>
                    </div>

                    {orden.observaciones && (
                        <div className="p-8 bg-blue-50/50 border-l-8 border-blue-600/30 text-[11px] font-bold italic text-primary/60 leading-relaxed uppercase tracking-widest">
                            “{orden.observaciones}”
                        </div>
                    )}
                </div>

                <div className="p-8 bg-slate-50 border-t border-primary/5 flex flex-col sm:flex-row gap-6">
                    <Button 
                        onClick={() => onCompleteOrder(orden.id)}
                        className="h-16 flex-1 bg-blue-600 text-white hover:bg-blue-700 rounded-none text-[11px] font-black uppercase tracking-[0.4em] gap-4 shadow-xl border-none shadow-blue-500/20"
                    >
                        <CheckCircle2 size={20} className="text-accent" />
                        Finalizar & Archivar
                    </Button>
                    <Button 
                        variant="outline"
                        onClick={() => onPrintOrder(orden.id)}
                        className="h-16 flex-1 bg-white border-2 border-blue-600/10 text-blue-600 hover:bg-blue-50 rounded-none text-[11px] font-black uppercase tracking-[0.3em] gap-4"
                    >
                        <Printer size={20} />
                        Generar Acta
                    </Button>
                </div>
            </div>
        );
    }
}
