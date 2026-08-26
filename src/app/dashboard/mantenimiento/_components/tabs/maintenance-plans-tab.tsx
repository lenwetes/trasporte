"use client";

import React from "react";
import type { PlanMantenimiento } from "@prisma/client";
import { Wrench, Settings, Clock, Activity, ChevronRight, LayoutPanelTop, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MaintenancePlansTabProps {
    planes: PlanMantenimiento[];
    searchTerm: string;
}

export function MaintenancePlansTab({
    planes,
    searchTerm,
}: MaintenancePlansTabProps) {
    const filteredPlanes = planes.filter((plan) =>
        plan.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (filteredPlanes.length === 0) {
        return (
            <div className="py-24 flex flex-col items-center justify-center border border-dashed border-primary/10 bg-slate-50/50 radius-0">
                <LayoutPanelTop className="h-12 w-12 text-primary/10 mb-4" />
                <h3 className="text-sm font-black text-primary uppercase tracking-widest">Protocolos no Definidos</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Utilice el panel superior para cargar nuevos esquemas de servicio</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
            {filteredPlanes.map((plan) => (
                <div 
                    key={plan.id} 
                    className="group bg-white border border-primary/10 relative overflow-hidden transition-all hover:shadow-xl hover:border-secondary/30"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Settings className="h-16 w-16" />
                    </div>
                    
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 flex items-center justify-center bg-slate-900 text-secondary border border-primary/10 shadow-lg">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-xs font-black text-primary uppercase tracking-widest">{plan.nombre}</h3>
                                <p className="text-[9px] font-bold text-slate-900 uppercase tracking-[0.2em]">Maintenance Routine ID: {plan.id.slice(0, 8)}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <p className="text-[11px] font-bold text-primary/60 uppercase leading-relaxed italic border-l-2 border-secondary/20 pl-4">
                                {plan.descripcion || "ESTE PLAN NO CUENTA CON ESPECIFICACIONES TÉCNICAS ADICIONALES."}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-px bg-primary/5 border border-primary/5 overflow-hidden">
                            <div className="bg-white p-4">
                                <span className="block text-[8px] font-black text-slate-900 uppercase tracking-widest mb-1">Intervalo KM</span>
                                <span className="font-mono text-sm font-black text-primary tracking-tighter">
                                    {plan.kmIntervalo ? `${plan.kmIntervalo.toLocaleString()} KM` : "---"}
                                </span>
                            </div>
                            <div className="bg-white p-4">
                                <span className="block text-[8px] font-black text-slate-900 uppercase tracking-widest mb-1">Intervalo Días</span>
                                <span className="font-mono text-sm font-black text-primary tracking-tighter">
                                    {plan.mesesIntervalo ? `${plan.mesesIntervalo} D` : "---"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-4 bg-slate-50 border-t border-primary/5 flex justify-between items-center group-hover:bg-slate-900 transition-all duration-300">
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest group-hover:text-white">Status: Nominal</span>
                        <Button variant="ghost" className="h-8 p-0 text-[10px] font-black uppercase tracking-widest text-secondary group-hover:text-white hover:bg-white/10 px-4 transition-all">
                            Audit Schema <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
