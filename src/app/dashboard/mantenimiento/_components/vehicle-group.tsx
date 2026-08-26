"use client";

import { Truck, ChevronDown, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import type { MaintenanceAlert, OrdenRevision } from "../types";
import { CompactOperationCard } from "./compact-operation-card";
import { cn } from "@/lib/utils";

interface VehicleGroupProps {
    placa: string;
    operations: Array<{
        type: "alerta" | "revision";
        data: MaintenanceAlert | OrdenRevision;
    }>;
    onIssueOrder?: (vehiculoId: string, planId: string) => void;
    onDirectRegister?: (alerta: MaintenanceAlert) => void;
    onApprove?: (ordenId: string) => void;
    onViewProof?: (ordenId: string) => void;
}

export function VehicleGroup({
    placa,
    operations,
    onIssueOrder,
    onDirectRegister,
    onApprove,
    onViewProof,
}: VehicleGroupProps) {
    const totalAlerts = operations.filter(o => o.type === "alerta").length;
    const totalReviews = operations.filter(o => o.type === "revision").length;

    return (
        <div className="mb-10 w-full group/vehicle animate-in fade-in slide-in-from-left-4 duration-500">
            {/* Cabecera Técnica del Vehículo */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 p-6 bg-slate-900 text-white border-2 border-primary shadow-xl relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -rotate-45 translate-x-16 -translate-y-16 group-hover/vehicle:scale-110 transition-transform" />
                
                {/* Plate Badge */}
                <div className="flex-shrink-0">
                    <div className="h-16 w-32 bg-white flex flex-col items-center justify-center border-2 border-accent shadow-premium shadow-accent/20">
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">COOPETRAES</span>
                        <h3 className="text-2xl font-black text-primary tracking-tighter italic uppercase">{placa}</h3>
                    </div>
                </div>

                {/* Info Center */}
                <div className="flex-grow space-y-2 relative z-10">
                    <div className="flex items-center gap-3">
                        <Truck className="h-4 w-4 text-accent" />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/80">Unidad de Flota Activa</span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {totalAlerts > 0 && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-600/20">
                                <AlertTriangle size={10} />
                                {totalAlerts} ALERTAS CRÍTICAS
                            </div>
                        )}
                        {totalReviews > 0 && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">
                                <ShieldCheck size={10} />
                                {totalReviews} EN REVISIÓN
                            </div>
                        )}
                    </div>
                </div>

                {/* Audit Signature */}
                <div className="hidden lg:flex flex-col items-end opacity-20">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Auditoría Activa</span>
                    <span className="text-[8px] font-bold uppercase tracking-widest">Protocolo de Seguridad</span>
                </div>
            </div>

            {/* Panel de Operaciones Multi-Tarjeta */}
            <div className="p-6 bg-white border-x-2 border-b-2 border-primary/10 shadow-2xl flex flex-col gap-4">
                {operations.map((operation, index) => (
                    <CompactOperationCard
                        key={`${placa}-${index}`}
                        operation={operation}
                        onIssueOrder={onIssueOrder}
                        onDirectRegister={onDirectRegister}
                        onApprove={onApprove}
                        onViewProof={onViewProof}
                    />
                ))}
            </div>
        </div>
    );
}
