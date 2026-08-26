"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { CuotaPrestamoItem } from "@/types";
import { HandCoins, Calendar, CheckCircle2, ArrowDownCircle, AlertTriangle, ShieldAlert } from "lucide-react";
import { PaymentModalState } from "./use-loan-detail";

interface LoanAmortizationTableProps {
    cuotas: CuotaPrestamoItem[];
    estadoPrestamo: string;
    tipo: string;
    onPayClick: (state: PaymentModalState) => void;
    onLiquidateClick: () => void;
}

export function LoanAmortizationTable({ cuotas, estadoPrestamo, tipo, onPayClick, onLiquidateClick }: LoanAmortizationTableProps) {
    const isDesembolsado = estadoPrestamo === "DESEMBOLSADO";

    return (
        <div className="col-span-2 p-0 overflow-hidden bg-white flex flex-col">
            <div className="flex-1">
                <div className="p-6 bg-white border-b border-slate-100 flex justify-between items-center font-black">
                    <h4 className="text-[11px] text-slate-900 uppercase tracking-widest flex items-center gap-2 italic">
                        <HandCoins className="h-4 w-4 text-emerald-500" />
                        Cronograma de Amortización Vigente
                    </h4>
                    {isDesembolsado && (
                        <Button
                            onClick={onLiquidateClick}
                            variant="outline"
                            className="h-8 rounded-none border-red-200 text-red-600 font-black uppercase text-[9px] tracking-widest hover:bg-red-50 hover:border-red-500 transition-all gap-2"
                        >
                            <ShieldAlert size={12} />
                            Liquidar Totalidad
                        </Button>
                    )}
                </div>

                <div className="h-[400px] overflow-y-auto">
                    <table className="w-full text-[10px] text-left">
                        <thead className="bg-slate-50 sticky top-0 font-black uppercase tracking-tighter italic border-b border-slate-100 text-slate-900">
                            <tr>
                                <th className="px-6 py-4">N°</th>
                                <th className="px-6 py-4">Vencimiento</th>
                                <th className="px-6 py-4">Valor Cuota</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Captura Recaudo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {cuotas.map((c) => (
                                <tr
                                    key={c.id}
                                    className={cn("transition-colors", c.estado === "PAGADA" ? "bg-emerald-50/30" : "hover:bg-slate-50")}
                                >
                                    <td className="px-6 py-4 font-black text-slate-900 italic">#{String(c.numCuota).padStart(2, "0")}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 uppercase font-bold text-slate-900 tracking-tighter italic">
                                            <Calendar className="h-3 w-3 text-slate-900" />
                                            {new Date(c.fechaVencimiento).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-black text-slate-900 tabular-nums">
                                        {formatCurrency(Number(c.totalCuota))}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className={cn(
                                            "rounded-none border-none text-[8px] font-black uppercase tracking-tighter italic px-2",
                                            c.estado === "PAGADA" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                        )}>
                                            {c.estado}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {c.estado !== "PAGADA" && isDesembolsado && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onPayClick({
                                                    isOpen: true,
                                                    cuotaId: c.id,
                                                    monto: Number(c.totalCuota) - Number(c.montoPagado ?? 0),
                                                    isLiquidation: false,
                                                })}
                                                className="rounded-none border-slate-200 text-slate-900 text-[9px] font-black uppercase px-4 h-8 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all group"
                                            >
                                                <ArrowDownCircle className="h-3 w-3 mr-2 group-hover:scale-125 transition-transform" />
                                                Recaudar
                                            </Button>
                                        )}
                                        {c.estado === "PAGADA" && (
                                            <div className="flex items-center justify-end gap-2 text-emerald-600 font-black text-[9px] uppercase tracking-widest italic">
                                                <CheckCircle2 className="h-4 w-4" />
                                                Sincronizado
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {cuotas.length === 0 && (
                        <div className="p-20 text-center space-y-4">
                            <AlertTriangle className="h-10 w-10 text-amber-400 mx-auto" />
                            <p className="text-[11px] font-black text-slate-900 uppercase italic tracking-widest">
                                Motor de amortización en espera del desembolso efectivo.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
