"use client";

import { UseFormReturn } from "react-hook-form";
import { ConfiguracionGlobal } from "@/lib/validations";
import { DASHBOARD_THEMES, DashboardTheme } from "@/lib/types/dashboard-theme";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface AppearanceSectionProps {
    form: UseFormReturn<ConfiguracionGlobal>;
}

export function AppearanceSection({ form }: AppearanceSectionProps) {
    const { watch, setValue } = form;
    const currentTheme = watch("dashboardTheme") as DashboardTheme || "command-classic";

    const themes = Object.values(DASHBOARD_THEMES);

    return (
        <div className="space-y-6">
            <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4 block">
                    Diseño del Dashboard Principal
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {themes.map((theme) => {
                        const isActive = currentTheme === theme.id;
                        
                        return (
                            <div 
                                key={theme.id}
                                onClick={() => setValue("dashboardTheme", theme.id, { shouldDirty: true })}
                                className={cn(
                                    "relative cursor-pointer rounded-2xl border-2 p-4 transition-all duration-300 group",
                                    isActive 
                                        ? "border-accent bg-accent/5 ring-4 ring-accent/10" 
                                        : "border-slate-100 bg-white hover:border-slate-200"
                                )}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className={cn(
                                        "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                                        isActive ? "bg-accent text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                                    )}>
                                        <span className="text-lg font-bold">
                                            {theme.id === "command-classic" ? "🏛️" : "✨"}
                                        </span>
                                    </div>
                                    {isActive && (
                                        <div className="h-6 w-6 bg-accent rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                                            <Check className="h-3.5 w-3.5 text-white stroke-[4]" />
                                        </div>
                                    )}
                                </div>
                                
                                <h4 className={cn(
                                    "text-sm font-black uppercase tracking-wider mb-1",
                                    isActive ? "text-slate-900" : "text-slate-600"
                                )}>
                                    {theme.label}
                                </h4>
                                <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                                    {theme.description}
                                </p>

                                {/* Mockup Abstracto sutil */}
                                <div className="mt-4 h-24 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex flex-col gap-2 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <div className="h-4 w-1/3 bg-slate-200 rounded" />
                                    <div className="grid grid-cols-3 gap-2 h-full pb-2">
                                        <div className="bg-slate-200 rounded-lg" />
                                        <div className="bg-slate-200 rounded-lg" />
                                        <div className="bg-slate-200 rounded-lg col-span-1" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-4">
                <div className="text-xl">💡</div>
                <p className="text-[11px] font-bold text-amber-900 leading-normal">
                    Este cambio se aplicará para todos los administradores. Los datos operativos permanecen intactos, solo cambia la presentación visual de la información en el panel principal.
                </p>
            </div>
        </div>
    );
}
