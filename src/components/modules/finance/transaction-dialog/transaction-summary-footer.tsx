"use client";

import { CheckCircle2, AlertTriangle, Activity, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TransactionSummaryFooterProps {
    isBalanced: boolean;
    totalDebito: number;
    totalCredito: number;
    loading: boolean;
    handleSubmit: () => void;
    setOpen: (val: boolean) => void;
}

export function TransactionSummaryFooter({
    isBalanced,
    totalDebito,
    totalCredito,
    loading,
    handleSubmit,
    setOpen
}: TransactionSummaryFooterProps) {
    return (
        <div className="flex flex-col">
            {/* 4. Resumen de Balances */}
            <div className={cn(
                "grid grid-cols-1 md:grid-cols-3 gap-0 border-2 transition-all p-1 mx-10 mb-10",
                isBalanced ? "bg-emerald-50 border-emerald-500/20" : "bg-red-50 border-red-500/20"
            )}>
                <div className="bg-white p-8 flex flex-col justify-center items-center gap-2 border-r border-primary/5">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Total Débito</span>
                    <h4 className="text-3xl font-black font-mono text-primary italic tracking-tighter">
                        ${totalDebito.toLocaleString()}
                    </h4>
                </div>
                <div className="bg-white p-8 flex flex-col justify-center items-center gap-2 border-r border-primary/5">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Total Crédito</span>
                    <h4 className="text-3xl font-black font-mono text-primary italic tracking-tighter">
                        ${totalCredito.toLocaleString()}
                    </h4>
                </div>
                <div className={cn(
                    "p-8 flex flex-col justify-center items-center gap-4 transition-colors",
                    isBalanced ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                )}>
                    {isBalanced ? (
                        <>
                            <CheckCircle2 size={32} className="text-accent shadow-xl" />
                            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Balance Ajustado</span>
                        </>
                    ) : (
                        <>
                            <AlertTriangle size={32} className="animate-pulse" />
                            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Desbalance detectado</span>
                        </>
                    )}
                </div>
            </div>

            {/* Footer Auditoría */}
            <div className="p-8 bg-slate-50 border-t-2 border-primary/10 flex flex-col sm:flex-row justify-end gap-6 relative overflow-hidden">
                <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-4 opacity-50">
                    <Activity size={16} className="text-primary animate-pulse" />
                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] italic">Audit Trail Active - System Secure</span>
                </div>

                <Button 
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                    className="h-14 bg-transparent text-slate-900 hover:text-red-600 hover:bg-red-50 px-10 text-[11px] font-black uppercase tracking-[0.3em] transition-all rounded-none"
                >
                    [ Abortar Movimiento ]
                </Button>
                <Button 
                    type="button"
                    onClick={handleSubmit} 
                    disabled={loading || !isBalanced}
                    className={cn(
                        "h-14 px-12 text-[11px] font-black uppercase tracking-[0.4em] gap-4 transition-all shadow-2xl rounded-none border-none",
                        isBalanced 
                            ? "bg-slate-900 text-white hover:bg-slate-800 shadow-primary/20" 
                            : "bg-slate-200 text-slate-900 cursor-not-allowed"
                    )}
                >
                    {loading ? (
                        <div className="h-5 w-5 border-2 border-white/20 border-t-white animate-spin" />
                    ) : (
                        <Zap size={18} className={cn(isBalanced ? "text-accent" : "text-slate-900")} />
                    )}
                    Certificar Transacción
                </Button>
            </div>
        </div>
    );
}
