"use client";

import { useState } from "react";
import { AlertCircle, Clock, Upload, CheckCircle2, AlertTriangle, FileText, X } from "lucide-react";
import { uploadFile } from "@/actions";
import { submitComprobanteOrden } from "@/actions/mantenimiento";
import { toast } from "sonner";
import type { OrdenServicio } from "@prisma/client";
import { cn } from "@/lib/utils";

// Tipado extendido para incluir relaciones
type OrdenExtendida = OrdenServicio & {
    vehiculo: { placa: string; marca: string | null; modelo: string | null };
    plan: { nombre: string };
    comprobante?: { id: string; rutaAbsoluta: string } | null;
};

export function ConductorOrdenesPendientes({
    ordenes,
}: {
    ordenes: OrdenExtendida[];
}) {
    const [selectedOrden, setSelectedOrden] = useState<OrdenExtendida | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        try {
            const file = formData.get("comprobante") as File;
            if (!file || file.size === 0) {
                toast.error("Debes subir un comprobante");
                setIsSubmitting(false);
                return;
            }

            // Upload File
            const uploadFormData = new FormData();
            uploadFormData.append("file", file);
            const uploadRes = await uploadFile(uploadFormData);

            if (!uploadRes.success || !uploadRes.data) {
                throw new Error("Error al subir archivo");
            }

            const res = await submitComprobanteOrden({
                ordenId: selectedOrden!.id,
                kilometraje: Number(formData.get("kilometraje")),
                costo: Number(formData.get("costo")),
                observaciones: formData.get("observaciones") as string,
                archivoId: uploadRes.data.id,
            });

            if (res.success) {
                toast.success("Comprobante enviado a revisión correctamente");
                setSelectedOrden(null);
                window.location.reload();
            } else {
                toast.error(res.error || "Error al enviar comprobante");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al subir el comprobante");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (ordenes.length === 0) return null;

    if (ordenes.length === 0) return null;

    const InputClass = "h-14 w-full rounded-none border-primary/10 bg-slate-50 px-4 text-xs font-bold uppercase tracking-widest focus:border-secondary focus:ring-0 transition-colors mb-6";
    const LabelClass = "block text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-3";

    return (
        <div className="mt-8">
            <div className="flex items-center gap-3 mb-6 bg-slate-50 p-6 border-l-4 border-secondary radius-0 shadow-sm">
                <div className="bg-white p-3 rounded-none shadow-sm">
                    <AlertCircle className="h-6 w-6 text-secondary" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-primary uppercase tracking-widest">
                        Órdenes de Servicio Pendientes
                    </h3>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Acciones requeridas</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {ordenes.map((orden) => (
                    <div key={orden.id} className="bg-white border border-primary/10 radius-0 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex gap-6 items-center">
                            <div className="text-center p-4 bg-slate-50 border border-primary/5 min-w-[120px]">
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">VEHÍCULO</div>
                                <div className="text-xl font-black text-primary font-mono tracking-tighter">{orden.vehiculo.placa}</div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-black text-slate-400 font-mono tracking-widest">#{orden.codigo}</span>
                                    {orden.estado === "EN_REVISION" && (
                                        <span className="text-[9px] bg-amber-50 text-amber-600 px-2 py-1 uppercase font-black tracking-widest border border-amber-500/20">EN REVISIÓN</span>
                                    )}
                                    {orden.estado === "RECHAZADA" && (
                                        <span className="text-[9px] bg-red-50 text-red-600 px-2 py-1 uppercase font-black tracking-widest border border-red-500/20">RECHAZADA</span>
                                    )}
                                </div>
                                <h4 className="m-0 mb-2 text-sm font-black text-primary uppercase tracking-tight">{orden.plan.nombre}</h4>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    {orden.estado === "RECHAZADA" ? (
                                        <div className="flex items-center gap-2 text-red-600">
                                            <AlertCircle className="h-3.5 w-3.5" /> Motivo: {orden.motivoRechazo}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-3.5 w-3.5" /> Emitida: {new Date(orden.fechaCreacion).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-auto mt-4 md:mt-0">
                            {orden.estado !== "EN_REVISION" ? (
                                <button 
                                    className="w-full md:w-auto h-12 rounded-none bg-primary text-white px-6 text-[10px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all"
                                    onClick={() => setSelectedOrden(orden)}
                                >
                                    <Upload className="h-4 w-4" /> Gestionar
                                </button>
                            ) : (
                                <div className="flex items-center justify-center gap-2 text-amber-600 text-[10px] font-black uppercase tracking-widest px-4 py-3 bg-amber-50 md:w-auto w-full">
                                    <Clock className="h-4 w-4" /> En Verificación
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Overlay */}
            {selectedOrden && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={(e) => e.target === e.currentTarget && setSelectedOrden(null)}
                >
                    <div className="bg-white border border-primary/10 shadow-2xl w-full max-w-xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="absolute top-0 left-0 w-2 h-full bg-secondary" />
                        
                        <div className="p-8 border-b border-primary/5 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 flex items-center justify-center border border-primary/10 bg-white">
                                    <Upload className="h-5 w-5 text-secondary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-primary uppercase tracking-widest">Subir Comprobante</h3>
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{selectedOrden.vehiculo.placa} - #{selectedOrden.codigo}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedOrden(null)} className="text-primary/20 hover:text-secondary transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="p-8 pb-4">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className={LabelClass}>Kilometraje Actual</label>
                                        <input
                                            name="kilometraje"
                                            type="number"
                                            required
                                            placeholder="EJ: 50000"
                                            className={InputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className={LabelClass}>Costo Total Invertido ($)</label>
                                        <input
                                            name="costo"
                                            type="number"
                                            required
                                            placeholder="EJ: 150000"
                                            className={InputClass}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className={LabelClass}>Factura / Recibo (Foto o Doc)</label>
                                        <input
                                            name="comprobante"
                                            type="file"
                                            accept="image/*,application/pdf"
                                            required
                                            className={cn(InputClass, "pt-4 bg-white")}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className={LabelClass}>Notas Adicionales</label>
                                        <textarea
                                            name="observaciones"
                                            placeholder="DETALLES IMPORTANTES SOBRE EL MANTENIMIENTO..."
                                            className={cn(InputClass, "h-24 py-4 resize-none")}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-primary/5">
                                <button type="button" onClick={() => setSelectedOrden(null)} className="h-14 rounded-none bg-white border border-primary/10 text-slate-900 hover:text-primary hover:bg-slate-100 px-8 text-[11px] font-black uppercase tracking-widest transition-all">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={isSubmitting} className="h-14 rounded-none bg-slate-900 text-white hover:bg-slate-800 px-10 text-[11px] font-black uppercase tracking-widest gap-2 transition-all shadow-xl flex items-center justify-center">
                                    {isSubmitting ? "Enviando..." : "Subir Comprobante"}
                                    {!isSubmitting && <Upload className="h-4 w-4 ml-2 text-emerald-400" />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

