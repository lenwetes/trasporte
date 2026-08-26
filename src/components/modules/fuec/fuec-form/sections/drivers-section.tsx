"use client";

import * as React from "react";
import { UseFormReturn, ControllerRenderProps } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Trash2, User, UserPlus, ShieldPlus } from "lucide-react";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { FuecInput } from "@/lib/validations/fuec";
import { DriverSelector } from "../../driver-selector";
import { FuecConductor } from "../types";
import { Card, CardContent } from "@/components/ui/card";

interface DriversSectionProps {
    form: UseFormReturn<FuecInput>;
    conductores: FuecConductor[];
    numConductores: number;
    setNumConductores: (val: number | ((prev: number) => number)) => void;
}

export function DriversSection({
    form,
    conductores,
    numConductores,
    setNumConductores,
}: DriversSectionProps) {
    return (
        <Card className="rounded-none border-none overflow-hidden shadow-2xl bg-white">
            <div className="bg-primary/5 px-6 py-3 border-b border-primary/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/5 flex items-center justify-center border border-primary/5 shadow-inner">
                        <User className="h-5 w-5 text-slate-900" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Conductores Asignados</h3>
                        <p className="text-[9px] font-bold text-slate-900 uppercase tracking-[0.2em] leading-none mt-1">Personal Operativo Certificado</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {numConductores > 1 && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-9 px-4 text-[10px] font-black uppercase tracking-widest rounded-none border border-primary/10 hover:bg-primary/5 gap-2"
                            onClick={() => {
                                const nextNum = numConductores - 1;
                                setNumConductores(nextNum);
                                if (nextNum < 3) form.setValue("conductor3Id", "");
                                if (nextNum < 2) form.setValue("conductor2Id", "");
                            }}
                        >
                            <Trash2 className="h-3 w-3" /> QUITAR
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        className="h-9 px-4 text-[10px] font-black bg-accent text-primary hover:bg-accent/90 rounded-none shadow-xl border border-white/10 gap-2"
                        onClick={() => setNumConductores((prev) => Math.min(prev + 1, 3))}
                        disabled={numConductores >= 3}
                    >
                        <UserPlus className="h-3 w-3" /> AGREGAR RELEVO
                    </Button>
                </div>
            </div>

            <CardContent className="p-8 space-y-8 bg-slate-50/50">
                <FormField
                    control={form.control}
                    name="conductor1Id"
                    render={({ field }: { field: ControllerRenderProps<FuecInput, "conductor1Id"> }) => (
                        <FormItem>
                            <FormControl>
                                <DriverSelector
                                    label="OPERADOR PRINCIPAL (MANDO 1)"
                                    value={field.value}
                                    onChange={field.onChange}
                                    initialDrivers={conductores}
                                    description={
                                        conductores.find(
                                            (c) => c.id === field.value,
                                        )?.nombre
                                    }
                                />
                            </FormControl>
                            <FormMessage className="text-[10px] uppercase font-bold text-red-600 mt-2" />
                        </FormItem>
                    )}
                />

                {numConductores >= 2 && (
                    <div className="relative pt-6 border-t border-primary/5 group">
                        <div className="absolute -top-3 left-4 bg-primary text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 flex items-center gap-2 shadow-lg">
                            <ShieldPlus className="h-2.5 w-2.5" /> RELEVO #1 ADICIONAL
                        </div>
                        <FormField
                            control={form.control}
                            name="conductor2Id"
                            render={({ field }: { field: ControllerRenderProps<FuecInput, "conductor2Id"> }) => (
                                <FormItem>
                                    <FormControl>
                                        <DriverSelector
                                            label="OPERADOR DE RELEVO (MANDO 2)"
                                            value={field.value}
                                            onChange={field.onChange}
                                            initialDrivers={conductores}
                                            description={
                                                conductores.find(
                                                    (c) => c.id === field.value,
                                                )?.nombre
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] uppercase font-bold text-red-600 mt-2" />
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                {numConductores >= 3 && (
                    <div className="relative pt-6 border-t border-primary/5">
                        <div className="absolute -top-3 left-4 bg-primary text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 flex items-center gap-2 shadow-lg">
                            <ShieldPlus className="h-2.5 w-2.5" /> APOYO #2 EXTRAORDINARIO
                        </div>
                        <FormField
                            control={form.control}
                            name="conductor3Id"
                            render={({ field }: { field: ControllerRenderProps<FuecInput, "conductor3Id"> }) => (
                                <FormItem>
                                    <FormControl>
                                        <DriverSelector
                                            label="OPERADOR DE APOYO (MANDO 3)"
                                            value={field.value}
                                            onChange={field.onChange}
                                            initialDrivers={conductores}
                                            description={
                                                conductores.find(
                                                    (c) => c.id === field.value,
                                                )?.nombre
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] uppercase font-bold text-red-600 mt-2" />
                                </FormItem>
                            )}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
