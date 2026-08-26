"use client";

import { useState, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    PreoperacionalCreateSchema,
    PreoperacionalCreate,
} from "@/lib/validations/safety";
import { createPreoperacional } from "@/actions";
import { useRouter } from "next/navigation";
import { SignaturePadRef } from "@/components/signature-pad";
import { DEFAULT_ITEMS } from "./preoperacional-constants";
import { PreoperacionalStepOne } from "./steps/step-one";
import { PreoperacionalStepTwo } from "./steps/step-two";
import { PreoperacionalStepThree } from "./steps/step-three";
import { ShieldAlert, ShieldCheck, ChevronRight, ChevronLeft, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PreoperacionalFormProps {
    conductorId: string;
    vehiculoId: string;
    vehiculoPlaca: string;
}

export function PreoperacionalForm({
    conductorId,
    vehiculoId,
    vehiculoPlaca,
}: PreoperacionalFormProps) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [signature, setSignature] = useState<string>("");
    const signaturePadRef = useRef<SignaturePadRef>(null);
    const router = useRouter();

    const methods = useForm<PreoperacionalCreate>({
        resolver: zodResolver(PreoperacionalCreateSchema),
        defaultValues: {
            conductorId,
            vehiculoId,
            fecha: new Date(),
            kilometraje: 0,
            detalles: DEFAULT_ITEMS.map((i) => ({
                item: i.item,
                estado: true,
                criticidad: i.criticidad as "ALTA" | "MEDIA" | "BAJA",
                observacion: "",
            })),
            observaciones: "",
        },
    });

    const onSubmit = async (data: PreoperacionalCreate) => {
        if (!signature || signaturePadRef.current?.isEmpty()) {
            toast.error("FIRMA REQUERIDA", {
                description: "Debe firmar el reporte para confirmar la inspección técnica."
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createPreoperacional({
                ...data,
                firmaDigital: signature,
            });
            if (result.success && result.data) {
                const isRejected = (result.data as { resultado: string }).resultado === "RECHAZADO";
                if (isRejected) {
                    toast.error("ALERTA CRÍTICA: VEHÍCULO NO APTO", {
                        description: "Se detectó una falla que compromete la seguridad. Reporte a mantenimiento inmediatamente.",
                        duration: 10000
                    });
                } else {
                    toast.success("INSPECCIÓN REGISTRADA", {
                        description: "Protocolo preoperacional completado exitosamente."
                    });
                }
                router.push("/dashboard");
                router.refresh();
            } else {
                toast.error("error al registrar", { description: result.error });
            }
        } catch {
            toast.error("error de comunicación", { description: "No se pudo conectar con el servidor central." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => s - 1);

    const steps = [
        { id: 1, label: "IDENTIFICACIÓN", icon: CheckCircle2 },
        { id: 2, label: "LISTA TÉCNICA", icon: ShieldCheck },
        { id: 3, label: "CERTIFICACIÓN", icon: ShieldAlert },
    ];

    return (
        <div className="space-y-10">
            {/* Premium Stepper */}
            <div className="relative">
                <div className="absolute top-1/2 left-0 w-full h-px bg-primary/10 -translate-y-1/2 z-0" />
                <div className="relative z-10 flex justify-between items-center px-4">
                    {steps.map((s) => {
                        const Icon = s.icon;
                        const active = s.id === step;
                        const completed = s.id < step;
                        return (
                            <div key={s.id} className="flex flex-col items-center gap-3">
                                <div className={cn(
                                    "h-12 w-12 flex items-center justify-center border-2 transition-all duration-300",
                                    active ? "bg-primary border-primary text-white scale-110 shadow-lg" : 
                                    completed ? "bg-accent border-accent text-white" : 
                                    "bg-white border-primary/10 text-primary"
                                )}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-widest transition-colors",
                                    active ? "text-primary" : "text-primary"
                                )}>
                                    {s.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="animate-in fade-in duration-500 delay-150">
                    {step === 1 && (
                        <PreoperacionalStepOne
                            vehiculoPlaca={vehiculoPlaca}
                            nextStep={nextStep}
                        />
                    )}

                    {step === 2 && (
                        <PreoperacionalStepTwo
                            prevStep={prevStep}
                            nextStep={nextStep}
                        />
                    )}

                    {step === 3 && (
                        <PreoperacionalStepThree
                            prevStep={prevStep}
                            isSubmitting={isSubmitting}
                            signatureRef={signaturePadRef}
                            setSignature={setSignature}
                        />
                    )}
                </form>
            </FormProvider>
        </div>
    );
}
