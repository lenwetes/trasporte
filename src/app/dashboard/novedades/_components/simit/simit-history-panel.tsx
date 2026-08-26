import * as React from "react";
import { History, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SimitHistory } from "../simit-update-module.types";

interface SimitHistoryPanelProps {
    history: SimitHistory[];
    showHistory: boolean;
}

export function SimitHistoryPanel({ history, showHistory }: SimitHistoryPanelProps) {
    if (!showHistory) return null;

    return (
        <div className="xl:col-span-12 animate-in slide-in-from-bottom-5 duration-700 mt-8">
            <Card className="p-8 border-primary/10 rounded-none shadow-2xl bg-white space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-3">
                        <History className="h-4 w-4" /> Historial de Auditorías
                    </h3>
                    <p className="text-[10px] font-bold text-slate-900 uppercase">Últimos 10 registros</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-primary/5">
                                <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-slate-900">Fecha</th>
                                <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-slate-900">Resultado</th>
                                <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-slate-900">Comparendos</th>
                                <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest text-slate-900">Monto</th>
                                <th className="text-right py-4 text-[10px] font-black uppercase tracking-widest text-slate-900">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {history.map((h) => (
                                <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-4 text-[10px] font-bold text-primary">{new Date(h.fechaConsulta).toLocaleString()}</td>
                                    <td className="py-4">
                                        <span className={cn(
                                            "px-2 py-1 text-[9px] font-black uppercase tracking-tighter",
                                            h.estadoCuenta === 'PAZ_Y_SALVO' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                        )}>
                                            {h.estadoCuenta.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="py-4 text-[10px] font-medium text-slate-600 font-mono">{h.numeroComparendos}</td>
                                    <td className="py-4 text-[10px] font-black text-primary font-mono">${Number(h.valorTotal).toLocaleString()}</td>
                                    <td className="py-4 text-right">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-primary hover:text-white transition-colors">
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {history.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center text-[10px] font-bold text-slate-900 uppercase italic">
                                        No se registran auditorías previas para este criterio en el motor local.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
