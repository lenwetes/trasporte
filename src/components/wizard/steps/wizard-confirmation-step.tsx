"use client";

import { Button } from "@/components/ui/button";
import {
    CheckCircle2,
    User,
    FileText,
    Briefcase,
    GraduationCap,
    ShieldCheck,
    ArrowLeft,
    Check,
    Loader2,
    HeartPulse,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardConfirmationStepProps {
    data: {
        basicInfo?: {
            nombres?: string | null;
            apellidos?: string | null;
            tipoDocumento?: string | null;
            numeroDocumento?: string | null;
            fechaNacimiento?: string | Date | null;
            email?: string | null;
            rol?: string | null;
        };
        licenseInfo?: {
            numeroLicencia?: string | null;
            licencias?: {
                categoria: string;
                servicio: string;
                fechaVencimiento: string | Date;
            }[];
        };
        hojaVida?: {
            eps?: string | null;
            arl?: string | null;
            contactoEmergenciaNombre?: string | null;
            contactoEmergenciaTelefono?: string | null;
        };
        academicInfo?: {
            nombre?: string;
            institucion?: string | null;
            fechaEmision?: string | null;
        }[];
        legalInfo?: {
            nombre?: string;
            institucion?: string | null;
            fechaEmision?: string | null;
        }[];
        experiencias?: {
            empresa?: string;
            cargo?: string;
            tiempoLaborado?: string | null;
        }[];
    };
    onBack: () => void;
    onSave: () => void;
    isSaving: boolean;
}

export function WizardConfirmationStep({
    data,
    onBack,
    onSave,
    isSaving,
}: WizardConfirmationStepProps) {
    const calculateAge = (date?: string | Date | null) => {
        if (!date) return null;
        const today = new Date();
        const birthDate = new Date(date);
        if (isNaN(birthDate.getTime())) return null;
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
    };

    const age = calculateAge(data.basicInfo?.fechaNacimiento);

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-emerald-600 rounded-none p-8 text-white border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CheckCircle2 size={160} />
                </div>
                
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white border-4 border-slate-900 flex items-center justify-center mb-4">
                        <Check size={32} className="text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">
                        Protocolo de <span className="text-emerald-200">Finalización</span>
                    </h3>
                    <p className="text-emerald-50 mt-2 max-w-md text-[10px] font-black uppercase tracking-widest leading-relaxed">
                        Audite la información consolidada antes de la inyección de datos en la base nacional de COOPETRAES.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Perfil Maestro */}
                <div className="bg-white border-2 border-slate-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                        <div className="p-2 bg-slate-100 text-slate-900">
                            <User size={18} />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Perfil Maestro</h4>
                    </div>
                    <div className="space-y-1">
                        <p className="text-lg font-black text-slate-900 leading-tight">
                            {data.basicInfo?.nombres} {data.basicInfo?.apellidos}
                        </p>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                            {data.basicInfo?.rol}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-black uppercase">{data.basicInfo?.tipoDocumento}</span>
                            <span className="text-[11px] font-bold text-slate-700">{data.basicInfo?.numeroDocumento}</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-50 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-slate-900 uppercase">Edad</span>
                                <span className="text-xs font-black text-slate-900">{age ? `${age} AÑOS` : "NO DEFINIDA"}</span>
                            </div>
                            <p className="text-[10px] text-slate-900 font-bold">{data.basicInfo?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Habilitación Técnica (Licenses) */}
                <div className="bg-white border-2 border-slate-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                        <div className="p-2 bg-slate-100 text-slate-900">
                            <ShieldCheck size={18} />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Habilitación Técnica</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black text-slate-900 uppercase">Licencia No.</span>
                            <span className="text-sm font-black text-slate-900">{data.licenseInfo?.numeroLicencia || "PENDIENTE"}</span>
                        </div>
                        <div className="space-y-2">
                            {data.licenseInfo?.licencias?.map((lic, i) => (
                                <div key={i} className="bg-slate-50 p-2 border border-slate-100 flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-900 uppercase">CAT {lic.categoria}</span>
                                        <span className="text-[8px] font-bold text-slate-900 uppercase">{lic.servicio}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[8px] text-slate-900 uppercase block leading-none">Vence</span>
                                        <span className="text-[10px] font-black text-slate-700">
                                            {lic.fechaVencimiento ? new Date(lic.fechaVencimiento).toLocaleDateString('es-CO', { year:'numeric', month:'short' }).toUpperCase() : '-'}
                                        </span>
                                    </div>
                                </div>
                            )) || <p className="text-[10px] text-slate-900 italic">No se registraron licencias operativas.</p>}
                        </div>
                    </div>
                </div>

                {/* Salud & Riesgos */}
                <div className="bg-white border-2 border-slate-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                        <div className="p-2 bg-slate-100 text-slate-900">
                            <HeartPulse size={18} />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Salud & Riesgos</h4>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[9px] font-black text-slate-900 uppercase mb-1">EPS Entidad</p>
                                <p className="text-xs font-black text-brand uppercase">{data.hojaVida?.eps || "Pte"}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-900 uppercase mb-1">ARL Aseguradora</p>
                                <p className="text-xs font-black text-brand uppercase">{data.hojaVida?.arl || "Pte"}</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-50">
                            <p className="text-[9px] font-black text-slate-900 uppercase mb-2">Contacto de Emergencia</p>
                            <p className="text-xs font-black text-slate-900 uppercase">{data.hojaVida?.contactoEmergenciaNombre || "No registrado"}</p>
                            <p className="text-[10px] font-bold text-slate-900 mt-1">{data.hojaVida?.contactoEmergenciaTelefono || "N/A"}</p>
                        </div>
                    </div>
                </div>

                {/* Formación Académica & Legal */}
                <div className="bg-white border-2 border-slate-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] lg:col-span-2">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                        <div className="p-2 bg-slate-100 text-slate-900">
                            <GraduationCap size={18} />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Certificaciones Capturadas</h4>
                        <span className="ml-auto bg-slate-100 px-2 py-0.5 text-[9px] font-black text-slate-900 uppercase tracking-widest">
                            {((data.academicInfo?.length || 0) + (data.legalInfo?.length || 0))} TOTAL
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-900 mb-2">Académica</h5>
                            {(data.academicInfo || []).length > 0 ? (
                                data.academicInfo?.map((item, i) => (
                                    <div key={i} className="flex flex-col border-l-2 border-emerald-500 pl-3 py-0.5">
                                        <p className="text-[10px] font-black text-slate-800 leading-tight uppercase">{item.nombre}</p>
                                        <p className="text-[8px] font-bold text-slate-900 uppercase">{item.institucion}</p>
                                    </div>
                                ))
                            ) : <p className="text-[9px] text-slate-900 italic uppercase">Sin registros académicos</p>}
                        </div>
                        <div className="space-y-3">
                            <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-900 mb-2">Legal / Capacitación</h5>
                            {(data.legalInfo || []).length > 0 ? (
                                data.legalInfo?.map((item, i) => (
                                    <div key={i} className="flex flex-col border-l-2 border-blue-500 pl-3 py-0.5">
                                        <p className="text-[10px] font-black text-slate-800 leading-tight uppercase">{item.nombre}</p>
                                        <p className="text-[8px] font-bold text-slate-900 uppercase">{item.institucion}</p>
                                    </div>
                                ))
                            ) : <p className="text-[9px] text-slate-900 italic uppercase">Sin certificados legales</p>}
                        </div>
                    </div>
                </div>

                {/* Trayectoria */}
                <div className="bg-white border-2 border-slate-900 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                        <div className="p-2 bg-slate-100 text-slate-900">
                            <Briefcase size={18} />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Historial Laboral</h4>
                    </div>
                    {data.experiencias && data.experiencias.length > 0 ? (
                        <div className="space-y-4">
                            {data.experiencias.map((exp, i) => (
                                <div key={i} className="group flex flex-col pl-3 border-l-2 border-slate-200 hover:border-brand transition-colors">
                                    <p className="text-[11px] font-black text-slate-900 leading-none uppercase">{exp.empresa}</p>
                                    <p className="text-[9px] font-bold text-slate-900 uppercase mt-1">{exp.cargo}</p>
                                    <p className="text-[8px] font-black text-brand uppercase mt-2">{exp.tiempoLaborado || "PERÍODO ND"}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[9px] text-slate-900 italic uppercase tracking-widest">Sin trayectoria registrada</p>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onBack}
                    disabled={isSaving}
                    className="flex items-center gap-2 text-slate-900 hover:text-slate-900"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm font-bold uppercase tracking-tight">Revisión Previa</span>
                </Button>

                <Button 
                    onClick={onSave}
                    disabled={isSaving}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[240px] h-14 rounded-xl shadow-xl shadow-emerald-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
                >
                    {isSaving ? (
                        <div className="flex items-center gap-3">
                            <Loader2 size={20} className="animate-spin" />
                            <span className="text-sm font-black uppercase tracking-widest">Inyectando Datos...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black uppercase tracking-widest">Gestar Usuario Maestro</span>
                            <CheckCircle2 size={20} />
                        </div>
                    )}
                </Button>
            </div>
        </div>
    );
}
