"use client";

import { UseFormReturn } from "react-hook-form";
import { ConfiguracionGlobal } from "@/lib/validations";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandingSectionProps {
    form: UseFormReturn<ConfiguracionGlobal>;
    isUploading: boolean;
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export function BrandingSection({
    form,
    isUploading,
    handleFileUpload,
}: BrandingSectionProps) {
    const { register, watch } = form;
    const logoLocalPath = watch("logoLocalPath");
    const colorPrimario = watch("colorPrimario");

    return (
        <div className="space-y-10 py-4">
            <div className="space-y-6">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Identidad Visual Corporativa</label>

                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                    <div className="relative group">
                        <div className="w-32 h-32 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center p-4 transition-all group-hover:border-brand/40 group-hover:shadow-xl group-hover:shadow-brand/5 relative overflow-hidden">
                            {logoLocalPath || watch("logoUrl") ? (
                                <Image
                                    src={
                                        logoLocalPath
                                            ? logoLocalPath.startsWith("/")
                                                ? logoLocalPath
                                                : `/api/files/${logoLocalPath}`
                                            : watch("logoUrl") || ""
                                    }
                                    alt="Logo Empresa"
                                    fill
                                    className="object-contain p-2"
                                    unoptimized
                                />
                            ) : (
                                <div className="text-4xl filter grayscale group-hover:grayscale-0 transition-all opacity-20">🏢</div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="space-y-1">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Activo de Marca Principal</h4>
                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Sube el logo oficial de la empresa en alta resolución. Se recomienda formato PNG con transparencia o SVG.</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <label
                                htmlFor="logo-upload"
                                className={cn(
                                    "h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center transition-all cursor-pointer shadow-sm border",
                                    isUploading 
                                        ? "bg-slate-100 text-slate-400 border-slate-200 cursor-wait" 
                                        : "bg-white text-slate-900 border-slate-200 hover:border-brand hover:text-brand"
                                )}
                            >
                                {isUploading ? "Procesando..." : "Explorar Archivos"}
                                <input
                                    id="logo-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={isUploading}
                                />
                            </label>
                            
                            <div className="h-1 w-1 rounded-full bg-slate-200 hidden md:block" />
                            
                            <span className="text-[10px] font-bold text-slate-400 italic">Máximo 2MB, PNG/SVG</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enlace de Logo Externo</label>
                    <input
                        {...register("logoUrl")}
                        placeholder="https://your-cdn.com/logo.png"
                        className="w-full h-12 bg-slate-50 border border-slate-200 px-4 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                    />
                </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-100">
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">Cromática Institucional</label>
                    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                        <div 
                            className="h-12 w-24 rounded-xl border border-slate-200 relative overflow-hidden shadow-inner cursor-pointer"
                            style={{ backgroundColor: colorPrimario || "#10b981" }}
                        >
                            <input
                                {...register("colorPrimario")}
                                type="color"
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-150"
                            />
                        </div>
                        <input
                            {...register("colorPrimario")}
                            placeholder="#10B981"
                            className="flex-1 h-12 bg-slate-50 border border-slate-200 px-4 rounded-xl text-xs font-black text-slate-900 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                        />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Este color definirá la identidad de botones y acentos en todo el ecosistema.</p>
                </div>
            </div>
        </div>
    );
}
