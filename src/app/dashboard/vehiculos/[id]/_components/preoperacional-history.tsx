"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
    ClipboardCheck, 
    ShieldCheck, 
    ShieldAlert, 
    User, 
    Gauge, 
    Clock, 
    FileSignature, 
    Info, 
    CheckCircle2, 
    XCircle,
    Calendar,
    ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SignatureViewer } from "@/components/signature-viewer";
import { PreoperacionalWithRelations } from "@/types";

interface PreoperacionalHistoryProps {
    preoperacionales: PreoperacionalWithRelations[];
}

export function PreoperacionalHistory({
    preoperacionales = [],
}: PreoperacionalHistoryProps) {
    if (preoperacionales.length === 0) {
        return (
            <div className="border border-slate-200 border-dashed p-16 text-center bg-slate-50/50 space-y-4 animate-in fade-in duration-700">
                <ClipboardCheck className="h-12 w-12 text-slate-200 mx-auto" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Historial Vacío</p>
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2">No se han registrado inspecciones para este vehículo</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {preoperacionales.map((pre) => (
                <div key={pre.id} className="bg-white border border-slate-200 hover:shadow-md transition-all group overflow-hidden">
                    {/* Header */}
                    <div className={cn(
                        "p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b",
                        pre.resultado === "APROBADO" ? "bg-emerald-50/30 border-emerald-100" : "bg-rose-50/30 border-rose-100"
                    )}>
                        <div className="flex gap-6 items-center">
                            <div className={cn(
                                "h-12 w-12 flex items-center justify-center shadow-sm",
                                pre.resultado === "APROBADO" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                            )}>
                                {pre.resultado === "APROBADO" ? <ShieldCheck className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                    {format(new Date(pre.fecha), "EEEE, d 'de' MMMM", { locale: es })}
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <User className="h-3 w-3" />
                                        {pre.conductor.nombres} {pre.conductor.apellidos}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <Gauge className="h-3 w-3" />
                                        {pre.kilometraje.toLocaleString()} KM
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-left md:text-right w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                            <div className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">CÓDIGO DE AUDITORÍA</div>
                            <div className="text-xs font-black text-slate-900 uppercase tracking-wider font-mono">#{pre.id.slice(0, 8)}</div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 space-y-8">
                        {/* Summary of items */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {pre.detalles?.slice(0, 9).map((det, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 group-hover:bg-white transition-colors">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">{det.item}</span>
                                    {det.estado ? (
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                    ) : (
                                        <XCircle className="h-3.5 w-3.5 text-rose-500" />
                                    )}
                                </div>
                            ))}
                            {pre.detalles?.length > 9 && (
                                <div className="flex items-center justify-center p-3 border border-dashed border-slate-200 text-[8px] font-black text-slate-400 uppercase tracking-widest gap-2">
                                    + {pre.detalles.length - 9} ÍTEMS ADICIONALES
                                    <ChevronRight className="h-3 w-3" />
                                </div>
                            )}
                        </div>

                        {/* Observations */}
                        {pre.observaciones && (
                            <div className="bg-amber-50 border-l-4 border-amber-400 p-5 space-y-1">
                                <div className="flex items-center gap-2 text-[9px] font-black text-amber-600 uppercase tracking-[0.2em]">
                                    <Info className="h-3 w-3" />
                                    DICTAMEN TÉCNICO
                                </div>
                                <p className="text-xs font-bold text-amber-800 uppercase tracking-tight leading-relaxed italic">
                                    "{pre.observaciones}"
                                </p>
                            </div>
                        )}

                        {/* Signature Section */}
                        {pre.firmaDigital && (
                            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-end gap-6">
                                <div className="w-full md:flex-1 space-y-4">
                                    <div className="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                        <div className="flex items-center gap-2">
                                            <FileSignature className="h-3 w-3" />
                                            CERTIFICACIÓN ELECTRÓNICA
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-3 w-3 text-slate-300" />
                                            REGISTRO: {format(new Date(pre.creadoEn), "HH:mm:ss")}
                                        </div>
                                    </div>
                                    <div className="opacity-80 grayscale hover:grayscale-0 transition-all origin-left scale-90 md:scale-100">
                                        <SignatureViewer
                                            signatureData={pre.firmaDigital}
                                            label={`RESPONSABLE LEGAL: ${pre.conductor.nombres} ${pre.conductor.apellidos}`}
                                        />
                                    </div>
                                </div>
                                <Badge variant="outline" className="rounded-none border-slate-200 text-[8px] font-black px-3 py-1 bg-slate-50 text-slate-400">
                                    FIRMADO DIGITALMENTE
                                </Badge>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
