"use client";

import Link from "next/link";
import { CalendarClock, Shield, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UpcomingExpiry } from "@/actions/dashboard-overview";

interface UpcomingExpiriesWidgetProps {
    expiries: UpcomingExpiry[];
}

export function UpcomingExpiriesWidget({ expiries }: UpcomingExpiriesWidgetProps) {
    return (
        <div className="bg-white border border-slate-200 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-slate-50 border border-slate-100 flex items-center justify-center">
                        <CalendarClock className="h-5 w-5 text-[#00b7b5]" />
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black text-[#005461] uppercase tracking-[0.25em]">Vencimientos Próximos</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Próximos 30 días</p>
                    </div>
                </div>
                <Link href="/dashboard/safety/flota">
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-[#005461] text-white text-[8.5px] font-black uppercase tracking-widest transition-colors">
                        VER TODO <ChevronRight className="h-2.5 w-2.5" />
                    </div>
                </Link>
            </div>

            {expiries.length > 0 ? (
                <div className="flex-1">
                    {expiries.map((exp) => {
                        const isUrgent = exp.diasRestantes <= 7;
                        const isWarning = exp.diasRestantes <= 15;
                        return (
                            <div
                                key={exp.id}
                                className={cn(
                                    "flex items-center gap-3 px-5 py-3 border-b border-slate-50 hover:bg-slate-50/70 transition-colors group",
                                    isUrgent ? "border-l-2 border-l-red-500" : isWarning ? "border-l-2 border-l-amber-500" : "border-l-2 border-l-transparent"
                                )}
                            >
                                <div className={cn(
                                    "h-11 w-11 flex flex-col items-center justify-center shrink-0 font-black",
                                    isUrgent ? "bg-red-500 text-white" :
                                    isWarning ? "bg-amber-500 text-white" :
                                    "bg-primary/5 text-primary border border-primary/10"
                                )}>
                                    <span className="text-sm leading-none font-black font-mono">{exp.diasRestantes}</span>
                                    <span className="text-[7px] font-bold uppercase leading-none mt-0.5 opacity-80">días</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight truncate">{exp.tipo}</p>
                                    <p className="text-[9px] font-bold text-primary uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 bg-accent inline-block" />
                                        {exp.vehiculoPlaca}
                                    </p>
                                </div>
                                <p className="text-[9px] font-mono font-bold text-slate-400 uppercase shrink-0">
                                    {new Date(exp.fechaVencimiento).toLocaleDateString("es-CO")}
                                </p>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="h-14 w-14 border-2 border-dashed border-[#00b7b5]/30 flex items-center justify-center mb-4">
                        <Shield className="h-6 w-6 text-[#00b7b5]/50" />
                    </div>
                    <p className="text-[10px] font-black text-[#005461]/40 uppercase tracking-widest">Sin Vencimientos Inminentes</p>
                    <p className="text-[8.5px] text-slate-300 font-bold uppercase tracking-widest mt-1.5">Documentación al día</p>
                </div>
            )}
        </div>
    );
}
