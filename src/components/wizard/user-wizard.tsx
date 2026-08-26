"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { WizardBasicInfoStep } from "./steps/wizard-basic-info-step";
import { WizardLicenseStep } from "./steps/wizard-license-step";
import { WizardHojaVidaStep } from "./steps/wizard-hoja-vida-step";
import { WizardCertificadosStep } from "./steps/wizard-certificados-step";
import { WizardExperienciasStep } from "./steps/wizard-experiencias-step";
import { WizardConfirmationStep } from "./steps/wizard-confirmation-step";
import { createUser, uploadFile } from "@/actions";
import { UsuarioCreate } from "@/lib/validations";
import { ActionResult } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    Check,
    User,
    CreditCard,
    FileText,
    GraduationCap,
    ShieldCheck,
    Briefcase,
    ClipboardCheck,
    Save,
} from "lucide-react";

const STORAGE_KEY = "wizard_usuario_draft";

// Representa un archivo ya persistido en base de datos
type ArchivoRecord = {
    id: string;
    nombreUnico: string;
    nombreOriginal?: string | null;
};

// Un archivo puede ser: un File nativo (upload), un ID string, o un registro de BD
type ArchivoValue = File | string | ArchivoRecord | null | undefined;

// ── Types ────────────────────────────────────────
type BasicInfoData = {
    nombres?: string;
    apellidos?: string;
    tipoDocumento: "CC" | "CE" | "PASAPORTE" | "NIT";
    numeroDocumento?: string | null;
    fechaNacimiento?: string | Date | null;
    lugarNacimiento?: string | null;
    email?: string | null;
    telefono?: string | null;
    direccion?: string | null;
    municipio: string;
    password?: string | null;
    rol: "ADMIN" | "CONDUCTOR" | "SECRETARIA" | "PROPIETARIO";
    idDocumentoIdentidad?: string | null;
    idFotoPerfil?: string | null;
    numeroLicencia?: string | null;
    licencias?: {
        categoria: "A1" | "A2" | "B1" | "B2" | "B3" | "C1" | "C2" | "C3";
        servicio: "PARTICULAR" | "ESPECIAL" | "PUBLICO";
        fechaVencimiento: Date;
    }[];
};

type HojaVidaData = {
    rh?: string | null;
    eps?: string | null;
    arl?: string | null;
    fondoPensiones?: string | null;
    fondoCesantias?: string | null;
    contactoEmergenciaNombre?: string | null;
    contactoEmergenciaTelefono?: string | null;
    perfilProfesional?: string | null;
};

type CertificadoItem = {
    nombre?: string;
    institucion?: string | null;
    fechaEmision?: string | null;
    fechaVencimiento?: string | null;
    categoria?: string | null;
    archivo?: ArchivoValue;
    archivoId?: string | null;
};

type ExperienciaData = {
    empresa?: string;
    cargo?: string;
    fechaInicio?: string | null;
    fechaFin?: string | null;
    jefeInmediato?: string | null;
    telefonoJefe?: string | null;
    tiempoLaborado?: string | null;
};

interface WizardData {
    basicInfo?: BasicInfoData;
    licenseInfo?: Partial<BasicInfoData>;
    hojaVida?: HojaVidaData;
    academicInfo?: CertificadoItem[];
    legalInfo?: CertificadoItem[];
    experiencias?: ExperienciaData[];
}

interface UserWizardProps {
    userRole?: string;
}

const STEPS = [
    { id: 1, title: "Identidad", short: "ID",    icon: User },
    { id: 2, title: "Licencia",  short: "LIC",   icon: CreditCard },
    { id: 3, title: "Hoja Vida", short: "HV",    icon: FileText },
    { id: 4, title: "Formación", short: "FORM",  icon: GraduationCap },
    { id: 5, title: "Legal",     short: "LEG",   icon: ShieldCheck },
    { id: 6, title: "Experiencia",short: "EXP",  icon: Briefcase },
    { id: 7, title: "Confirmar", short: "OK",    icon: ClipboardCheck },
];

