"use client";

import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormControl, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Hash, FileText } from "lucide-react";

export function ContratoIdentificationPanel() {
    const { control } = useFormContext();

    return (
        <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] pl-1">Identificación y Consecución</p>
            <div className="grid grid-cols-1 sm:grid-cols-12 border border-primary/10 bg-slate-50/50 overflow-hidden transition-all focus-within:border-accent/40 focus-within:shadow-xl group/contract">
                <FormField
                    control={control}
                    name="numeroContrato"
                    render={({ field }) => (
                        <FormItem className="sm:col-span-8 space-y-0 border-b sm:border-b-0 sm:border-r border-primary/5">
                            <FormControl>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors">
                                        <Hash className="h-5 w-5" />
                                    </div>
                                    <Input 
                                        {...field} 
                                        placeholder="NRO. CONTRATO INTERNO" 
                                        className="h-16 pl-14 pr-4 border-none rounded-none focus-visible:ring-0 font-black text-xs uppercase tracking-widest bg-transparent" 
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="consecutivoNumerico"
                    render={({ field }) => (
                        <FormItem className="sm:col-span-4 space-y-0 bg-accent/[0.02]">
                            <FormControl>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-accent/30 group-focus-within:text-accent transition-colors">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <Input
                                        type="number"
                                        {...field}
                                        value={field.value ?? ""}
                                        placeholder="CONSECUTIVO"
                                        className="h-16 pl-14 pr-4 border-none rounded-none focus-visible:ring-0 font-mono font-black text-xs text-accent uppercase tracking-widest bg-transparent"
                                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={control}
                name="esInterno"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-none border border-primary/10 bg-slate-50/50 p-4 shadow-sm transition-all focus-within:border-accent/40">
                        <div className="space-y-0.5">
                            <FormLabel className="text-xs font-black uppercase tracking-widest text-primary">Contrato Interno</FormLabel>
                            <FormDescription className="text-[10px] tracking-wider text-primary/60">
                                Afecta la numeración interna del FUEC generado.
                            </FormDescription>
                        </div>
                        <FormControl>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={field.value} onChange={field.onChange} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                            </label>
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormMessage />
        </div>
    );
}
