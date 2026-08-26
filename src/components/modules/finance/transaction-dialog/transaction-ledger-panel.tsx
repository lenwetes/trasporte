"use client";

import { Scale, Plus, Zap, Hash, CreditCard, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ManualTransactionFormData, FinanceMetadata } from "./use-transaction-form";

interface SimpleData {
    conceptoId: string;
    monto: number;
    metodoPago: string;
}

interface TransactionLedgerPanelProps {
    mode: "simple" | "advanced";
    metadata: FinanceMetadata | null;
    simpleData: SimpleData;
    setSimpleData: (val: SimpleData) => void;
    formData: ManualTransactionFormData;
    handleAddAsiento: () => void;
    handleRemoveAsiento: (i: number) => void;
    updateAsiento: (index: number, key: string, value: string | number) => void;
}

const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
        {children}
    </label>
);

const InputClass = "h-12 w-full rounded-none border-primary/10 bg-slate-50 px-4 text-xs font-bold uppercase tracking-widest focus:border-primary focus:ring-0 transition-all placeholder:text-primary/10";

export function TransactionLedgerPanel({
    mode,
    metadata,
    simpleData,
    setSimpleData,
    formData,
    handleAddAsiento,
    handleRemoveAsiento,
    updateAsiento
}: TransactionLedgerPanelProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end border-b-2 border-primary/10 pb-4">
                <Label><Scale size={14} className="text-slate-900" /> Libro Mayor / Asientos Contables</Label>
                {mode === "advanced" && (
                    <Button 
                        type="button" 
                        onClick={handleAddAsiento}
                        className="h-9 bg-primary text-white rounded-none text-[9px] font-black uppercase tracking-widest gap-2 px-6 hover:bg-slate-800 transition-all shadow-lg"
                    >
                        <Plus size={12} /> Añadir Fila
                    </Button>
                )}
            </div>

            {mode === "simple" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-white border border-primary/10 shadow-sm animate-in fade-in duration-500">
                    <div className="space-y-4">
                        <Label><Zap size={14} className="text-secondary" /> Concepto Maestro</Label>
                        <select 
                            value={simpleData.conceptoId} 
                            onChange={(e) => setSimpleData({ ...simpleData, conceptoId: e.target.value })}
                            className={cn(InputClass, "font-black italic appearance-none bg-slate-50 border-primary/5")}
                        >
                            <option value="">SELECCIONAR...</option>
                            {metadata?.conceptos.map((c) => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-4">
                        <Label><Hash size={14} className="text-emerald-500" /> Valor de Operación</Label>
                        <div className="relative">
                            <div className="absolute left-0 top-0 h-full w-12 flex items-center justify-center bg-emerald-50 border-r border-emerald-100 font-black text-emerald-600 text-xs">$</div>
                            <input 
                                type="number" 
                                value={simpleData.monto || ""} 
                                onChange={(e) => setSimpleData({ ...simpleData, monto: Number(e.target.value) })}
                                className={cn(InputClass, "pl-16 font-mono text-sm bg-emerald-50/20 border-emerald-500/10 focus:border-emerald-500")}
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Label><CreditCard size={14} className="text-blue-500" /> Origen / Destino Fondos</Label>
                        <select 
                            value={simpleData.metodoPago} 
                            onChange={(e) => setSimpleData({ ...simpleData, metodoPago: e.target.value })}
                            className={cn(InputClass, "font-black italic appearance-none bg-blue-50/20 border-blue-500/10 focus:border-blue-500")}
                        >
                            <option value="">SELECCIONAR CUENTA...</option>
                            {metadata?.cuentas?.filter((c) => c.codigo.startsWith("11")).map((c) => (
                                <option key={c.id} value={c.id}>[{c.codigo}] {c.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>
            ) : (
                <div className="bg-white border border-primary/10 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-white">
                                <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.3em] border-r border-white/5">Código / Descripción Cuenta</th>
                                <th className="px-6 py-4 text-right text-[9px] font-black uppercase tracking-[0.3em] border-r border-white/5 w-44">Débito (+)</th>
                                <th className="px-6 py-4 text-right text-[9px] font-black uppercase tracking-[0.3em] border-r border-white/5 w-44">Crédito (-)</th>
                                <th className="px-6 py-4 text-center text-[9px] font-black uppercase tracking-[0.3em] w-20">Cmd</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                             {formData.asientos.map((a, i: number) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-4 py-2 border-r border-primary/5">
                                        <select 
                                            value={a.cuentaId} 
                                            onChange={(e) => updateAsiento(i, "cuentaId", e.target.value)}
                                            className="w-full h-10 bg-transparent border-none text-[11px] font-bold uppercase tracking-tight focus:ring-0 cursor-pointer"
                                        >
                                            <option value="">SELECCIONE CUENTA...</option>
                                            {metadata?.cuentas.map((c) => (
                                                <option key={c.id} value={c.id}>[{c.codigo}] {c.nombre}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-0 py-0 border-r border-primary/5">
                                        <input 
                                            type="number" 
                                            value={a.debito || ""} 
                                            onChange={(e) => updateAsiento(i, "debito", Number(e.target.value))}
                                            className="w-full h-14 bg-transparent border-none text-right font-mono text-xs font-bold text-emerald-600 focus:ring-2 focus:ring-emerald-500/20 px-6 transition-all"
                                        />
                                    </td>
                                    <td className="px-0 py-0 border-r border-primary/5">
                                        <input 
                                            type="number" 
                                            value={a.credito || ""} 
                                            onChange={(e) => updateAsiento(i, "credito", Number(e.target.value))}
                                            className="w-full h-14 bg-transparent border-none text-right font-mono text-xs font-bold text-red-600 focus:ring-2 focus:ring-red-500/20 px-6 transition-all"
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <button 
                                            type="button"
                                            onClick={() => handleRemoveAsiento(i)}
                                            className="h-10 w-10 flex items-center justify-center text-primary/10 hover:text-red-500 hover:bg-red-50 transition-all group-hover:opacity-100 opacity-0"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
