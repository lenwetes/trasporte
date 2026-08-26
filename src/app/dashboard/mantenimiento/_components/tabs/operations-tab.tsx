"use client";

import React from "react";
import { MaintenanceAlert, OrdenRevision } from "../../types";
import { Wrench, ShieldAlert, CheckCircle2, FileText, ArrowRight, Truck, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OperationsTabProps {
    alertas: MaintenanceAlert[];
    ordenesRevision: OrdenRevision[];
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    onIssueOrder: (vehiculoId: string, planId: string) => void;
    onDirectRegister: (alerta: MaintenanceAlert) => void;
    onApprove: (ordenId: string) => void;
    onViewProof: (ordenId: string) => void;
}

export function OperationsTab({
    alertas,
    ordenesRevision,
    searchTerm,
    onIssueOrder,
    onApprove,
    onViewProof,
}: OperationsTabProps) {
    const filteredOps = [
        ...(alertas || []).map(a => ({ type: "alerta" as const, data: a })),
        ...(ordenesRevision || []).map(o => ({ type: "revision" as const, data: o }))
    ].filter(op => {
        const placa = op.type === "alerta" 
            ? op.data.placa 
            : (op.data as any).placa || (op.data as any).vehiculo?.placa;
            
        if (!searchTerm) return true;
        return placa?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // De-duplicate: If a revision exists for a vehicle+plan, hide the alert
    const allOps = filteredOps.filter((op, idx, self) => {
        if (op.type === "alerta") {
            const hasRevision = self.some(other => 
                other.type === "revision" && 
                (other.data as any).vehiculoId === op.data.vehiculoId && 
                (other.data as any).planId === op.data.planId
            );
            return !hasRevision;
        }
        return true;
    }).sort((a, b) => {
        // Show revisions at the top
        if (a.type === "revision" && b.type === "alerta") return -1;
        if (a.type === "alerta" && b.type === "revision") return 1;
        return 0;
    });

    if (allOps.length === 0) {
        return (
            <div className="py-24 flex flex-col items-center justify-center border border-dashed border-primary/10 bg-slate-50/50 radius-0">
                <CheckCircle2 className="h-12 w-12 text-primary/10 mb-4" />
                <h3 className="text-sm font-black text-primary uppercase tracking-widest">Estado Nominal Logrado</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">No hay operaciones pendientes de despacho</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-slate-900 text-white border-b border-primary/20">
                        <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em]">Flota / Placa</th>
                        <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em]">Prioridad / Tipo</th>
                        <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em]">Servicio Requerido</th>
                        <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em]">Estado de Gestión</th>
                        <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em]">Acciones de Comando</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                    {allOps.map((op, idx) => {
                        const isAlerta = op.type === "alerta";
                        const placa = isAlerta ? op.data.placa : (op.data as OrdenRevision).placa;
                        const planId = isAlerta ? op.data.planId : (op.data as OrdenRevision).planId;
                        const vehiculoId = isAlerta ? op.data.vehiculoId : (op.data as OrdenRevision).vehiculoId;
                        const planNombre = isAlerta ? op.data.planNombre : (op.data as OrdenRevision).plan.nombre;
                        const id = isAlerta ? `${op.data.vehiculoId}-${op.data.planId}` : (op.data as any).id;

                        return (
                            <tr key={`${op.type}-${id}`} className="hover:bg-slate-50/80 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "h-10 w-10 flex items-center justify-center border",
                                            isAlerta ? "bg-red-50 border-red-500/10 text-red-600" : "bg-primary/5 border-primary/10 text-primary"
                                        )}>
                                            <Truck className="h-4 w-4" />
                                        </div>
                                        <span className="font-mono text-sm font-black tracking-tighter text-primary">
                                            {placa}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        {isAlerta ? (
                                            <Badge className="bg-red-600 text-white rounded-none px-2 py-1 text-[9px] font-black uppercase tracking-widest border-none">
                                                <ShieldAlert className="h-3 w-3 mr-1" /> Alerta
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-primary text-white rounded-none px-2 py-1 text-[9px] font-black uppercase tracking-widest border-none">
                                                <Activity className="h-3 w-3 mr-1" /> Revisión
                                            </Badge>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-primary uppercase tracking-tight">
                                            {planNombre}
                                        </span>
                                        <span className="text-[9px] font-bold text-primary uppercase tracking-widest">
                                            Plan de mantenimiento preventivo
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("h-1.5 w-1.5 rounded-full", isAlerta ? "bg-red-500 animate-pulse" : (op.data as OrdenRevision).estado === 'PENDIENTE' ? "bg-amber-500 animate-pulse" : "bg-primary")} />
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-widest",
                                            isAlerta ? "text-red-700" : (op.data as OrdenRevision).estado === 'PENDIENTE' ? "text-amber-700" : "text-primary"
                                        )}>
                                            {isAlerta ? "PENDIENTE - DESPACHO" : (op.data as OrdenRevision).estado === 'PENDIENTE' ? "EN PROCESO" : "REVISIÓN PENDIENTE"}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    {isAlerta ? (
                                        <Button 
                                            onClick={() => onIssueOrder(vehiculoId, planId)}
                                            className="h-10 rounded-none bg-primary text-white px-6 text-[10px] font-black uppercase tracking-[0.15em] gap-2 hover:bg-primary-hover transition-all border-none"
                                        >
                                            Emitir Orden <ArrowRight className="h-3 w-3" />
                                        </Button>
                                    ) : (
                                        <div className="flex justify-end gap-2">
                                            <Button 
                                                variant="outline"
                                                onClick={() => onViewProof(id)}
                                                className="h-10 rounded-none px-4 text-[9px] font-black uppercase tracking-widest border-primary/10"
                                            >
                                                <FileText className="h-3.5 w-3.5" />
                                            </Button>
                                            {(op.data as OrdenRevision).estado === 'PENDIENTE' ? (
                                                <Button 
                                                    onClick={() => onApprove(id)}
                                                    className="h-10 rounded-none bg-amber-500 text-white px-6 text-[10px] font-black uppercase tracking-[0.15em] hover:bg-amber-600 transition-all border-none"
                                                >
                                                    En Proceso <Activity className="h-3 w-3 ml-2" />
                                                </Button>
                                            ) : (
                                                <Button 
                                                    onClick={() => onApprove(id)}
                                                    className="h-10 rounded-none bg-secondary text-primary px-6 text-[10px] font-black uppercase tracking-[0.15em] hover:bg-secondary/90 transition-all border-none"
                                                >
                                                    Validar Orden <CheckCircle2 className="h-3 w-3 ml-2" />
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
