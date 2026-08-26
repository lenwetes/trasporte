"use client";

import { useState } from "react";
import { 
    CheckCircle2, 
    AlertTriangle, 
    FileText, 
    X,
    ExternalLink,
    Clock,
    DollarSign,
    Hash,
    ArrowRight,
    ShieldAlert,
    ChevronRight,
    MessageSquare,
    Truck,
    BadgeCheck,
    Wrench
} from "lucide-react";
import { aprobarOrdenServicio, rechazarOrdenServicio } from "@/actions/mantenimiento";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { OrdenRevision } from "../../types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
    ordenes: OrdenRevision[];
    onRefresh: () => void;
}

export function MaintenanceReviewTab({ ordenes, onRefresh }: Props) {
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleApprove = async (ordenId: string) => {
        const toastId = toast.loading("Procesando aprobación técnica...");
        try {
            const res = await aprobarOrdenServicio(ordenId);
            if (res.success) {
                toast.success("Mantenimiento auditado y aprobado correctamente", { id: toastId });
                onRefresh();
            } else {
                toast.error(res.error || "Error en la aprobación", { id: toastId });
            }
        } catch (error) {
            toast.error("Falla crítica en el servidor de auditoría", { id: toastId });
        }
    };

    const handleReject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const motivo = formData.get("motivo") as string;

        try {
            const res = await rechazarOrdenServicio({
                id: rejectingId!,
                motivo,
            });
            setIsSubmitting(false);

            if (res.success) {
                toast.success("Documentación rechazada satisfactoriamente");
                setRejectingId(null);
                onRefresh();
            } else {
                toast.error(res.error || "Error al rechazar");
            }
        } catch (error) {
            setIsSubmitting(false);
            toast.error("Error crítico en el proceso de rechazo");
        }
    };

    if (ordenes.length === 0) {
        return (
            <div className="py-24 flex flex-col items-center justify-center border border-dashed border-primary/10 bg-slate-50/50 radius-0">
                <BadgeCheck className="h-16 w-16 text-emerald-500/20 mb-4" />
                <h3 className="text-sm font-black text-primary uppercase tracking-widest italic">Sistemas Auditados 100%</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">No hay órdenes pendientes de validación técnica</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-700">
            {ordenes.map((orden) => (
                <div key={orden.id} className="bg-white border border-primary/10 shadow-sm relative group overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                    
                    <div className="flex flex-col lg:flex-row items-stretch">
                        {/* Status Column */}
                        <div className="bg-slate-50/80 p-6 flex flex-col items-center justify-center gap-2 border-r border-primary/5 min-w-[140px]">
                            <div className="h-12 w-12 flex items-center justify-center bg-white border border-amber-500/20 text-amber-500 shadow-sm">
                                <ShieldAlert className="h-6 w-6" />
                            </div>
                            <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest text-center mt-2 leading-tight">
                                PENDIENTE<br/>AUDITORÍA
                            </span>
                        </div>

                        {/* Main Info Area */}
                        <div className="flex-1 p-8">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <h3 className="text-2xl font-black text-primary font-mono tracking-tighter italic uppercase">{orden.vehiculo.placa}</h3>
                                        <Badge variant="outline" className="rounded-none border-primary/10 bg-slate-50 text-[10px] font-bold px-3 py-1 font-mono uppercase">
                                            {orden.codigo}
                                        </Badge>
                                    </div>
                                    <p className="text-sm font-black text-secondary uppercase tracking-widest flex items-center gap-2 italic">
                                        <Wrench className="h-3.5 w-3.5" />
                                        {orden.plan.nombre}
                                    </p>
                                </div>
                                
                                {orden.comprobante && (
                                    <Button asChild variant="outline" className="h-10 rounded-none border-primary/10 bg-white hover:bg-slate-50 px-6 text-[10px] font-black uppercase tracking-widest gap-2">
                                        <Link href={`/api/files/${orden.comprobante.nombreUnico}`} target="_blank">
                                            <ExternalLink className="h-3.5 w-3.5 text-secondary" />
                                            Ver Documento Probatorio
                                        </Link>
                                    </Button>
                                )}
                            </div>

                            {/* Technical Metrics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-slate-900 radius-0 overflow-hidden mb-6">
                                <div className="bg-slate-900 p-4 border-r border-slate-800">
                                    <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-1">Carga de Fecha</p>
                                    <p className="text-xs font-black text-white font-mono uppercase tracking-tighter">
                                        {orden.fechaComprobante ? new Date(orden.fechaComprobante).toLocaleDateString('es-CO') : "S/F"}
                                    </p>
                                </div>
                                <div className="bg-slate-900 p-4 border-r border-slate-800/50">
                                    <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-1">Métrica KM Reportada</p>
                                    <p className="text-xs font-black text-secondary font-mono uppercase tracking-tighter">
                                        {orden.kilometrajeReportado?.toLocaleString()} <span className="text-[10px]">KM_CTR</span>
                                    </p>
                                </div>
                                <div className="bg-slate-900 p-4">
                                    <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-1">Capital Invertido</p>
                                    <p className="text-xs font-black text-emerald-400 font-mono tracking-tighter">
                                        ${orden.costoReportado?.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Contextual Notes */}
                            <div className="bg-slate-50 p-5 border-l-4 border-secondary border-t border-r border-b border-primary/5 radius-0">
                                <div className="flex items-center gap-2 mb-2 text-[9px] font-black text-slate-900 uppercase tracking-widest">
                                    <MessageSquare className="h-3 w-3" /> Reporte Operativo del Conductor
                                </div>
                                <p className="text-[11px] font-bold text-primary/80 italic leading-relaxed">
                                    "{orden.observacionesConductor || "NO SE REPORTARON HALLAZGOS ADICIONALES DURANTE EL SERVICIO."}"
                                </p>
                            </div>
                        </div>

                        {/* Direct Command Actions */}
                        <div className="bg-slate-50 p-8 flex flex-row lg:flex-col items-center justify-center gap-4 lg:min-w-[200px] border-l border-primary/5">
                            <Button 
                                onClick={() => handleApprove(orden.id)}
                                className="h-14 w-full rounded-none bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] font-black uppercase tracking-[0.2em] gap-2 shadow-sm"
                            >
                                <CheckCircle2 className="h-4 w-4" /> Aprobar
                            </Button>
                            <Button 
                                variant="outline"
                                onClick={() => setRejectingId(orden.id)}
                                className="h-14 w-full rounded-none border-2 border-red-500/20 text-red-600 hover:bg-red-50 text-[11px] font-black uppercase tracking-[0.2em] gap-2 bg-white shadow-sm"
                            >
                                <X className="h-4 w-4" /> Rechazar
                            </Button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Rejection System Backdrop */}
            {rejectingId && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white border border-primary/10 shadow-2xl w-full max-w-lg relative overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="absolute top-0 left-0 w-2 h-full bg-red-600" />
                        <div className="p-8 border-b border-primary/5 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 flex items-center justify-center border border-red-500/10 bg-white">
                                    <ShieldAlert className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-primary uppercase tracking-widest">Rechazar Comprobante</h3>
                                    <p className="text-[10px] font-bold text-red-500/50 uppercase tracking-[0.2em]">Compliance Action</p>
                                </div>
                            </div>
                            <button onClick={() => setRejectingId(null)} className="text-primary/20 hover:text-red-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleReject}>
                            <div className="p-8">
                                <p className="text-xs font-bold text-primary/60 uppercase tracking-tight mb-6 leading-relaxed">
                                    INDIQUE EL MOTIVO TÉCNICO POR EL CUAL SE RECHAZA LA DOCUMENTACIÓN. EL CONDUCTOR SERÁ NOTIFICADO AUTOMÁTICAMENTE.
                                </p>
                                <textarea
                                    name="motivo"
                                    required
                                    placeholder="EJ: EL COMPROBANTE NO ES LEGIBLE O EL KILOMETRAJE NO COINCIDE..."
                                    className="w-full h-32 p-4 rounded-none border-primary/10 bg-slate-50 text-[11px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-red-500 outline-none resize-none"
                                />
                            </div>
                            <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-primary/5">
                                <Button type="button" variant="outline" onClick={() => setRejectingId(null)} className="h-12 rounded-none px-6 text-[10px] font-black uppercase tracking-widest">
                                    Regresar
                                </Button>
                                <Button type="submit" disabled={isSubmitting} className="h-12 rounded-none bg-red-600 text-white hover:bg-red-700 px-8 text-[10px] font-black uppercase tracking-widest">
                                    {isSubmitting ? "Procesando..." : "Confirmar Rechazo"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

