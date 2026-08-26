"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UsuarioCreateSchema } from "@/lib/validations";
import { BasicInfoPersonalFields } from "./basic-info/personal-fields";
import { BasicInfoContactFields } from "./basic-info/contact-fields";
import { BasicInfoAccountFields } from "./basic-info/account-fields";
import { User, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const WizardBasicInfoSchema = UsuarioCreateSchema.pick({
    nombres: true,
    apellidos: true,
    tipoDocumento: true,
    numeroDocumento: true,
    fechaNacimiento: true,
    lugarNacimiento: true,
    email: true,
    telefono: true,
    direccion: true,
    municipio: true,
    password: true,
    rol: true,
    numeroLicencia: true,
    licencias: true,
    idDocumentoIdentidad: true,
    idFotoPerfil: true,
});

type BasicInfoFormValues = z.infer<typeof WizardBasicInfoSchema>;

interface WizardBasicInfoStepProps {
    onNext: (data: BasicInfoFormValues) => void;
    initialData?: Partial<BasicInfoFormValues>;
    isAdmin?: boolean;
}

export function WizardBasicInfoStep({ onNext, initialData, isAdmin }: WizardBasicInfoStepProps) {
    const form = useForm<BasicInfoFormValues>({
        resolver: zodResolver(WizardBasicInfoSchema),
        defaultValues: {
            ...initialData,
            nombres: initialData?.nombres || "",
            apellidos: initialData?.apellidos || "",
            tipoDocumento: initialData?.tipoDocumento || "CC",
            numeroDocumento: initialData?.numeroDocumento || "",
            fechaNacimiento: initialData?.fechaNacimiento 
                ? (typeof initialData.fechaNacimiento === "string" 
                    ? (initialData.fechaNacimiento as any).split("T")[0] 
                    : (initialData.fechaNacimiento as any).toISOString().split("T")[0])
                : "",
            lugarNacimiento: initialData?.lugarNacimiento || "",
            municipio: initialData?.municipio || "Sincelejo",
            rol: initialData?.rol || "CONDUCTOR",
            idDocumentoIdentidad: initialData?.idDocumentoIdentidad || null,
            idFotoPerfil: initialData?.idFotoPerfil || null,
        } as any,
    });

    const { formState: { errors, isSubmitting } } = form;

    const onSubmit = (values: BasicInfoFormValues) => {
        onNext(values);
    };

    const onInvalid = () => {
        const fieldNames: Record<string, string> = {
            nombres: "Nombres",
            apellidos: "Apellidos",
            tipoDocumento: "Tipo de Documento",
            numeroDocumento: "Número de Documento",
            email: "Email",
            telefono: "Teléfono",
            municipio: "Municipio",
            rol: "Rol / Nivel de Privilegios",
        };

        const errs = form.formState.errors;
        const errorKeys = Object.keys(errs);
        if (errorKeys.length > 0) {
            const first = fieldNames[errorKeys[0]] ?? errorKeys[0];
            toast.error(`Error en el campo: "${first}". Verifique todos los campos obligatorios.`, {
                duration: 5000,
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Step Header */}
            <div className="flex items-start gap-4 border-b border-slate-100 pb-6">
                <div className="w-10 h-10 bg-primary/10 border border-primary/5 text-primary flex items-center justify-center rounded-none shrink-0">
                    <User size={18} />
                </div>
                <div>
                    <h3 className="text-base font-black text-primary uppercase tracking-widest leading-none">
                        Identidad &amp; Acceso
                    </h3>
                    <p className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mt-1">
                        Fase 01 — Datos personales, contacto y configuración de cuenta
                    </p>
                </div>
            </div>

            {/* Error summary */}
            {Object.keys(errors).length > 0 && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 px-4 py-3">
                    <AlertTriangle size={14} className="text-red-500 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-[10px] font-black uppercase text-red-700 tracking-widest">
                            Hay {Object.keys(errors).length} campo(s) con error. Revise el formulario.
                        </p>
                        <ul className="mt-1 space-y-0.5">
                            {Object.entries(errors).slice(0, 4).map(([k, v]) => (
                                <li key={k} className="text-[10px] text-red-600 font-bold">
                                    · {k}: {(v as { message?: string })?.message ?? "Campo requerido"}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
                    {/* Two columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left — Identidad + Contacto */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                <User size={12} className="text-brand" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                                    Datos de Identidad
                                </span>
                            </div>
                            <BasicInfoPersonalFields />
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mt-6">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                                    Datos de Contacto
                                </span>
                            </div>
                            <BasicInfoContactFields />
                        </div>

                        {/* Right — Cuenta */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                <ShieldCheck size={12} className="text-brand" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                                    Configuración de Cuenta
                                </span>
                            </div>
                            <BasicInfoAccountFields />

                            {/* Advisory */}
                            <div className="bg-amber-50 border border-amber-200 px-4 py-3 flex items-start gap-3 mt-4">
                                <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                                <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider leading-relaxed">
                                    La omisión o inexactitud en nombres y apellidos compromete la integridad del expediente digital.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">
                            Campos marcados son obligatorios *
                        </span>
                        <div className="flex items-center gap-3">
                            {isAdmin && Object.keys(errors).length > 0 && (
                                <button
                                    type="button"
                                    className="text-[10px] uppercase font-black text-slate-900 hover:text-amber-600 tracking-widest transition-colors"
                                    onClick={() => {
                                        const v = form.getValues();
                                        if (!v.nombres?.trim() || !v.apellidos?.trim()) {
                                            form.trigger(["nombres", "apellidos"]);
                                            return;
                                        }
                                        onNext(v as BasicInfoFormValues);
                                    }}
                                >
                                    Forzar (Admin)
                                </button>
                            )}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-11 rounded-none bg-primary hover:bg-black text-white font-black text-[10px] uppercase tracking-widest px-8 gap-3 transition-colors"
                            >
                                Continuar Fase 02
                                <ArrowRight size={16} />
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
