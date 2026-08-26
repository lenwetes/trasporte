"use client";

import { X, ArrowRightLeft } from "lucide-react";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface TransactionDialogHeaderProps {
    loading: boolean;
    tipo: string;
    mode: "simple" | "advanced";
    setMode: (mode: "simple" | "advanced") => void;
    isBalanced: boolean;
    setOpen: (open: boolean) => void;
}

export function TransactionDialogHeader({
    loading,
    tipo,
    mode,
    setMode,
    isBalanced,
    setOpen
}: TransactionDialogHeaderProps) {
    return (
        <>
            {/* Indicador de Estado Balanced */}
            <div className={cn(
                "absolute top-0 left-0 w-2 h-full transition-colors duration-500",
                isBalanced ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            )} />

            {/* Header Auditoría */}
            <div className="p-8 border-b border-primary/5 bg-slate-900 text-white flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rotate-45 translate-x-32 -translate-y-32" />
                
                <div className="flex items-center gap-6 relative z-10 text-white">
                    <div className="h-14 w-14 flex items-center justify-center border-2 border-white/20 bg-white/10 shadow-2xl">
                        <ArrowRightLeft className={cn("h-7 w-7 text-accent", loading && "animate-spin-slow")} />
                    </div>
                    <div>
                        <DialogTitle className="text-[16px] font-black uppercase tracking-[0.4em] leading-none mb-2 text-white">
                            Registro de Transacción Maestro
                        </DialogTitle>
                        <div className="flex items-center gap-4">
                            <DialogDescription className="text-[9px] font-black text-accent uppercase tracking-[0.5em] italic mb-0">
                                CORE_FINANCE_v3 (Stacking Corrected)
                            </DialogDescription>
                            <span className="h-1 w-1 bg-white/20 rounded-full" />
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-[0.3em]",
                                tipo === "INGRESO" ? "text-emerald-400" : tipo === "EGRESO" ? "text-red-400" : "text-blue-400"
                            )}>
                                OPERACIÓN_{tipo}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8 relative z-10">
                    <div className="flex bg-white/5 border border-white/10 p-1">
                        <button 
                            type="button"
                            onClick={() => setMode("simple")}
                            className={cn(
                                "px-6 py-2 text-[9px] font-black uppercase tracking-widest transition-all",
                                mode === "simple" ? "bg-accent text-primary shadow-lg" : "text-white hover:text-white"
                            )}
                        >
                            Asistido
                        </button>
                        <button 
                            type="button"
                            onClick={() => setMode("advanced")}
                            className={cn(
                                "px-6 py-2 text-[9px] font-black uppercase tracking-widest transition-all",
                                mode === "advanced" ? "bg-accent text-primary shadow-lg" : "text-white hover:text-white"
                            )}
                        >
                            Avanzado
                        </button>
                    </div>
                    <button 
                        type="button"
                        onClick={() => setOpen(false)} 
                        className="h-10 w-10 flex items-center justify-center text-white hover:text-white hover:bg-white/10 transition-all rounded-none"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>
        </>
    );
}
