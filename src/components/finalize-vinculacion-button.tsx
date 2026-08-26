"use client";

import { useState } from "react";
import { finalizeVinculacion } from "@/actions";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import { CalendarOff, Loader2 } from "lucide-react";

interface FinalizeVinculacionButtonProps {
    vinculacionId: string;
}

export function FinalizeVinculacionButton({
    vinculacionId,
}: FinalizeVinculacionButtonProps) {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleFinalize = async () => {
        setLoading(true);
        try {
            const result = await finalizeVinculacion(vinculacionId);
            if (result.success) {
                toast.success("VINCULACIÓN FINALIZADA", {
                    description: "El conductor ha sido desvinculado exitosamente.",
                    className: "rounded-none border-l-4 border-l-emerald-500 font-black uppercase tracking-tight",
                });
                setShowConfirm(false);
            } else {
                toast.error("ERROR TÉCNICO", {
                    description: result.error || "No se pudo procesar la desvinculación",
                    className: "rounded-none border-l-4 border-l-red-500 font-black uppercase tracking-tight",
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("FALLO DE CONEXIÓN", {
                description: "Error crítico al finalizar la vinculación",
                className: "rounded-none border-l-4 border-l-red-500 font-black uppercase tracking-tight",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ConfirmDialog
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleFinalize}
                loading={loading}
                title="FINALIZAR VINCULACIÓN"
                description="¿Estás seguro de que deseas finalizar esta vinculación técnica? El conductor dejará de estar asignado a este vehículo inmediatamente y se cerrará el ciclo operativo actual."
                variant="warning"
            />

            <Button
                variant="outline"
                onClick={() => setShowConfirm(true)}
                disabled={loading}
                className="h-9 rounded-none border-slate-200 hover:border-red-600 hover:text-red-600 hover:bg-red-50 font-black text-[10px] uppercase tracking-widest transition-all duration-300 gap-2 group"
            >
                {loading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                    <>
                        <CalendarOff className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                        <span>FINALIZAR VINCULACIÓN</span>
                    </>
                )}
            </Button>
        </>
    );
}
