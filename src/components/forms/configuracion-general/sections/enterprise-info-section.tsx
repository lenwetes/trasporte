"use client";

import { UseFormReturn } from "react-hook-form";
import { ConfiguracionGlobal } from "@/lib/validations";

interface EnterpriseInfoSectionProps {
    form: UseFormReturn<ConfiguracionGlobal>;
}

export function EnterpriseInfoSection({ form }: EnterpriseInfoSectionProps) {
    const {
        register,
        formState: { errors },
    } = form;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre de la Empresa</label>
                    <input 
                        {...register("nombreEmpresa")} 
                        className="w-full h-12 bg-slate-50 border border-slate-200 px-4 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                    />
                    {errors.nombreEmpresa && <span className="text-[10px] font-bold text-red-500 mt-1 block">{errors.nombreEmpresa.message}</span>}
                </div>
                <div className="md:col-span-1 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NIT</label>
                    <input 
                        {...register("nit")} 
                        placeholder="900.000.000-0"
                        className="w-full h-12 bg-slate-50 border border-slate-200 px-4 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                    />
                </div>
                <div className="md:col-span-1 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Representante Legal</label>
                    <input 
                        {...register("representanteLegal")} 
                        placeholder="Nombre completo" 
                        className="w-full h-12 bg-slate-50 border border-slate-200 px-4 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teléfono de Contacto</label>
                    <input 
                        {...register("telefono")} 
                        placeholder="+57 605 ..." 
                        type="tel" 
                        className="w-full h-12 bg-slate-50 border border-slate-200 px-4 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Corporativo</label>
                    <input 
                        {...register("email")} 
                        placeholder="gerencia@empresa.com" 
                        type="email" 
                        className="w-full h-12 bg-slate-50 border border-slate-200 px-4 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                    />
                    {errors.email && <span className="text-[10px] font-bold text-red-500 mt-1 block">{errors.email.message}</span>}
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dirección Principal</label>
                    <input 
                        {...register("direccion")} 
                        placeholder="Calle # ..." 
                        className="w-full h-12 bg-slate-50 border border-slate-200 px-4 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                    />
                </div>
            </div>
        </div>
    );
}
