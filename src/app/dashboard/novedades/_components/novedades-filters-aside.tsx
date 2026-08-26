"use client";

import Link from "next/link";
import { Search, Filter, Hash, ChevronRight, CircleDot, BadgeInfo, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NovedadesFiltersAsideProps {
    query: string;
    tipo: string;
}

export function NovedadesFiltersAside({
    query,
    tipo,
}: NovedadesFiltersAsideProps) {
    const categories = [
        { label: "Todas las Novedades", value: "TODOS" },
        { label: "Multas & Comparendos", value: "MULTA" },
        { label: "Fallas Mecánicas", value: "FALLA_MECANICA" },
        { label: "Conducta & Disciplina", value: "CONDUCTA" },
    ];

    return (
        <aside className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
            {/* Categorization Section */}
            <div className="space-y-8">
                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3 px-1">
                        <Filter className="h-4 w-4 text-slate-900 group-hover:text-primary transition-colors" />
                        <label className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em]">
                            Categorización Operativa
                        </label>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    {categories.map((cat) => {
                        const isActive = tipo === cat.value;
                        const url = `/dashboard/novedades?q=${query}&tipo=${cat.value}&tab=novedades`;
                        
                        return (
                            <Link key={cat.value} href={url} className="block group">
                                <div className={cn(
                                    "flex items-center justify-between px-5 h-14 transition-all duration-300 cursor-pointer border-l-2",
                                    isActive 
                                        ? "bg-primary text-white shadow-xl border-accent" 
                                        : "bg-white border-transparent text-primary/60 hover:bg-slate-50 hover:border-primary/20 hover:pl-6"
                                )}>
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "h-1.5 w-1.5 rounded-full transition-all",
                                            isActive ? "bg-accent scale-150 shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "bg-primary/20 group-hover:bg-primary/40"
                                        )} />
                                        <span className="text-[11px] font-black uppercase tracking-widest">
                                            {cat.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <ChevronRight className={cn(
                                            "h-4 w-4 transition-transform",
                                            isActive ? "text-accent translate-x-1" : "text-primary/10 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                                        )} />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Auditoria Section */}
            <div className="pt-8 border-t border-primary/5 space-y-6">
                <div className="flex items-center gap-3 px-1">
                    <BadgeInfo className="h-4 w-4 text-slate-900" />
                    <label className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em]">
                        Seguridad Jurídica
                    </label>
                </div>
                
                <div className="relative p-6 bg-slate-900 overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -translate-y-1/2 translate-x-1/2 rotate-45 transition-transform group-hover:scale-125 duration-700" />
                    <div className="relative z-10 space-y-4">
                        <ShieldAlert className="h-6 w-6 text-red-600" />
                        <p className="text-[10px] font-bold text-white/80 uppercase leading-relaxed tracking-tight font-mono">
                            REGISTO DEFINITIVO:<br/>
                            <span className="text-white font-normal">
                                Todo evento reportado queda indexado en la auditoría PESV institucional.
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

const ShieldAlert = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);
