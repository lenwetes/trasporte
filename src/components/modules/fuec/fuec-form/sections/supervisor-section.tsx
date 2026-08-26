"use client";

import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { FuecInput } from "@/lib/validations/fuec";
import { ShieldAlert, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SupervisorSectionProps {
    form: UseFormReturn<FuecInput>;
    isAdmin?: boolean;
    isForceEnabled: boolean;
}

export function SupervisorSection({
    form,
    isAdmin,
    isForceEnabled,
}: SupervisorSectionProps) {
    if (!isAdmin) return null;

    return (
        <Card className={cn(
            "border-red-500/20 bg-red-50/10 overflow-hidden transition-all duration-300",
            isForceEnabled && "border-red-500/50 bg-red-50/30"
        )}>
            <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "h-10 w-10 flex items-center justify-center transition-colors",
                            isForceEnabled ? "bg-red-500 text-white" : "bg-red-500/10 text-red-500"
                        )}>
                            <ShieldAlert className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-red-700 uppercase tracking-tighter">Modo Supervisor / Forzado</h3>
                            <p className="text-xs text-red-600/60 font-medium">Permite emitir la planilla ignorando bloqueos técnicos.</p>
                        </div>
                    </div>
                    
                    <FormField
                        control={form.control}
                        name="force"
                        render={({ field }: any) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-red-600"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                {isForceEnabled && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Separator className="bg-red-500/10" />
                        <FormField
                            control={form.control}
                            name="justificacion"
                            render={({ field }: any) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-black text-red-700 uppercase tracking-widest flex items-center gap-2">
                                        <AlertTriangle className="h-3 w-3" /> Justificación de la Excepción
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Detalle por qué se autoriza esta planilla fuera de los protocolos estándar..."
                                            className="bg-white border-red-500/20 focus:border-red-500 rounded-none h-24 placeholder:text-red-900/20 text-red-900"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-600" />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-start gap-2 text-[10px] text-red-600/80 font-bold bg-white/50 p-2 border border-red-500/10">
                            <ShieldAlert className="h-3 w-3 shrink-0" />
                            <span>ADVERTENCIA: Esta acción quedará registrada en el log de auditoría con su firma digital.</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// Ensure Separator is imported
import { Separator } from "@/components/ui/separator";
