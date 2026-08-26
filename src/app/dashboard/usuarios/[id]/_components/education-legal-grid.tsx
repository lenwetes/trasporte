import { GraduationCap, Shield, BookOpen, Scale, Calendar, FileCheck, Landmark } from "lucide-react";

interface CertificadoGridItem {
    categoria?: string | null;
    nombre: string;
    institucion?: string | null;
    fechaVencimiento?: string | Date | null;
}

interface EducationLegalGridProps {
    certificados: CertificadoGridItem[];
}

export function EducationLegalGrid({ certificados }: EducationLegalGridProps) {
    const academic = certificados?.filter((c) => c.categoria === "ESTUDIO" || !c.categoria) || [];
    const legal = certificados?.filter((c) => c.categoria === "LEGAL") || [];

    return (
        <div className="flex flex-col gap-10 h-full">
            {/* Formación Académica - Ancho Completo */}
            <div className="bg-white border border-slate-200 radius-0 flex flex-col shadow-sm w-full overflow-hidden">
                <div className="bg-white px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <GraduationCap size={18} className="text-brand" />
                        <h4 className="text-[14px] font-black uppercase tracking-[0.2em] text-brand">Formación Académica</h4>
                    </div>
                    <div className="flex items-center gap-2 opacity-30 italic">
                         <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 leading-none">EXPEDIENTE_FORMACIÓN</span>
                         <BookOpen size={14} className="text-slate-500" />
                    </div>
                </div>
                
                <div className="p-8 space-y-4">
                    {academic.length > 0 ? (
                        academic.map((cert, i: number) => (
                            <div key={i} className="group border border-slate-100 hover:border-brand/40 p-6 bg-slate-50/30 radius-0 transition-all hover:bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex-1">
                                    <p className="text-[14px] font-black uppercase text-slate-800 group-hover:text-brand transition-colors tracking-tight leading-none mb-1">
                                        {cert.nombre}
                                    </p>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic opacity-80 leading-none">
                                        Registro Académico Verificado por Coopetraes SGIT
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 bg-white px-5 py-3 border border-slate-100 radius-0 min-w-[280px] group-hover:bg-slate-50 transition-colors">
                                     <div className="h-10 w-10 border border-slate-100 flex items-center justify-center text-brand opacity-60 radius-0 shrink-0">
                                         <Landmark size={14} />
                                     </div>
                                     <div className="flex flex-col">
                                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Institución de formación:</span>
                                         <span className="text-[12px] font-black text-slate-600 uppercase italic opacity-80 leading-none">
                                            {cert.institucion || "PENDIENTE"}
                                         </span>
                                     </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-16 text-center border border-slate-50 bg-slate-50/50 radius-0 opacity-40 italic">
                             <span className="text-[11px] font-bold uppercase tracking-widest">SIN_FORMACIÓN_DATOS_EXPEDIENTE</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Documentos Legales - Ancho Completo */}
            <div className="bg-white border border-slate-200 radius-0 flex flex-col shadow-sm w-full overflow-hidden">
                <div className="bg-white px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield size={18} className="text-brand" />
                        <h4 className="text-[14px] font-black uppercase tracking-[0.2em] text-brand">Legal & Antecedentes</h4>
                    </div>
                    <div className="flex items-center gap-2 opacity-30 italic">
                         <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 leading-none">EXPEDIENTE_LEGAL</span>
                         <Scale size={14} className="text-slate-500" />
                    </div>
                </div>

                <div className="p-8 space-y-4">
                    {legal.length > 0 ? (
                        legal.map((cert, i: number) => (
                            <div key={i} className="group border border-slate-100 hover:border-emerald-500 p-6 bg-slate-50/30 radius-0 transition-all hover:bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-4 flex-1">
                                     <div className="h-10 w-10 border border-slate-100 flex items-center justify-center text-emerald-600 bg-white radius-0 shrink-0 group-hover:bg-emerald-50 transition-all shadow-sm">
                                         <FileCheck size={18} />
                                     </div>
                                     <div className="flex flex-col">
                                         <p className="text-[14px] font-black uppercase text-slate-800 leading-tight tracking-tight mb-1">
                                            {cert.nombre}
                                         </p>
                                         <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none italic opacity-60">Validación vigente de antecedentes operativos</span>
                                     </div>
                                </div>
                                <div className="flex items-center gap-4 bg-white px-5 py-3 border border-slate-100 radius-0 min-w-[280px] group-hover:bg-emerald-50 transition-colors">
                                    <div className="h-10 w-10 border border-slate-100 flex items-center justify-center text-emerald-600 opacity-60 radius-0 shrink-0">
                                        <Calendar size={14} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Vigencia del registro:</span>
                                        <span className="text-[12px] font-black uppercase tracking-widest text-emerald-600 italic leading-none">
                                            {cert.fechaVencimiento ? new Date(cert.fechaVencimiento).toLocaleDateString() : "PERMANENTE"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-16 text-center border border-slate-50 bg-slate-50/50 radius-0 opacity-40 italic">
                             <span className="text-[11px] font-bold uppercase tracking-widest">SIN_ANTECEDENTES_DATOS_EXPEDIENTE</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
