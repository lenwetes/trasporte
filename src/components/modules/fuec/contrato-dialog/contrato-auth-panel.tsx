"use client";

import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User, Fingerprint } from "lucide-react";
import { FastResponsable } from "./types";

interface ContratoAuthPanelProps {
    fastResponsables: FastResponsable[];
}

export function ContratoAuthPanel({ fastResponsables }: ContratoAuthPanelProps) {
    const { control, setValue } = useFormContext();

    return (
        <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] pl-1">Autorización y Firma</p>
            <div className="grid grid-cols-1 sm:grid-cols-12 border border-primary/10 bg-slate-50/50 overflow-hidden transition-all focus-within:border-primary/40 focus-within:shadow-xl group/auth">
                <FormField
                    control={control}
                    name="responsableNombre"
                    render={({ field }) => (
                        <FormItem className="sm:col-span-8 space-y-0 border-b sm:border-b-0 sm:border-r border-primary/5">
                            <FormControl>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <Input 
                                        {...field} 
                                        list="responsables-list"
                                        placeholder="NOMBRE DEL RESPONSABLE" 
                                        className="h-16 pl-14 pr-4 border-none rounded-none focus-visible:ring-0 font-black text-xs uppercase tracking-widest bg-transparent" 
                                        onChange={(e) => {
                                            field.onChange(e);
                                            const hit = fastResponsables.find(c => c.nombre === e.target.value.toUpperCase());
                                            if (hit && hit.cedula) setValue("responsableCedula", hit.cedula);
                                        }}
                                    />
                                    <datalist id="responsables-list">
                                        {fastResponsables.map((c, i) => <option key={i} value={c.nombre} />)}
                                    </datalist>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="responsableCedula"
                    render={({ field }) => (
                        <FormItem className="sm:col-span-4 space-y-0">
                            <FormControl>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors">
                                        <Fingerprint className="h-5 w-5" />
                                    </div>
                                    <Input 
                                        {...field} 
                                        placeholder="C.C. / NIT" 
                                        className="h-16 pl-14 pr-4 border-none rounded-none focus-visible:ring-0 font-mono font-bold text-xs uppercase tracking-widest bg-transparent" 
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
