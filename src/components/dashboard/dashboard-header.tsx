import React from "react";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
    title: string;
    subtitle?: string;
    tagline?: string;
    icon?: React.ElementType | React.ReactNode;
    image?: string;
    actions?: React.ReactNode;
    iconGradient?: string;
    taglineColor?: string;
    className?: string;
}

export function DashboardHeader({
    title,
    subtitle,
    tagline,
    icon: Icon,
    image,
    actions,
    iconGradient = "from-primary to-slate-900",
    taglineColor = "text-primary",
    className,
}: DashboardHeaderProps) {
    return (
        <div className={cn(
            "relative bg-white border border-primary/10 p-6 md:p-8 lg:p-12 shadow-sm mb-12 animate-in fade-in slide-in-from-top-4 duration-700 overflow-hidden",
            className
        )}>
            {/* Decoración de Fondo Técnica */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/[0.01] -skew-x-12 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-primary/5 -translate-x-8 -translate-y-8 pointer-events-none" />

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Contenedor de Icono Maestro */}
                    <div className="flex-shrink-0">
                        <div className="relative group">
                            <div className={cn(
                                "h-16 w-16 bg-white border border-primary/10 flex items-center justify-center shadow-xl transition-all duration-500 group-hover:scale-110 active:scale-95",
                                "after:absolute after:inset-0 after:bg-primary/[0.02] after:translate-x-1 after:translate-y-1 after:-z-10"
                            )}>
                                {image ? (
                                    <img
                                        src={image}
                                        className="h-10 w-10 object-contain grayscale group-hover:grayscale-0 transition-all"
                                        alt={title}
                                    />
                                ) : (
                                    Icon && (
                                        <div className={cn("text-primary p-2", taglineColor)}>
                                            {React.isValidElement(Icon) ? Icon : typeof Icon === 'function' || typeof Icon === 'object' ? React.createElement(Icon as React.ElementType, { size: 32 }) : null}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 text-wrap break-words">
                        {tagline && (
                            <div className="flex items-center gap-3">
                                <span className="h-[2px] w-8 bg-primary/20" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 leading-none">
                                    {tagline}
                                </span>
                            </div>
                        )}
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight text-primary leading-none">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] max-w-2xl italic leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {actions && (
                    <div className="flex flex-wrap items-center gap-4 bg-slate-50/50 p-4 border border-primary/5 shadow-inner">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
