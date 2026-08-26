"use client";

import { 
    AlertTriangle, 
    CheckCircle2, 
    FileText, 
    Clock, 
    Truck, 
    Navigation,
    User,
    ShieldAlert,
    ChevronRight,
    Activity
} from "lucide-react";
import type { MaintenanceAlert, OrdenRevision } from "../types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UrgentOperationCardProps {
    operation: {
        type: "alerta" | "revision";
        data: MaintenanceAlert | OrdenRevision;
    };
    onIssueOrder?: (vehiculoId: string, planId: string) => void;
    onDirectRegister?: (alerta: MaintenanceAlert) => void;
    onApprove?: (ordenId: string) => void;
    onViewProof?: (ordenId: string) => void;
}

export function UrgentOperationCard({
    operation,
    onIssueOrder,
    onDirectRegister,
    onApprove,
    onViewProof,
}: UrgentOperationCardProps) {
    const isAlert = operation.type === "alerta";
    const data = operation.data;

    if (isAlert) {
        const alerta = data as MaintenanceAlert;
        const isCritical = alerta.diasRetraso > 30;

        return (
            <div className="bg-white border-2 border-primary shadow-[16px_16px_0px_0px_rgba(0,84,97,0.05)] p-8 mb-8 relative overflow-hidden group">
                {/* Indicador de Criticidad */}
                <div className={cn(
                    "absolute top-0 right-0 w-32 h-32 -rotate-45 translate-x-16 -translate-y-16 flex items-end justify-center pb-4 transition-transform group-hover:scale-110",
                    isCritical ? "bg-red-600 text-white" : "bg-amber-500 text-white"
                )}>
                    <AlertTriangle size={24} className="rotate-45" />
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Visual Ident */}
                    <div className="flex-shrink-0">
                        <div className={cn(
                            "h-24 w-24 border-2 flex flex-col items-center justify-center gap-1 bg-white shadow-xl",
                            isCritical ? "border-red-600/20 text-red-600" : "border-amber-500/20 text-amber-500"
                        )}>
                            <span className="text-[10px] font-black uppercase tracking-tighter opacity-40">Status</span>
                            <ShieldAlert size={32} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{isCritical ? "Fatal" : "Warn"}</span>
                        </div>
                    </div>

                    {/* Data Body */}
                    <div className="flex-grow space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-4">
                                <h2 className="text-3xl font-black text-primary tracking-tighter uppercase italic">{alerta.placa}</h2>
                                <div className={cn(
                                    "px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2",
                                    isCritical ? "bg-red-50 text-red-700 border-red-600/10" : "bg-amber-50 text-amber-700 border-amber-500/10"
                                )}>
                                    {alerta.diasRetraso} DÍAS RETRASO
                                </div>
                            </div>
                            <h3 className="text-sm font-black text-primary/60 uppercase tracking-[0.2em]">{alerta.planNombre}</h3>
                        </div>

                        {alerta.planDescripcion && (
                            <p className="text-xs font-bold text-slate-900 uppercase tracking-widest leading-relaxed max-w-2xl">
                                {alerta.planDescripcion}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-8 pt-4 border-t border-primary/5">
                            <div className="space-y-1">
                                <span className="text-[9px] font-black text-primary/20 uppercase tracking-widest">Vehículo Vinculado</span>
                                <div className="flex items-center gap-3 text-xs font-black text-primary uppercase tracking-widest">
                                    <Truck size={14} className="text-secondary" /> 
                                    {alerta.marca} {alerta.modelo}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] font-black text-primary/20 uppercase tracking-widest">Odómetro Registrado</span>
                                <div className="flex items-center gap-3 text-xs font-black text-primary font-mono tracking-tighter">
                                    <Activity size={14} className="text-secondary" /> 
                                    {alerta.kilometrajeActual?.toLocaleString()} KM
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Column */}
                    <div className="flex flex-col gap-4 lg:w-64">
                        <Button 
                            onClick={() => onIssueOrder?.(alerta.vehiculoId, alerta.planId)}
                            className="h-14 rounded-none bg-primary text-white hover:bg-slate-800 text-[11px] font-black uppercase tracking-[0.3em] gap-3 shadow-xl"
                        >
                            <FileText size={16} className="text-accent" />
                            Emitir Orden
                        </Button>
                        <Button 
                            variant="outline"
                            onClick={() => onDirectRegister?.(alerta)}
                            className="h-14 rounded-none border-primary/10 bg-white text-primary hover:bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] gap-3"
                        >
                            <CheckCircle2 size={16} />
                            Registro Directo
                        </Button>
                    </div>
                </div>
            </div>
        );
    } else {
        const orden = data as OrdenRevision;

        return (
            <div className="bg-white border-2 border-blue-600/30 shadow-[16px_16px_0px_0px_rgba(59,130,246,0.05)] p-8 mb-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 -rotate-45 translate-x-16 -translate-y-16 bg-blue-600 text-white flex items-end justify-center pb-4">
                    <Clock size={24} className="rotate-45" />
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="flex-shrink-0">
                        <div className="h-24 w-24 border-2 border-blue-600/20 flex flex-col items-center justify-center gap-1 bg-white text-blue-600 shadow-xl">
                            <span className="text-[10px] font-black uppercase tracking-tighter opacity-40">Phase</span>
                            <Clock size={32} />
                            <span className="text-[10px] font-black uppercase tracking-widest italic font-mono">ACTIVE</span>
                        </div>
                    </div>

                    <div className="flex-grow space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-4">
                                <h2 className="text-3xl font-black text-primary tracking-tighter uppercase italic">{orden.placa}</h2>
                                <div className="px-3 py-1 bg-blue-50 text-blue-700 border-2 border-blue-600/10 text-[10px] font-black uppercase tracking-widest">
                                    EN REVISIÓN TÉCNICA
                                </div>
                            </div>
                            <h3 className="text-sm font-black text-primary/60 uppercase tracking-[0.2em]">{orden.planNombre}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-primary/5">
                            <div className="space-y-1">
                                <span className="text-[9px] font-black text-primary/20 uppercase tracking-widest">Responsable Asignado</span>
                                <div className="flex items-center gap-3 text-xs font-black text-primary uppercase tracking-widest">
                                    <User size={14} className="text-blue-600" /> 
                                    {orden.conductorNombre}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] font-black text-primary/20 uppercase tracking-widest">Punto de Control</span>
                                <div className="flex items-center gap-3 text-xs font-black text-primary font-mono tracking-tighter">
                                    <Activity size={14} className="text-blue-600" /> 
                                    {orden.kilometraje?.toLocaleString()} KM ENTRADA
                                </div>
                            </div>
                        </div>

                        {orden.observaciones && (
                            <div className="p-6 bg-slate-50 border-l-4 border-blue-600 text-xs font-bold italic text-primary/60 leading-relaxed uppercase tracking-tighter">
                                "{orden.observaciones}"
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 lg:w-64">
                        <Button 
                            onClick={() => onApprove?.(orden.id)}
                            className="h-14 rounded-none bg-blue-600 text-white hover:bg-blue-700 text-[11px] font-black uppercase tracking-[0.3em] gap-3 shadow-xl border-none"
                        >
                            <CheckCircle2 size={16} />
                            Validar & Aprobar
                        </Button>
                        {orden.comprobante && (
                            <Button 
                                variant="outline"
                                onClick={() => onViewProof?.(orden.id)}
                                className="h-14 rounded-none border-primary/10 bg-white text-primary hover:bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] gap-3"
                            >
                                <FileText size={16} />
                                Soporte Digital
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
