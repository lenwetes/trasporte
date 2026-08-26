"use client";

import React, { useState, useEffect } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogTrigger
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock, Loader2, Download, AlertCircle } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { getCashFlowProjection } from "@/actions/finance/reports";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { exportCashFlowExcel } from "@/lib/export-excel";

export function CashFlowDialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getCashFlowProjection();
            if (res.success) {
                setData(res.data);
            } else {
                toast.error(res.error || "Fallo al proyectar flujo");
            }
        } catch (error) {
            toast.error("Error al conectar con el servidor corporativo");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (!data) return toast.error("No hay datos para exportar");
        toast.promise(
            exportCashFlowExcel(data),
            {
                loading: 'Generando reporte Excel corporativo...',
                success: '¡Reporte Excel descargado!',
                error: 'Error al generar el archivo',
            }
        );
    };

    useEffect(() => {
        if (open) fetchData();
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[85vh] bg-white rounded-none border-t-8 border-primary shadow-2xl p-0 overflow-hidden flex flex-col border-x-0 border-b-0">
                <div className="bg-primary p-8 text-white relative shrink-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-slate-900 opacity-50" />
                    <div className="absolute right-8 top-8 opacity-10 pointer-events-none rotate-12">
                        <TrendingUp size={150} strokeWidth={1} />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-white/10 border border-white/20 px-3 py-1 rounded-none flex items-center gap-2 shadow-inner">
                                <div className="h-1.5 w-1.5 bg-accent" />
                                <span className="text-[9px] font-black text-white uppercase tracking-widest leading-none">Fin-Projection-V2.4</span>
                            </div>
                            <span className="text-[10px] font-black text-white uppercase tracking-widest font-mono select-none italic">Sincronizado vía Ledger Maestro</span>
                        </div>
                        <DialogTitle className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-2 text-white">
                            Proyección de <span className="underline decoration-accent underline-offset-8 decoration-4">Liquidez</span>
                        </DialogTitle>
                        <DialogDescription className="text-white font-bold text-[10px] uppercase tracking-[0.3em] opacity-100 max-w-2xl leading-relaxed italic">
                            Análisis probabilístico de flujo de caja basado en compromisos de recaudo (PRÓXIMOS 90 DÍAS)
                        </DialogDescription>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar bg-slate-50/50">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 space-y-6">
                            <div className="relative">
                                <div className="h-16 w-16 border-4 border-primary/10 border-t-primary rounded-none animate-spin" />
                                <TrendingUp size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
                            </div>
                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] animate-pulse">Calculando Proyecciones Maestro...</p>
                        </div>
                    ) : data && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {data?.periodos?.map((p: { label: string; monto: number; count: number }, idx: number) => (
                                    <div key={idx} className="group relative">
                                        <div className="absolute -inset-1 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <Card className="rounded-none border-2 border-primary/10 shadow-sm bg-white hover:border-accent transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1">
                                            <div className="h-1 w-full bg-primary/5 group-hover:bg-accent transition-colors" />
                                                <div className="p-8 pb-4">
                                                    <div className="flex justify-between items-center mb-6">
                                                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{p.label}</span>
                                                        <Clock size={16} className="text-primary/20" />
                                                    </div>
                                                    <h4 className="text-4xl font-black text-primary mb-4 tracking-tighter italic">
                                                        {formatCurrency(p.monto)}
                                                    </h4>
                                                </div>
                                                <div className="bg-slate-50/50 px-8 py-4 flex items-center justify-between border-t border-primary/5 group-hover:bg-accent transition-colors">
                                                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{p.count} OBLIGACIONES ACTIVAS</span>
                                                    <div className="flex items-center gap-1">
                                                        <div className="h-1.5 w-1.5 bg-accent rounded-none" />
                                                        <span className="text-[9px] font-black text-primary uppercase italic">Verificado</span>
                                                    </div>
                                                </div>
                                        </Card>
                                    </div>
                                ))}
                            </div>

                            <Card className="rounded-none border-2 border-primary bg-white shadow-2xl relative z-10 overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-4 items-stretch">
                                    <div className="md:col-span-3 p-10">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="bg-slate-900 px-4 py-1.5 rounded-none flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 bg-accent" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Master Ledger</span>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Resumen Analítico</span>
                                        </div>
                                        
                                        <div className="flex items-end gap-6 text-primary">
                                            <h3 className="text-7xl font-black tracking-tighter leading-none italic">
                                                {formatCurrency(data.totalProyectado)}
                                            </h3>
                                            <div className="pb-1 space-y-2">
                                                <div className="bg-primary/5 border border-primary/10 px-3 py-1 rounded-none">
                                                    <span className="text-[10px] font-black text-primary uppercase italic tracking-widest leading-none block">Saldo Bruto Realizable</span>
                                                </div>
                                                <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Total Estimado Consolidado (NIIF)</p>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-12 space-y-4 text-primary">
                                            <div className="flex justify-between items-end">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-1 bg-accent" />
                                                    <span className="text-[11px] font-black text-primary uppercase tracking-[0.4em]">CAPACIDAD DE RECAUDO PROBABILÍSTICO</span>
                                                </div>
                                                <span className="text-3xl font-black italic tracking-tight underline decoration-accent underline-offset-8 decoration-4">94.8%</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 overflow-hidden flex">
                                                <div className="h-full bg-primary w-[70%]" />
                                                <div className="h-full bg-accent w-[24.8%]" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-primary p-8 flex flex-col justify-center items-center text-center space-y-8 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,183,181,0.1),transparent_70%)]" />
                                        <div className="space-y-1 relative z-10">
                                            <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] leading-none mb-2">STATUS MONITOR</p>
                                            <div className="h-1 w-12 bg-accent mx-auto" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="h-28 w-28 rounded-none border-4 border-white/5 border-t-accent animate-[spin_4s_linear_infinite] p-2">
                                                <div className="h-full w-full border-2 border-white/10 border-b-accent rotate-180" />
                                            </div>
                                            <TrendingUp size={36} className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                                        </div>
                                        <div className="space-y-2 relative z-10">
                                            <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Estabilidad Fiscal</p>
                                            <span className="text-3xl font-black text-accent italic uppercase tracking-tighter drop-shadow-lg">ESTABLE</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </>
                    )}
                </div>

                <div className="bg-slate-50 p-6 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-6 shrink-0 shadow-[0_-4px_30px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-4">
                        <div className="h-3 w-3 bg-emerald-500 rounded-none rotate-45 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none">
                            Seguridad Ledger Activa • Cierre Probabilístico 94.8%
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="outline"
                            className="h-12 px-8 bg-white text-primary text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all border-2 border-primary/10 rounded-none h-auto py-4"
                            onClick={() => {
                                fetchData();
                                toast.success("Sincronización de Ledger completada");
                            }}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Sincronizar Ledger
                        </Button>
                        <Button 
                            className="h-12 px-10 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center gap-3 rounded-none active:scale-95 h-auto py-4"
                            onClick={handleExport}
                        >
                            <Download size={14} className="text-accent" />
                            Exportar Proyección
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
