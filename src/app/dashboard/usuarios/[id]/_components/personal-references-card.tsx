import { Contact, Phone, User, CheckCircle2 } from "lucide-react";

interface PersonalReferencesCardProps {
    referencias: any[];
}

export function PersonalReferencesCard({
    referencias,
}: PersonalReferencesCardProps) {
    return (
        <div className="bg-white border border-slate-200 radius-0 overflow-hidden shadow-sm mt-10 mb-10">
            <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Contact size={18} className="text-brand" />
                    <h4 className="text-[14px] font-bold uppercase tracking-[0.2em] text-brand">Referencias Personales</h4>
                </div>
                <div className="flex items-center gap-2 opacity-50 italic">
                    <CheckCircle2 size={14} className="text-[#018790]" />
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest leading-none">REGISTRO_VERIFICADO</span>
                </div>
            </div>

            <div className="p-8">
                {referencias && referencias.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {referencias.map((ref: any, i: number) => (
                            <div key={i} className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100 border border-slate-100 radius-0 group hover:border-brand/40 transition-all bg-slate-50/50 shadow-sm">
                                <div className="p-5 flex items-center gap-4 flex-1">
                                    <div className="h-10 w-10 border border-slate-200 bg-white flex items-center justify-center text-slate-900 radius-0 group-hover:bg-brand group-hover:border-brand group-hover:text-white transition-all shadow-sm">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-black uppercase text-slate-900 group-hover:text-brand transition-colors tracking-tight">
                                            {ref.nombre}
                                        </p>
                                        <p className="text-[10px] font-bold text-[#018790] uppercase tracking-widest opacity-70 italic">
                                            {ref.ocupacion || "Referencia Directa"}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-5 flex items-center gap-4 bg-white md:w-56 shrink-0 lg:justify-center border-l-2 border-slate-100">
                                    <div className="h-8 w-8 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 radius-0 group-hover:bg-brand/10 transition-colors">
                                        <Phone size={14} className="text-brand" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Contacto Directo</span>
                                        <span className="text-[13px] font-bold text-slate-900 tracking-widest font-mono italic">{ref.telefono || "000 000 0000"}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-20 text-center border border-slate-100 bg-slate-50 radius-0 opacity-40">
                         <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic leading-loose">
                            SIN_REFERENCIAS_PERSONALES_VINCULADAS_AL_EXPEDIENTE
                         </span>
                    </div>
                )}
            </div>
        </div>
    );
}
