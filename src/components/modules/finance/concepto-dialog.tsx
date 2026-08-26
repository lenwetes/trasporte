"use client";

import { useState, useEffect } from "react";
import { upsertConceptoFinanciero } from "@/actions/finance/settings";
import { toast } from "sonner";
import { 
    X, 
    BookOpen, 
    ShieldCheck, 
    Activity, 
    Layers, 
    Save, 
    Scale,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { AccountSelector } from "@/components/modules/finance/account-selector";

export interface Concepto {
    id: string;
    nombre: string;
    cuenta: {
        id: string;
        codigo: string;
        nombre: string;
    } | null;
    valorSugerido: number | null;
    activo: boolean;
}

interface ConceptoDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onSuccess: () => void;
    initialData?: Concepto | null;
}

export function ConceptoDialog({
    open,
    setOpen,
    onSuccess,
    initialData,
}: ConceptoDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        nombre: "",
        cuentaId: "",
        valorSugerido: "" as string | number,
        activo: true,
    });

    // Sincronizar estado cuando se abre para editar
    useEffect(() => {
        if (open) {
            setFormData({
                id: initialData?.id || "",
                nombre: initialData?.nombre || "",
                cuentaId: initialData?.cuenta?.id || "",
                valorSugerido: initialData?.valorSugerido || "",
                activo: initialData?.activo ?? true,
            });
        }
    }, [open, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.nombre || formData.nombre.length < 3) {
            return toast.error("El nombre debe tener al menos 3 caracteres");
        }

        if (!formData.cuentaId) {
            return toast.error("Debe seleccionar una cuenta contable");
        }

        setLoading(true);
        try {
            const res = await upsertConceptoFinanciero({
                id: formData.id || undefined,
                nombre: formData.nombre,
                cuentaId: formData.cuentaId,
                valorSugerido: formData.valorSugerido ? Number(formData.valorSugerido) : null,
                activo: formData.activo
            });

            if (res.success) {
                toast.success("Catálogo maestro actualizado correctamente");
                onSuccess();
                setOpen(false);
            } else {
                toast.error(res.error || "Fallo en la sincronización técnica");
            }
        } catch (error) {
            toast.error("Error crítico en la comunicación con el servidor");
        } finally {
            setLoading(false);
        }
    };

    const Label = ({ children }: { children: React.ReactNode }) => (
        <label className="block text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-3">
            {children}
        </label>
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
                                <BookOpen className="h-5 w-5 text-secondary" />
                            </div>
                            <div>
                                <DialogTitle className="text-[13px] font-black uppercase tracking-[0.3em] leading-none mb-1 text-white">
                                    {formData.id ? "Ajuste de Concepto" : "Nuevo Concepto Maestro"}
                                </DialogTitle>
                                <DialogDescription className="text-[9px] font-black text-white uppercase tracking-[0.4em] italic mb-0">
                                    Configuración de Diccionario Contable
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
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Definición Operativa</h3>
                                </div>
                                
                                <div className="space-y-1">
                                    <Label>Nombre del Concepto</Label>
                                    <input 
                                        required
                                        placeholder="EJ: SERVICIOS PÚBLICOS..."
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value.toUpperCase() })}
                                        className="h-12 w-full rounded-none border border-slate-200 bg-slate-50/50 px-5 text-[12px] font-bold uppercase tracking-widest focus:border-primary focus:ring-0 transition-all shadow-inner"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label>Asignación P.U.C (Libro Mayor)</Label>
                                    <AccountSelector 
                                        selectedId={formData.cuentaId}
                                        onSelect={(id) => setFormData({ ...formData, cuentaId: id })}
                                        placeholder="BUSCAR CUENTA CONTABLE..."
                                    />
                                    {formData.cuentaId && (
                                        <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-emerald-50 border-l-2 border-emerald-500">
                                            <ShieldCheck size={12} className="text-emerald-600" />
                                            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Cuenta vinculada correctamente</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center gap-4 border-b border-slate-100 pb-4 text-slate-900">
                                    <Scale size={16} />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Estimación Financiera</h3>
                                </div>

                                <div className="space-y-1">
                                    <Label>Valor Sugerido (Referencial)</Label>
                                    <div className="relative">
                                        <div className="absolute left-0 top-0 h-full w-12 flex items-center justify-center bg-slate-100 border-r border-slate-200 font-black text-primary text-xs">$</div>
                                        <input 
                                            type="number"
                                            placeholder="0.00"
                                            value={formData.valorSugerido}
                                            onChange={(e) => setFormData({ ...formData, valorSugerido: e.target.value })}
                                            className="h-12 w-full rounded-none border border-slate-200 bg-slate-50/50 pl-16 pr-5 text-lg font-black tracking-tight text-primary focus:border-primary focus:ring-0 transition-all shadow-inner"
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
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} className="text-secondary" />
                                        Guardar Concepto
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
