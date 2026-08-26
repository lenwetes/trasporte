import * as React from "react";
import { Search, Clock, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, cn } from "@/lib/utils";
import { DashboardData, PrestamoWithRelations } from "@/types";

interface LoansTableViewProps {
    data: DashboardData;
    loading: boolean;
    setSelectedLoanId: (id: string) => void;
    setIsDetailOpen: (open: boolean) => void;
}

export function LoansTableView({
    data,
    loading,
    setSelectedLoanId,
    setIsDetailOpen,
}: LoansTableViewProps) {
    return (
        <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-4 bg-white p-2 shadow-sm border border-primary/5">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-primary" />
                    <Input 
                        placeholder="BUSCAR BENEFICIARIO O DOCUMENTO..."
                        className="rounded-none border-none h-10 pl-10 text-[10px] font-black uppercase tracking-widest bg-slate-50 shadow-inner"
                    />
                </div>
                <Button variant="ghost" className="rounded-none border-primary/10 h-10 px-4 text-[10px] font-black uppercase">Filtros Avanzados</Button>
            </div>

            <Card className="rounded-none border-none shadow-xl bg-white min-h-[500px] overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-primary/5">
                    <CardTitle className="text-[12px] font-black text-primary uppercase tracking-widest flex items-center gap-2 italic">
                        <Clock className="h-4 w-4 text-accent" />
                        Originaciones de Crédito Recientes
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-12 text-center text-[10px] font-black text-primary/20 uppercase animate-pulse italic">Sincronizando con motor de cartera...</div>
                    ) : data.recientes.length === 0 ? (
                        <div className="p-12 text-center text-[10px] font-black text-primary/20 uppercase italic">No se registran créditos activos en el periodo actual.</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-primary/5">
                                <tr className="text-[9px] font-black text-slate-900 uppercase tracking-tighter italic">
                                    <th className="px-6 py-4">Beneficiario Operativo</th>
                                    <th className="px-6 py-4">Monto Capital</th>
                                    <th className="px-6 py-4">Plazo</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.recientes.map((p: PrestamoWithRelations) => (
                                    <tr 
                                        key={p.id} 
                                        className="hover:bg-slate-50/50 transition-colors cursor-pointer group" 
                                        onClick={() => { setSelectedLoanId(p.id); setIsDetailOpen(true); }}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 bg-primary/5 rounded-none flex items-center justify-center text-[10px] font-black text-primary uppercase">
                                                    {(p.usuario?.nombres?.[0] || 'U') + (p.usuario?.apellidos?.[0] || '')}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-black text-primary uppercase tracking-tighter italic">{p.usuario?.nombres} {p.usuario?.apellidos}</span>
                                                    <span className="text-[9px] font-medium text-slate-900 leading-none">ID: {p.id.slice(-8).toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[12px] font-black text-primary tabular-nums tracking-tighter">{formatCurrency(Number(p.montoCapital))}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold text-primary italic uppercase">{p.numCuotas} {p.tipo === "FLEXIBLE_DIARIO" ? "Días" : "Meses"}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={cn(
                                                "rounded-none border-none text-[8px] font-black uppercase px-2 py-0.5 shadow-sm",
                                                p.estado === "DESEMBOLSADO" ? "bg-emerald-100 text-emerald-800" :
                                                p.estado === "EN_MORA" ? "bg-red-100 text-red-800" :
                                                "bg-amber-100 text-amber-800"
                                            )}>
                                                {p.estado}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm" className="rounded-none hover:bg-primary hover:text-white transition-all">
                                                <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
