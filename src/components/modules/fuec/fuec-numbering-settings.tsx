"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateResolucionConsecutivo } from "@/actions/fuec";
import { toast } from "sonner";
import { RefreshCw, Save, Settings, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberingSettingsProps {
    resolucion: {
        id: string;
        numeroResolucion: string;
        actual: number;
        rangoHasta: number;
    };
    onUpdate: (newActual: number) => void;
}

export function FuecNumberingSettings({
    resolucion,
    onUpdate,
}: NumberingSettingsProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [newValue, setNewValue] = useState(resolucion.actual.toString());
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        const num = parseInt(newValue);
        if (isNaN(num)) {
            toast.error("Número inválido");
            return;
        }

        if (num > resolucion.rangoHasta) {
            toast.error(
                `El número excede el rango de la resolución (Máx: ${resolucion.rangoHasta})`,
            );
            return;
        }

        setIsLoading(true);
        try {
            const result = await updateResolucionConsecutivo({
                id: resolucion.id,
                actual: num,
            });
            if (result.success) {
                toast.success("Numeración actualizada correctamente");
                onUpdate(num);
                setIsEditing(false);
            } else {
                toast.error(result.error || "Error al actualizar numeración");
            }
        } catch (error) {
            toast.error("Error inesperado");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-primary/[0.02] border-b border-primary/10">
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-primary/5 flex items-center justify-center text-slate-900">
                            <Settings className="h-5 w-5" />
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="text-xs font-black text-primary uppercase tracking-tighter">Gestión de Consecutivo</h3>
                            <p className="text-[10px] text-muted-foreground font-mono">RESOLUCIÓN ACTIVA: {resolucion.numeroResolucion}</p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 text-[10px] font-bold text-primary/60 hover:text-primary hover:bg-primary/5 rounded-none"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? "CANCELAR" : "MODIFICAR"}
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                            Próximo Extracto a Emitir
                        </label>
                        <div className="relative">
                            <Input
                                type="number"
                                value={isEditing ? newValue : (resolucion.actual + 1).toString()}
                                onChange={(e) => setNewValue(e.target.value)}
                                disabled={!isEditing}
                                className={cn(
                                    "h-10 text-xl font-black font-mono rounded-none border-primary/10",
                                    !isEditing ? "bg-primary/[0.04] text-primary/60" : "bg-white text-primary border-accent/40"
                                )}
                            />
                            {!isEditing && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                                    <span className="text-[9px] font-bold text-accent tracking-widest">AUTOMÁTICO</span>
                                    <CheckCircle2 className="h-3 w-3 text-accent" />
                                </div>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <Button
                            type="button"
                            onClick={handleSave}
                            disabled={isLoading}
                            className="h-10 bg-primary hover:bg-primary/90 text-white font-bold rounded-none gap-2 px-6"
                        >
                            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            APLICAR CAMBIOS
                        </Button>
                    )}
                </div>

                {isEditing && (
                    <div className="p-3 bg-amber-50 border border-amber-200 flex items-start gap-3 animate-in fade-in duration-300">
                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-amber-800 font-bold leading-relaxed">
                            ADVERTENCIA LEGAL: Alterar el consecutivo manualmente puede generar inconsistencias ante el Ministerio de Transporte. 
                            Asegúrese de que el número coincida con su secuencia legal de FUECs.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
