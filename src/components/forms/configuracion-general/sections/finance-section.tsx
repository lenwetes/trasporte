"use client";

import { UseFormReturn } from "react-hook-form";
import { ConfiguracionGlobal } from "@/lib/validations";

interface FinanceSectionProps {
    form: UseFormReturn<ConfiguracionGlobal>;
}

export function FinanceSection({ form }: FinanceSectionProps) {
    const {
        register,
        formState: { errors },
    } = form;

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 space-y-8">
            <div className="space-y-1 pb-4 border-b border-slate-200/50">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Protocolo Financiero Maestros</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Configura el core económico y parámetros de automatización operativa.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Costo Base FUEC ($ COP)</label>
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs group-focus-within:text-brand transition-colors">$</span>
                        <input 
                            {...register("costoBaseFuec")} 
                            type="number" 
                            placeholder="30000" 
                            className="w-full h-12 bg-white border border-slate-200 pl-8 pr-4 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                        />
                    </div>
                    {errors.costoBaseFuec && <span className="text-[10px] font-bold text-red-500 mt-1 block">{errors.costoBaseFuec.message}</span>}
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cuota de Administración ($ COP)</label>
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs group-focus-within:text-brand transition-colors">$</span>
                        <input 
                            {...register("montoCuotaAdministracion")} 
                            type="number" 
                            placeholder="80000" 
                            className="w-full h-12 bg-white border border-slate-200 pl-8 pr-4 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                        />
                    </div>
                    {errors.montoCuotaAdministracion && <span className="text-[10px] font-bold text-red-500 mt-1 block">{errors.montoCuotaAdministracion.message}</span>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Día de Corte Mensual</label>
                    <input 
                        {...register("diaCorteMensual")} 
                        type="number" 
                        min="1" 
                        max="28" 
                        placeholder="5" 
                        className="w-full h-12 bg-white border border-slate-200 px-4 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                    />
                    {errors.diaCorteMensual && <span className="text-[10px] font-bold text-red-500 mt-1 block">{errors.diaCorteMensual.message}</span>}
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Umbral Bloqueo Mora ($)</label>
                    <input 
                        {...register("umbralBloqueoMora")} 
                        type="number" 
                        placeholder="200000" 
                        className="w-full h-12 bg-white border border-slate-200 px-4 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                    />
                    {errors.umbralBloqueoMora && <span className="text-[10px] font-bold text-red-500 mt-1 block">{errors.umbralBloqueoMora.message}</span>}
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">% Mora Diaria</label>
                    <div className="relative group">
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs group-focus-within:text-brand transition-colors">%</span>
                        <input 
                            {...register("porcentajeMoraDiaria")} 
                            type="number" 
                            step="0.01" 
                            placeholder="0.1" 
                            className="w-full h-12 bg-white border border-slate-200 px-4 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                        />
                    </div>
                    {errors.porcentajeMoraDiaria && <span className="text-[10px] font-bold text-red-500 mt-1 block">{errors.porcentajeMoraDiaria.message}</span>}
                </div>
            </div>
        </div>
    );
}
