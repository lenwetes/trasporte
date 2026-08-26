"use client";

import { useState, useEffect } from "react";
import { upsertResolucion } from "@/actions/finance/settings";
import { toast } from "sonner";
import { 
    X, 
    FileText, 
    Calendar, 
    Hash, 
    ShieldCheck, 
    Save, 
    Loader2,
    Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface Resolucion {
    id: string;
    tipo: string;
    prefijo: string | null;
    numero: string;
    consecutivoDesde: number;
    consecutivoHasta: number;
    actual: number;
    fechaInicio?: Date | string;
    fechaFin?: Date | string;
    activa: boolean;
}

interface ResolucionDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onSuccess: () => void;
    initialData?: Resolucion | null;
}

export function ResolucionDialog({
    open,
    setOpen,
    onSuccess,
    initialData,
}: ResolucionDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        tipo: "FACTURA_VENTA",
        prefijo: "",
        numero: "",
        consecutivoDesde: 1,
        consecutivoHasta: 1000,
        actual: 0,
        fechaInicio: "",
        fechaFin: "",
        activa: true,
    });

    useEffect(() => {
        if (open) {
            setFormData({
                id: initialData?.id || "",
                tipo: initialData?.tipo || "FACTURA_VENTA",
                prefijo: initialData?.prefijo || "",
                numero: initialData?.numero || "",
                consecutivoDesde: initialData?.consecutivoDesde || 1,
                consecutivoHasta: initialData?.consecutivoHasta || 1000,
                actual: initialData?.actual || 0,
                fechaInicio: initialData?.fechaInicio
                    ? new Date(initialData.fechaInicio).toISOString().split("T")[0]
                    : "",
                fechaFin: initialData?.fechaFin
                    ? new Date(initialData.fechaFin).toISOString().split("T")[0]
                    : "",
                activa: initialData?.activa ?? true,
            });
        }
    }, [open, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.numero || !formData.fechaInicio || !formData.fechaFin) {
            return toast.error("Número de resolución y fechas son obligatorios");
        }

        setLoading(true);
        try {
            const res = await upsertResolucion({
                ...formData,
                consecutivoDesde: Number(formData.consecutivoDesde),
                consecutivoHasta: Number(formData.consecutivoHasta),
                actual: Number(formData.actual),
                fechaInicio: new Date(formData.fechaInicio),
                fechaFin: new Date(formData.fechaFin),
            });

            if (res.success) {
                toast.success("Resolución fiscal actualizada correctamente");
                onSuccess();
                setOpen(false);
            } else {
                toast.error(res.error || "Error al sincronizar con la DIAN");
            }
        } catch (error) {
            toast.error("Fallo técnico en la persistencia de datos");
        } finally {
            setLoading(false);
        }
    };

    const FormLabel = ({ children }: { children: React.ReactNode }) => (
        <Label className="text-[10px] font-black uppercase text-slate-900 tracking-[0.2em] mb-3 block">
            {children}
        </Label>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-xl p-0 border-none bg-transparent shadow-none rounded-none flex flex-col max-h-[95vh] z-[9999]">
                <div className="bg-white border-2 border-primary shadow-2xl relative overflow-hidden flex flex-col h-full ring-8 ring-primary/5 animate-in zoom-in-95 duration-200">
                    {/* Header Sharp */}
                    <div className="p-8 border-b-2 border-primary bg-slate-900 text-white flex justify-between items-center relative overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rotate-45 translate-x-12 -translate-y-12" />
                        
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="h-10 w-10 flex items-center justify-center border border-white/20 bg-white/5">
                                <FileText className="h-5 w-5 text-secondary" />
                            </div>
                            <div>
                                <DialogTitle className="text-[13px] font-black uppercase tracking-[0.3em] leading-none mb-1 text-white">
                                    {formData.id ? "Ajuste de Resolución" : "Nueva Resolución DIAN"}
                                </DialogTitle>
                                <DialogDescription className="text-[9px] font-black text-white uppercase tracking-[0.4em] italic mb-0">
                                    Parámetros de Legalidad Fiscal
                                </DialogDescription>
                            </div>
                        </div>
                        <button 
                            onClick={() => setOpen(false)} 
                            className="h-10 w-10 flex items-center justify-center text-white hover:text-white hover:bg-white/10 transition-all rounded-none"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 bg-white">
                        <div className="p-10 space-y-10">
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 border-b border-slate-100 pb-4 text-slate-900">
                                    <Layers size={16} />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Identificación Fiscal</h3>
                                </div>

                                <div className="space-y-1">
                                    <FormLabel>Tipo de Documento</FormLabel>
                                    <Select 
                                        value={formData.tipo}
                                        onValueChange={(val) => setFormData({ ...formData, tipo: val })}
                                    >
                                        <SelectTrigger className="h-12 w-full rounded-none border border-slate-200 bg-slate-50/50 px-5 text-[11px] font-bold uppercase tracking-widest shadow-inner">
                                            <SelectValue placeholder="SELECCIONAR TIPO..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-none border-2 border-primary shadow-xl">
                                            <SelectItem value="FACTURA_VENTA" className="text-[10px] font-black uppercase tracking-widest py-3">Factura de Venta</SelectItem>
                                            <SelectItem value="EGRESO" className="text-[10px] font-black uppercase tracking-widest py-3">Comprobante de Egreso</SelectItem>
                                            <SelectItem value="INGRESO" className="text-[10px] font-black uppercase tracking-widest py-3">Recibo de Caja (Ingreso)</SelectItem>
                                            <SelectItem value="NOTA_CONTABLE" className="text-[10px] font-black uppercase tracking-widest py-3">Nota Contable</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <FormLabel>Prefijo (Opcional)</FormLabel>
                                        <Input 
                                            placeholder="EJ: FE"
                                            value={formData.prefijo}
                                            onChange={(e) => setFormData({ ...formData, prefijo: e.target.value.toUpperCase() })}
                                            className="h-12 rounded-none border-slate-200 bg-slate-50/50 px-5 text-[12px] font-bold uppercase tracking-widest transition-all shadow-inner focus:border-primary focus:ring-0"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <FormLabel>N° de Resolución</FormLabel>
                                        <Input 
                                            required
                                            placeholder="EJ: 1876..."
                                            value={formData.numero}
                                            onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                                            className="h-12 rounded-none border-slate-200 bg-slate-50/50 px-5 text-[12px] font-bold uppercase tracking-widest transition-all shadow-inner focus:border-primary focus:ring-0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center gap-4 border-b border-slate-100 pb-4 text-slate-900">
                                    <Hash size={16} />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Rangos de Consecutivo</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <FormLabel>Desde</FormLabel>
                                        <Input 
                                            type="number"
                                            value={formData.consecutivoDesde}
                                            onChange={(e) => setFormData({ ...formData, consecutivoDesde: Number(e.target.value) })}
                                            className="h-12 rounded-none border-slate-200 bg-slate-50/50 px-5 text-lg font-black tracking-tight font-mono shadow-inner"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <FormLabel>Hasta</FormLabel>
                                        <Input 
                                            type="number"
                                            value={formData.consecutivoHasta}
                                            onChange={(e) => setFormData({ ...formData, consecutivoHasta: Number(e.target.value) })}
                                            className="h-12 rounded-none border-slate-200 bg-slate-50/50 px-5 text-lg font-black tracking-tight font-mono shadow-inner"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <FormLabel>Actual</FormLabel>
                                        <Input 
                                            type="number"
                                            value={formData.actual}
                                            onChange={(e) => setFormData({ ...formData, actual: Number(e.target.value) })}
                                            className="h-12 rounded-none border-primary/20 bg-slate-50/50 px-5 text-lg font-black tracking-tight text-primary font-mono shadow-inner border-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center gap-4 border-b border-slate-100 pb-4 text-slate-900">
                                    <Calendar size={16} />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Vigencia Temporal</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <FormLabel>Fecha Inicio</FormLabel>
                                        <Input 
                                            type="date"
                                            value={formData.fechaInicio}
                                            onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                                            className="h-12 rounded-none border-slate-200 bg-slate-50/50 px-5 text-[11px] font-bold uppercase tracking-widest shadow-inner"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <FormLabel>Fecha Vencimiento</FormLabel>
                                        <Input 
                                            type="date"
                                            value={formData.fechaFin}
                                            onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                                            className="h-12 rounded-none border-slate-200 bg-slate-50/50 px-5 text-[11px] font-bold uppercase tracking-widest shadow-inner"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-4 mt-auto">
                            <Button 
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="h-12 rounded-none border-slate-200 bg-white text-slate-900 hover:bg-slate-50 px-8 text-[10px] font-black uppercase tracking-[0.2em] transition-all order-2 sm:order-1"
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit"
                                disabled={loading}
                                className="h-12 rounded-none bg-slate-900 text-white hover:bg-primary px-10 text-[10px] font-black uppercase tracking-[0.2em] gap-3 transition-all shadow-xl order-1 sm:order-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Sincronizando...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} className="text-secondary" />
                                        Guardar Resolución
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
