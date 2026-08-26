"use client";

import { useState } from "react";
import { toggleOwnerBlockAction } from "@/actions/fleet/operability.actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ShieldCheck, Lock, Unlock, AlertTriangle } from "lucide-react";

interface OwnerKillswitchPanelProps {
    ownerId: string;
    ownerName: string;
    vehicleCount: number;
}

export function OwnerKillswitchPanel({
    ownerId,
    ownerName,
    vehicleCount,
}: OwnerKillswitchPanelProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [razon, setRazon] = useState("");
    const [actionType, setActionType] = useState<"block" | "unblock">("block");

    if (vehicleCount === 0) return null;

    const handleConfirm = async () => {
        if (actionType === "block" && !razon.trim()) {
            toast.error("Debe ingresar una razón para el bloqueo masivo");
            return;
        }

        setLoading(true);
        try {
            const result = await toggleOwnerBlockAction(
                ownerId,
                actionType === "block",
                razon,
            );
            if (result.success) {
                toast.success(actionType === "block"
                    ? `Se han bloqueado ${vehicleCount} vehículos exitosamente`
                    : `Se han desbloqueado ${vehicleCount} vehículos exitosamente`
                );
                setOpen(false);
                setRazon("");
                window.location.reload();
            } else {
                toast.error(result.error || "Ocurrió un error");
            }
        } catch {
            toast.error("Error al procesar el bloqueo masivo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mt-6 shadow-sm">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-3 uppercase tracking-wider mb-6">
                <ShieldAlert className="h-5 w-5 text-red-600" />
                Killswitch de Operaciones
            </h3>
            
            <div className="flex gap-4 items-start mb-8 p-4 bg-slate-50/50 rounded-lg border border-slate-100">
                <div className="h-10 w-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm shrink-0">
                    <span className="text-lg">🚛</span>
                </div>
                <div>
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-1">Gestión Masiva de Flota</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        Este propietario tiene <strong className="text-slate-900 font-bold">{vehicleCount} vehículos</strong> afiliados. Puede bloquear o desbloquear la operación de toda su flota al instante.
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                <Button 
                    variant="outline"
                    onClick={() => { setActionType("block"); setOpen(true); }}
                    className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 font-black uppercase tracking-widest text-[10px] h-11 px-6 rounded-lg gap-2"
                >
                    <Lock className="h-3.5 w-3.5" />
                    Bloquear Flota
                </Button>
                <Button 
                    variant="outline"
                    onClick={() => { setActionType("unblock"); setOpen(true); }}
                    className="bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700 font-black uppercase tracking-widest text-[10px] h-11 px-6 rounded-lg gap-2"
                >
                    <Unlock className="h-3.5 w-3.5" />
                    Desbloquear
                </Button>
            </div>

            {open && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
                        <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
                            {actionType === "block" ? <Lock className="h-6 w-6 text-red-600" /> : <Unlock className="h-6 w-6 text-emerald-600" />}
                        </div>

                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">
                            {actionType === "block" ? "Bloqueo Masivo de Flota" : "Desbloqueo Masivo de Flota"}
                        </h3>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed mb-6">
                            Está a punto de <span className="font-bold text-slate-700">{actionType === "block" ? "restringir" : "habilitar"}</span> la operación de <strong className="text-slate-900">{vehicleCount} vehículos</strong> de propiedad de <strong className="text-slate-900">{ownerName}</strong>.
                        </p>

                        {actionType === "block" && (
                            <div className="mb-6 space-y-3">
                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] block">
                                    Motivo del Bloqueo Masivo
                                </label>
                                <textarea 
                                    value={razon}
                                    onChange={(e) => setRazon(e.target.value)}
                                    placeholder="Especifique la razón legal, técnica o administrativa..."
                                    className="w-full min-h-[120px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-0 focus:border-red-400 transition-all resize-none outline-none"
                                />
                                <p className="text-[10px] text-red-500 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                                    <AlertTriangle className="h-3 w-3" />
                                    Esta acción es auditable
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                            <Button 
                                variant="ghost"
                                onClick={() => setOpen(false)}
                                disabled={loading}
                                className="font-black uppercase tracking-widest text-[10px] h-12 px-6"
                            >
                                Cancelar
                            </Button>
                            <Button 
                                onClick={handleConfirm}
                                disabled={loading}
                                className={actionType === "block" 
                                    ? "bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-lg shadow-red-200" 
                                    : "bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-lg shadow-emerald-200"
                                }
                            >
                                {loading ? "Procesando..." : actionType === "block" ? "Confirmar Bloqueo" : "Confirmar Desbloqueo"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

