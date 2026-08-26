"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { WizardHojaVidaSchema, HojaVidaFormValues } from "./hoja-vida/schema";
import { SecuritySocialFields } from "./hoja-vida/security-social-fields";
import { EmergencyContactFields } from "./hoja-vida/emergency-contact-fields";
import { ProfessionalProfileFields } from "./hoja-vida/professional-profile-fields";
import { ArrowLeft, ArrowRight, FileText, HeartPulse, Phone, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface WizardHojaVidaStepProps {
    onNext: (data: HojaVidaFormValues) => void;
    onBack: () => void;
    initialData?: Partial<HojaVidaFormValues>;
    isAdmin?: boolean;
}

export function WizardHojaVidaStep({ onNext, onBack, initialData, isAdmin }: WizardHojaVidaStepProps) {
    const form = useForm<HojaVidaFormValues>({
        resolver: zodResolver(WizardHojaVidaSchema),
        defaultValues: {
            rh: "",
            eps: "",
            arl: "",
            fondoPensiones: "",
            fondoCesantias: "",
            contactoEmergenciaNombre: "",
            contactoEmergenciaTelefono: "",
            perfilProfesional: "",
            ...initialData,
        },
    });

    const { formState: { errors, isSubmitting } } = form;

    const onSubmit = (values: HojaVidaFormValues) => {
        onNext(values);
    };

    const onInvalid = () => {
        toast.error("Verifique los campos de hoja de vida antes de continuar.", { duration: 4000 });
    };

    return (
        <div className="space-y-6">
            {/* Step Header */}
            <div className="flex items-start gap-4 border-b border-slate-100 pb-6">
                <div className="w-10 h-10 bg-primary/10 border border-primary/5 text-primary flex items-center justify-center rounded-none shrink-0">
                    <FileText size={18} />
                </div>
                <div>
                    <h3 className="text-base font-black text-primary uppercase tracking-widest leading-none">
                        Hoja de Vida
                    </h3>
                    <p className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mt-1">
                        Seguridad Social &amp; Perfil Corporativo
                    </p>
                </div>
            </div>

            {Object.keys(errors).length > 0 && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 px-4 py-3">
                    <AlertTriangle size={14} className="text-red-500 mt-0.5 shrink-0" />
                    <p className="text-[10px] font-black uppercase text-red-700 tracking-widest">
                        Hay campos con error. Revise el formulario antes de continuar.
                    </p>
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                <HeartPulse size={12} className="text-brand" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                                    Seguridad Social
                                </span>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 p-4">
                                <SecuritySocialFields form={form} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                <Phone size={12} className="text-brand" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                                    Contacto &amp; Perfil
                                </span>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 p-4 space-y-4">
                                <EmergencyContactFields form={form} />
                                <div className="pt-2 border-t border-slate-200">
                                    <ProfessionalProfileFields form={form} />
                                </div>
                            </div>
                        </div>
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
                                    onClick={() => onNext(form.getValues() as HojaVidaFormValues)}
                                >
                                    Omitir (Admin)
                                </button>
                            )}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-11 rounded-none bg-primary hover:bg-black text-white font-black text-[10px] uppercase tracking-widest px-8 gap-3 transition-colors"
                            >
                                Continuar
                                <ArrowRight size={16} />
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