export function UserWizard({ userRole }: UserWizardProps) {
    const isAdmin = userRole === "ADMIN";
    const router = useRouter();
    const [step, setStep]       = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [hasDraft, setHasDraft] = useState(false);
    const [formData, setFormData] = useState<WizardData>({
        basicInfo:    undefined,
        hojaVida:     undefined,
        academicInfo: [],
        legalInfo:    [],
        experiencias: [],
    });

    // ── Autoguardado ──────────────────────────────
    const saveDraft = useCallback((data: WizardData, currentStep: number) => {
        try {
            const draft = { data, step: currentStep, savedAt: new Date().toISOString() };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
            setHasDraft(true);
        } catch { /* noop */ }
    }, []);

    const clearDraft = useCallback(() => {
        try {
            localStorage.removeItem(STORAGE_KEY);
            setHasDraft(false);
        } catch { /* noop */ }
    }, []);

    // Load draft on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const { data, step: savedStep } = JSON.parse(saved) as { data: WizardData; step: number; savedAt: string };
                setFormData(data);
                setStep(savedStep || 1);
                setHasDraft(true);
                toast.info("Se restauró un borrador guardado anteriormente.", {
                    action: { label: "Descartar borrador", onClick: clearDraft },
                    duration: 8000,
                });
            }
        } catch { /* noop */ }
    }, [clearDraft]);

    // ── Step Navigation ───────────────────────────
    const visibleSteps = formData.basicInfo?.rol !== "CONDUCTOR"
        ? STEPS.filter(s => s.id !== 2)
        : STEPS;

    const handleJumpToStep = (s: number) => {
        if (s < step) { setStep(s); }
    };

    const handleNextBasicInfo = (data: BasicInfoData) => {
        const updated = { ...formData, basicInfo: data };
        setFormData(updated);
        const nextStep = data.rol === "CONDUCTOR" ? 2 : 3;
        setStep(nextStep);
        saveDraft(updated, nextStep);
    };

    const handleNextLicense = (data: Partial<BasicInfoData>) => {
        const updated = { ...formData, licenseInfo: data };
        setFormData(updated);
        setStep(3);
        saveDraft(updated, 3);
    };

    const handleNextHojaVida = (data: HojaVidaData) => {
        const updated = { ...formData, hojaVida: data };
        setFormData(updated);
        setStep(4);
        saveDraft(updated, 4);
    };

    const handleNextAcademic = (data: CertificadoItem[]) => {
        const updated = { ...formData, academicInfo: data };
        setFormData(updated);
        setStep(5);
        saveDraft(updated, 5);
    };

    const handleNextLegal = (data: CertificadoItem[]) => {
        const updated = { ...formData, legalInfo: data };
        setFormData(updated);
        setStep(6);
        saveDraft(updated, 6);
    };

    const handleNextExperiencias = (data: ExperienciaData[]) => {
        const updated = { ...formData, experiencias: data };
        setFormData(updated);
        setStep(7);
        saveDraft(updated, 7);
    };

    const handleBack = () => {
        const prevStep = step === 3 && formData.basicInfo?.rol !== "CONDUCTOR" ? 1 : step - 1;
        setStep(prevStep);
    };

    // ── Final Submit ──────────────────────────────
    const handleFinalSave = async () => {
        if (!formData.basicInfo) return;
        setIsSaving(true);
        try {
            const uploadCerts = async (certs: CertificadoItem[], cat: string) =>
                Promise.all(
                    certs.map(async (cert) => {
                        let archivoId = cert.archivoId ?? null;
                        
                        // Si ya tenemos un ID (puede venir del objeto o si cert.archivo es el ID)
                        if (typeof cert.archivo === "string") archivoId = cert.archivo;
                        if (
                            cert.archivo !== null &&
                            cert.archivo !== undefined &&
                            !(cert.archivo instanceof File) &&
                            typeof cert.archivo !== "string" &&
                            "id" in cert.archivo
                        ) {
                            archivoId = (cert.archivo as ArchivoRecord).id;
                        }

                        // Solo subir si es un objeto File (o Blob) real
                        if (cert.archivo instanceof File) {
                            const fd = new FormData();
                            fd.append("file", cert.archivo);
                            const r = await uploadFile(fd);
                            if (r.success && r.data) archivoId = (r.data as { id: string }).id;
                        }
                        
                        return { 
                            nombre: cert.nombre, 
                            institucion: cert.institucion, 
                            fechaEmision: cert.fechaEmision && cert.fechaEmision !== "" ? cert.fechaEmision : null, 
                            fechaVencimiento: cert.fechaVencimiento && cert.fechaVencimiento !== "" ? cert.fechaVencimiento : null, 
                            categoria: cat, 
                            archivoId 
                        };
                    }),
                );

            const acad  = await uploadCerts(formData.academicInfo || [], "ESTUDIO");
            const legal = await uploadCerts(formData.legalInfo    || [], "LEGAL");
            const certs = [...acad, ...legal].filter(c => c.nombre?.trim());

            // Limpieza profunda de fechas antes de enviar
            const cleanDate = (d: unknown): Date | null => {
                if (!d || d === "" || d === "undefined" || d === "null") return null;
                const dt = new Date(d as string | number | Date);
                return isNaN(dt.getTime()) ? null : dt;
            };

            const cleanLicencias = (formData.licenseInfo?.licencias || []).map(lic => ({
                ...lic,
                fechaVencimiento: cleanDate(lic.fechaVencimiento)
            })).filter(lic => lic.categoria && lic.fechaVencimiento);

            const cleanExperiencias = (formData.experiencias || []).map(exp => ({
                ...exp,
                fechaInicio: cleanDate(exp.fechaInicio),
                fechaFin: cleanDate(exp.fechaFin),
            })).filter(exp => exp.empresa?.trim());

            const basicInfo = formData.basicInfo;
            if (!basicInfo.nombres?.trim() || !basicInfo.apellidos?.trim()) {
                toast.error("Nombres y Apellidos son obligatorios.");
                return;
            }

            const userData = {
                ...basicInfo,
                fechaNacimiento: cleanDate(basicInfo.fechaNacimiento),
                ...formData.licenseInfo,
                licencias: cleanLicencias,
                ...formData.hojaVida,
                experiencias: cleanExperiencias,
                certificados: certs,
                password: basicInfo.password || "",
                nombres: (basicInfo.nombres || "").trim(),
                apellidos: (basicInfo.apellidos || "").trim(),
            };

            const result = await createUser(userData as UsuarioCreate);

            if (result.success) {
                clearDraft();
                toast.success("Usuario creado exitosamente ✓");
                router.push(`/dashboard/usuarios/${(result.data as { id: string })?.id}/editar`);
            } else {
                if (result.errors) {
                    const errorMessages = Object.entries(result.errors)
                        .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
                        .join(" | ");
                    toast.error(`Error de validación: ${errorMessages}`, { duration: 10000 });
                } else {
                    // Mostrar error específico de la DB si es posible
                    const msg = result.message || result.error || "Error de base de datos";
                    toast.error(`No se pudo crear: ${msg}`, { duration: 10000 });
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado. Su borrador fue guardado.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Draft Banner */}
            {hasDraft && (
                <div className="flex items-center justify-between bg-brand/5 border border-brand/20 px-5 py-3">
                    <div className="flex items-center gap-3">
                        <Save className="w-4 h-4 text-primary shrink-0" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                            Borrador guardado automáticamente
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={clearDraft}
                        className="text-[10px] font-black uppercase text-slate-900 hover:text-red-500 tracking-widest transition-colors"
                    >
                        Descartar
                    </button>
                </div>
            )}

            {/* ── Stepper ─────────────────────────── */}
            <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                {/* Top bar progress */}
                <div className="h-1 bg-slate-100">
                    <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${((step - 1) / (visibleSteps.length - 1)) * 100}%` }}
                    />
                </div>

                {/* Steps */}
                <div className="flex overflow-x-auto">
                    {visibleSteps.map((s, idx) => {
                        const isCompleted = s.id < step;
                        const isCurrent  = s.id === step;
                        const StepIcon   = s.icon;
                        return (
                            <button
                                key={s.id}
                                type="button"
                                className={cn(
                                    "flex-1 flex flex-col items-center justify-center py-4 px-2 min-w-[80px] border-r border-slate-100 last:border-r-0 transition-colors duration-200",
                                    isCurrent  ? "bg-primary text-white" :
                                    isCompleted ? "bg-white text-primary cursor-pointer hover:bg-slate-50" :
                                    "bg-white text-slate-900 cursor-default"
                                )}
                                onClick={() => handleJumpToStep(s.id)}
                                disabled={!isCompleted && !isCurrent}
                            >
                                <div className={cn(
                                    "w-8 h-8 flex items-center justify-center border mb-2 transition-all",
                                    isCurrent   ? "border-white/30 bg-white/10" :
                                    isCompleted ? "border-primary/20 bg-primary/10" :
                                    "border-slate-100 bg-slate-50"
                                )}>
                                    {isCompleted
                                        ? <Check size={14} className="text-primary" />
                                        : <StepIcon size={14} />
                                    }
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                                    {s.short}
                                </span>
                                <span className={cn(
                                    "text-[9px] font-bold mt-0.5 hidden sm:block",
                                    isCurrent ? "text-white/80" : "text-slate-900"
                                )}>
                                    {s.title}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Step Content ─────────────────────── */}
            <div className="bg-white border border-slate-200 shadow-sm">
                <div className="p-6 md:p-8">
                    {step === 1 && (
                        <WizardBasicInfoStep
                            onNext={handleNextBasicInfo}
                            initialData={formData.basicInfo as Parameters<typeof WizardBasicInfoStep>[0]["initialData"]}
                            isAdmin={isAdmin}
                        />
                    )}
                    {step === 2 && (
                        <WizardLicenseStep
                            onNext={handleNextLicense}
                            onBack={handleBack}
                            initialData={formData.licenseInfo}
                            isAdmin={isAdmin}
                        />
                    )}
                    {step === 3 && (
                        <WizardHojaVidaStep
                            onNext={handleNextHojaVida}
                            onBack={handleBack}
                            initialData={formData.hojaVida}
                            isAdmin={isAdmin}
                        />
                    )}
                    {step === 4 && (
                        <WizardCertificadosStep
                            title="Formación Académica"
                            description="Agrega estudios, títulos y capacitaciones."
                            category="ESTUDIO"
                            onNext={handleNextAcademic}
                            onBack={handleBack}
                            initialData={formData.academicInfo}
                            isAdmin={isAdmin}
                        />
                    )}
                    {step === 5 && (
                        <WizardCertificadosStep
                            title="Certificados Legales"
                            description="Antecedentes de Procuraduría, Contraloría, Policía y otros."
                            category="LEGAL"
                            onNext={handleNextLegal}
                            onBack={handleBack}
                            initialData={formData.legalInfo}
                            isAdmin={isAdmin}
                        />
                    )}
                    {step === 6 && (
                        <WizardExperienciasStep
                            onNext={handleNextExperiencias}
                            onBack={handleBack}
                            initialData={formData.experiencias}
                            isAdmin={isAdmin}
                        />
                    )}
                    {step === 7 && (
                        <WizardConfirmationStep
                            data={formData}
                            onBack={handleBack}
                            onSave={handleFinalSave}
                            isSaving={isSaving}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
