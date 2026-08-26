"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCcw, AlertTriangle, CheckCircle2, AlertOctagon, Timer, Download, Loader2, TrendingUp } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { getPortfolioReport } from "@/actions/finance/reports";
import { exportPortfolioExcel } from "@/lib/export-excel";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ReporteCartera } from "@/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function PortfolioPage() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ReporteCartera | null>(null);

    const fetchReport = useCallback(async (quiet = false) => {
        let toastId;
        if (!quiet) {
            toastId = toast.loading("Analizando comportamiento de cartera y morosidad...");
        }
        
        setLoading(true);
        try {
            const res = await getPortfolioReport();

            if (res.success && res.data) {
                setData(res.data);
                if (!quiet) toast.success("Análisis de cartera completado correctamente", { id: toastId });
            } else {
                toast.error(res.error || "Error al sincronizar datos de cartera", { id: toastId });
            }
        } catch (error) {
            toast.error("Error crítico en la conexión con el servidor financiero", { id: toastId });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReport(true);
    }, [fetchReport]);

    const StatCard = ({
        title,
        value,
        icon: Icon,
        color,
    }: {
        title: string;
        value: number;
        color: string;
        icon: React.ElementType;
    }) => (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex justify-between items-center group">
            <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-900 transition-colors">
                    {title}
                </p>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {formatCurrency(value)}
                </h3>
            </div>
            <div className={cn("p-3 rounded-xl transition-all group-hover:scale-110", color)}>
                <Icon size={24} />
            </div>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-200">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="text-brand h-6 w-6" />
                        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                            Reporte de Cartera
                        </h1>
                    </div>
                    <p className="text-slate-500 font-medium text-sm">
                        Análisis detallado de morosidad y proyecciones de cuentas por cobrar.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => fetchReport()}
                        disabled={loading}
                        className="h-11 px-6 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-bold text-[12px] uppercase tracking-wider transition-all"
                    >
                        {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin text-brand" />
                        ) : (
                            <RefreshCcw className="mr-2 h-4 w-4 text-slate-400" />
                        )}
                        {loading ? "Sincronizando..." : "Actualizar"}
                    </Button>
                    
                    <Button
                        onClick={() => {
                            if (data) {
                                exportPortfolioExcel(data);
                                toast.success("Reporte Excel generado y descargado");
                            }
                        }}
                        disabled={!data || loading}
                        className="h-11 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[12px] uppercase tracking-wider shadow-lg shadow-slate-200 transition-all border-none"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Exportar a Excel
                    </Button>
                </div>
            </div>

            {!data && loading ? (
                <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4 bg-white/50 rounded-3xl border border-dashed border-slate-300">
                    <Loader2 className="h-12 w-12 text-brand animate-spin opacity-20" />
                    <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">
                        Extrayendo información financiera...
                    </p>
                </div>
            ) : data ? (
                <div className="space-y-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <StatCard
                            title="Total Cartera"
                            value={data.resumen.total}
                            color="bg-slate-50 text-slate-400"
                            icon={AlertTriangle}
                        />
                        <StatCard
                            title="Cartera al Día"
                            value={data.resumen.corriente}
                            color="bg-emerald-50 text-emerald-500"
                            icon={CheckCircle2}
                        />
                        <StatCard
                            title="Mora 31-60 Días"
                            value={data.resumen.vencido30}
                            color="bg-amber-50 text-amber-500"
                            icon={Timer}
                        />
                        <StatCard
                            title="Mora 61-90 Días"
                            value={data.resumen.vencido60}
                            color="bg-orange-50 text-orange-500"
                            icon={AlertTriangle}
                        />
                        <StatCard
                            title="Mora Crítica (>90)"
                            value={data.resumen.vencido90}
                            color="bg-red-50 text-red-500"
                            icon={AlertOctagon}
                        />
                    </div>

                    {/* Report Table */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-brand animate-pulse" />
                                <h3 className="font-black text-slate-900 uppercase tracking-widest text-[12px]">
                                    Detalle de Compromisos ({data.cartera.length})
                                </h3>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-[12px]">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-400 font-black uppercase tracking-tighter text-left border-b border-slate-100">
                                        <th className="px-6 py-4">Asociado / Tercero</th>
                                        <th className="px-6 py-4">Activo / Placa</th>
                                        <th className="px-6 py-4">Tipo Concepto</th>
                                        <th className="px-6 py-4">Vencimiento</th>
                                        <th className="px-6 py-4 text-center">Estado de Mora</th>
                                        <th className="px-6 py-4 text-right">Saldo Pendiente</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium">
                                    {data.cartera.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-slate-900 font-bold uppercase">{item.tercero}</span>
                                                    <span className="text-slate-400 text-[10px] font-bold tracking-wider">{item.documento}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.placa !== "N/A" ? (
                                                    <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 rounded-md font-black text-[10px]">
                                                        {item.placa}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 font-bold">{item.concepto}</td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {format(new Date(item.vence), "dd MMM, yyyy", { locale: es })}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={cn(
                                                    "inline-flex items-center px-3 py-1.5 rounded-full font-black text-[10px] uppercase tracking-wider transition-all",
                                                    item.diasMora > 90 ? "bg-red-100 text-red-600 shadow-sm shadow-red-100" :
                                                    item.diasMora > 30 ? "bg-amber-100 text-amber-600" :
                                                    item.diasMora > 0 ? "bg-orange-100 text-orange-600" :
                                                    "bg-emerald-100 text-emerald-600"
                                                )}>
                                                    {item.diasMora > 0 ? `${item.diasMora} DÍAS MORA` : "AL DÍA"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="text-slate-900 font-black text-sm">
                                                    {formatCurrency(item.saldo)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="min-h-[300px] flex flex-col items-center justify-center space-y-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[11px] text-center max-w-xs leading-relaxed">
                        No se han cargado datos maestros de cartera aún.
                    </p>
                    <Button 
                        onClick={() => fetchReport()}
                        className="bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 font-bold"
                    >
                        Consultar Ahora
                    </Button>
                </div>
            )}
        </div>
    );
}

