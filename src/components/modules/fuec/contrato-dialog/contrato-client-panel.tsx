"use client";

import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, Fingerprint, UserPlus } from "lucide-react";
import { ClientDialog } from "../client-dialog";
import { FastClient } from "./types";

interface ContratoClientPanelProps {
    fastClients: FastClient[];
}

export function ContratoClientPanel({ fastClients }: ContratoClientPanelProps) {
    const { control, setValue } = useFormContext();

    return (
        <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] pl-1">Información del Contratante</p>
            <div className="grid grid-cols-1 sm:grid-cols-12 border border-primary/10 bg-slate-50/50 overflow-hidden transition-all focus-within:border-primary/40 focus-within:shadow-xl group/client border-t-0 sm:border-t border-primary/10">
                <FormField
                    control={control}
                    name="cliente"
                    render={({ field }) => (
                        <FormItem className="sm:col-span-8 space-y-0 border-b sm:border-b-0 sm:border-r border-primary/5">
                            <FormControl>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <Input 
                                        {...field} 
                                        list="clients-list"
                                        placeholder="NOMBRE DEL CLIENTE / ENTIDAD" 
                                        className="h-16 pl-14 pr-4 border-none rounded-none focus-visible:ring-0 font-black text-xs uppercase tracking-widest bg-transparent" 
                                        onChange={(e) => {
                                            field.onChange(e);
                                            const hit = fastClients.find(c => c.nombre === e.target.value.toUpperCase());
                                            if (hit && hit.nit) setValue("nitCliente", hit.nit);
                                        }}
                                    />
                                    <datalist id="clients-list">
                                        {fastClients.map((c, i) => <option key={i} value={c.nombre} />)}
                                    </datalist>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="nitCliente"
                    render={({ field }) => (
                        <FormItem className="sm:col-span-4 space-y-0">
                            <FormControl>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors">
                                        <Fingerprint className="h-5 w-5" />
                                    </div>
                                    <Input 
                                        {...field} 
                                        placeholder="NIT / RUT" 
                                        className="h-16 pl-14 pr-16 border-none rounded-none focus-visible:ring-0 font-mono font-bold text-xs uppercase tracking-widest bg-transparent" 
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                        <ClientDialog 
                                            onCreated={(client) => {
                                                setValue("cliente", `${client.nombres} ${client.apellidos}`.toUpperCase());
                                                setValue("nitCliente", client.numeroDocumento);
                                            }}
                                            trigger={
                                                <Button variant="ghost" size="icon" type="button" className="h-10 w-10 text-accent hover:bg-accent/10">
                                                    <UserPlus className="h-5 w-5" />
                                                </Button>
                                            }
                                        />
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
