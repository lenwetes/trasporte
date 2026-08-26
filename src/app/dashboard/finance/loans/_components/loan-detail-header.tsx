"use client";

import { Badge } from "@/components/ui/badge";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import { PrestamoWithRelations } from "@/types";

interface LoanDetailHeaderProps {
    loan: PrestamoWithRelations;
}

export function LoanDetailHeader({ loan }: LoanDetailHeaderProps) {
    return (
        <DialogHeader className="p-8 bg-slate-50 border-b border-slate-100">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <Badge className="bg-[#0f172a] text-white rounded-none border-none text-[9px] font-black uppercase italic tracking-tighter shadow-lg">
                            REF: {loan.id.slice(-8).toUpperCase()}
                        </Badge>
                        <DialogTitle className="text-xl font-black text-[#0f172a] uppercase tracking-tighter italic">
                            Control de Crédito Operativo
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] italic">
                        TITULAR: {loan.usuario.nombres} {loan.usuario.apellidos} — MODALIDAD:{" "}
                        {loan.tipo === "FLEXIBLE_DIARIO" ? "CRÉDITO RÁPIDO" : "ESTÁNDAR"}
                    </DialogDescription>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-[#94a3b8] uppercase mb-1 italic tracking-widest">Saldo Pendiente</p>
                    <h3 className="text-3xl font-black text-[#0f172a] tracking-tighter italic">
                        {formatCurrency(Number(loan.saldoActual ?? 0))}
                    </h3>
                </div>
            </div>
        </DialogHeader>
    );
}
