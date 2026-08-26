import { Briefcase, History, User, Phone, Calendar, ArrowUpRight } from "lucide-react";

interface WorkExperienceCardProps {
    experiencias: any[];
}

export function WorkExperienceCard({ experiencias }: WorkExperienceCardProps) {
    return (
        <div className="bg-white border border-slate-200 radius-0 h-full overflow-hidden shadow-sm">
            <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Briefcase size={18} className="text-brand" />
                    <h4 className="text-[14px] font-bold uppercase tracking-[0.2em] text-brand">Trayectoria Laboral</h4>
                </div>
                <div className="flex items-center gap-3 opacity-50 italic">
                    <History size={14} className="text-[#018790]" />
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest leading-none">HISTORIAL_SINCRO</span>
                </div>
            </div>

            <div className="p-8 space-y-8">
                {experiencias && experiencias.length > 0 ? (
                    experiencias.map((exp: any, i: number) => (
                        <div key={i} className="relative pl-10 group">
                            {/* Línea de tiempo técnica */}
                            {i < experiencias.length - 1 && (
                                <div className="absolute left-[11px] top-6 bottom-[-32px] w-[2.5px] bg-slate-100 group-hover:bg-brand/20 transition-colors" />
                            )}
                            <div className="absolute left-0 top-1 h-6 w-6 border-2 border-[#018790] bg-white flex items-center justify-center p-1 radius-0 group-hover:bg-brand transition-all">
                                <div className="h-full w-full bg-slate-50 radius-0 group-hover:bg-white" />
                            </div>

                            <div className="bg-slate-50/50 border border-slate-100 p-6 radius-0 group-hover:bg-white group-hover:border-brand/30 transition-all">
                                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-4">
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-[15px] font-bold uppercase tracking-tight text-slate-800 leading-none group-hover:text-brand transition-colors">
                                            {exp.cargo}
                                        </h4>
                                        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest italic">{exp.empresa}</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white px-3 py-1.5 border border-slate-100 radius-0 shadow-sm">
                                        <Calendar size={12} className="text-brand" />
                                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
                                            {exp.fechaInicio ? new Date(exp.fechaInicio).getFullYear() : "????"} | {exp.fechaFin ? new Date(exp.fechaFin).getFullYear() : "ACTUALIDAD"}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100 border border-slate-100 mt-6">
                                    <div className="bg-white p-4 flex items-center gap-4 group/item transition-colors hover:bg-slate-50">
                                        <div className="h-10 w-10 border border-slate-100 flex items-center justify-center text-[#018790] radius-0 opacity-50 group-hover/item:opacity-100">
                                            <User size={14} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Referente Directo</span>
                                            <span className="text-[12px] font-bold text-slate-800 uppercase italic opacity-80">{exp.jefeInmediato || "NO_SUMINISTRADO"}</span>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 flex items-center gap-4 group/item transition-colors hover:bg-slate-50">
                                        <div className="h-10 w-10 border border-slate-100 flex items-center justify-center text-[#018790] radius-0 opacity-50 group-hover/item:opacity-100">
                                            <Phone size={14} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Contacto Directo</span>
                                            <span className="text-[12px] font-bold text-brand uppercase tracking-tighter">{exp.telefonoJefe || "NO_SUMINISTRADO"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button className="text-[10px] font-bold text-[#018790]/50 hover:text-brand uppercase tracking-widest flex items-center gap-1.5 transition-colors italic underline underline-offset-4 decoration-brand/20">
                                        VER_SOPORTE_DIGITAL <ArrowUpRight size={10} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-16 text-center border-2 border-dashed border-slate-200 bg-slate-50 radius-0 opacity-50">
                         <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">
                            SIN_REGISTROS_DE_TRAYECTORIA_VINCULADOS
                         </span>
                    </div>
                )}
            </div>
        </div>
    );
}
