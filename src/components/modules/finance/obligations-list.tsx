"use client";

import { useState } from "react";
import {
    CreditCard,
    Calendar,
    CheckCircle2,
    User,
    ChevronRight,
    Search,
    AlertCircle,
    Landmark,
    ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { RegisterPaymentDialog } from "./register-payment-dialog";

export interface ObligationItem {
    id: string;
    tipo: string;
    saldoPendiente: number | string;
    usuarioId: string;
    periodo: string | Date;
    estado: string;
    fechaVence: string | Date;
    montoInicial: number | string;
    usuario: { nombres: string; apellidos: string };
    vehiculo?: { placa: string } | null;
}

interface ObligationsListProps {
    obligations: ObligationItem[];
}

export function ObligationsList({ obligations }: ObligationsListProps) {
    const [selectedOb, setSelectedOb] = useState<{
        id: string;
        tipo: string;
        saldoPendiente: number;
        usuarioId: string;
        periodo: string;
    } | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openPayment = (ob: ObligationItem) => {
        setSelectedOb({
            id: ob.id,
            tipo: ob.tipo.replace(/_/g, " "),
            saldoPendiente: Number(ob.saldoPendiente),
            usuarioId: ob.usuarioId,
            periodo: (typeof ob.periodo === "string"
                ? ob.periodo
                : new Date(ob.periodo).toISOString()
            ).slice(0, 7),
        });
        setIsDialogOpen(true);
    };

    return (
        <div className="divide-y divide-slate-50">
            {obligations.map((ob: ObligationItem) => (
                <div
                    key={ob.id}
                    className="group flex flex-col lg:flex-row lg:items-center justify-between p-6 hover:bg-slate-50 transition-all gap-8 relative overflow-hidden"
                >
                    {/* Status Indicator Sidebar */}
                    <div className={cn(
                        "absolute left-0 top-0 bottom-0 w-1 transition-all",
                        ob.estado === "PENDIENTE" ? "bg-amber-400 group-hover:w-1.5" : "bg-emerald-500"
                    )} />

                    <div className="flex-1 space-y-6">
                        {/* User/Vehicle Section */}
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white border border-slate-100 text-slate-900 group-hover:text-slate-900 rounded-2xl shadow-sm transition-colors">
                                <User size={22} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-base font-black text-slate-900 leading-tight">
                                    {ob.usuario.nombres} {ob.usuario.apellidos}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <div className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-black rounded uppercase tracking-widest">
                                        {ob.vehiculo?.placa || "N/A"}
                                    </div>
                                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Placa Vinculada</span>
                                </div>
                            </div>
                        </div>

                        {/* Concept & Period Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <span className="text-[10px] font-black uppercase text-slate-900 tracking-widest block">Concepto</span>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <div className="p-1.5 bg-slate-100 rounded-lg">
                                        <CreditCard size={14} />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-tight">
                                        {ob.tipo.replace(/_/g, " ")}
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-900 font-medium pl-1">
                                    Periodo Fiscal: {(typeof ob.periodo === "string" ? ob.periodo : new Date(ob.periodo).toISOString()).slice(0, 7)}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <span className="text-[10px] font-black uppercase text-slate-900 tracking-widest block">Vencimiento</span>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <div className="p-1.5 bg-rose-50 text-rose-500 rounded-lg">
                                        <Calendar size={14} />
                                    </div>
                                    <span className="text-xs font-bold">
                                        {new Date(ob.fechaVence).toLocaleDateString("es-CO", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric"
                                        })}
                                    </span>
                                </div>
                                <div className="pl-1">
                                    <span className={cn(
                                        "text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter",
                                        ob.estado === "PENDIENTE" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                                    )}>
                                        {ob.estado}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <span className="text-[10px] font-black uppercase text-slate-900 tracking-widest block">Cartera Exigible</span>
                                <div className="text-xl font-black text-slate-900 tracking-tighter">
                                    {formatCurrency(Number(ob.saldoPendiente))}
                                </div>
                                <p className="text-[11px] text-slate-900 font-medium pl-1 italic">
                                    Base Inicial: {formatCurrency(Number(ob.montoInicial))}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Section */}
                    <div className="shrink-0 flex items-center lg:items-end justify-between lg:flex-col gap-4 lg:pl-8 lg:border-l lg:border-slate-50">
                        {ob.estado !== "PAGADO" ? (
                            <Button
                                onClick={() => openPayment(ob)}
                                className="bg-slate-900 hover:bg-black text-white h-11 px-8 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all hover:shadow-xl hover:-translate-y-0.5"
                            >
                                Liquidar Pago
                                <ChevronRight size={14} />
                            </Button>
                        ) : (
                            <div className="flex items-center gap-3 px-6 py-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl">
                                <CheckCircle2 size={18} />
                                <span className="text-[11px] font-black uppercase tracking-widest">Consolidado</span>
                            </div>
                        )}
                        <button className="text-[10px] font-black uppercase text-slate-900 hover:text-indigo-600 tracking-widest transition-colors flex items-center gap-1.5 p-1">
                            Ver Detalles
                            <ArrowUpRight size={12} />
                        </button>
                    </div>
                </div>
            ))}

            {selectedOb && (
                <RegisterPaymentDialog
                    open={isDialogOpen}
                    setOpen={setIsDialogOpen}
                    obligacion={selectedOb}
                />
            )}
        </div>
    );
}
