"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
    WizardExperienciasSchema,
    ExperienciaItem,
    ExperienciasFormValues,
} from "./experiencias/schema";
import { ExperienciaFormItem } from "./experiencias/experiencia-form-item";
import { Briefcase, ArrowLeft, ArrowRight, Plus, History } from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardExperienciasStepProps {
    onNext: (data: ExperienciaItem[]) => void;
    onBack: () => void;
    initialData?: ExperienciaItem[];
    isAdmin?: boolean;
}

export function WizardExperienciasStep({
    onNext,
    onBack,
    initialData,
    isAdmin,
}: WizardExperienciasStepProps) {
    const form = useForm<ExperienciasFormValues>({
        resolver: zodResolver(WizardExperienciasSchema),
        defaultValues: {
            experiencias:
                initialData && initialData.length > 0
                    ? initialData.map(e => ({
                        ...e,
                        fechaInicio: e.fechaInicio ? new Date(e.fechaInicio).toISOString().split('T')[0] : "",
                        fechaFin: e.fechaFin ? new Date(e.fechaFin).toISOString().split('T')[0] : "",
                      }))
                    : [{ empresa: "", cargo: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "experiencias",
    });

    const onSubmit = (values: ExperienciasFormValues) => {
        onNext(values.experiencias);
    };

    return (
        <div className="space-y-6">
            {/* Step Header */}
            <div className="flex items-start gap-4 border-b border-slate-100 pb-6">
                <div className="w-10 h-10 bg-primary/10 border border-primary/5 text-primary flex items-center justify-center rounded-none shrink-0">
                    <Briefcase size={18} />
                </div>
                <div>
                    <h3 className="text-base font-black text-primary uppercase tracking-widest leading-none">
                        Trayectoria Laboral
                    </h3>
                    <p className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mt-1">
                        Historial de Desempeño &amp; Referencias Corporativas
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-6">
                        {fields.map((field, index) => (
                            <div key={field.id} className="relative group">
                                <div className="absolute -left-3 top-4 w-1 h-32 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                <ExperienciaFormItem
                                    index={index}
                                    form={form}
                                    remove={remove}
                                    showRemove={fields.length > 1}
                                />
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-12 border-dashed border-2 border-slate-200 text-slate-900 hover:border-brand hover:text-brand rounded-none flex items-center justify-center gap-2 transition-colors font-black text-[10px] uppercase tracking-widest"
                            onClick={() => {
                                append({ empresa: "", cargo: "" });
                            }}
                        >
                            <Plus size={16} />
                            Agregar Experiencia
                        </Button>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onBack}
                            className="h-11 rounded-none border-slate-200 font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-slate-50"
                        >
                            <ArrowLeft size={16} />
                            Retorno
                        </Button>

                        <div className="flex items-center gap-3">
                            {isAdmin && !form.formState.isValid && (
                                <button
                                    type="button"
                                    className="text-[10px] uppercase font-black text-slate-900 hover:text-amber-600 tracking-widest transition-colors"
                                    onClick={() => onNext(form.getValues().experiencias)}
                                >
                                    Omitir (Admin)
                                </button>
                            )}
                            <Button
                                type="submit"
                                className="h-11 rounded-none bg-primary hover:bg-black text-white font-black text-[10px] uppercase tracking-widest px-8 gap-3 transition-colors"
                            >
                                Revisar y Confirmar
                                <ArrowRight size={16} />
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
