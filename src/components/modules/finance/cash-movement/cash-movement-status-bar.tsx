"use client";

import { Split } from "lucide-react";
import { cn } from "@/lib/utils";

interface CashMovementStatusBarProps {
    isSplitMode: boolean;
    toggleSplitMode: () => void;
}

export function CashMovementStatusBar({ isSplitMode, toggleSplitMode }: CashMovementStatusBarProps) {
    return (
        <div className={cn(
            "h-14 flex items-center justify-between px-8 transition-all duration-500 border-b border-primary/10",
            isSplitMode ? "bg-accent/5" : "bg-slate-50/50"
        )}>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div className={cn("h-2 w-2 rounded-full", isSplitMode ? "bg-primary animate-pulse" : "bg-slate-300")} />
                    {isSplitMode && <div className="absolute inset-0 h-2 w-2 rounded-full bg-primary animate-ping opacity-50" />}
                </div>
                <span className={cn("text-[10px] font-black uppercase tracking-[0.25em]", isSplitMode ? "text-primary" : "text-slate-500")}>
                    {isSplitMode ? "Distribución Multicanal Activa" : "Modo Transacción Unitaria"}
                </span>
            </div>
            
            <button
                type="button"
                onClick={toggleSplitMode}
                className={cn(
                    "flex items-center gap-2 px-5 py-1.5 border text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300",
                    isSplitMode 
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105" 
                        : "bg-white border-slate-200 text-slate-600 hover:border-primary/30 hover:text-primary"
                )}
            >
                <Split size={14} className={cn(isSplitMode ? "animate-pulse" : "")} />
                {isSplitMode ? "Desactivar Split" : "Activar Pago Mixto"}
            </button>
        </div>
    );
}
