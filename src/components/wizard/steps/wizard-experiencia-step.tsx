"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Briefcase, ArrowLeft, ArrowRight, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

// Schema local para Experiencia - sincronizado con ExperienciaLaboralCreateSchema
const WizardExperienciaSchema = z.object({
    empresa: z.string().min(2, "Empresa requerida"),
    cargo: z.string().min(2, "Cargo requerido"),
    fechaInicio: z.string().optional().nullable(),
    fechaFin: z.string().optional().nullable(),
    jefeInmediato: z.string().optional().nullable(),
    telefonoJefe: z.string().optional().nullable(),
    tiempoLaborado: z.string().optional().nullable(),
});

type ExperienciaFormValues = z.infer<typeof WizardExperienciaSchema>;

interface WizardExperienciaStepProps {
    onNext: (data: ExperienciaFormValues | null) => void;
    onBack: () => void;
    initialData?: ExperienciaFormValues;
    isAdmin?: boolean;
}

export function WizardExperienciaStep({
    onNext,
    onBack,
    initialData,
    isAdmin,
}: WizardExperienciaStepProps) {
    const form = useForm<ExperienciaFormValues>({
        resolver: zodResolver(WizardExperienciaSchema),
        defaultValues: initialData || {
            empresa: "",
            cargo: "",
            fechaInicio: "",
            fechaFin: "",
            jefeInmediato: "",
            telefonoJefe: "",
            tiempoLaborado: "",
        },
    });

    const onSubmit = (values: ExperienciaFormValues) => {
        onNext(values);
    };

    const handleSkip = () => {
        onNext(null); // Null indica que se omitió este paso
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-lg ring-4 ring-emerald-50">
                    <Briefcase size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-900 leading-none">
                        Experiencia <span className="text-emerald-600">Laboral</span> Reciente
                    </h3>
                    <p className="text-xs text-slate-900 font-medium mt-1">
                        Agrega tu experiencia laboral más relevante. Este paso es opcional 
                        {isAdmin && <span className="text-rose-600 ml-1 font-bold">(Modo Admin)</span>}.
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="empresa"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase text-slate-900">Empresa</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nombre de la empresa" {...field} className="bg-slate-50 border-slate-200 focus:bg-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cargo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase text-slate-900">Cargo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Cargo desempeñado" {...field} className="bg-slate-50 border-slate-200 focus:bg-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="fechaInicio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase text-slate-900">Fecha Inicio</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} value={field.value || ""} className="bg-slate-50 border-slate-200 focus:bg-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fechaFin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase text-slate-900">Fecha Fin</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} value={field.value || ""} className="bg-slate-50 border-slate-200 focus:bg-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="jefeInmediato"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase text-slate-900">Jefe Inmediato</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nombre del jefe" {...field} value={field.value || ""} className="bg-slate-50 border-slate-200 focus:bg-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="telefonoJefe"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase text-slate-900">Teléfono de Contacto</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Teléfono del jefe" {...field} value={field.value || ""} className="bg-slate-50 border-slate-200 focus:bg-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onBack}
                            className="flex items-center gap-2 text-slate-900"
                        >
                            <ArrowLeft size={18} />
                            <span className="text-sm font-bold uppercase tracking-tight">Atrás</span>
                        </Button>

                        <div className="flex items-center gap-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleSkip}
                                className="flex items-center gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            >
                                <SkipForward size={18} />
                                <span className="text-sm font-bold uppercase tracking-tight">Omitir</span>
                            </Button>
                            <Button
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 px-8 py-6 rounded-xl shadow-lg transition-all"
                            >
                                <span className="text-sm font-bold uppercase tracking-tight">Siguiente</span>
                                <ArrowRight size={18} />
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
