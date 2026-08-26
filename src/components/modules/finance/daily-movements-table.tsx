"use client";

import { TransaccionWithAsientos } from "@/types/finance";
import { formatCurrency } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    ArrowUpCircle,
    ArrowDownCircle,
    Clock,
    User,
    FileText,
    ChevronRight,
    SearchX
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DailyMovementsTableProps {
    movimientos: TransaccionWithAsientos[];
}

export function DailyMovementsTable({ movimientos }: DailyMovementsTableProps) {
    if (movimientos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 px-6 border-y border-primary/5 bg-primary/[0.01] text-center space-y-6">
                <div className="h-16 w-16 bg-white border border-primary/10 flex items-center justify-center text-primary/10 shadow-sm relative group">
                    <div className="absolute inset-0 bg-primary/[0.02] border-r-2 border-primary/20 -translate-x-[2px] -translate-y-[2px]" />
                    <SearchX className="h-8 w-8 relative z-10" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Sin Actividad Registrada</h3>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest max-w-[280px] mx-auto leading-relaxed">
                        No se han detectado operaciones financieras en el ciclo contable de la jornada actual.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="border border-primary/10 bg-white overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-primary/[0.02]">
                    <TableRow className="hover:bg-transparent border-b-2 border-primary/10">
                        <TableHead className="w-[120px] h-14 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] px-6">Cronología</TableHead>
                        <TableHead className="w-[120px] text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Tipo</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Concepto / Detalle</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Tercero</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-right px-6">Valor Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {movimientos.map((mov) => {
                        const isIngreso = mov.tipo === "INGRESO";
                        const monto = mov.asientos.reduce((acc, current) => {
                            if (isIngreso) return acc + Number(current.debito);
                            return acc + Number(current.credito);
                        }, 0);

                        return (
                            <TableRow key={mov.id} className="group hover:bg-slate-50/80 transition-colors border-primary/5 h-16">
                                <TableCell className="px-6">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-primary/60 font-mono">
                                        <Clock className="h-3 w-3 opacity-30 cursor-help" />
                                        {new Date(mov.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className={cn(
                                        "inline-flex items-center gap-2 px-2.5 h-6 text-[9px] font-black uppercase tracking-widest border",
                                        isIngreso
                                            ? "bg-accent/10 text-accent border-accent/20"
                                            : "bg-red-50 text-red-600 border-red-100"
                                    )}>
                                        {isIngreso ? <ArrowUpCircle className="h-3 w-3" /> : <ArrowDownCircle className="h-3 w-3" />}
                                        {mov.tipo}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-black text-primary uppercase tracking-tight leading-none group-hover:text-accent transition-colors">
                                            {mov.descripcion || "MOVIMIENTO OPERATIVO DE CAJA"}
                                        </p>
                                        <div className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1 opacity-60">
                                            <FileText className="h-2.5 w-2.5" />
                                            ASIENTO: {mov.numeroComprobante || "N/A"}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 bg-slate-100 flex items-center justify-center text-primary shrink-0">
                                            <User className="h-3 w-3" />
                                        </div>
                                        <span className="text-[10px] font-black text-primary/80 uppercase tracking-tighter truncate max-w-[150px]">
                                            {mov.tercero ? `${mov.tercero.nombres} ${mov.tercero.apellidos || ""}` : "CLIENTE GENÉRICO"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right px-6">
                                    <span className={cn(
                                        "text-sm font-black font-mono tracking-tighter",
                                        isIngreso ? "text-accent" : "text-red-600"
                                    )}>
                                        {isIngreso ? "+" : "-"}{formatCurrency(monto)}
                                    </span>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
