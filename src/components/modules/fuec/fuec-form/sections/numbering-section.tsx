"use client";

import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FuecInput } from "@/lib/validations/fuec";
import { FuecNumberingSettings } from "../../fuec-numbering-settings";
import { ResolucionFUEC } from "@prisma/client";
import { Hash, AlertTriangle, RefreshCw, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getNextConsecutivos } from "@/actions/fuec";
import { cn } from "@/lib/utils";

interface NumberingSectionProps {
    form: UseFormReturn<FuecInput>;
    isAdmin?: boolean;
    activeResolucion: ResolucionFUEC | null;
    setActiveResolucion: (res: ResolucionFUEC) => void;
    manualNumbering: boolean;
    setManualNumbering: (val: boolean) => void;
    contratoId?: string;
}

export function NumberingSection({
    form,
    isAdmin,
    activeResolucion,
    setActiveResolucion,
    manualNumbering,
    setManualNumbering,
    contratoId,
}: NumberingSectionProps) {
    const [autoValues, setAutoValues] = React.useState<{ s5: number; s6: number } | null>(null);
    const [loading, setLoading] = React.useState(false);

    // Cargar valores auto cuando cambia el contrato
    React.useEffect(() => {
        if (!contratoId) {
            setAutoValues(null);
            return;
        }
        setLoading(true);
        getNextConsecutivos(contratoId).then((res) => {
            if (res.success && res.data) {
                const data = res.data as { s5: number; s6: number };
                setAutoValues(data);
                // Si NO están en modo manual, rellenar automáticamente
                if (!manualNumbering) {
                    form.setValue("consecutivoContrato", data.s5);
                    form.setValue("consecutivoExtracto", data.s6);
                }
            }
        }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contratoId]);

    const s5Value = form.watch("consecutivoContrato");
    const s6Value = form.watch("consecutivoExtracto");

    const s5Preview = String(s5Value ?? autoValues?.s5 ?? 1).padStart(4, "0");
    const s6Preview = String(s6Value ?? autoValues?.s6 ?? 1).padStart(4, "0");

    const handleReset = () => {
        if (autoValues) {
            form.setValue("consecutivoContrato", autoValues.s5);
            form.setValue("consecutivoExtracto", autoValues.s6);
        }
    };

    return (
        <Card className="border-primary/10 overflow-hidden shadow-none">
            {/* Header */}
            <div className="bg-primary/5 px-6 py-3 border-b border-primary/10 flex items-center justify-between font-mono">
                <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-slate-900" />
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Consecutivos del Extracto</span>
                </div>
                {activeResolucion && isAdmin && (
                    <div className="text-[10px] text-slate-900 font-bold bg-white px-2 py-0.5 border border-primary/10 uppercase">
                        RES: {activeResolucion.numeroResolucion}
                    </div>
                )}
            </div>

            <CardContent className="p-0">
                {/* Configuración de resolución (solo admin) */}
                {isAdmin && activeResolucion && (
                    <FuecNumberingSettings
                        resolucion={activeResolucion}
                        onUpdate={(newActual) => {
                            setActiveResolucion({ ...activeResolucion, actual: newActual });
                        }}
                    />
                )}

                <div className="p-6 space-y-5">
                    {/* Preview del número resultante */}
                    {contratoId && (
                        <div className="bg-primary/[0.03] border border-primary/10 p-4 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Vista Previa • Segmentos 5 y 6</p>
                                <p className="font-mono font-black text-primary text-lg tracking-widest">
                                    <span className="text-slate-900">···</span>
                                    <span className={cn("text-accent", manualNumbering && "text-orange-500")}> {s5Preview}</span>
                                    <span className={cn("text-primary", manualNumbering && "text-orange-500")}>{s6Preview}</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {loading && <RefreshCw className="h-4 w-4 animate-spin text-primary" />}
                                {manualNumbering && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleReset}
                                        className="h-7 text-[10px] font-bold text-slate-900 hover:text-primary rounded-none px-3 border border-primary/10"
                                    >
                                        <RefreshCw className="h-3 w-3 mr-1" /> AUTO
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Toggle manual */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-primary/50 uppercase tracking-widest">Numeración Manual</p>
                            <p className="text-[9px] text-primary leading-relaxed max-w-xs">
                                Permite sobrescribir S5 y S6 para emparejar con talonarios físicos anteriores.
                                El sistema valida que no colisione con números ya emitidos.
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant={manualNumbering ? "default" : "outline"}
                            size="sm"
                            className={cn(
                                "h-8 text-[10px] font-bold rounded-none px-4 shrink-0 transition-all",
                                manualNumbering
                                    ? "bg-accent hover:bg-accent/90 text-white border-none"
                                    : "text-primary/60 border-primary/20"
                            )}
                            onClick={() => {
                                const next = !manualNumbering;
                                setManualNumbering(next);
                                if (!next && autoValues) {
                                    // Restaurar auto al quitar manual
                                    form.setValue("consecutivoContrato", autoValues.s5);
                                    form.setValue("consecutivoExtracto", autoValues.s6);
                                }
                            }}
                        >
                            {manualNumbering ? "MANUAL: ACTIVO" : "ACTIVAR MANUAL"}
                        </Button>
                    </div>

                    {/* Campos editables (siempre visibles, solo editables en modo manual) */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="consecutivoContrato"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between items-center mb-1">
                                        <FormLabel className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-0">
                                            S5 — Contrato
                                        </FormLabel>
                                        <span className="text-[8px] font-mono bg-primary/10 px-1 text-primary">4 DÍG.</span>
                                    </div>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder={String(autoValues?.s5 ?? "0001")}
                                            disabled={!manualNumbering}
                                            className={cn(
                                                "border-primary/10 rounded-none h-9 text-xs font-mono",
                                                !manualNumbering ? "bg-primary/[0.02] text-primary/50 cursor-not-allowed" : "bg-white ring-1 ring-accent/30"
                                            )}
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(
                                                e.target.value ? Number(e.target.value) : undefined
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="consecutivoExtracto"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between items-center mb-1">
                                        <FormLabel className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-0">
                                            S6 — Extracto
                                        </FormLabel>
                                        <span className="text-[8px] font-mono bg-primary/10 px-1 text-primary">4 DÍG.</span>
                                    </div>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder={String(autoValues?.s6 ?? "0001")}
                                            disabled={!manualNumbering}
                                            className={cn(
                                                "border-primary/10 rounded-none h-9 text-xs font-mono",
                                                !manualNumbering ? "bg-primary/[0.02] text-primary/50 cursor-not-allowed" : "bg-white ring-1 ring-accent/30"
                                            )}
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(
                                                e.target.value ? Number(e.target.value) : undefined
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {manualNumbering && (
                        <div className="flex items-start gap-2 text-[9px] text-accent font-bold bg-accent/5 p-2 border border-accent/10">
                            <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
                            <span>Modo manual activo. El sistema rechazará la emisión si el consecutivo resultante ya existe en la base de datos.</span>
                        </div>
                    )}
                    {!manualNumbering && contratoId && !loading && autoValues && (
                        <div className="flex items-start gap-2 text-[9px] text-slate-900 font-bold bg-primary/[0.02] p-2 border border-primary/5">
                            <Info className="h-3 w-3 shrink-0 mt-0.5" />
                            <span>Consecutivos calculados automáticamente. S5={autoValues.s5} desde el contrato · S6={autoValues.s6} siguiendo el historial de emisiones.</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
