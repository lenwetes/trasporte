"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { PreoperacionalCreate } from "@/lib/validations/safety";
import { DEFAULT_ITEMS } from "../preoperacional-constants";
import { CheckCircle2, XCircle, AlertTriangle, ArrowLeft, ArrowRight, ShieldCheck, Check, X, Search, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface PreoperacionalStepTwoProps {
    prevStep: () => void;
    nextStep: () => void;
}

export function PreoperacionalStepTwo({
    prevStep,
    nextStep,
}: PreoperacionalStepTwoProps) {
    const { control, watch, setValue, register } =
        useFormContext<PreoperacionalCreate>();

    const { fields } = useFieldArray({
        control,
        name: "detalles",
    });

    const markAllOk = () => {
        fields.forEach((_, index) => {
            setValue(`detalles.${index}.estado`, true);
        });
    };

    const details = watch("detalles");
    const completedCount = details.filter((d) => d.estado !== undefined).length;
    const totalCount = fields.length;
    const failsCount = details.filter((d) => d.estado === false).length;
    const progressPercentage = (completedCount / totalCount) * 100;

    // Group items
    const groupedFields = DEFAULT_ITEMS.reduce(
        (acc, item, index) => {
            if (!acc[item.group]) acc[item.group] = [];
            acc[item.group].push({
                ...fields[index],
                ...item,
                originalIndex: index,
            });
            return acc;
        },
        {} as Record<
            string,
            ((typeof fields)[0] &
                (typeof DEFAULT_ITEMS)[0] & { originalIndex: number })[]
        >,
    );

    return (
        <div className="space-y-10">
            {/* Technical Metric Header */}
            <div className="bg-primary/[0.03] border border-primary/10 p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-end gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Settings2 className="h-4 w-4 text-accent" />
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Auditoría Técnica en Tiempo Real</h3>
                        </div>
                        <p className="text-3xl font-black text-primary font-mono tracking-tighter">
                            {completedCount.toString().padStart(2, '0')}<span className="text-primary/20">/</span>{totalCount}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Puntos de inspección verificados</p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={markAllOk}
                        className="h-10 rounded-none border-primary/20 font-bold text-[10px] uppercase tracking-widest hover:bg-accent hover:text-white hover:border-accent transition-all"
                    >
                        <CheckCircle2 className="h-4 w-4 mr-2" /> Validar Estado Operativo
                    </Button>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-primary/5 rounded-none overflow-hidden flex">
                    <div 
                        className="h-full bg-accent transition-all duration-500 ease-out" 
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>

                {failsCount > 0 && (
                    <div className="p-4 bg-red-600 text-white flex items-center justify-between animate-in zoom-in duration-300">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5" />
                            <span className="text-xs font-black uppercase tracking-widest">
                                Hallazgos Críticos Detectados: {failsCount}
                            </span>
                        </div>
                        <span className="text-[10px] font-bold bg-white/20 px-2 py-1">ACCIÓN REQUERIDA</span>
                    </div>
                )}
            </div>

            {/* Checklist Groups */}
            <div className="space-y-12">
                {Object.entries(groupedFields).map(([group, groupItems]) => (
                    <div key={group} className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-primary/5" />
                            <h4 className="text-[11px] font-black text-primary/60 uppercase tracking-[0.3em] font-mono">
                                SECTION: {group}
                            </h4>
                            <div className="h-px flex-1 bg-primary/5" />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {groupItems.map((item) => {
                                const index = item.originalIndex;
                                const isOk = watch(`detalles.${index}.estado`);
                                const criticality = DEFAULT_ITEMS[index].criticidad;

                                return (
                                    <div
                                        key={item.id}
                                        className={cn(
                                            "border transition-all duration-300 relative overflow-hidden",
                                            isOk === undefined ? "bg-white border-primary/10" : 
                                            isOk ? "bg-accent/[0.02] border-accent/30 shadow-sm" : 
                                            "bg-red-50 border-red-200"
                                        )}
                                    >
                                        {/* Status Sidebar Indicator */}
                                        <div className={cn(
                                            "absolute top-0 left-0 w-1 h-full transition-colors",
                                            isOk === undefined ? "bg-primary/5" : 
                                            isOk ? "bg-accent" : "bg-red-500"
                                        )} />

                                        <div className="p-5 flex flex-col sm:flex-row justify-between items-start gap-6">
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center gap-3">
                                                    <p className="text-sm font-black text-primary uppercase tracking-tight leading-none">
                                                        {item.item}
                                                    </p>
                                                    {criticality === "ALTA" && (
                                                        <span className="text-[8px] font-black bg-red-100 text-red-600 px-1.5 py-0.5 border border-red-200 uppercase tracking-tighter">CRÍTICO</span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest font-mono">
                                                    ID: TP-{index.toString().padStart(3, '0')} | CAT: {group}
                                                </p>
                                            </div>

                                            <div className="flex gap-2 self-end sm:self-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setValue(`detalles.${index}.estado`, true)}
                                                    className={cn(
                                                        "h-12 w-20 flex items-center justify-center border transition-all rounded-none",
                                                        isOk === true 
                                                            ? "bg-accent border-accent text-white shadow-lg" 
                                                            : "bg-white border-primary/10 text-primary/20 hover:border-primary/30"
                                                    )}
                                                >
                                                    <Check className="h-5 w-5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setValue(`detalles.${index}.estado`, false)}
                                                    className={cn(
                                                        "h-12 w-20 flex items-center justify-center border transition-all rounded-none",
                                                        isOk === false 
                                                            ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-200" 
                                                            : "bg-white border-primary/10 text-primary/20 hover:border-primary/30"
                                                    )}
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Observation Section (Visible only if Failed) */}
                                        {isOk === false && (
                                            <div className="p-5 pt-0 animate-in slide-in-from-top-2 duration-300">
                                                <div className="border-t border-red-100 pt-5 space-y-4">
                                                    <div className="flex items-center gap-3 text-red-600">
                                                        <AlertTriangle className="h-4 w-4 shrink-0" />
                                                        <p className="text-[10px] font-black uppercase tracking-widest">
                                                            {criticality === "ALTA"
                                                                ? "PROTOCOLO BLOQUEANTE: Describa la falla crítica obligatoriamente."
                                                                : "OBSERVACIÓN TÉCNICA: Detalle el hallazgo encontrado."}
                                                        </p>
                                                    </div>
                                                    <Textarea
                                                        {...register(`detalles.${index}.observacion` as const)}
                                                        placeholder="Ingrese el detalle técnico de la anomalía..."
                                                        className="w-full bg-white border-red-100 min-h-[100px] text-xs font-medium rounded-none focus-visible:ring-red-500 focus-visible:border-red-500"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Footer */}
            <div className="pt-10 border-t border-primary/5 flex justify-between items-center bg-white sticky bottom-0 z-20 pb-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="h-12 px-6 rounded-none border-primary/10 font-bold text-xs uppercase tracking-widest text-primary/60 hover:bg-primary/5"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> REGRESAR
                </Button>
                <Button
                    type="button"
                    onClick={nextStep}
                    className="h-14 px-10 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-none gap-3 shadow-2xl"
                >
                    CONTINUAR PROTOCOLO <ArrowRight className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
