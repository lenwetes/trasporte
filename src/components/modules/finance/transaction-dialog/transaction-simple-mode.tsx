"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FinanceMetadata } from "./use-transaction-form";
import { Zap, PiggyBank, Coins, ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimpleData {
    conceptoId: string;
    monto: number;
    metodoPago: string;
}

interface SimpleModeProps {
    simpleData: SimpleData;
    setSimpleData: (data: SimpleData) => void;
    metadata: FinanceMetadata | null;
}

/**
 * Modo asistido: concepto + monto + caja/banco → genera asientos automáticamente.
 */
export function TransactionSimpleMode({
    simpleData,
    setSimpleData,
    metadata,
}: SimpleModeProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Concepto */}
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-900 tracking-widest pl-1">
                        ¿Qué concepto estás registrando?
                    </Label>
                    <div className="relative">
                        <select
                            className="w-full h-11 bg-white border border-slate-200 rounded-lg pl-4 pr-10 text-xs font-bold appearance-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 transition-all"
                            value={simpleData.conceptoId}
                            onChange={(e) => setSimpleData({
                                ...simpleData,
                                conceptoId: e.target.value,
                            })}
                        >
                            <option value="">Seleccionar concepto...</option>
                            {metadata?.conceptos.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.nombre?.toUpperCase()}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-900 pointer-events-none" />
                    </div>
                </div>

                {/* Monto */}
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-900 tracking-widest pl-1">
                        Valor Total de la Operación
                    </Label>
                    <div className="relative">
                        <Coins size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-900" />
                        <Input
                            type="number"
                            placeholder="0.00"
                            className="h-11 pl-10 bg-white border-slate-200 font-black text-sm focus:ring-emerald-500/10 focus:border-emerald-500"
                            value={String(simpleData.monto || "")}
                            onChange={(e) => setSimpleData({
                                ...simpleData,
                                monto: Number(e.target.value),
                            })}
                        />
                    </div>
                </div>
            </div>

            {/* Medio de Pago */}
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-900 tracking-widest pl-1">
                    ¿Desde/Hacia dónde se moviliza el dinero?
                </Label>
                <div className="relative">
                    <PiggyBank size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-900" />
                    <select
                        className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-10 text-xs font-bold appearance-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
                        value={simpleData.metodoPago}
                        onChange={(e) => setSimpleData({
                            ...simpleData,
                            metodoPago: e.target.value,
                        })}
                    >
                        <option value="">Seleccionar caja, banco o cartera...</option>
                        {metadata?.cuentas
                            ?.filter((c) => c.codigo.startsWith("11") || c.codigo.startsWith("13"))
                            .map((c) => (
                                <option key={c.id} value={c.id}>
                                    [{c.codigo}] {c.nombre}
                                </option>
                            ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-900 pointer-events-none" />
                </div>
            </div>

            {/* Hint Inteligente */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 flex-shrink-0">
                    <Zap size={16} />
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-1">Generación Automática v5.0</h4>
                    <p className="text-[10px] text-amber-600 font-medium leading-relaxed uppercase tracking-tighter">
                        El sistema generará automáticamente los asientos contables de partida doble vinculando las cuentas PUC maestras.
                    </p>
                </div>
            </div>
        </div>
    );
}
