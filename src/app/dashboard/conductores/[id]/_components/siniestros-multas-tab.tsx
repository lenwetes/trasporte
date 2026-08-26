"use client";

import { UsuarioWithRelations } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { 
    AlertTriangle, 
    Calendar, 
    MapPin, 
    MessageSquare, 
    ExternalLink, 
    ShieldCheck, 
    Eye 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SiniestrosTabProps {
    conductor: UsuarioWithRelations;
}

type SiniestroDisplay = {
    id: string;
    gravedad: string;
    fecha: string | Date;
    lugar: string;
    reporteHechos: string;
};

export function SiniestrosTab({ conductor }: SiniestrosTabProps) {
    const siniestros = conductor.siniestrosAsociados || [];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Intel Bar: Incident Context */}
            <div className="bg-amber-50 border-b border-amber-100 p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="max-w-2xl space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-amber-600 flex items-center justify-center shadow-lg shadow-amber-600/20">
                            <AlertTriangle className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-xl font-black text-amber-900 uppercase tracking-tight leading-none pt-1">
                            Investigaciones PESV & Accidentabilidad
                        </h3>
                    </div>
                    <p className="text-[11px] font-medium text-amber-800/70 uppercase leading-relaxed tracking-wide">
                        Registro histórico de siniestros, accidentes de tránsito e investigaciones operativas bajo el <span className="font-black">Plan Estratégico de Seguridad Vial</span>.
                    </p>
                </div>

                <div className="bg-white border border-amber-200 p-6 min-w-[160px] text-center shadow-sm">
                    <span className="text-[9px] font-black text-amber-900/40 uppercase tracking-[0.2em] block mb-2">Total Siniestros</span>
                    <div className="flex items-baseline justify-center gap-1">
                        <span className={cn(
                            "text-4xl font-black tracking-tighter",
                            siniestros.length > 0 ? "text-amber-600" : "text-emerald-600"
                        )}>
                            {siniestros.length}
                        </span>
                        <Badge variant="outline" className="text-[8px] font-black p-0 uppercase border-none">Registros</Badge>
                    </div>
                </div>
            </div>

            {/* List Overview */}
            <div className="space-y-4 px-8">
                {siniestros.length > 0 ? (
                    siniestros.map((siniestro: SiniestroDisplay) => (
                        <Card key={siniestro.id} className="rounded-none border-primary/5 hover:border-amber-200 transition-all duration-300 overflow-hidden group">
                            <CardContent className="p-0 flex flex-col md:flex-row">
                                <div className="p-6 flex-1 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Badge className={cn(
                                            "rounded-none text-[9px] font-black uppercase tracking-widest px-3 border-none",
                                            siniestro.gravedad === "SOLO_DANOS" ? "bg-slate-100 text-slate-600" : "bg-amber-600 text-white"
                                        )}>
                                            {siniestro.gravedad.replace("_", " ")}
                                        </Badge>
                                        <div className="flex items-center gap-2 text-primary/40">
                                            <Calendar className="h-3 w-3" />
                                            <span className="text-[10px] font-black uppercase tracking-tight">
                                                {format(new Date(siniestro.fecha), "PPP", { locale: es })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-primary font-black uppercase text-sm tracking-tight">
                                            <MapPin className="h-4 w-4 text-accent" />
                                            <span>{siniestro.lugar}</span>
                                        </div>
                                        <div className="flex items-start gap-2 p-3 bg-slate-50 border-l-2 border-primary/10 italic text-[11px] text-muted-foreground leading-relaxed mt-3">
                                            <MessageSquare className="h-3 w-3 mt-0.5 text-primary/20 shrink-0" />
                                            "{siniestro.reporteHechos}"
                                        </div>
                                    </div>
                                </div>
                                
                                <Link 
                                    href={`/dashboard/siniestros/${siniestro.id}`}
                                    className="bg-slate-50 md:border-l border-primary/5 flex flex-col items-center justify-center p-6 hover:bg-primary group/btn transition-colors duration-300 md:w-24 shrink-0"
                                >
                                    <ExternalLink className="h-5 w-5 text-primary/20 group-hover/btn:text-accent mb-2" />
                                    <span className="text-[8px] font-black text-primary/40 group-hover/btn:text-white uppercase tracking-tighter text-center">Ver<br/>Detalle</span>
                                </Link>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="py-24 border border-dashed border-primary/10 bg-slate-50/50 flex flex-col items-center justify-center space-y-4">
                        <div className="h-20 w-20 bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-sm">
                            <ShieldCheck className="h-10 w-10" />
                        </div>
                        <div className="text-center space-y-2">
                            <h4 className="text-sm font-black text-primary uppercase tracking-[0.2em]">Expediente Impecable</h4>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase max-w-xs leading-relaxed">
                                EL CONDUCTOR NO REGISTRA INVESTIGACIONES OPERATIVAS NI ACCIDENTABILIDAD VIGENTE.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
