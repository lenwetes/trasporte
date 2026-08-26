"use client";

import Link from "next/link";
import Image from "next/image";
import type { SiniestroWithRelations } from "@/types";
import { 
    Calendar, 
    MapPin, 
    User, 
    Truck, 
    ChevronRight, 
    Camera, 
    AlertTriangle,
    ShieldAlert,
    FileText,
    History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface SiniestrosListProps {
    siniestros: SiniestroWithRelations[];
}

const getGravityConfig = (gravedad?: string) => {
    switch (gravedad) {
        case "MORTAL":
            return { label: "CRÍTICO / MORTAL", color: "bg-red-600 text-white border-red-700", icon: ShieldAlert };
        case "CON_HERIDOS":
            return { label: "CON HERIDOS", color: "bg-amber-500 text-white border-amber-600", icon: AlertTriangle };
        case "SOLO_DANOS":
            return { label: "DAÑOS MATERIALES", color: "bg-slate-200 text-slate-800 border-slate-300", icon: CarIcon };
        default:
            return { label: "INCIDENTE", color: "bg-primary text-white border-primary", icon: FileText };
    }
};

const CarIcon = (props: any) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.6 2 12.2 2 12.8V16c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
    </svg>
);

export function SiniestrosList({ siniestros }: SiniestrosListProps) {
    if (siniestros.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-primary/10 bg-slate-50/50 text-center space-y-4">
                <div className="h-16 w-16 bg-white flex items-center justify-center text-primary/20 shadow-sm border border-primary/5">
                    <History className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-sm font-black text-primary uppercase tracking-widest">Historial Vacío</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed max-w-xs mx-auto">
                        No se han detectado registros de siniestralidad bajo los parámetros de búsqueda actuales.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {siniestros.map((siniestro) => {
                const gravity = getGravityConfig(siniestro.gravedad);
                const GravityIcon = gravity.icon;

                return (
                    <Link 
                        key={siniestro.id} 
                        href={`/dashboard/siniestros/${siniestro.id}`}
                        className="bg-white border border-primary/10 group hover:border-primary/30 transition-all duration-300 relative overflow-hidden flex flex-col sm:flex-row"
                    >
                        {/* Status Stripe */}
                        <div className={cn("absolute top-0 left-0 w-full h-1 sm:w-1 sm:h-full shrink-0", gravity.color.split(' ')[0])} />

                        {/* Image Preview Container */}
                        <div className="w-full sm:w-48 h-48 sm:h-auto relative bg-slate-100 shrink-0 overflow-hidden">
                            {siniestro.fotos && siniestro.fotos.length > 0 ? (
                                <>
                                    <Image
                                        src={`/api/files/${siniestro.fotos[0].nombreUnico}`}
                                        alt="Evidencia Siniestro"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        unoptimized
                                    />
                                    <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 shadow-lg border border-white/20">
                                        {siniestro.fotos.length} EVIDENCIAS
                                    </div>
                                </>
                            ) : (
                                <div className="h-full w-full flex flex-col items-center justify-center text-primary/10 space-y-2">
                                    <Camera className="h-8 w-8" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">SIN REGISTRO FOTOGRÁFICO</span>
                                </div>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between gap-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start gap-4">
                                    <div className={cn(
                                        "px-3 h-6 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest border shadow-sm",
                                        gravity.color
                                    )}>
                                        <GravityIcon className="h-3 w-3" />
                                        {gravity.label}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground bg-slate-100 px-2 py-1 uppercase tracking-tighter">
                                        <Calendar className="h-3 w-3 opacity-40 text-primary" />
                                        {format(new Date(siniestro.fecha), "PPP", { locale: es })}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-primary">
                                        <MapPin className="h-4 w-4 shrink-0 text-accent" />
                                        <h3 className="text-lg font-black uppercase tracking-tight leading-tight group-hover:text-accent transition-colors underline decoration-primary/10 decoration-2 underline-offset-4">
                                            {siniestro.lugar}
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-slate-100 flex items-center justify-center text-slate-900">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none">Conductor</p>
                                                <p className="text-[11px] font-black text-primary uppercase">{siniestro.conductor.nombres} {siniestro.conductor.apellidos}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-primary/5 flex items-center justify-center text-accent/60">
                                                <Truck className="h-4 w-4" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none">Unidad de Flota</p>
                                                <p className="text-[11px] font-black text-accent uppercase tracking-[0.1em] font-mono">{siniestro.vehiculo.placa}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-primary/5 mt-auto">
                                <div className="flex items-center gap-2 text-[10px] font-black text-accent uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform cursor-pointer">
                                    EXPEDIENTE COMPLETO <ChevronRight className="h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    );
}
