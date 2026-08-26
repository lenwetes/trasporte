"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileCheck, Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "@/actions/uploads";
import { cn } from "@/lib/utils";
import { CurrencyInput } from "@/components/ui/currency-input";
import { HandlePayParams } from "./use-loan-detail";

interface PaymentCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: HandlePayParams) => Promise<void>;
    initialAmount: number;
    title: string;
    isLiquidation: boolean;
}

export function PaymentCaptureModal({ isOpen, onClose, onConfirm, initialAmount, title, isLiquidation }: PaymentCaptureModalProps) {
    const [monto, setMonto] = useState(initialAmount);
    const [metodo, setMetodo] = useState("EFECTIVO");
    const [soporteUrl, setSoporteUrl] = useState("");
    const [soporteId, setSoporteId] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMonto(Math.round(initialAmount));
            setMetodo("EFECTIVO");
            setSoporteUrl("");
            setSoporteId("");
        }
    }, [isOpen, initialAmount]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", e.target.files[0]);
            const res = await uploadFile(formData);
            if (res.success && res.data) {
                setSoporteUrl(`/api/files/${res.data.nombreUnico}`);
                setSoporteId(res.data.id);
                toast.success("Soporte cargado");
            }
        } finally {
            setIsUploading(false);
        }
    };

    const needsSupport = metodo !== "EFECTIVO";
    const canConfirm = monto > 0 && (!needsSupport || !!soporteUrl) && !isUploading;

    return (
        <Dialog open={isOpen} onOpenChange={(o) => { if (!o) onClose(); }}>
            <DialogContent className="max-w-md rounded-none border-t-8 border-t-emerald-600 p-0 overflow-hidden bg-white shadow-2xl">
                <DialogHeader className="p-6 bg-slate-50 border-b border-slate-100">
                    <DialogTitle className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">{title}</DialogTitle>
                    <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">
                        {isLiquidation ? "Procesar pago final y cierre de expediente" : "Registro de abono a cuota o pago extraordinario"}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-5">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">Monto a Recaudar</p>
                        <CurrencyInput value={monto} onChange={(val) => setMonto(Number(val))} className="bg-slate-50 border-slate-100" />
                        {isLiquidation && (
                            <p className="text-[9px] font-black text-amber-600 uppercase italic">
                                * Se recomienda liquidar el capital total. Los intereses se calcularán al confirmar.
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">Medio de Pago</p>
                        <div className="grid grid-cols-3 gap-2">
                            {(["EFECTIVO", "TRANSFERENCIA", "CHEQUE"] as const).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMetodo(m)}
                                    className={cn(
                                        "h-10 text-[9px] font-black uppercase tracking-tighter border transition-all",
                                        metodo === m ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-900 border-slate-100 hover:border-slate-200"
                                    )}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    {needsSupport && (
                        <div className="space-y-2 animate-in fade-in duration-300">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic">Soporte de Transacción (Obligatorio)</p>
                            <div className="relative h-14 w-full">
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                />
                                <div className={cn(
                                    "h-full border border-dashed flex items-center justify-center gap-3 transition-all",
                                    soporteUrl ? "bg-emerald-50 border-emerald-500" : "bg-slate-50 border-slate-300"
                                )}>
                                    {soporteUrl ? <FileCheck className="text-emerald-600" /> : <Upload className="text-slate-900" />}
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-900">
                                        {isUploading ? "Subiendo..." : (soporteUrl ? "Soporte Vinculado" : "Click para adjuntar")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <Button onClick={onClose} variant="ghost" className="rounded-none font-black uppercase text-[10px] h-12 flex-1">Cancelar</Button>
                    <Button
                        disabled={!canConfirm || loading}
                        onClick={async () => {
                            setLoading(true);
                            await onConfirm({ monto, metodoPago: metodo, soporteUrl: soporteUrl || undefined, soporteId: soporteId || undefined });
                            setLoading(false);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-none font-black uppercase text-[10px] tracking-widest h-12 flex-1 shadow-lg"
                    >
                        {loading ? "PROCESANDO..." : "CONFIRMAR PAGO"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
