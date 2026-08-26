import { getUsuarioById, getConfiguracionGlobal } from "@/actions";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { HojaVidaControls } from "@/components/hoja-vida-controls";
import { UsuarioWithRelations } from "@/types";
import { CVHeader } from "./_components/cv-header";
import { SectionTitle } from "./_components/cv-shared";
import {
    CVPersonalData,
    CVSocialSecurity,
    CVLicenseInfo,
    CVExperience,
    CVReferences,
} from "./_components/cv-sections";
import { HojaVida } from "@prisma/client";
import { FileText, GraduationCap } from "lucide-react";

interface HojaVidaPageProps {
    params: Promise<{ id: string }>;
}

export default async function HojaVidaPage({ params }: HojaVidaPageProps) {
    const { id } = await params;
    const [result, configRes] = await Promise.all([
        getUsuarioById(id),
        getConfiguracionGlobal(),
    ]);

    const companyConfig = configRes.success
        ? (configRes.data as import("@prisma/client").ConfiguracionGlobal)
        : null;

    if (!result.success || !result.data) {
        notFound();
    }

    const usuario = result.data as UsuarioWithRelations;
    const hojaVida = (usuario.hojaVida as Partial<HojaVida>) || {};

    return (
        <div className="min-h-screen bg-slate-50 py-10 print:bg-white print:py-0">
            <div className="max-w-5xl mx-auto space-y-8 print:space-y-0">
                {/* Controls - Hidden in Print */}
                <div className="print:hidden">
                    <HojaVidaControls
                        usuarioId={id}
                        companyConfig={companyConfig}
                            data={{
                                usuario: { 
                                    ...usuario,
                                    documentoIdentidad: usuario.documentoIdentidad ? { nombreUnico: usuario.documentoIdentidad.nombreUnico } : null
                                },
                                hojaVida: usuario.hojaVida ? { ...usuario.hojaVida } : null,
                                numeroLicencia: usuario.numeroLicencia,
                                licencias: usuario.licencias?.map((l) => ({
                                    ...l,
                                    archivo: l.archivo ? { nombreUnico: l.archivo.nombreUnico } : null
                                })),
                                certificados: usuario.certificados?.map((c) => ({
                                    nombre: c.nombre,
                                    institucion: c.institucion,
                                    fechaEmision: c.fechaEmision,
                                    archivo: c.archivo ? { nombreUnico: c.archivo.nombreUnico } : null,
                                })) ?? [],
                                experienciasLaborales: usuario.experienciasLaborales?.map((e) => ({
                                    cargo: e.cargo,
                                    empresa: e.empresa,
                                    tiempoLaborado: e.tiempoLaborado,
                                    jefeInmediato: e.jefeInmediato,
                                    telefonoJefe: e.telefonoJefe,
                                    archivo: e.archivo ? { nombreUnico: e.archivo.nombreUnico } : null,
                                })) ?? [],
                                referenciasPersonales: usuario.referenciasPersonales || [],
                            }}
                        />
                </div>

                {/* Paper Container */}
                <div className="bg-white border-y md:border border-slate-900 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)] p-10 md:p-16 print:border-none print:p-0 print:shadow-none min-h-[1100px]">
                    <CVHeader usuario={usuario} />

                    <CVPersonalData usuario={usuario} />
                    <CVSocialSecurity usuario={usuario} />
                    <CVLicenseInfo usuario={usuario} />

                    {hojaVida.perfilProfesional && (
                        <div className="mb-12 print:mb-8">
                            <SectionTitle title="Perfil Profesional & Competencias" />
                            <div className="p-8 bg-slate-50 border-l-2 border-slate-900 italic text-slate-700 text-[13px] leading-relaxed">
                                &quot;{hojaVida.perfilProfesional}&quot;
                            </div>
                        </div>
                    )}

                    <div className="mb-12 print:mb-8">
                        <SectionTitle title="Formación Académica & Otros Estudios" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-slate-900 border-t-0 print:border-none print:p-2">
                            {usuario.certificados && usuario.certificados.length > 0 ? (
                                usuario.certificados.map((cert) => (
                                    <div key={cert.id} className="flex items-start gap-4 p-4 border border-slate-100 bg-white group hover:border-brand transition-colors">
                                        <div className="bg-slate-50 p-3 group-hover:bg-brand/5">
                                            <GraduationCap size={20} className="text-slate-400 group-hover:text-brand" />
                                        </div>
                                        <div className="flex-1 flex flex-col gap-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-900 leading-tight">
                                                    {cert.nombre}
                                                </h4>
                                                <span className="text-[10px] font-black text-slate-400">
                                                    {cert.fechaEmision ? format(new Date(cert.fechaEmision), "yyyy") : "S/F"}
                                                </span>
                                            </div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">{cert.institucion}</p>
                                            
                                            {cert.archivo?.nombreUnico && (
                                                <a
                                                    href={`/api/files/${cert.archivo.nombreUnico}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-2 inline-flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-brand hover:text-black transition-colors"
                                                >
                                                    <FileText size={10} /> VER_SOPORTE_DIGITAL
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[10px] uppercase font-black text-slate-400">No se registran estudios adicionales.</p>
                            )}
                        </div>
                    </div>

                    <CVExperience usuario={usuario} />
                    <CVReferences usuario={usuario} />

                    {/* Signature Section */}
                    <div className="mt-20 flex flex-col items-start gap-4 pt-10 border-t border-slate-200">
                        <div className="w-64 h-[1px] bg-slate-900" />
                        <div className="flex flex-col">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">
                                Firma del Colaborador
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                C.C. {usuario.numeroDocumento}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `@media print { 
                        @page { margin: 1cm; size: letter; } 
                        body { background: white !important; overflow: visible !important; } 
                        .print\\:hidden { display: none !important; } 
                        .shadow-none { border: none !important; box-shadow: none !important; }
                    }`,
                }}
            />
        </div>
    );
}
