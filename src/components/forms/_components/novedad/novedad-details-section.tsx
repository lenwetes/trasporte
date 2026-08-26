import * as React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { 
    Calendar, 
    ShieldAlert, 
    MoreHorizontal, 
    DollarSign 
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NovedadCreate } from "@/lib/validations";

interface NovedadDetailsSectionProps {
    register: UseFormRegister<NovedadCreate>;
    errors: FieldErrors<NovedadCreate>;
}

export function NovedadDetailsSection({
    register,
    errors,
}: NovedadDetailsSectionProps) {
    return (
        <div className="bg-white border border-primary/10 shadow-sm radius-0 overflow-hidden relative group transition-all hover:border-secondary/40">
            <div className="bg-slate-900 border-b border-white/5 px-8 py-6 flex items-center gap-4">
                <div className="h-10 w-1 bg-secondary" />
                <div>
                    <h4 className="text-[13px] font-black uppercase tracking-[0.2em] text-white">Detalles de la Incidencia</h4>
                    <p className="text-[9px] font-bold text-white uppercase tracking-widest mt-1 italic">Clasificación, Fecha e Impacto Operativo</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-primary/5">
                <div className="p-10 lg:p-12 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldAlert size={14} className="text-secondary" />
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Categorización</Label>
                    </div>
                    <div className="relative">
                        <select 
                            id="tipo" 
                            {...register("tipo")}
                            className="w-full h-16 radius-0 border border-primary/10 bg-white px-6 text-[11px] font-black uppercase tracking-widest appearance-none focus:border-secondary transition-all outline-none cursor-pointer pr-10 shadow-sm hover:bg-slate-50"
                        >
                            <option value="MULTA">Protocolo de Infracción (Multa)</option>
                            <option value="COMPARENDO">Comparendo de Tránsito (Civil)</option>
                            <option value="FALLA_MECANICA">Detección de Falla Mecánica</option>
                            <option value="CONDUCTA">Reporte de Conducta Institucional</option>
                            <option value="OTRO">Otros Hechos / Observación</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-primary/20">
                            <MoreHorizontal className="h-4 w-4" />
                        </div>
                    </div>
                    {errors.tipo && <p className="text-[10px] text-red-600 font-black uppercase tracking-tight select-none">{errors.tipo.message}</p>}
                </div>

                <div className="p-10 lg:p-12 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar size={14} className="text-secondary" />
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Temporalidad del Hecho</Label>
                    </div>
                    <Input
                        type="date"
                        {...register("fecha")}
                        className="h-16 radius-0 border-primary/10 bg-white px-6 font-mono text-[11px] font-black uppercase tracking-widest focus-visible:ring-1 focus-visible:ring-secondary transition-all shadow-sm"
                    />
                    {errors.fecha && <p className="text-[10px] text-red-600 font-black uppercase tracking-tight select-none">{errors.fecha.message}</p>}
                </div>

                <div className="p-10 lg:p-12 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <DollarSign size={14} className="text-secondary" />
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Gravamen Económico</Label>
                    </div>
                    <div className="relative">
                        <Input
                            type="number"
                            step="any"
                            {...register("monto")}
                            className="h-16 radius-0 border-primary/10 bg-white px-6 font-mono text-[11px] font-black uppercase tracking-widest focus-visible:ring-1 focus-visible:ring-secondary transition-all shadow-sm pl-12"
                            placeholder="0.00"
                        />
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-primary font-black text-sm italic">
                            $
                        </div>
                    </div>
                    {errors.monto && <p className="text-[10px] text-red-600 font-black uppercase tracking-tight select-none">{errors.monto.message}</p>}
                </div>
            </div>
        </div>
    );
}
