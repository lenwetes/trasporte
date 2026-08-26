"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleSectionCardProps {
    title: string;
    count?: number;
    icon: any;
    color: "violet" | "blue" | "slate" | "indigo";
    defaultExpanded?: boolean;
    children: React.ReactNode;
    actions?: React.ReactNode;
}

export function CollapsibleSectionCard({
    title,
    count,
    icon: Icon,
    color,
    defaultExpanded = false,
    children,
    actions,
}: CollapsibleSectionCardProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const colorVariants = {
        violet: "border-violet-500/20 bg-violet-50 text-violet-700",
        blue: "border-blue-500/20 bg-blue-50 text-blue-700",
        slate: "border-slate-500/20 bg-slate-50 text-slate-700",
        indigo: "border-indigo-500/20 bg-indigo-50 text-indigo-700",
    };

    return (
        <div className="bg-white border border-primary/10 shadow-sm relative overflow-hidden group mb-8">
            {/* Header Técnico */}
            <div 
                className={cn(
                    "flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-slate-50/50 border-b border-primary/5 transition-colors cursor-pointer group/header",
                    isExpanded ? "bg-white" : "hover:bg-slate-100"
                )}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-6 px-8 py-6 flex-1">
                    <div className={cn(
                        "h-12 w-12 flex items-center justify-center border transition-all group-hover/header:scale-110",
                        colorVariants[color]
                    )}>
                        <Icon size={20} />
                    </div>
                    
                    <div className="flex flex-col">
                        <div className="flex items-center gap-4">
                            <h3 className="text-[14px] font-black text-primary uppercase tracking-[0.2em] italic">{title}</h3>
                            {count !== undefined && count > 0 && (
                                <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-widest shadow-sm">
                                    {count.toString().padStart(2, '0')} REGISTROS
                                </span>
                            )}
                        </div>
                        <span className="text-[9px] font-bold text-primary uppercase tracking-[0.3em] mt-1">
                            Modulo de Auditoría Técnica y Control de Flota
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-6 px-8 py-4 sm:py-0 border-t sm:border-t-0 border-primary/5">
                    {actions && (
                        <div className="relative z-20" onClick={(e) => e.stopPropagation()}>
                            {actions}
                        </div>
                    )}
                    <div className="h-10 w-10 border border-primary/10 flex items-center justify-center text-slate-900 group-hover/header:bg-primary group-hover/header:text-white transition-all">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronRight size={20} />}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {isExpanded && (
                <div className="p-8 lg:p-10 animate-in fade-in slide-in-from-top-2 duration-300">
                    {children}
                </div>
            )}
        </div>
    );
}
