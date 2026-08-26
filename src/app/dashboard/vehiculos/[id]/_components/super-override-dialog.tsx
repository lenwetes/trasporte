"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleSuperOverrideAction } from "@/actions/fleet/operability.actions";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldAlert, AlertCircle, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuperOverrideDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vehiculoId: string;
    placa: string;
    isOverrideActive: boolean;
}


export function SuperOverrideDialog({
    open,
    onOpenChange,
    vehiculoId,
    placa,
    isOverrideActive,
}: SuperOverrideDialogProps) {
    const [justificacion, setJustificacion] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    if (!open) return null;

    const handleConfirm = async () => {
        if (!isOverrideActive && !justificacion.trim()) {
            setError("Debe ingresar una justificación para el desbloqueo de super usuario.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const result = await toggleSuperOverrideAction(
                vehiculoId,
                !isOverrideActive,
                justificacion,
            );
            if (result.success) {
                router.refresh();
                onOpenChange(false);
                setJustificacion("");
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
                {/* Protocol Header */}
                <div className="p-8 pb-6 border-b border-slate-100 flex items-center gap-6">
                    <div className={cn(
                        "h-16 w-16 flex items-center justify-center text-white shadow-xl shrink-0 transition-transform hover:scale-105",
                        isOverrideActive ? "bg-slate-900" : "bg-indigo-600"
                    )}>
                        {isOverrideActive ? <ShieldAlert className="h-8 w-8" /> : <Scale className="h-8 w-8" />}
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter text-slate-900 leading-none mb-2">
                            {isOverrideActive ? "CALIBRACIÓN DE SEGURIDAD" : "PROTOCOLO DE EXCEPCIÓN"}
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                            MANDO CENTRAL - UNIDAD: <span className="text-slate-900">{placa}</span>
                        </p>
                    </div>
                </div>

                {/* Secure Input Area */}
                <div className="p-8 space-y-6 bg-slate-50/50">
                    {!isOverrideActive && (
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">
                                Justificación del Mando Superior
                            </label>
                            <textarea
                                placeholder="Describa por qué autoriza la operación omitiendo bloqueos legales..."
                                value={justificacion}
                                onChange={(e) => setJustificacion(e.target.value)}
                                rows={4}
                                className="w-full p-4 border border-slate-200 bg-white focus:ring-0 focus:border-indigo-600 outline-none text-sm font-medium tracking-tight resize-none transition-all placeholder:text-slate-300"
                            />
                            
                            <div className="p-5 bg-red-50 border border-red-100 space-y-2">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-red-700">Advertencia Forense Crítica</h4>
                                </div>
                                <p className="text-[11px] font-medium text-red-800 leading-relaxed">
                                    Esta acción ignora requisitos legales y financieros. Quedará registrado en el historial de auditoría bajo su responsabilidad directa.
                                </p>
                            </div>
                        </div>
                    )}

                    {isOverrideActive && (
                        <div className="flex items-center gap-4 p-5 bg-slate-900 text-white">
                            <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                            <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed">
                                Se reactivarán los firewalls de cumplimiento técnico y financiero inmediatamente.
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
                        CANCELAR
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={cn(
                            "h-12 rounded-none px-10 text-[10px] font-black uppercase tracking-widest gap-3 shadow-lg transition-all",
                            isOverrideActive 
                                ? "bg-slate-900 hover:bg-black" 
                                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
                        )}
                    >
                        {loading && <span className="h-3 w-3 border-2 border-white/30 border-t-white animate-spin" />}
                        {isOverrideActive ? "RESTAURAR SEGURIDAD" : "AUTORIZAR EXCEPCIÓN"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
