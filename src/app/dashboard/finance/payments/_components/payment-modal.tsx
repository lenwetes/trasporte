"use client";

import { useState, useTransition } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { registerPaymentAction } from "@/actions/finance";
import { toast } from "sonner";
import { DollarSign, Loader2, CreditCard, User, AlertCircle } from "lucide-react";

interface PaymentModalProps {
    obligation: {
        id: string;
        saldoPendiente: number;
        usuario: { nombres: string; apellidos: string };
        fechaVence: Date;
    };
    onSuccess?: () => void;
}

export function PaymentModal({ obligation, onSuccess }: PaymentModalProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [amount, setAmount] = useState(String(obligation.saldoPendiente));
    const [method, setMethod] = useState("EFECTIVO");

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        const amountNum = Number(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            toast.error("Monto inválido");
            return;
        }
        if (amountNum > Number(obligation.saldoPendiente)) {
            toast.error("El monto excede el saldo pendiente");
            return;
        }

        startTransition(async () => {
            const result = await registerPaymentAction({
                obligacionId: obligation.id,
                monto: amountNum,
                metodoPago: method,
            });

            if (result.success) {
                toast.success("Pago registrado exitosamente");
                setOpen(false);
                if (onSuccess) onSuccess();
            } else {
                toast.error(result.error || "Error al registrar el pago");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="premium" className="h-9 px-4">
                    <DollarSign size={14} className="text-accent" />
                    Pagar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] rounded-none p-0 overflow-hidden border border-primary/10 shadow-2xl">
                <DialogHeader className="p-8 bg-primary text-white">
                    <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-white/10 border border-white/10">
                            <CreditCard size={20} className="text-accent" />
                        </div>
                        Registrar Pago
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handlePayment} className="p-8 space-y-8 bg-white">
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-none space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <User size={14} className="text-slate-900" />
                                <span className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Responsable</span>
                            </div>
                            <span className="text-sm font-bold text-slate-700">
                                {obligation.usuario.nombres} {obligation.usuario.apellidos}
                            </span>
                        </div>
                        <div className="h-px bg-slate-200/50" />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <DollarSign size={14} className="text-slate-900" />
                                <span className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Saldo Pendiente</span>
                            </div>
                            <span className="text-lg font-black text-rose-600 tracking-tighter">
                                {new Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                    maximumFractionDigits: 0
                                }).format(Number(obligation.saldoPendiente))}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="amount" className="text-xs font-black uppercase text-slate-900 tracking-widest pl-1">
                                Monto a Pagar
                            </Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-900">$</span>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    max={Number(obligation.saldoPendiente)}
                                    className="h-12 pl-8 bg-slate-50 border-slate-100 rounded-none focus:ring-primary/20 text-lg font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="method" className="text-xs font-black uppercase text-slate-900 tracking-widest pl-1">
                                Método de Pago
                            </Label>
                            <Select value={method} onValueChange={setMethod}>
                                <SelectTrigger className="h-12 bg-slate-50 border-slate-100 rounded-none focus:ring-primary/20">
                                    <SelectValue placeholder="Seleccione método" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none border-slate-100">
                                    <SelectItem value="EFECTIVO">Efectivo (Caja)</SelectItem>
                                    <SelectItem value="CONSIGNACION">Consignación Bancaria</SelectItem>
                                    <SelectItem value="TRANSFERENCIA">Transferencia Electrónica</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-slate-50 mt-8">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            className="text-xs font-black uppercase tracking-widest text-slate-900 hover:text-primary transition-colors"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit"
                            disabled={isPending}
                            variant="premium"
                            className="h-12 px-8"
                        >
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="animate-spin text-accent" size={16} />
                                    <span>Procesando...</span>
                                </div>
                            ) : (
                                "Registrar Pago"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
