import type { MaintenanceAlert, OrdenRevision } from "../types";
import { 
    AlertTriangle, 
    Clock, 
    Wrench, 
    ChevronRight, 
    CheckCircle2, 
    FileText,
    ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CompactOperationCardProps {
    operation: {
        type: "alerta" | "revision";
        data: MaintenanceAlert | OrdenRevision;
    };
    onIssueOrder?: (vehiculoId: string, planId: string) => void;
    onDirectRegister?: (alerta: MaintenanceAlert) => void;
    onApprove?: (ordenId: string) => void;
    onViewProof?: (ordenId: string) => void;
}

export function CompactOperationCard({
    operation,
    onIssueOrder,
    onDirectRegister,
    onApprove,
    onViewProof,
}: CompactOperationCardProps) {
    const isAlert = operation.type === "alerta";
    const data = operation.data;

    if (isAlert) {
        const alerta = data as MaintenanceAlert;
        const isCritical = alerta.diasRetraso > 30;

        return (
            <div className="bg-white border border-primary/10 p-4 mb-4 group hover:border-primary/30 transition-all shadow-sm relative overflow-hidden">
                <div className={cn(
                    "absolute top-0 left-0 w-1 h-full",
                    isCritical ? "bg-red-600" : "bg-amber-500"
                )} />
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "h-10 w-10 flex items-center justify-center border-2",
                            isCritical ? "border-red-600/10 text-red-600 bg-red-50" : "border-amber-500/10 text-amber-500 bg-amber-50"
                        )}>
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <h4 className="text-[12px] font-black text-primary uppercase tracking-widest">{alerta.planNombre}</h4>
                                {isCritical && (
                                    <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 uppercase tracking-tighter">
                                        CRÍTICO
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest leading-none">
                                <span className={cn(isCritical ? "text-red-700" : "text-amber-700")}>
                                    {alerta.diasRetraso} DÍAS RETRASO
                                </span>
                                {alerta.kilometrajeActual && (
                                    <span className="text-primary flex items-center gap-1.5 before:content-['•'] before:mr-1.5">
                                        {alerta.kilometrajeActual.toLocaleString()} KM REGISTRADO
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                            size="sm"
                            onClick={() => onIssueOrder?.(alerta.vehiculoId, alerta.planId)}
                            className="flex-1 sm:flex-none h-10 rounded-none bg-primary text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6"
                        >
                            Emitir Orden
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDirectRegister?.(alerta)}
                            className="flex-1 sm:flex-none h-10 rounded-none border-primary/10 text-slate-900 hover:text-primary hover:bg-slate-50 text-[10px] font-black uppercase tracking-widest px-6"
                        >
                            Registrar
                        </Button>
                    </div>
                </div>
            </div>
        );
    } else {
        const orden = data as OrdenRevision;

        return (
            <div className="bg-white border border-primary/10 p-4 mb-4 group hover:border-primary/30 transition-all shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex items-center justify-center border-2 border-blue-600/10 text-blue-600 bg-blue-50">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="text-[12px] font-black text-primary uppercase tracking-widest mb-0.5">
                                {orden.planNombre || "Revisión Pendiente"}
                            </h4>
                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest leading-none text-slate-900">
                                <span className="text-blue-700 font-black">EN REVISIÓN ACTIVA</span>
                                {orden.conductorNombre && (
                                    <span className="flex items-center gap-1.5 before:content-['•'] before:mr-1.5">
                                        OPERADOR: {orden.conductorNombre.toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                            size="sm"
                            onClick={() => onApprove?.(orden.id)}
                            className="flex-1 sm:flex-none h-10 rounded-none bg-primary text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 gap-2"
                        >
                            <CheckCircle2 size={14} className="text-accent" />
                            Validar & Cerrar
                        </Button>
                        {orden.comprobante && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onViewProof?.(orden.id)}
                                className="flex-1 sm:flex-none h-10 rounded-none border-primary/10 text-slate-900 hover:text-primary hover:bg-slate-50 text-[10px] font-black uppercase tracking-widest px-6 gap-2"
                            >
                                <ExternalLink size={14} />
                                Soporte
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
