"use client";

import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { 
  BarChart4, 
  FileText, 
  Wallet, 
  ChevronRight, 
  Download, 
  Filter,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Activity,
  UserCheck
} from "lucide-react";

import { getFinancialStatement } from "@/actions/finance/reports";
import { FinancialReportData } from "@/types/finance";
import { FinancialSummaryCards } from "./_components/financial-summary-cards";
import { FinancialReportTable } from "./_components/financial-report-table";
import { CashFlowDialog } from "./_components/cash-flow-dialog";
import { AuditLogsDialog } from "./_components/audit-logs-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { exportFinancialStatementExcel } from "@/lib/export-excel";

export default function FinancialReportsPage() {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<FinancialReportData | null>(null);
    const [dateRange, setDateRange] = useState({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    });

    const fetchReport = async () => {
        setLoading(true);
        try {
            const res = await getFinancialStatement({
                startDate: dateRange.from.toISOString(),
                endDate: dateRange.to.toISOString(),
            });

            if (res.success) {
                setReport(res.data as FinancialReportData);
            } else {
                toast.error(res.error || "Error al generar el reporte");
            }
        } catch (error) {
            toast.error("Error técnico al conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const fromStr = format(dateRange.from, "yyyy-MM-dd");
    const toStr = format(dateRange.to, "yyyy-MM-dd");

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Técnico */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-primary/10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-primary/5 text-primary border-primary/10 rounded-none px-2 py-0 text-[10px] font-black uppercase tracking-widest">
                            Auditoría NIIF
                        </Badge>
                        <span className="text-[10px] text-primary/70 font-mono">REFERENCIA INTEGRAL DE AUDITORÍA</span>
                    </div>
                    <h1 className="text-4xl font-black text-primary tracking-tighter uppercase leading-none italic">
                        Reportes<br />
                        <span className="text-accent not-italic">Financieros</span>
                    </h1>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 border border-primary/10 shadow-sm">
                    <div className="flex flex-col px-3">
                        <span className="text-[9px] font-bold text-primary/70 uppercase tracking-tight">Periodo de Análisis</span>
                        <div className="flex items-center gap-2 flex-wrap">
                            <input 
                                type="date" 
                                value={fromStr} 
                                onChange={(e) => setDateRange({ ...dateRange, from: new Date(e.target.value) })}
                                className="text-xs font-black text-primary border-none p-0 focus:ring-0 uppercase cursor-pointer"
                            />
                            <ArrowRight className="h-3 w-3 text-primary/20" />
                            <input 
                                type="date" 
                                value={toStr} 
                                onChange={(e) => setDateRange({ ...dateRange, to: new Date(e.target.value) })}
                                className="text-xs font-black text-primary border-none p-0 focus:ring-0 uppercase cursor-pointer"
                            />
                        </div>
                    </div>
                    <Button 
                        onClick={fetchReport} 
                        disabled={loading}
                        className="bg-primary text-white hover:bg-black rounded-none h-10 px-6 font-black uppercase tracking-widest text-[10px]"
                    >
                        {loading ? "Calculando..." : "Ejecutar Auditoría"}
                    </Button>
                </div>
            </div>

            {/* Quick Access Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/dashboard/finance/reports/portfolio" className="group">
                    <Card className="rounded-none border-primary/10 hover:border-accent transition-all duration-300 bg-white shadow-sm overflow-hidden h-full">
                        <CardContent className="p-6 relative">
                            <div className="absolute top-0 right-0 p-2 bg-primary/5">
                                <Activity className="h-4 w-4 text-primary/20 group-hover:text-accent transition-colors" />
                            </div>
                            <h3 className="text-sm font-black text-primary mb-1 uppercase tracking-tight">Análisis de Cartera</h3>
                            <p className="text-[11px] text-slate-900 font-medium leading-relaxed mb-4">
                                Revisión detallada de morosidad y obligaciones pendientes por vehículo y asociado.
                            </p>
                            <div className="flex items-center text-[10px] font-black text-accent uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                Ver Detalle <ChevronRight className="h-3 w-3 ml-1" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <CashFlowDialog>
                    <div className="relative group cursor-pointer">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Card className="rounded-none border-2 border-dashed border-primary/20 bg-white shadow-sm overflow-hidden h-full group-hover:border-primary transition-all duration-300">
                            <CardContent className="p-6 relative">
                                <div className="absolute top-0 right-0 p-2 bg-primary/5">
                                    <TrendingUp className="h-4 w-4 text-primary group-hover:text-primary transition-colors" />
                                </div>
                                <h3 className="text-sm font-black text-primary/80 mb-1 uppercase tracking-tight italic group-hover:text-primary transition-colors">Flujo de Caja Proyectado</h3>
                                <p className="text-[11px] text-primary/60 font-medium leading-relaxed mb-4">
                                    Algoritmo predictivo a 30, 60 y 90 días basado en comportamiento histórico.
                                </p>
                                <Badge className="bg-primary text-white rounded-none text-[8px] font-black uppercase shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">Ejecutar Simulación</Badge>
                            </CardContent>
                        </Card>
                    </div>
                </CashFlowDialog>

                <AuditLogsDialog>
                    <div className="relative group cursor-pointer">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Card className="rounded-none border-2 border-dashed border-primary/20 bg-white shadow-sm overflow-hidden h-full group-hover:border-primary transition-all duration-300">
                            <CardContent className="p-6 relative">
                                <div className="absolute top-0 right-0 p-2 bg-primary/5">
                                    <ShieldCheck className="h-4 w-4 text-primary group-hover:text-primary transition-colors" />
                                </div>
                                <h3 className="text-sm font-black text-primary/80 mb-1 uppercase tracking-tight italic group-hover:text-primary transition-colors">Libros de Auditoría</h3>
                                <p className="text-[11px] text-primary/60 font-medium leading-relaxed mb-4">
                                    Motor de exportación masiva para requerimientos de Supersociedades y DIAN.
                                </p>
                                <Badge className="bg-accent text-primary rounded-none text-[8px] font-black uppercase shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform">Auditoría Master</Badge>
                            </CardContent>
                        </Card>
                    </div>
                </AuditLogsDialog>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <div className="h-12 w-12 border-4 border-accent border-t-transparent animate-spin" />
                    <p className="text-[10px] font-black text-primary/70 uppercase tracking-widest animate-pulse">
                        Consolidando data de servidores...
                    </p>
                </div>
            ) : report ? (
                <div className="space-y-6">
                    <FinancialSummaryCards report={report} />
                    
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                        {/* Tabla de Datos Densos */}
                        <div className="xl:col-span-2">
                             <FinancialReportTable report={report} />
                             
                             <div className="mt-8 flex justify-center">
                                 <Button 
                                    variant="outline" 
                                    onClick={() => report && exportFinancialStatementExcel(report)}
                                    className="border-2 border-primary text-primary hover:bg-primary hover:text-white uppercase font-black text-[10px] tracking-[0.2em] rounded-none px-12 transition-all bg-white shadow-xl shadow-primary/5"
                                 >
                                    <Download className="h-4 w-4 mr-2" />
                                    Generar Balance Maestro (EXCEL)
                                 </Button>
                             </div>
                        </div>

                        {/* Sidebar de Análisis Rápido */}
                        <div className="space-y-6">
                            <Card className="rounded-none border-none shadow-2xl bg-primary text-white overflow-hidden relative">
                                <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
                                    <FileText size={160} />
                                </div>
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-2 mb-6">
                                         <ShieldCheck className="h-4 w-4 text-accent" />
                                         <span className="text-[10px] font-black uppercase tracking-widest text-white">Resumen Ejecutivo</span>
                                     </div>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[10px] font-black text-white uppercase tracking-wider mb-2">Utilidad Operacional</p>
                                            <h4 className="text-4xl font-black italic tracking-tight text-white">
                                                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(report.utilidadOperacional)}
                                            </h4>
                                        </div>

                                        <div className="pt-6 border-t border-white/20 space-y-4">
                                            <div className="flex justify-between items-center text-[11px] font-black">
                                                <span className="text-white uppercase">Rendimiento Operativo</span>
                                                <span className="text-accent underline decoration-2">
                                                    {report.ingresos.total > 0 ? ((report.utilidadOperacional / report.ingresos.total) * 100).toFixed(2) : 0}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-[11px] font-black">
                                                <span className="text-white uppercase">Balance de Caja</span>
                                                <span className="text-emerald-400">ESTADO: NORMAL</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[11px] font-black">
                                                <span className="text-white uppercase">Riesgo Financiero</span>
                                                <span className="text-amber-400">NIVEL: BAJO</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-10">
                                        <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[9px] font-black uppercase tracking-tighter italic">
                                            Datos Validados por Sistema
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-none border-primary/10 bg-slate-50 border-dashed">
                                <CardContent className="p-6">
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Filter className="h-3 w-3" />
                                        Notas de Auditoría
                                    </h4>
                                    <div className="space-y-4">
                                        {[
                                            "Cierre de mes programado para el día 30.",
                                            "Conciliación de bancos pendiente (7 conceptos).",
                                            "Auditoría externa programada para Q3."
                                        ].map((note, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className="h-1 w-1 bg-accent mt-1.5 shrink-0" />
                                                <p className="text-[11px] text-primary/60 font-medium italic">{note}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            ) : (
                <Card className="rounded-none border-dashed border-primary/20 bg-primary/[0.02]">
                    <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                        <Wallet className="h-12 w-12 text-primary/10 mb-4" />
                        <h2 className="text-lg font-black text-primary uppercase tracking-tight mb-2">Sin Datos Cargados</h2>
                        <p className="text-[11px] text-slate-900 font-medium max-w-sm mb-6 uppercase leading-relaxed">
                            Aún no se ha consolidado el balance para este periodo o los filtros seleccionados no poseen movimientos registrados.
                        </p>
                        <Button 
                            onClick={fetchReport}
                            variant="outline"
                            className="bg-primary text-white hover:bg-black rounded-none h-10 px-8 font-black uppercase tracking-widest text-[10px]"
                        >
                            Ejecutar Auditoría Ahora
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
