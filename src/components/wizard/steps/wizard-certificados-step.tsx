"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
    Plus,
    GraduationCap,
    ShieldCheck,
    ArrowLeft,
    ArrowRight,
    FilePlus,
    FileText,
} from "lucide-react";
import { useState } from "react";
import {
    WizardCertificadosSchema,
    CertificadoItem,
    CertificadosFormValues,
} from "./certificados/schema";
import { CertificadoFormItem } from "./certificados/certificado-form-item";
import { cn } from "@/lib/utils";

interface WizardCertificadosStepProps {
    onNext: (data: CertificadoItem[]) => void;
    onBack: () => void;
    initialData?: CertificadoItem[];
    title: string;
    description: string;
    category: "ESTUDIO" | "LEGAL";
    isAdmin?: boolean;
}

export function WizardCertificadosStep({
    onNext,
    onBack,
    initialData,
    title,
    description,
    category,
    isAdmin,
}: WizardCertificadosStepProps) {
    const [files, setFiles] = useState<Record<number, any>>(() => {
        const initial: Record<number, any> = {};
        if (initialData) {
            initialData.forEach((cert, idx) => {
                if (cert.archivo) {
                    initial[idx] = cert.archivo;
                }
            });
        }
        return initial;
    });

    const form = useForm<CertificadosFormValues>({
        resolver: zodResolver(WizardCertificadosSchema),
        defaultValues: {
            certificados:
                initialData && initialData.length > 0
                    ? initialData.map(c => ({
                        ...c,
                        fechaEmision: c.fechaEmision ? new Date(c.fechaEmision).toISOString().split('T')[0] : "",
                        fechaVencimiento: c.fechaVencimiento ? new Date(c.fechaVencimiento).toISOString().split('T')[0] : "",
                      }))
                    : [{ nombre: "", institucion: "", categoria: category }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "certificados",
    });

    const onSubmit = (values: CertificadosFormValues) => {
        const certificadosWithFiles = values.certificados.map(
            (cert, index) => ({
                ...cert,
                archivo: files[index] || null,
            }),
        );
        onNext(certificadosWithFiles);
    };

    const Icon = category === "ESTUDIO" ? GraduationCap : ShieldCheck;

    return (
        <div className="space-y-6">
            {/* Step Header */}
            <div className="flex items-start gap-4 border-b border-slate-100 pb-6">
                <div className="w-10 h-10 bg-primary/10 border border-primary/5 text-primary flex items-center justify-center rounded-none shrink-0">
                    <Icon size={18} />
                </div>
                <div>
                    <h3 className="text-base font-black text-primary uppercase tracking-widest leading-none">
                        {title}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mt-1">
                        {description}
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="relative group">
                                <CertificadoFormItem
                                    index={index}
                                    form={form}
                                    remove={remove}
                                    showRemove={fields.length > 1}
                                    category={category}
                                    file={files[index] || null}
                                    onFileChange={(idx, file) => {
                                        setFiles((prev) => ({
                                            ...prev,
                                            [idx]: file,
                                        }));
                                    }}
                                />
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-12 border-dashed border-2 border-slate-200 text-slate-900 hover:border-brand hover:text-brand rounded-none flex items-center justify-center gap-2 transition-colors font-black text-[10px] uppercase tracking-widest"
                            onClick={() => {
                                append({
                                    nombre: "",
                                    institucion: "",
                                    categoria: category,
                                });
                            }}
                        >
                            <FilePlus size={16} />
                            Agregar {category === "ESTUDIO" ? "Estudio" : "Antecedente"}
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
                                    onClick={() => onNext(form.getValues().certificados.map((c, i) => ({ ...c, archivo: files[i] || null })))}
                                >
                                    Omitir (Admin)
                                </button>
                            )}
                            <Button
                                type="submit"
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
