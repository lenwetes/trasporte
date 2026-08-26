"use client";

import { cn, formatCurrency } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Scale, FileCheck2 } from "lucide-react";

interface BalancePanelProps {
    totalDebito: number;
    totalCredito: number;
    isBalanced: boolean;
}

/**
 * Panel de totales de débito/crédito y estado de balance de la transacción.
 */
export function TransactionBalancePanel({
    totalDebito,
    totalCredito,
    isBalanced,
}: BalancePanelProps) {
    const diferencia = Math.abs(totalDebito - totalCredito);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Totales */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase text-slate-900 tracking-widest pl-1">Total Débito</p>
                    <p className="text-sm font-black text-slate-900 font-mono">{formatCurrency(totalDebito)}</p>
                </div>
                <div className="space-y-1 border-l border-slate-200 pl-4">
                    <p className="text-[9px] font-black uppercase text-slate-900 tracking-widest pl-1">Total Crédito</p>
                    <p className="text-sm font-black text-slate-900 font-mono">{formatCurrency(totalCredito)}</p>
                </div>
            </div>

            {/* Estado de Balance */}
            <div className={cn(
                "flex items-center gap-4 p-4 rounded-xl border transition-all",
                isBalanced 
                    ? "bg-emerald-50 border-emerald-100 text-emerald-700 shadow-sm shadow-emerald-600/5" 
                    : "bg-rose-50 border-rose-100 text-rose-700 shadow-sm shadow-rose-600/5"
            )}>
                <div className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 border",
                    isBalanced ? "bg-white border-emerald-200" : "bg-white border-rose-200"
                )}>
                    {isBalanced ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-widest leading-none">
                            {isBalanced ? "Asiento Balanceado" : "Desbalance Contable"}
                        </p>
                        {isBalanced && <FileCheck2 size={14} className="opacity-50" />}
                    </div>
                    {isBalanced ? (
                        <p className="text-[10px] font-bold uppercase tracking-tight text-emerald-600/70 mt-1">Listo para registrar en libro mayor</p>
                    ) : (
                        <p className="text-[10px] font-black uppercase tracking-tight text-rose-600 mt-1 flex items-center gap-1">
                            Diferencia: <span className="font-mono bg-white px-1.5 py-0.5 rounded shadow-sm">{formatCurrency(diferencia)}</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
