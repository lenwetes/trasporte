"use client";

import { format } from "date-fns";
import { DetalleLicenciaWithActivo } from "@/actions/licencias";
import { History, ShieldMinus, Calendar, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LicenseHistoryProps {
    historial: DetalleLicenciaWithActivo[];
    variant: "light" | "dark";
}

export function LicenseHistory({ historial }: LicenseHistoryProps) {
    const inactivos = historial.filter((l) => !l.activo);

    if (inactivos.length === 0) {
        return (
            <div className="py-12 border border-dashed border-primary/5 bg-slate-50/30 flex flex-col items-center justify-center space-y-3 opacity-50">
                <div className="h-10 w-10 bg-white border border-primary/5 flex items-center justify-center text-primary/20">
                    <History className="h-5 w-5" />
                </div>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic">Sin renovaciones previas registradas</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-500">
            {inactivos.map((licencia) => (
                <div key={licencia.id} className="p-4 bg-slate-50 border border-primary/5 flex items-center justify-between group hover:bg-white hover:border-primary/10 transition-all duration-300 shadow-sm overflow-hidden relative">
                    {/* Visual Stamp */}
                    <div className="absolute -right-2 -bottom-2 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-500">
                        <ShieldMinus className="h-16 w-16 text-primary" />
                    </div>

                    <div className="flex gap-4 items-center relative z-10">
                        <div className="h-10 w-10 bg-white border border-primary/10 flex items-center justify-center font-black text-xs text-slate-900 group-hover:text-primary transition-colors">
                            {licencia.categoria}
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-primary/20 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{licencia.servicio}</p>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                                <Calendar className="h-3 w-3" />
                                <span>Venci&oacute;: {format(new Date(licencia.fechaVencimiento), "dd/MM/yyyy")}</span>
                            </div>
                        </div>
                    </div>

                    <Badge variant="outline" className="rounded-none text-[8px] font-black uppercase text-primary/20 border-primary/10 bg-white shadow-sm px-2 py-0 relative z-10 group-hover:text-slate-900 group-hover:border-primary/20 transition-all">
                        INACTIVA
                    </Badge>
                </div>
            ))}
        </div>
    );
}
