"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UsuarioCreateSchema } from "@/lib/validations";
import { BasicInfoLicenseFields } from "./basic-info/license-fields";
import { ShieldCheck, ArrowLeft, ArrowRight, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const WizardLicenseSchema = UsuarioCreateSchema.pick({
    numeroLicencia: true,
    licencias: true,
    rol: true,
});

type LicenseFormValues = z.infer<typeof WizardLicenseSchema>;

interface WizardLicenseStepProps {
    onNext: (data: LicenseFormValues) => void;
    onBack: () => void;
    initialData?: Partial<LicenseFormValues>;
    isAdmin?: boolean;
}

export function WizardLicenseStep({ onNext, onBack, initialData, isAdmin }: WizardLicenseStepProps) {
    const form = useForm<LicenseFormValues>({
        resolver: zodResolver(WizardLicenseSchema),
        defaultValues: {
            rol: "CONDUCTOR",
            numeroLicencia: "",
            ...initialData,
            licencias: (initialData?.licencias?.map(lic => ({
                ...lic,
                fechaVencimiento: lic.fechaVencimiento 
                    ? new Date(lic.fechaVencimiento).toISOString().split('T')[0]
                    : ""
            })) || []) as unknown as LicenseFormValues["licencias"],
        },
    });

    const { formState: { errors, isSubmitting } } = form;

    const onSubmit = (values: LicenseFormValues) => {
        onNext(values);
    };

    const onInvalid = () => {
        toast.error("Verifique los campos de licencia antes de continuar.", { duration: 4000 });
    };

    return (
        <div className="space-y-6">
            {/* Step Header */}
            <div className="flex items-start gap-4 border-b border-slate-100 pb-6">
                <div className="w-10 h-10 bg-primary/10 border border-primary/5 text-primary flex items-center justify-center rounded-none shrink-0">
                    <ShieldCheck size={18} />
                </div>
                <div>
                    <h3 className="text-base font-black text-primary uppercase tracking-widest leading-none">
                        Habilitación Técnica
                    </h3>
                    <p className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mt-1">
                        Fase 02 — Licencias y Categorías Operativas
                    </p>
                </div>
            </div>

            {Object.keys(errors).length > 0 && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 px-4 py-3">
                    <AlertTriangle size={14} className="text-red-500 mt-0.5 shrink-0" />
                    <p className="text-[10px] font-black uppercase text-red-700 tracking-widest">
                        Revise los campos requeridos de licencia.
                    </p>
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
                    <div className="bg-slate-50 border border-slate-200 p-6">
                        <BasicInfoLicenseFields />
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
                            {isAdmin && (
                                <button
                                    type="button"
                                    className="text-[10px] uppercase font-black text-slate-900 hover:text-amber-600 tracking-widest transition-colors"
                                    onClick={() => onNext(form.getValues())}
                                >
                                    Omitir (Admin)
                                </button>
                            )}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-11 rounded-none bg-primary hover:bg-black text-white font-black text-[10px] uppercase tracking-widest px-8 gap-3 transition-colors"
                            >
                                Continuar Fase 03
                                <ArrowRight size={16} />
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
