import * as React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FileText, Bell, ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { NovedadCreate } from "@/lib/validations";

interface NovedadNarrativeSectionProps {
    register: UseFormRegister<NovedadCreate>;
    errors: FieldErrors<NovedadCreate>;
}

export function NovedadNarrativeSection({
    register,
    errors,
}: NovedadNarrativeSectionProps) {
    return (
        <div className="bg-white border border-primary/10 shadow-sm radius-0 overflow-hidden relative group transition-all">
            <div className="bg-white border-b border-primary/5 px-8 py-6 flex items-center gap-4">
                <div className="h-10 w-1 bg-slate-900" />
                <div>
                    <h4 className="text-[13px] font-black uppercase tracking-[0.2em] text-primary">Relato Técnico & Auditoría</h4>
                    <p className="text-[9px] font-bold text-primary uppercase tracking-widest mt-1 italic">Descripción Integral de Hechos para Expediente</p>
                </div>
            </div>
            
            <div className="p-10 lg:p-14 space-y-12">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-6 flex items-center justify-center bg-slate-50 text-slate-900">
                                <FileText size={14} />
                            </div>
                            <Label className="text-[12px] font-black uppercase tracking-[0.2em] text-primary/60">Análisis Narrativo</Label>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-primary/20 uppercase italic tracking-widest">REGISTRO AUDITABLE</span>
                    </div>
                    <textarea
                        rows={8}
                        {...register("descripcion")}
                        className="w-full radius-0 border border-primary/10 bg-slate-50 px-10 py-8 text-[14px] font-bold leading-relaxed focus:border-primary transition-all outline-none font-sans text-primary/80 min-h-[250px] shadow-inner placeholder:text-primary/10 italic"
                        placeholder="DESCRIPCIÓN TAXATIVA DE LOS HECHOS..."
                    />
                    {errors.descripcion && <p className="text-[10px] text-red-600 font-black uppercase tracking-tight pl-2 select-none">{errors.descripcion.message}</p>}
                </div>

                <div className="border-t border-primary/5 pt-10">
                    <div className="flex items-center gap-3 mb-8">
                        <Bell size={14} className="text-secondary" />
                        <Label className="text-[12px] font-black uppercase tracking-[0.2em] text-primary/60">Situación de Gestión Inicial</Label>
                    </div>
                    <div className="relative max-w-sm">
                        <select 
                            id="estado" 
                            {...register("estado")}
                            className="w-full h-16 radius-0 border border-primary/10 bg-white px-8 text-[11px] font-black uppercase tracking-widest appearance-none focus:border-primary transition-all outline-none cursor-pointer pr-10 shadow-sm"
                        >
                            <option value="PENDIENTE" className="text-amber-600">PENDIENTE DE REVISIÓN CENTRAL</option>
                            <option value="EN_PROCESO" className="text-blue-600">INICIAR GESTIÓN / INVESTIGACIÓN</option>
                            <option value="RESUELTO" className="text-green-600">CONCLUIDO / ARCHIVAR CASO</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-primary/20">
                            <ChevronRight className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
