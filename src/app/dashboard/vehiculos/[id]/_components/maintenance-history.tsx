"use client";

import { VehiculoWithRelations } from "@/types";
import { useState } from "react";
import { 
    Wrench, 
    Clock, 
    CheckCircle2, 
    DollarSign, 
    Gauge, 
    FileText, 
    AlertCircle,
    ArrowUpRight,
    Calendar,
    History as HistoryIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    DocumentPreviewModal,
    type PreviewArchivo,
} from "@/components/ui/document-preview-modal";

interface MaintenanceHistoryProps {
    mantenimientos: VehiculoWithRelations["mantenimientos"];
    ordenesPendientes: VehiculoWithRelations["ordenesServicio"];
}

export function MaintenanceHistory({
    mantenimientos,
    ordenesPendientes,
}: MaintenanceHistoryProps) {
    const [previewDoc, setPreviewDoc] = useState<PreviewArchivo | null>(null);

    const formatCurrency = (val: number | null) => {
        if (!val) return "$ 0";
        return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Órdenes Pendientes */}
            {ordenesPendientes.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-600 flex items-center gap-3">
                            <Clock className="h-3 w-3" />
                            Pendientes por Ejecutar ({ordenesPendientes.length})
                        </h3>
                        <div className="h-px flex-1 bg-cyan-100" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ordenesPendientes.map((os) => (
                            <div key={os.id} className="bg-cyan-50/50 border border-cyan-100 p-5 flex justify-between items-center group hover:bg-cyan-50 transition-colors">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-cyan-800 uppercase tracking-widest">Ref: {os.codigo}</div>
                                    <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{os.plan.nombre}</div>
                                    <div className="flex items-center gap-2 text-[9px] font-bold text-cyan-400 uppercase tracking-widest">
                                        <Calendar className="h-3 w-3" />
                                        Emitida: {new Date(os.fechaCreacion).toLocaleDateString()}
                                    </div>
                                </div>
                                <Badge className="rounded-none border-none bg-cyan-600 text-white text-[8px] font-black px-2 py-1 uppercase tracking-widest">
                                    EN CURSO
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Historial */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                        <HistoryIcon className="h-3 w-3" />
                        Bitácora de Intervenciones
                    </h3>
                    <div className="h-px flex-1 bg-slate-100" />
                </div>

                {mantenimientos.length === 0 ? (
                    <div className="border border-slate-200 border-dashed p-16 text-center bg-slate-50/50">
                        <Wrench className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No se registran intervenciones históricas</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {mantenimientos.map((m) => (
                            <div key={m.id} className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-all group">
                                <div className="flex gap-6 flex-1 text-left">
                                    <div className="h-12 w-12 bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm transition-transform group-hover:scale-105">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-3 flex-1">
                                        <div>
                                            <div className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-cyan-600 transition-colors">{m.plan.nombre}</div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(m.fecha).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <Gauge className="h-3 w-3" />
                                                    {m.kilometraje.toLocaleString()} KM
                                                </div>
                                            </div>
                                        </div>
                                        {m.observaciones && (
                                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed pl-4 border-l-2 border-slate-100 italic">
                                                "{m.observaciones}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                                    <div className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                                        {formatCurrency(m.costo)}
                                    </div>
                                    {m.factura && (
                                        <Button 
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPreviewDoc(m.factura as unknown as PreviewArchivo)}
                                            className="h-8 rounded-none border-slate-200 text-[9px] font-black uppercase tracking-widest gap-2 hover:bg-slate-50"
                                        >
                                            <FileText className="h-3 w-3 text-slate-400" />
                                            Ver Soporte
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {previewDoc && (
                <DocumentPreviewModal
                    open={!!previewDoc}
                    onOpenChange={(v: any) => !v && setPreviewDoc(null)}
                    archivo={previewDoc}
                    label="Comprobante de Mantenimiento"
                />
            )}
        </div>
    );
}
