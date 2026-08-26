"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Lock,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Calculator,
    ShieldCheck,
    ArrowRightLeft,
    FileText,
    History
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { closeCash } from "@/actions/finance/cash-movements";
import { toast } from "sonner";

interface CloseCashButtonProps {
    saldoActual: number;
    movimientosHoy: number;
}

export function CloseCashButton({
    saldoActual,
    movimientosHoy,
}: CloseCashButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [saldoFisico, setSaldoFisico] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [step, setStep] = useState<"form" | "success">("form");

    const saldoTeorico = saldoActual;
    const diferencia = saldoFisico ? parseFloat(saldoFisico) - saldoTeorico : 0;
    const squared = Math.abs(diferencia) < 0.01;

    const handleClose = () => {
        setIsOpen(false);
        setStep("form");
        setSaldoFisico("");
        setObservaciones("");
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const result = await closeCash({
                fecha: new Date(),
                saldoTeorico: saldoTeorico,
                saldoFisico: parseFloat(saldoFisico),
                observaciones: observaciones,
            });

            if (result.success) {
                setStep("success");
                toast.success("Cierre de caja registrado exitosamente");
            } else {
                toast.error(result.error || "Error al realizar el cierre");
            }
        } catch {
            toast.error("Error inesperado");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Button
                variant="outline"
                onClick={() => setIsOpen(true)}
                className="h-10 rounded-none border-primary/10 bg-white hover:bg-slate-50 text-[10px] font-black uppercase tracking-widest gap-2 shadow-sm"
            >
                <Lock className="h-4 w-4 text-slate-900" />
                Sincronizar Cierre de Caja
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md p-0 rounded-none border-none overflow-hidden sm:max-w-[500px]">
                    {step === "form" ? (
                        <div className="bg-white">
                            <DialogHeader className="p-8 bg-primary text-white">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-white/10 flex items-center justify-center border border-white/20">
                                        <Calculator className="h-6 w-6 text-accent" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <DialogTitle className="text-lg font-black uppercase tracking-tighter">Protocolo de Cierre</DialogTitle>
                                        <DialogDescription className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                                            Conciliación Técnica de Flujo Moneda v1.0
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="p-8 space-y-8">
                                {/* Resumen Estadístico */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 border border-primary/5 space-y-1">
                                        <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Saldo Contable (LIBROS)</p>
                                        <p className="text-xl font-black font-mono tracking-tighter text-primary">
                                            {formatCurrency(saldoTeorico)}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-slate-50 border border-primary/5 space-y-1">
                                        <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Eventos de Caja</p>
                                        <p className="text-xl font-black font-mono tracking-tighter text-primary">
                                            {movimientosHoy.toString().padStart(2, '0')} <span className="text-[9px] text-muted-foreground uppercase">OPS</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Entrada Saldo Físico */}
                                <div className="space-y-3">
                                    <Label htmlFor="saldo_fisico" className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] px-1">
                                        Confirmación Saldo Físico (ARQUEO)
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20 font-black text-lg">$</div>
                                        <Input
                                            id="saldo_fisico"
                                            type="number"
                                            value={saldoFisico}
                                            onChange={(e) => setSaldoFisico(e.target.value)}
                                            placeholder="0.00"
                                            className="h-16 pl-10 rounded-none border-2 border-primary/10 text-3xl font-black font-mono tracking-tighter focus-visible:border-accent transition-all"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {/* Diferencia (Feedback Visual) */}
                                {saldoFisico && (
                                    <div className={cn(
                                        "p-4 flex items-center gap-4 border transition-all animate-in zoom-in-95 duration-200",
                                        squared 
                                            ? "bg-accent/5 border-accent text-accent" 
                                            : "bg-red-50 border-red-200 text-red-600"
                                    )}>
                                        <div className="h-10 w-10 flex items-center justify-center bg-white/50 shrink-0">
                                            {squared ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[9px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">Margen de Descuadre Contable</p>
                                            <p className="text-xl font-black font-mono tracking-tighter leading-none">
                                                {formatCurrency(diferencia)}
                                            </p>
                                        </div>
                                        {squared && <ShieldCheck className="h-5 w-5 opacity-40" />}
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <Label htmlFor="obs_cierre" className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] px-1">
                                        Novedades & Observaciones de Auditoría
                                    </Label>
                                    <Textarea
                                        id="obs_cierre"
                                        value={observaciones}
                                        onChange={(e) => setObservaciones(e.target.value)}
                                        placeholder="Justifique aquí los descuadres o anomalías detectadas en el arqueo físico..."
                                        className="min-h-[100px] rounded-none border-primary/10 bg-slate-50 text-[11px] font-medium uppercase tracking-tight resize-none"
                                    />
                                </div>
                            </div>

                            <DialogFooter className="p-8 bg-slate-50 border-t border-primary/5 flex flex-col sm:flex-row gap-4">
                                <Button variant="ghost" onClick={handleClose} className="rounded-none font-black text-[10px] uppercase tracking-widest h-12 flex-1">
                                    Descartar Proceso
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !saldoFisico}
                                    className="bg-primary hover:bg-primary/90 text-white rounded-none font-black text-[10px] uppercase tracking-[0.15em] h-12 px-8 flex-1 gap-2 shadow-xl"
                                >
                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                                        <>
                                            <ShieldCheck className="h-4 w-4" />
                                            CERTIFICAR CIERRE TÉCNICO
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </div>
                    ) : (
                        <div className="p-12 text-center bg-white space-y-8 animate-in fade-in duration-500">
                            <div className="flex justify-center">
                                <div className="h-24 w-24 bg-accent/10 flex items-center justify-center border-4 border-accent relative">
                                    <div className="absolute inset-0 border border-accent m-1" />
                                    <ShieldCheck className="h-12 w-12 text-accent" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-black text-primary uppercase tracking-tighter">Auditoría Finalizada</h3>
                                <div className="h-1 w-12 bg-accent mx-auto" />
                                <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed max-w-xs mx-auto tracking-widest">
                                    La caja ha sido cerrada correctamente. El bloqueo de transacciones ha sido activado satisfactoriamente para el periodo actual.
                                </p>
                            </div>
                            <Button 
                                onClick={handleClose}
                                className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-none font-black text-[10px] uppercase tracking-[0.3em] gap-3"
                            >
                                CONTINUAR PROTOCOLO <ArrowRightLeft className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
