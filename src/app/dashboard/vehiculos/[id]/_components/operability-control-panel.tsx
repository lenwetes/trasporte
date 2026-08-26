"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { evaluateVehicleAction } from "@/actions/fleet/operability.actions";
import { ToggleBlockDialog } from "./toggle-block-dialog";
import { PreoperacionalHistoryModal } from "./preoperacional-history-modal";
import { PreoperacionalWithRelations } from "@/types";
import { SuperOverrideDialog } from "./super-override-dialog";
import { 
    CheckCircle2, 
    AlertTriangle, 
    XCircle, 
    Lock, 
    Loader2, 
    ShieldCheck, 
    History, 
    ShieldAlert, 
    Unlock, 
    RotateCcw 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const EstadoOperativo = {
    EVALUANDO: "EVALUANDO",
    OPERATIVO: "OPERATIVO",
    OPERATIVO_CON_ALERTAS: "OPERATIVO_CON_ALERTAS",
    NO_OPERATIVO: "NO_OPERATIVO",
    BLOQUEADO_ADMIN: "BLOQUEADO_ADMIN",
    OPERATIVO_OVERRIDE: "OPERATIVO_OVERRIDE",
} as const;

type EstadoOperativo = (typeof EstadoOperativo)[keyof typeof EstadoOperativo];

interface OperabilityControlPanelProps {
    vehiculoId: string;
    placa: string;
    estadoActual: EstadoOperativo;
    bloqueadoManualmente: boolean;
    razonBloqueo?: string | null;
    overrideActivo: boolean;
    justificacionOverride?: string | null;
    preoperacionales: PreoperacionalWithRelations[];
}

export function OperabilityControlPanel({
    vehiculoId,
    placa,
    estadoActual,
    bloqueadoManualmente,
    razonBloqueo,
    overrideActivo,
    justificacionOverride,
    preoperacionales,
}: OperabilityControlPanelProps) {
    const [evaluating, setEvaluating] = useState(false);
    const [blockDialogOpen, setBlockDialogOpen] = useState(false);
    const [overrideDialogOpen, setOverrideDialogOpen] = useState(false);
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const router = useRouter();

    const handleReevaluate = async () => {
        setEvaluating(true);
        try {
            const result = await evaluateVehicleAction(vehiculoId);
            if (result.success) {
                router.refresh();
                toast.success("ESTADO OPERATIVO ACTUALIZADO", {
                    description: `La unidad ahora se encuentra en estado: ${result.data}`,
                    className: "rounded-none border-l-4 border-l-emerald-500 font-black uppercase tracking-tight",
                });
            } else {
                toast.error("ERROR DE EVALUACIÓN", {
                    description: result.error || "No se pudo actualizar el estado",
                    className: "rounded-none border-l-4 border-l-red-500 font-black uppercase tracking-tight",
                });
            }
        } catch {
            toast.error("FALLO DE CONEXIÓN", {
                description: "Error crítico al procesar la solicitud técnica",
                className: "rounded-none border-l-4 border-l-red-500 font-black uppercase tracking-tight",
            });
        } finally {
            setEvaluating(false);
        }
    };

    const config = {
        [EstadoOperativo.OPERATIVO]: {
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50/50",
            border: "border-emerald-100",
            label: "Operativo",
            description: "Cumple con todos los requisitos legales y técnicos.",
        },
        [EstadoOperativo.OPERATIVO_CON_ALERTAS]: {
            icon: AlertTriangle,
            color: "text-amber-600",
            bg: "bg-amber-50/50",
            border: "border-amber-100",
            label: "Con Alertas",
            description: "En regla, pero con documentos próximos a vencer.",
        },
        [EstadoOperativo.NO_OPERATIVO]: {
            icon: XCircle,
            color: "text-red-600",
            bg: "bg-red-50/50",
            border: "border-red-100",
            label: "No Operativo",
            description: "Documentación vencida o restricciones de seguridad.",
        },
        [EstadoOperativo.BLOQUEADO_ADMIN]: {
            icon: Lock,
            color: "text-slate-600",
            bg: "bg-slate-50/50",
            border: "border-slate-200",
            label: "Bloqueado",
            description: "Restringido manualmente por administración.",
        },
        [EstadoOperativo.EVALUANDO]: {
            icon: Loader2,
            color: "text-blue-600",
            bg: "bg-blue-50/50",
            border: "border-blue-100",
            label: "Evaluando",
            description: "Calculando estado de cumplimiento actual...",
        },
        [EstadoOperativo.OPERATIVO_OVERRIDE]: {
            icon: ShieldCheck,
            color: "text-indigo-600",
            bg: "bg-indigo-50/50",
            border: "border-indigo-100",
            label: "Override Activo",
            description: "Desbloqueado administrativamente por Super Usuario.",
        },
    };

    const current = config[estadoActual] || config[EstadoOperativo.EVALUANDO];
    const StatusIcon = current.icon;

    return (
        <div className="bg-white border border-slate-200 p-8 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Monitor de Operatividad</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mt-1">Control Maestro de Seguridad Unificada</p>
                </div>
                <Button 
                    variant="outline"
                    onClick={handleReevaluate} 
                    disabled={evaluating}
                    className="h-11 rounded-none border-slate-300 text-[10px] font-black uppercase tracking-widest px-6 gap-3 group"
                >
                    <RotateCcw className={cn("h-4 w-4 text-slate-600 group-hover:text-cyan-600 transition-all", evaluating && "animate-spin")} />
                    {evaluating ? "Evaluando..." : "Re-evaluar"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Status Card */}
                <div className={cn("p-8 border-l-8 transition-all flex items-center gap-8 shadow-sm", current.bg, current.border, "border-l-current")}>
                    <div className={cn("h-20 w-20 bg-white border flex items-center justify-center shadow-inner shrink-0", current.border)}>
                        <StatusIcon className={cn("h-10 w-10", current.color, estadoActual === EstadoOperativo.EVALUANDO && "animate-spin")} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <h4 className={cn("text-2xl font-black uppercase tracking-tighter", current.color)}>{current.label}</h4>
                            {estadoActual === EstadoOperativo.OPERATIVO && (
                                <Badge className="rounded-none border-none text-[8px] font-black px-2 py-1 uppercase tracking-widest bg-emerald-600 text-white">
                                    VERIFICADO
                                </Badge>
                            )}
                        </div>
                        <p className="text-[12px] font-bold text-slate-700 uppercase tracking-wide leading-relaxed">{current.description}</p>
                    </div>
                </div>

                {/* Info Boxes */}
                <div className="flex flex-col gap-3">
                    {bloqueadoManualmente && (
                        <div className="p-4 bg-white border border-slate-200">
                            <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2 mb-2">
                                <ShieldAlert className="h-3 w-3 text-red-500" />
                                Razón del Bloqueo
                            </div>
                            <p className="text-[12px] font-black text-slate-800 uppercase tracking-tight leading-tight">{razonBloqueo || "Restricción administrativa sin especificar"}</p>
                        </div>
                    )}
                    {overrideActivo && (
                        <div className="p-4 bg-indigo-50 border border-indigo-100">
                            <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                                <ShieldCheck className="h-3 w-3" />
                                Protocolo de Excepción
                            </div>
                            <p className="text-[12px] font-black text-indigo-800 uppercase tracking-tight leading-tight">{justificacionOverride || "Autorizado por nivel central"}</p>
                        </div>
                    )}
                    {!bloqueadoManualmente && !overrideActivo && (
                        <div className="p-4 bg-slate-50/50 border border-slate-100 border-dashed h-full flex items-center justify-center">
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Sin intervenciones manuales activas</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col xl:flex-row justify-between items-center gap-8 pt-8 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                    <Button 
                        onClick={() => setBlockDialogOpen(true)}
                        className={cn(
                            "h-12 rounded-none font-black uppercase text-[10px] tracking-[0.2em] px-8 gap-4 transition-all w-full sm:w-auto shadow-lg shadow-slate-200",
                            bloqueadoManualmente ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100" : "bg-red-600 hover:bg-red-700 shadow-red-100"
                        )}
                    >
                        {bloqueadoManualmente ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        {bloqueadoManualmente ? "SUSPENDER RESTRICCIÓN" : "RESTRINGIR OPERACIÓN"}
                    </Button>
                    <Button 
                        variant="outline"
                        onClick={() => setOverrideDialogOpen(true)}
                        className="h-12 rounded-none border-slate-200 font-black uppercase text-[10px] tracking-[0.2em] px-8 gap-4 w-full sm:w-auto hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <ShieldCheck className={cn("h-4 w-4", overrideActivo ? "text-indigo-600" : "text-slate-400")} />
                        {overrideActivo ? "DESACTIVAR OVERRIDE" : "INICIAR OVERRIDE"}
                    </Button>
                </div>
                
                <Button 
                    variant="ghost"
                    onClick={() => setHistoryModalOpen(true)}
                    className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] gap-3 hover:text-cyan-700 transition-all shrink-0"
                >
                    <History className="h-4 w-4" />
                    HISTORIAL DE ESTADOS
                </Button>
            </div>

            <ToggleBlockDialog
                open={blockDialogOpen}
                onOpenChange={setBlockDialogOpen}
                vehiculoId={vehiculoId}
                placa={placa}
                isBlocked={bloqueadoManualmente}
            />

            <SuperOverrideDialog
                open={overrideDialogOpen}
                onOpenChange={setOverrideDialogOpen}
                vehiculoId={vehiculoId}
                placa={placa}
                isOverrideActive={overrideActivo}
            />

            <PreoperacionalHistoryModal
                open={historyModalOpen}
                onOpenChange={setHistoryModalOpen}
                vehiculoId={vehiculoId}
                preoperacionales={preoperacionales}
            />
        </div>
    );
}
