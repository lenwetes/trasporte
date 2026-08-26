"use client";

import { Button } from "@/components/ui/button";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Calculator, Zap, Settings, Activity } from "lucide-react";

interface TransactionHeaderProps {
    mode: "simple" | "advanced";
    setMode: (mode: "simple" | "advanced") => void;
}

/**
 * Cabecera del diálogo de transacciones con selector de modo ASISTIDO/AVANZADO.
 */
export function TransactionHeader({ mode, setMode }: TransactionHeaderProps) {
    return (
        <div className="bg-slate-900 border-b border-white/10 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                    <Calculator size={24} />
                </div>
                <div>
                    <DialogTitle className="text-lg font-black uppercase tracking-widest text-white leading-none mb-1">
                        Operación Financiera
                    </DialogTitle>
                    <DialogDescription className="text-slate-900 text-xs font-bold uppercase tracking-tight">
                        Módulo de Contabilidad Centralizada
                    </DialogDescription>
                </div>
            </div>

            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full md:w-auto">
                <button
                    type="button"
                    onClick={() => setMode("simple")}
                    className={cn(
                        "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        mode === "simple" 
                            ? "bg-white text-slate-900 shadow-xl shadow-black/20" 
                            : "text-slate-900 hover:text-white hover:bg-white/5"
                    )}
                >
                    <Zap size={14} className={cn(mode === "simple" ? "text-amber-500" : "text-slate-900")} />
                    Modo Asistido
                </button>
                <button
                    type="button"
                    onClick={() => setMode("advanced")}
                    className={cn(
                        "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        mode === "advanced" 
                            ? "bg-white text-slate-900 shadow-xl shadow-black/20" 
                            : "text-slate-900 hover:text-white hover:bg-white/5"
                    )}
                >
                    <Settings size={14} className={cn(mode === "advanced" ? "text-emerald-500" : "text-slate-900")} />
                    Multiasiento
                </button>
            </div>
        </div>
    );
}
