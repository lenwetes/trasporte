"use client";

import { useState } from "react";
import { CheckCircle2, Wrench } from "lucide-react";
import type { MaintenanceAlert, OrdenRevision } from "../types";
import { VehicleOperation } from "./operations.types";
import { OperationsSidebar } from "./operations-sidebar";
import { VehicleDetailPanel } from "./vehicle-detail-panel";

export interface OperationsCenterProps {
    alertas: MaintenanceAlert[];
    ordenesRevision: OrdenRevision[];
    onIssueOrder: (vehiculoId: string, planId: string) => void;
    onCompleteOrder: (ordenId: string) => void;
    onPrintOrder: (ordenId: string) => void;
    onDirectRegister: (alerta: MaintenanceAlert) => void;
}

// @refactored 2026-04-01 | M12 - Panel de Control Desfragmentado
export function OperationsCenter({
    alertas,
    ordenesRevision,
    onIssueOrder,
    onCompleteOrder,
    onPrintOrder,
    onDirectRegister,
}: OperationsCenterProps) {
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleOperation | null>(null);

    const operations: VehicleOperation[] = [
        ...alertas.map((alerta) => ({
            id: `alerta-${alerta.vehiculoId}-${alerta.planId}`,
            placa: alerta.placa,
            tipo: "alerta" as const,
            criticidad:
                alerta.diasRetraso > 30
                    ? ("critico" as const)
                    : alerta.diasRetraso > 15
                      ? ("urgente" as const)
                      : ("normal" as const),
            data: alerta,
        })),
        ...ordenesRevision.map((orden) => ({
            id: `revision-${orden.id}`,
            placa: orden.placa,
            tipo: "revision" as const,
            criticidad: "urgente" as const,
            data: orden,
        })),
    ];

    const sortedOperations = operations.sort((a, b) => {
        const priority = { critico: 0, urgente: 1, normal: 2 };
        return priority[a.criticidad] - priority[b.criticidad];
    });

    if (sortedOperations.length === 0) {
        return (
            <div className="bg-emerald-50 border-2 border-emerald-500/20 p-20 text-center animate-in zoom-in duration-500">
                <div className="inline-flex h-20 w-20 items-center justify-center bg-white border-2 border-emerald-500/20 shadow-xl mb-8">
                    <CheckCircle2 size={40} className="text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-emerald-900 uppercase tracking-tighter mb-2 italic">¡Estado Operativo Óptimo!</h3>
                <p className="text-[11px] font-black text-emerald-700/60 uppercase tracking-widest">No se detectan anomalías técnicas ni órdenes pendientes en el sistema central.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 min-h-[700px]">
            <OperationsSidebar 
                operations={sortedOperations}
                selectedVehicle={selectedVehicle}
                onSelectVehicle={setSelectedVehicle}
            />

            <div className="lg:col-span-8 bg-white border border-primary/10 shadow-2xl overflow-hidden flex flex-col min-h-[700px]">
                {selectedVehicle ? (
                    <VehicleDetailPanel
                        operation={selectedVehicle}
                        onIssueOrder={onIssueOrder}
                        onCompleteOrder={onCompleteOrder}
                        onPrintOrder={onPrintOrder}
                        onDirectRegister={onDirectRegister}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-8 bg-slate-50/30">
                        <div className="h-32 w-32 border-4 border-dashed border-primary/10 flex items-center justify-center text-primary/10 animate-pulse">
                            <Wrench size={64} />
                        </div>
                        <div className="space-y-4 max-w-sm">
                            <h3 className="text-sm font-black text-primary uppercase tracking-[0.4em]">Terminal de Diagnóstico</h3>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] leading-relaxed">Seleccione una unidad operativa de la cola lateral para iniciar el protocolo de revisión técnica.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
