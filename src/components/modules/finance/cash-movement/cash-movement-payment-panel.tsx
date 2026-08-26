"use client";

import { useFormContext } from "react-hook-form";
import { DollarSign, CreditCard, Plus, X } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MetodoPago } from "@prisma/client";
import { cn } from "@/lib/utils";

import type { CashMovementFormData } from "./use-cash-movement-form";

interface CashMovementPaymentPanelProps {
    fields: any[];
    isSplitMode: boolean;
    append: (val: any) => void;
    remove: (index: number) => void;
    getPenduloValue: () => string;
}

export function CashMovementPaymentPanel({
    fields,
    isSplitMode,
    append,
    remove,
    getPenduloValue
}: CashMovementPaymentPanelProps) {
    const { control } = useFormContext<CashMovementFormData>();

    return (
        <div className="lg:col-span-5 flex flex-col h-full">
            <div className="bg-slate-50/50 border border-slate-200 p-10 flex-1 flex flex-col relative overflow-hidden shadow-sm">
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.02] -rotate-45 translate-x-16 -translate-y-16" />

                <div className="flex items-center justify-between border-b border-primary/10 pb-6 mb-10 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <DollarSign size={14} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Cuantía y Canales</span>
                            <span className="text-[8px] font-bold text-slate-900 uppercase tracking-widest leading-none mt-1">Liquidación de Fondos</span>
                        </div>
                    </div>
                    <div className="bg-primary/5 text-primary text-[8px] px-3 py-1 font-black uppercase tracking-widest border border-primary/10">Data Telemetry</div>
                </div>

                <FormField
                    control={control}
                    name="monto"
                    render={({ field }) => (
                        <FormItem className="mb-12 relative z-10">
                            <div className="flex justify-between items-end mb-4 px-1">
                                <FormLabel className="text-[9px] font-black uppercase text-slate-900 tracking-[0.2em]">Cifra Total de Operación</FormLabel>
                            </div>
                            <FormControl>
                                <div className="relative group/monto">
                                    <div className="absolute inset-0 bg-primary/5 -translate-x-1 -translate-y-1 group-focus-within/monto:translate-x-0 group-focus-within/monto:translate-y-0 transition-transform duration-300" />
                                    <div className="relative bg-white border border-primary/20 shadow-xl overflow-hidden group-focus-within/monto:border-primary transition-colors">
                                        <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 h-10 w-10 text-primary/10" />
                                        <Input 
                                            type="text" 
                                            value={field.value ? new Intl.NumberFormat("es-CO").format(Number(field.value)) : ""}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, "");
                                                field.onChange(val);
                                            }}
                                            className="h-24 pl-20 pr-10 rounded-none border-none text-5xl font-black font-mono tracking-tighter bg-transparent focus:ring-0 transition-all text-primary" 
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-900 uppercase tracking-widest">COP</div>
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="space-y-6 mt-auto relative z-10">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 px-1">
                        <div className="flex items-center gap-2">
                            <CreditCard size={14} className="text-primary/40" />
                            <span>Asignación de Canales</span>
                        </div>
                        {isSplitMode && (
                            <button 
                                type="button" 
                                onClick={() => append({ metodo: MetodoPago.TRANSFERENCIA, monto: "" })} 
                                className="text-primary hover:text-accent font-black text-[9px] uppercase tracking-widest flex items-center gap-2 border-b border-primary/20 pb-0.5 transition-all"
                            >
                                <Plus size={12} /> AÑADIR CANAL
                            </button>
                        )}
                    </div>
                    
                    <div className="space-y-3 pr-2 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                        {fields.map((f, index) => (
                            <div key={f.id} className="bg-white border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="flex gap-3 mb-3">
                                    <FormField
                                        control={control}
                                        name={`pagos.${index}.metodo` as const}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="flex-1 h-10 rounded-none border border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase transition-colors focus:ring-0">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-none border border-primary/20 shadow-2xl">
                                                    <SelectItem value={MetodoPago.EFECTIVO} className="text-[10px] font-bold">FONDO CAJA (EFECTIVO)</SelectItem>
                                                    <SelectItem value={MetodoPago.TRANSFERENCIA} className="text-[10px] font-bold">TRANSF. BANCARIA</SelectItem>
                                                    <SelectItem value={MetodoPago.CHEQUE} className="text-[10px] font-bold">CHEQUE GERENCIA</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {isSplitMode && index > 0 && (
                                        <button type="button" onClick={() => remove(index)} className="w-10 h-10 text-slate-900/50 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center shrink-0 border border-slate-100">
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                                <FormField
                                    control={control}
                                    name={`pagos.${index}.monto` as const}
                                    render={({ field }) => (
                                        <div className="relative">
                                            <Input 
                                                type="text" 
                                                value={index === 0 
                                                    ? (getPenduloValue() ? new Intl.NumberFormat("es-CO").format(Number(getPenduloValue())) : "") 
                                                    : (field.value ? new Intl.NumberFormat("es-CO").format(Number(field.value)) : "")
                                                }
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, "");
                                                    field.onChange(val);
                                                }}
                                                readOnly={index === 0} 
                                                className={cn(
                                                    "h-11 pl-10 rounded-none border border-slate-100 text-[13px] font-black font-mono focus:ring-0",
                                                    index === 0 ? "bg-slate-50 text-slate-900" : "bg-white text-primary border-primary/20"
                                                )} 
                                            />
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary/20" />
                                            {index === 0 && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-900 uppercase tracking-widest">Balance Péndulo</span>}
                                        </div>
                                    )}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
