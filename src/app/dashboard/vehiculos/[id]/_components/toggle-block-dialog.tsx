"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleVehicleBlockAction } from "@/actions/fleet/operability.actions";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, AlertTriangle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToggleBlockDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vehiculoId: string;
    placa: string;
    isBlocked: boolean;
}


export function ToggleBlockDialog({
    open,
    onOpenChange,
    vehiculoId,
    placa,
    isBlocked,
}: ToggleBlockDialogProps) {
    const [razon, setRazon] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    if (!open) return null;

    const handleConfirm = async () => {
        if (!isBlocked && !razon.trim()) {
            setError("Debe ingresar una razón para el bloqueo.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const result = await toggleVehicleBlockAction(
                vehiculoId,
                !isBlocked,
                razon,
            );
            if (result.success) {
                router.refresh();
                onOpenChange(false);
                setRazon("");
            } else {
                setError(result.error ?? "Ocurrió un error");
            }
        } catch {
            setError("Error al procesar la solicitud");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[1000] animate-in fade-in duration-300"
            onClick={() => onOpenChange(false)}
        >
            <div 
                className="bg-white border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-500"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Technical Header */}
                <div className="p-8 pb-6 border-b border-slate-100 flex items-center gap-6">
                    <div className={cn(
                        "h-16 w-16 flex items-center justify-center text-white shadow-xl shrink-0 transition-transform hover:scale-105",
                        isBlocked ? "bg-emerald-600" : "bg-red-600"
                    )}>
                        {isBlocked ? <Unlock className="h-8 w-8" /> : <Lock className="h-8 w-8" />}
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter text-slate-900 leading-none mb-2">
                            {isBlocked ? "AUTORIZAR OPERACIÓN" : "PROTOCOLO DE RESTRICCIÓN"}
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                            UNIDAD DE TRANSPORTE: <span className="text-slate-900">{placa}</span>
                        </p>
                    </div>
                </div>

                {/* Secure Input Area */}
                <div className="p-8 space-y-6 bg-slate-50/50">
                    {!isBlocked && (
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">
                                Justificación Técnica Mandataria
                            </label>
                            <textarea
                                placeholder="Especifique el motivo de la restricción operativa..."
                                value={razon}
                                onChange={(e) => setRazon(e.target.value)}
                                rows={4}
                                className="w-full p-4 border border-slate-200 bg-white focus:ring-0 focus:border-red-600 outline-none text-sm font-medium tracking-tight resize-none transition-all placeholder:text-slate-300"
                            />
                            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100">
                                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                                <p className="text-[9px] font-black uppercase tracking-widest text-amber-700 leading-tight">
                                    Esta acción será auditada por el centro de control maestro.
                                </p>
                            </div>
                        </div>
                    )}

                    {isBlocked && (
                        <div className="flex items-center gap-4 p-5 bg-emerald-50 border border-emerald-100">
                            <ShieldAlert className="h-5 w-5 text-emerald-600 shrink-0" />
                            <p className="text-[11px] font-black uppercase tracking-widest text-emerald-800 leading-relaxed">
                                Se restaurará la operatividad basándose en el cumplimiento automático de vigencias legales.
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest animate-pulse">
                            ⚠️ Error: {error}
                        </div>
                    )}
                </div>

                {/* Professional Action Bar */}
                <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-3">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        className="h-12 rounded-none px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
                    >
                        ABORTAR
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={cn(
                            "h-12 rounded-none px-10 text-[10px] font-black uppercase tracking-widest gap-3 shadow-lg transition-all",
                            isBlocked 
                                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100" 
                                : "bg-red-600 hover:bg-red-700 shadow-red-100"
                        )}
                    >
                        {loading && <span className="h-3 w-3 border-2 border-white/30 border-t-white animate-spin" />}
                        {isBlocked ? "CONFIRMAR DESBLOQUEO" : "EJECUTAR RESTRICCIÓN"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
