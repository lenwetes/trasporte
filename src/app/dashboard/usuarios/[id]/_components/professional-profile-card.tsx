import { ClipboardList, CheckCircle, Quote } from "lucide-react";

interface ProfessionalProfileCardProps {
    perfilProfesional: string | null | undefined;
}

export function ProfessionalProfileCard({
    perfilProfesional,
}: ProfessionalProfileCardProps) {
    return (
        <div className="bg-white border border-slate-200 radius-0 overflow-hidden mt-8 shadow-sm">
            <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ClipboardList size={18} className="text-brand" />
                    <h4 className="text-[14px] font-bold uppercase tracking-[0.2em] text-brand">Perfil Profesional</h4>
                </div>
                <div className="flex items-center gap-3 opacity-50 italic">
                    <CheckCircle size={14} className="text-[#018790]" />
                    <span className="text-[9px] font-bold uppercase text-slate-500 tracking-widest leading-none">V-2026.VERIFICADO</span>
                </div>
            </div>

            <div className="p-10 relative group bg-slate-50/20">
                <Quote size={40} className="absolute top-6 right-6 text-slate-100 group-hover:text-brand/10 transition-colors pointer-events-none" />
                
                {perfilProfesional ? (
                    <div className="relative z-10">
                        <p className="text-[14px] md:text-[16px] font-bold text-slate-800 uppercase tracking-wide leading-relaxed italic border-l-4 border-brand/20 pl-8 transition-all hover:border-brand">
                            &quot;{perfilProfesional}&quot;
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <p className="text-[11px] font-bold uppercase text-slate-400 tracking-[0.2em]">
                            ESTADO: PERFIL_SIN_DEFINIR
                        </p>
                        <p className="text-[13px] font-medium text-slate-500 uppercase leading-loose border-l-2 border-slate-200 pl-6 py-1 italic">
                            No se ha definido un perfil profesional detallado aún. El sistema requiere una descripción de habilidades y experiencia para habilitar módulos de selección avanzada en el SGIT.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
