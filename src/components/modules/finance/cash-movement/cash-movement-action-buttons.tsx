"use client";

import { Eye, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CashMovementActionButtonsProps {
    tipoSeleccionado: string;
    isSubmitting: boolean;
    preparePreview: () => void;
}

export function CashMovementActionButtons({
    tipoSeleccionado,
    isSubmitting,
    preparePreview
}: CashMovementActionButtonsProps) {
    return (
        <div className="grid grid-cols-2 gap-0 border-t border-primary/10">
            <Button 
                type="button" 
                variant="default" 
                onClick={preparePreview} 
                className="h-24 rounded-none bg-white text-primary border-r border-primary/10 text-[11px] font-black uppercase tracking-[0.4em] gap-5 hover:bg-slate-50 transition-all duration-300"
            >
                <div className="h-10 w-10 bg-primary/5 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
                    <Eye size={20} className="text-primary/60" /> 
                </div>
                Vista Previa Auditor
            </Button>
            <Button 
                type="submit" 
                disabled={isSubmitting} 
                className={cn(
                    "h-24 rounded-none font-black text-[11px] uppercase tracking-[0.4em] gap-5 transition-all duration-500 overflow-hidden relative group",
                    tipoSeleccionado === "INGRESO" ? "bg-primary text-white hover:bg-primary/95" : (tipoSeleccionado === "EGRESO" ? "bg-red-600 text-white hover:bg-red-700" : "bg-primary text-white hover:bg-primary/90")
                )}
            >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                {isSubmitting ? (
                    <Loader2 className="animate-spin h-8 w-8" />
                ) : (
                    <>
                        <div className="h-10 w-10 bg-white/20 flex items-center justify-center rounded-full">
                            <CheckCircle2 size={20} /> 
                        </div>
                        <span className="relative z-10">Consolidar Registro Maestro</span>
                    </>
                )}
            </Button>
        </div>
    );
}
