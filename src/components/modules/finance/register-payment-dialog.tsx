"use client";

import { useState } from "react";
import { registerPaymentAction } from "@/actions/finance";
import { formatCurrency } from "@/lib/utils";
import { 
    X, 
    CreditCard, 
    Banknote, 
    Building, 
    Smartphone, 
    ShieldCheck, 
    ArrowRight,
    Activity,
    CheckCircle2,
    Calendar,
    Hash,
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
import { toast } from "sonner";

interface RegisterPaymentDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    obligacion: {
        id: string;
        tipo: string;
        saldoPendiente: number;
        usuarioId: string;
        periodo: string;
    };
}

export function RegisterPaymentDialog({
    open,
    setOpen,
    obligacion,
}: RegisterPaymentDialogProps) {
    const [loading, setLoading] = useState(false);

    const handlePay = async (metodo: "EFECTIVO" | "CONSIGNACION" | "TRANSFERENCIA") => {
        setLoading(true);
        try {
            const result = await registerPaymentAction({
                obligacionId: obligacion.id,
                monto: Number(obligacion.saldoPendiente),
                metodoPago: metodo,
            });

            if (result.success) {
                toast.success("Liquidación de obligación procesada exitosamente.");
                setOpen(false);
            } else {
                toast.error(result.error || "No se pudo procesar el pago.");
            }
        } catch (error) {
            toast.error("Error crítico: Fallo en la conexión con el servidor de pagos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none rounded-none flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300 z-[9999]">
                <div className="bg-white border-2 border-primary shadow-2xl relative overflow-hidden flex flex-col h-full ring-8 ring-primary/5">
                    {/* Indicador de Tipo Sharp */}
                    <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
                    
                    {/* Header Auditoría */}
                    <div className="p-8 border-b-2 border-primary bg-slate-900 text-white relative shrink-0">
                        <div className="flex justify-between items-start relative z-10">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-white">
                                    <div className="h-10 w-10 flex items-center justify-center border-2 border-white/20 bg-white/10">
                                        <CreditCard className="h-5 w-5 text-accent" />
                                    </div>
                                    <DialogTitle className="text-[14px] font-black uppercase tracking-[0.3em] leading-none mb-1 text-white">
                                        Cierre de Obligación
                                    </DialogTitle>
                                </div>
                                <div className="flex items-center gap-3 pl-14">
                                    <DialogDescription className="text-[9px] font-black text-white uppercase tracking-[0.2em] mb-0">
                                        {obligacion.tipo}
                                    </DialogDescription>
                                    <span className="h-1 w-1 rounded-full bg-white/20" />
                                    <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">PERIODO {obligacion.periodo}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setOpen(false)} 
                                className="h-8 w-8 flex items-center justify-center text-white hover:text-white hover:bg-white/10 transition-all rounded-none"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="p-10 space-y-10 bg-white overflow-y-auto custom-scrollbar">
                        {/* Visualización de Importe */}
                        <div className="p-8 bg-slate-50 border-2 border-primary/5 shadow-inner relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 text-primary/5 group-hover:text-primary/10 transition-colors">
                                <Activity size={100} />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-4">Monto Total a Liquidar</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-3xl font-black text-primary tracking-tighter font-mono">{formatCurrency(obligacion.saldoPendiente)}</h3>
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">COP</span>
                                </div>
                            </div>
                        </div>

                        {/* Canales de Dispersión */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b-2 border-primary/10 pb-4">
                                <Smartphone size={16} className="text-slate-900" />
                                <h4 className="text-[10px] font-black text-primary/60 uppercase tracking-[0.4em]">Seleccionar Método de Abono</h4>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <button 
                                    disabled={loading}
                                    onClick={() => handlePay("EFECTIVO")}
                                    className="h-16 w-full flex items-center justify-between px-8 border-2 border-primary/10 bg-white hover:bg-primary hover:text-white hover:border-primary transition-all group rounded-none"
                                >
                                    <div className="flex items-center gap-4">
                                        <Banknote size={20} className="text-primary group-hover:text-white transition-colors" />
                                        <span className="text-[11px] font-black uppercase tracking-widest text-primary/60 group-hover:text-white">Efectivo / Caja Física</span>
                                    </div>
                                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>

                                <button 
                                    disabled={loading}
                                    onClick={() => handlePay("CONSIGNACION")}
                                    className="h-16 w-full flex items-center justify-between px-8 border-2 border-primary/10 bg-white hover:bg-primary hover:text-white hover:border-primary transition-all group rounded-none"
                                >
                                    <div className="flex items-center gap-4">
                                        <Building size={20} className="text-primary group-hover:text-white transition-colors" />
                                        <span className="text-[11px] font-black uppercase tracking-widest text-primary/60 group-hover:text-white">Consignación Bancaria</span>
                                    </div>
                                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>

                                <button 
                                    disabled={loading}
                                    onClick={() => handlePay("TRANSFERENCIA")}
                                    className="h-16 w-full flex items-center justify-between px-8 border-2 border-primary/10 bg-white hover:bg-primary hover:text-white hover:border-primary transition-all group rounded-none"
                                >
                                    <div className="flex items-center gap-4">
                                        <CreditCard size={20} className="text-primary group-hover:text-white transition-colors" />
                                        <span className="text-[11px] font-black uppercase tracking-widest text-primary/60 group-hover:text-white">Transferencia Maestro/PSE</span>
                                    </div>
                                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </div>
                        </div>

                        {/* Nota de Auditoría */}
                        <div className="flex items-center gap-4 p-4 border-2 border-primary/10 bg-slate-50 relative overflow-hidden">
                            <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
                            <p className="text-[9px] font-bold text-primary/50 uppercase tracking-widest leading-relaxed">
                                El proceso generará un recibo de recaudo digital sincronizado con el folio del periodo correspondiente.
                            </p>
                        </div>
                    </div>

                    {/* Footer Maestro */}
                    <div className="p-8 bg-slate-50 border-t-2 border-primary flex justify-center items-center shrink-0 mt-auto overflow-hidden">
                        <div className="flex items-center gap-3">
                            {loading ? (
                                <Loader2 size={18} className="animate-spin text-primary" />
                            ) : (
                                <CheckCircle2 size={18} className="text-emerald-500" />
                            )}
                            <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] italic">Seguridad de Transacción Cifrada TLS 1.3</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
