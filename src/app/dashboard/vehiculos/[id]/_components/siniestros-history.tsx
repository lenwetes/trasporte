"use client";

import { SiniestroWithRelations } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { 
    ShieldAlert, 
    ShieldCheck, 
    MapPin, 
    Calendar, 
    User, 
    ArrowRight, 
    Camera, 
    FileText,
    AlertTriangle,
    CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SiniestrosHistoryProps {
    siniestros: SiniestroWithRelations[];
}

export function SiniestrosHistory({ siniestros }: SiniestrosHistoryProps) {
    if (siniestros.length === 0) {
        return (
            <div className="border border-rose-200 border-dashed p-16 text-center bg-rose-50/50 space-y-4 animate-in fade-in duration-700">
                <ShieldCheck className="h-12 w-12 text-rose-200 mx-auto" />
                <div>
                  <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.3em]">Sin siniestros registrados</p>
                  <p className="text-[9px] font-bold text-rose-400 uppercase tracking-widest mt-2">Este vehículo no tiene reportes de accidentes actuales</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-700">
            {siniestros.map((siniestro) => (
                <Link
                    key={siniestro.id}
                    href={`/dashboard/siniestros/${siniestro.id}`}
                    className="group"
                >
                    <div className="bg-white border border-slate-200 p-6 flex flex-col md:flex-row gap-8 transition-all hover:shadow-lg hover:border-rose-200">
                        {/* Miniatura de Evidencia */}
                        <div className="w-full md:w-32 h-32 bg-slate-100 border border-slate-200 overflow-hidden relative flex-shrink-0">
                            {siniestro.fotos && siniestro.fotos.length > 0 ? (
                                <>
                                    {siniestro.fotos[0].nombreUnico.toLowerCase().endsWith(".pdf") ? (
                                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-slate-50">
                                            <FileText className="h-8 w-8 text-slate-300" />
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center px-2">PDF REGISTRO</span>
                                        </div>
                                    ) : (
                                        <Image
                                            src={`/api/files/${siniestro.fotos[0].nombreUnico}`}
                                            alt="Evidencia"
                                            fill
                                            className="object-cover transition-transform group-hover:scale-110 duration-500"
                                            unoptimized
                                        />
                                    )}
                                    {siniestro.fotos.length > 1 && (
                                        <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[8px] font-black px-1.5 py-0.5 uppercase tracking-widest backdrop-blur-sm">
                                            +{siniestro.fotos.length - 1} FOTOS
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                    <Camera className="h-8 w-8 text-slate-200" />
                                </div>
                            )}
                        </div>

                        {/* Info Principal */}
                        <div className="flex-1 flex flex-col justify-between space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-3">
                                    <Badge className={cn(
                                        "rounded-none border-none text-[8px] font-black px-2 py-1 uppercase tracking-widest",
                                        siniestro.gravedad === "CON_HERIDOS" || siniestro.gravedad === "MORTAL" 
                                            ? "bg-rose-100 text-rose-600" 
                                            : "bg-amber-100 text-amber-600"
                                    )}>
                                        <AlertTriangle className="h-3 w-3 mr-1.5 inline" />
                                        NIVEL: {siniestro.gravedad.replace("_", " ")}
                                    </Badge>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-rose-600 transition-colors flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-slate-300" />
                                            {siniestro.lugar}
                                        </h4>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {new Date(siniestro.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}
                                        </div>
                                    </div>
                                </div>
                                <div className="h-8 w-8 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-rose-600 group-hover:text-white group-hover:border-rose-600 transition-all">
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 -mx-6 -mb-6 p-4 px-6 mt-auto">
                                <div className="flex items-center gap-3">
                                    <div className="h-7 w-7 bg-slate-900 flex items-center justify-center text-white text-[10px] font-black">
                                        {siniestro.conductor.nombres[0]}{siniestro.conductor.apellidos[0]}
                                    </div>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                        {siniestro.conductor.nombres} {siniestro.conductor.apellidos}
                                    </span>
                                </div>
                                {siniestro.estado === "CERRADO" ? (
                                    <div className="flex items-center gap-2 text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        CASO FINALIZADO
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-[9px] font-black text-amber-500 uppercase tracking-widest">
                                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                        INVESTIGACIÓN ABIERTA
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
