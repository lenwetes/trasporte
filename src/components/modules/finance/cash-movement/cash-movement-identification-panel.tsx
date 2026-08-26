"use client";

import { useFormContext } from "react-hook-form";
import { FileText, UserPlus } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { CashMovementFormData } from "./use-cash-movement-form";
import type { ConceptoWithCuenta, TerceroData, FinanceMetadata } from "./types";

interface CashMovementIdentificationPanelProps {
    conceptosDisponibles: ConceptoWithCuenta[];
    terceroData: TerceroData | null;
    setTerceroData: (val: TerceroData | null) => void;
    setShowProviderDialog: (val: boolean) => void;
    metadata: FinanceMetadata | null;
}

export function CashMovementIdentificationPanel({
    conceptosDisponibles,
    terceroData,
    setTerceroData,
    setShowProviderDialog,
    metadata
}: CashMovementIdentificationPanelProps) {
    const { control } = useFormContext<CashMovementFormData>();

    return (
        <div className="lg:col-span-7 space-y-10">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-slate-50 border border-slate-200 flex items-center justify-center text-primary/40">
                    <FileText size={18} />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Identificación y Origen</span>
                    <span className="text-[8px] font-bold text-slate-900 uppercase tracking-widest leading-none mt-1">Metadatos de la Operación</span>
                </div>
            </div>

            <div className="space-y-8 pl-14">
                <FormField
                    control={control}
                    name="conceptoId"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-[9px] font-black uppercase text-slate-900 tracking-[0.2em]">Concepto de Operación</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-12 rounded-none border border-slate-200 text-[11px] font-bold uppercase focus:border-primary focus:ring-0 transition-all bg-white shadow-sm">
                                        <SelectValue placeholder="SELECCIONAR..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-none border border-primary/20 shadow-2xl">
                                    {conceptosDisponibles.map((c) => (
                                        <SelectItem key={c.id} value={c.id} className="text-[10px] font-bold uppercase py-3">{c.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2 flex flex-col">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black uppercase text-slate-900 tracking-[0.2em]">Tercero Vinculado</span>
                            <button 
                                type="button" 
                                onClick={() => setShowProviderDialog(true)}
                                className="text-[8px] font-black uppercase text-primary hover:text-accent flex items-center gap-1.5 transition-colors"
                            >
                                <UserPlus size={10} /> CREAR TERCERO
                            </button>
                        </div>
                        <Select value={terceroData?.id || ""} onValueChange={(val) => {
                            const p = metadata?.proveedores.find(p => p.id === val);
                            const u = metadata?.usuarios.find(u => u.id === val);
                            if (p) setTerceroData({ id: val, type: "provider", nombres: p.nombres, documento: p.numeroDocumento || "" });
                            else if (u) setTerceroData({ id: val, type: "user", nombres: u.nombres, apellidos: u.apellidos, documento: u.numeroDocumento || "" });
                            else setTerceroData(null);
                        }}>
                            <SelectTrigger className="h-12 rounded-none border border-slate-200 text-[10px] font-bold uppercase bg-white shadow-sm w-full">
                                <SelectValue placeholder="BUSCAR..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-none border border-primary/20 shadow-2xl">
                                {metadata?.usuarios.length ? (
                                    <div className="px-3 py-2 text-[8px] font-black text-slate-900 uppercase tracking-widest border-b border-slate-50 mb-1">Cuentas Internas</div>
                                ) : null}
                                {metadata?.usuarios.map((u) => (
                                    <SelectItem key={u.id} value={u.id} className="text-[10px] font-bold py-2">{u.nombres} {u.apellidos}</SelectItem>
                                ))}
                                {metadata?.proveedores.length ? (
                                    <div className="px-3 py-2 text-[8px] font-black text-slate-900 uppercase tracking-widest border-b border-slate-50 mt-4 mb-1">Proveedores Externos</div>
                                ) : null}
                                {metadata?.proveedores.map((p) => (
                                    <SelectItem key={p.id} value={p.id} className="text-[10px] font-bold py-2 text-accent">{p.nombres}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <FormField
                        control={control}
                        name="fechaOperacion"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel className="text-[9px] font-black uppercase text-slate-900 tracking-[0.2em]">Fecha Contable</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="date" 
                                        value={field.value ? field.value.toISOString().split('T')[0] : ""} 
                                        onChange={(e) => field.onChange(new Date(e.target.value))}
                                        className="h-12 rounded-none border border-slate-200 text-[11px] font-mono font-bold bg-white shadow-sm focus:border-primary focus:ring-0"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={control}
                    name="descripcion"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-[9px] font-black uppercase text-slate-900 tracking-[0.2em]">Observación de Auditoría</FormLabel>
                            <FormControl>
                                <Textarea {...field} className="min-h-[140px] rounded-none border border-slate-200 text-[11px] font-medium uppercase resize-none bg-white p-4 shadow-sm focus:border-primary transition-all placeholder:text-slate-400" placeholder="Justificación técnica sustentada..." />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
