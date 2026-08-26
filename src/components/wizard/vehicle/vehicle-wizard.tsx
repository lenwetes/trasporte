"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { VehiculoCreate } from "@/lib/validations";
import { createVehiculo, uploadFile, createDocumentoVehiculo, getLearnedFleetData } from "@/actions";
import { useRouter } from "next/navigation";
import { RepositorioArchivo } from "@prisma/client";
import { TechnicalStep } from "./steps/technical-step";
import { TransitStep } from "./steps/transit-step";
import { DocumentsStep } from "./steps/documents-step";
import { ActionResult } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Check, ShieldAlert, AlertTriangle } from "lucide-react";

const FIELD_LABELS: Record<string, string> = {
    placa: "PLACA",
    anho: "AÑO",
    marca: "MARCA",
    modelo: "MODELO",
    clase: "CLASE",
    capacidadPuestos: "CAPACIDAD",
    color: "COLOR",
    cilindraje: "MOTOR (CC)",
    peso: "PESO BRUTO",
    numeroMotor: "NRO MOTOR",
    numeroChasis: "NRO CHASIS",
    lugarExpedicion: "OFICINA TRÁNSITO",
    modalidad: "MODALIDAD",
    numeroInterno: "NRO INTERNO",
};

export function VehicleWizard() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [serverErrors, setServerErrors] = useState<Record<string, unknown>>({});
    const [files, setFiles] = useState<Record<string, File>>({});
    const [expiryDates, setExpiryDates] = useState<Record<string, string>>({});
    const [learnedData, setLearnedData] = useState<{ marcas: string[]; modelos: Record<string, string[]>; organismos: string[]; colores: string[] } | null>(null);
    const router = useRouter();

    useEffect(() => {
        getLearnedFleetData().then(res => {
            if (res.success && res.data) setLearnedData(res.data);
        });
    }, []);

    const methods = useForm<VehiculoCreate>({
        defaultValues: {
            modalidad: "FLOTA_PROPIA",
            clase: "OTRO",
            anho: new Date().getFullYear(),
        },
    });

    const handleFileChange = (type: string, file: File | null) => {
        if (file) {
            setFiles((prev) => ({ ...prev, [type]: file }));
        }
    };

    const handleDateChange = (type: string, date: string) => {
        setExpiryDates((prev) => ({ ...prev, [type]: date }));
    };

    const handleFinalSave = async () => {
        const values = methods.getValues();
        setLoading(true);

        try {
            const vehicleResult = await createVehiculo(values);

            if (!vehicleResult.success || !vehicleResult.data) {
                const actionResult = vehicleResult as ActionResult;
                setServerErrors(actionResult.errors || {});
                setShowErrorModal(true);
                setLoading(false);
                toast.error("ERROR DE VALIDACIÓN", {
                    description: "Se encontraron inconsistencias técnicas en el formulario.",
                    className: "rounded-none border-l-4 border-l-red-500 font-black uppercase tracking-tight"
                });
                return;
            }

            const vData = vehicleResult.data as { id: string };
            const vId = vData.id;

            const uploadPromises = Object.entries(files).map(
                async ([type, file]) => {
                    const formData = new FormData();
                    formData.append("file", file);

                    const uploadRes = await uploadFile(formData);
                    if (
                        uploadRes.success &&
                        uploadRes.data &&
                        (expiryDates[type] || type === "SIMIT")
                    ) {
                        const uploadData = uploadRes.data as RepositorioArchivo;
                        await createDocumentoVehiculo({
                            vehiculoId: vId,
                            tipo: type,
                            fechaVencimiento: expiryDates[type] ? new Date(expiryDates[type]) : null,
                            archivoId: uploadData.id,
                        });
                    }
                },
            );

            await Promise.all(uploadPromises);

            toast.success("UNIDAD REGISTRADA", {
                description: `La placa ${values.placa.toUpperCase()} ha sido incorporada al sistema.`,
                className: "rounded-none border-l-4 border-l-emerald-500 font-black uppercase tracking-tight"
            });
            router.push("/dashboard/vehiculos");
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error("FALLO CRÍTICO", {
                description: "Ocurrió un error inesperado durante el registro forense.",
                className: "rounded-none border-l-4 border-l-red-500 font-black uppercase tracking-tight"
            });
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 1, title: "Información Técnica", sub: "Motor, Marca, Modelo" },
        { id: 2, title: "Datos de Tránsito", sub: "Placa, Año, Color" },
        { id: 3, title: "Documentación", sub: "Validación Legal" },
    ];

    return (
        <div className="bg-white overflow-hidden shadow-none border-none">
            {/* Stepper Tecnológico */}
            <nav className="border-b border-slate-100 bg-slate-50/50">
                <div className="grid grid-cols-3 divide-x divide-slate-100">
                    {steps.map((s) => {
                        const isActive = s.id === step;
                        const isCompleted = step > s.id;
                        return (
                            <div 
                                key={s.id} 
                                className={cn(
                                    "p-6 relative transition-all duration-500",
                                    isActive ? "bg-white" : "opacity-40"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "h-10 w-10 shrink-0 flex items-center justify-center text-xs font-black transition-all duration-700",
                                        isCompleted ? "bg-emerald-500 text-white" : 
                                        isActive ? "bg-slate-900 text-white ring-4 ring-slate-100" : "bg-slate-200 text-slate-900"
                                    )}>
                                        {isCompleted ? <Check className="h-5 w-5" /> : s.id.toString().padStart(2, '0')}
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-none mb-1">
                                            {s.title}
                                        </p>
                                        <p className="text-[9px] font-medium text-slate-900 uppercase tracking-tighter">
                                            {s.sub}
                                        </p>
                                    </div>
                                </div>
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 animate-in slide-in-from-left duration-1000" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </nav>

            {/* Error Monitor Area */}
            {showErrorModal && (
                <div className="p-8 bg-red-50 border-b border-red-100 animate-in slide-in-from-top duration-500">
                    <div className="flex items-start gap-6 max-w-4xl mx-auto">
                        <div className="h-12 w-12 bg-red-600 flex items-center justify-center shrink-0">
                            <ShieldAlert className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xs font-black uppercase tracking-widest text-red-900 mb-4 flex items-center gap-2">
                                <AlertTriangle className="h-3 w-3" /> Inconsistencias Detectadas
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
                                {Object.entries(serverErrors).map(([key, val]: any) => (
                                    <div key={key} className="flex items-start gap-3 py-2 border-b border-red-100/50">
                                        <span className="text-[9px] font-black text-red-400 shrink-0 w-24 uppercase italic mt-0.5">
                                            [{FIELD_LABELS[key] || key}]
                                        </span>
                                        <div className="text-[11px] font-medium text-red-700 tracking-tight leading-normal">
                                            {Array.isArray(val) ? val.join(". ") : String(val)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => setShowErrorModal(false)} 
                                className="mt-8 text-[9px] font-black uppercase tracking-[0.2em] text-red-600 hover:text-red-900 transition-colors"
                            >
                                [ CERRAR Y CORREGIR ]
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Step Panel */}
            <div className="p-8 md:p-16">
                <div className="max-w-4xl mx-auto">
                    <FormProvider {...methods}>
                        <div className="animate-in fade-in zoom-in-95 duration-700">
                            {step === 1 && <TechnicalStep onNext={() => setStep(2)} learnedData={learnedData} />}
                            {step === 2 && (
                                <TransitStep
                                    onNext={() => setStep(3)}
                                    onBack={() => setStep(1)}
                                    learnedData={learnedData}
                                />
                            )}
                            {step === 3 && (
                                <DocumentsStep
                                    files={files}
                                    expiryDates={expiryDates}
                                    onFileChange={handleFileChange}
                                    onDateChange={handleDateChange}
                                    onBack={() => setStep(2)}
                                    onSave={handleFinalSave}
                                    isSaving={loading}
                                />
                            )}
                        </div>
                    </FormProvider>
                </div>
            </div>
        </div>
    );
}
