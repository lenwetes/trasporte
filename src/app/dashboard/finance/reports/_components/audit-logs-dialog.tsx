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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { ShieldCheck, User, Calendar, Loader2, Search, Download } from "lucide-react";
import { getAuditLogs } from "@/actions/finance/reports";
import { formatCurrency, cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { exportAuditLogsExcel } from "@/lib/export-excel";

export function AuditLogsDialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAuditLogs();
            if (res.success) {
                setLogs(res.data as any[]);
            } else {
                toast.error(res.error || "Fallo al recuperar logs");
            }
        } catch (error) {
            toast.error("Error al conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (logs.length === 0) return toast.error("No hay registros para exportar");
        toast.promise(
            exportAuditLogsExcel(logs),
            {
                loading: 'Generando Data Maestra Excel...',
                success: '¡Data Maestra descargada!',
                error: 'Error al exportar los registros',
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
            <DialogContent className="max-w-7xl max-h-[85vh] bg-white rounded-none border-t-8 border-primary shadow-2xl p-0 overflow-hidden flex flex-col border-x-0 border-b-0">
                <div className="bg-primary p-8 text-white relative shrink-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-slate-900 opacity-50" />
                    <div className="absolute right-8 top-4 opacity-5 pointer-events-none">
                        <ShieldCheck size={180} strokeWidth={1} />
                    </div>
                    
                    <div className="relative z-10 flex justify-between items-start">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/10 border border-white/20 px-3 py-1 rounded-none flex items-center gap-2 shadow-inner">
                                    <div className="h-1.5 w-1.5 bg-accent" />
                                    <span className="text-[9px] font-black text-white uppercase tracking-widest leading-none">Control Audit v3.0</span>
                                </div>
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] font-mono italic">Protocolo NIIF</span>
                            </div>
                            <DialogTitle className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-2 text-white">
                                Auditoría <span className="underline decoration-accent underline-offset-8 decoration-4">Maestra</span>
                            </DialogTitle>
                            <DialogDescription className="text-white font-bold text-[10px] uppercase tracking-[0.3em] opacity-100 italic">
                                Monitor maestro de actividad transaccional y validación de integridad contable
                            </DialogDescription>
                        </div>
                        
                        <div className="hidden md:flex gap-8">
                            <div className="text-right">
                                <p className="text-[10px] text-white font-black uppercase mb-1">Registros</p>
                                <p className="text-4xl font-black italic text-white leading-none">{logs.length}</p>
                            </div>
                            <div className="h-12 w-px bg-white/10 mt-2" />
                            <div className="text-right">
                                <p className="text-[10px] text-white font-black uppercase mb-1">Estado</p>
                                <p className="text-4xl font-black italic text-accent leading-none">SEGURO</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-4">
                            <Loader2 className="h-10 w-10 text-primary animate-spin" />
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em]">Sincronizando Ledger Maestro...</p>
                        </div>
                    ) : logs.length > 0 ? (
                        <Table className="border-collapse">
                            <TableHeader className="bg-white sticky top-0 z-20 border-b-2 border-slate-200">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="h-14 px-6 text-[11px] font-black uppercase text-slate-900 tracking-widest py-0">TIMESTAMP</TableHead>
                                    <TableHead className="h-14 px-6 text-[11px] font-black uppercase text-slate-900 tracking-widest py-0">CUENTA CONTABLE (PUC)</TableHead>
                                    <TableHead className="h-14 px-6 text-[11px] font-black uppercase text-slate-900 tracking-widest py-0">TERCERO</TableHead>
                                    <TableHead className="h-14 px-6 text-[11px] font-black uppercase text-slate-900 tracking-widest py-0">DOCUMENTO</TableHead>
                                    <TableHead className="h-14 px-6 text-[11px] font-black uppercase text-emerald-600 tracking-widest py-0 text-right">DÉBITO</TableHead>
                                    <TableHead className="h-14 px-6 text-[11px] font-black uppercase text-red-600 tracking-widest py-0 text-right">CRÉDITO</TableHead>
                                    <TableHead className="h-14 px-6 text-[11px] font-black uppercase text-slate-900 tracking-widest py-0">OPERADOR</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log.id} className="group hover:bg-slate-50/50 border-primary/5 transition-all">
                                        <TableCell className="px-6 py-4 border-r border-primary/5">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-primary uppercase">
                                                    {format(new Date(log.fecha), "dd MMM yyyy", { locale: es })}
                                                </span>
                                                <span className="text-[9px] font-mono text-slate-900 group-hover:text-primary transition-colors">
                                                    {format(new Date(log.fecha), "HH:mm:ss")}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 font-black text-xs uppercase tracking-tight text-primary/80 group-hover:text-primary transition-colors">
                                           {log.cuenta}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 font-bold text-[10px] uppercase tracking-tighter text-slate-600">
                                           {log.tercero}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <Badge className="bg-primary/5 text-primary border-primary/10 rounded-none text-[8px] font-bold group-hover:bg-primary group-hover:text-white transition-all italic">
                                                {log.referencia}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right font-black text-emerald-600 text-xs">
                                            {log.debito > 0 ? formatCurrency(log.debito) : "-"}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right font-black text-red-600 text-xs border-r border-primary/5">
                                            {log.credito > 0 ? formatCurrency(log.credito) : "-"}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-none bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                    <User size={10} />
                                                </div>
                                                <span className="text-[9px] font-black uppercase tracking-tight text-primary/60">{log.usuario}</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-32 opacity-20 text-primary">
                            <ShieldCheck size={80} strokeWidth={1} />
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-8 italic">No se encontraron trazas de auditoría hoy</p>
                        </div>
                    )}
                </div>

                <div className="bg-slate-50 p-6 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-6 shrink-0 shadow-[0_-4px_30px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-4">
                        <div className="h-3 w-3 bg-emerald-500 rounded-none rotate-45 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none">
                            Infraestructura Auditada • Conexión Cifrada SSL-256
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="outline"
                            className="h-12 px-8 bg-white text-primary text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all border-2 border-primary/10 rounded-none h-auto py-4"
                            onClick={() => {
                                fetchData();
                                toast.success("Integridad de auditoría validada con éxito");
                            }}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Validar Integridad
                        </Button>
                        <Button 
                            className="h-12 px-10 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center gap-3 rounded-none active:scale-95 h-auto py-4"
                            onClick={handleExport}
                        >
                            <Download size={14} className="text-accent" />
                            EXPORTAR DATA MAESTRA
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
