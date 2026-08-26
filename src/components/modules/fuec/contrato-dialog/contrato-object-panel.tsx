"use client";

import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileText } from "lucide-react";

export function ContratoObjectPanel() {
    const { control } = useFormContext();

    return (
        <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] pl-1">Objeto Operativo</p>
            <FormField
                control={control}
                name="objeto"
                render={({ field }) => (
                    <FormItem className="space-y-0">
                        <FormControl>
                            <div className="relative group border border-primary/10 bg-slate-50/50 overflow-hidden transition-all focus-within:border-primary/40 focus-within:shadow-xl">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <Input 
                                    {...field} 
                                    placeholder="EJ: SERVICIO DE TRANSPORTE ESCOLAR / EMPRESARIAL" 
                                    className="h-16 pl-14 pr-4 border-none rounded-none focus-visible:ring-0 font-bold text-xs uppercase tracking-widest bg-transparent italic" 
                                />
                            </div>
                        </FormControl>
                        <p className="text-[8px] font-black text-primary uppercase tracking-widest mt-2 pl-1 italic">Sincronización automática con extractos FUEC vigentes</p>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
