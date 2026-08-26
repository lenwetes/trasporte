/**
 * Vehicle Status Card - Refactored with Tailwind and Sonner
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatPlaca } from "@/lib/utils";
import { getPreoperacionalById } from "@/actions/safety";
import { generatePreoperacionalPDF } from "@/lib/pdf-generator-safety";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, MapPin, User, ShieldAlert, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FleetVehicle {
    id: string;
    placa: string;
    marca: string | null;
    modelo: string | null;
    status: "GREEN" | "YELLOW" | "RED" | "OVERRIDE";
    reason: string;
    isOverride?: boolean;
    justificacion?: string | null;
    kilometraje: number;
    lastInspection?: {
        id: string;
        fecha: Date;
        conductor: string;
        resultado: string;
    } | null;
}

export function VehicleStatusCard({
    vehicle,
    companyConfig,
}: {
    vehicle: FleetVehicle;
    companyConfig?: import("@prisma/client").ConfiguracionGlobal | null;
}) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPDF = async () => {
        if (!vehicle.lastInspection?.id) return;

        setIsDownloading(true);
        const toastId = toast.loading("Generando reporte PDF...");
        try {
            const result = await getPreoperacionalById(
                vehicle.lastInspection.id,
            );
            if (result.success && result.data) {
                const pdfData = {
                    ...(result.data as any),
                    config: companyConfig,
                };
                await generatePreoperacionalPDF(pdfData as import("@/lib/pdf-generator-safety").PreoperacionalPDFData);
                toast.success("Reporte generado con éxito", { id: toastId });
            } else {
                toast.error("Error al obtener los datos de la inspección", { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al generar el PDF", { id: toastId });
        } finally {
            setIsDownloading(false);
        }
    };

    const statusConfig = {
        GREEN: {
            text: "text-emerald-700",
            bg: "bg-emerald-500",
            light: "bg-emerald-50",
            border: "border-emerald-100",
            label: "Operativo",
            icon: <CheckCircle2 className="h-6 w-6 text-emerald-500" />,
        },
        YELLOW: {
            text: "text-amber-700",
            bg: "bg-amber-500",
            light: "bg-amber-50",
            border: "border-amber-100",
            label: "Alerta",
            icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
        },
        RED: {
            text: "text-red-700",
            bg: "bg-red-500",
            light: "bg-red-50",
            border: "border-red-100",
            label: "Bloqueado",
            icon: <ShieldAlert className="h-6 w-6 text-red-500" />,
        },
        OVERRIDE: {
            text: "text-slate-700",
            bg: "bg-slate-600",
            light: "bg-slate-50",
            border: "border-slate-200",
            label: "Supervisado",
            icon: <Info className="h-6 w-6 text-slate-500" />,
        },
    };

    const config = statusConfig[vehicle.status];

    return (
        <div className={cn(
            "bg-white rounded-xl border overflow-hidden shadow-sm transition-all hover:shadow-md",
            config.border
        )}>
            {/* Status Indicator Bar */}
            <div className={cn("h-1", config.bg)} />

            <div className="p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                            config.light, config.text
                        )}>
                            {config.label}
                        </span>
                        <h3 className="text-lg font-black text-slate-900 mt-2 uppercase tracking-tight">
                            {formatPlaca(vehicle.placa)}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            {vehicle.marca || "Unidad"} • {vehicle.modelo || "S.M"}
                        </p>
                    </div>
                    <div className="bg-slate-50 h-10 w-10 flex items-center justify-center rounded-lg border border-slate-100 shadow-sm">
                        {config.icon}
                    </div>
                </div>

                {/* Reason Banner */}
                <div className={cn(
                    "p-3 rounded-lg mb-4 border border-dashed",
                    config.light, "border-black/5"
                )}>
                    <div className={cn("text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-70", config.text)}>
                        Estatus de Operación
                    </div>
                    <p className="text-[11px] font-bold text-slate-700 leading-snug">
                        {vehicle.isOverride && <span className="text-red-600 inline-flex items-center gap-1">🛡️ SUPERVISIÓN ACTIVA • </span>}
                        {vehicle.reason}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Kilometraje</span>
                        <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            {vehicle.kilometraje?.toLocaleString() || "0"} <span className="text-[9px] text-slate-400">KM</span>
                        </div>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mantenimiento</span>
                        <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            {vehicle.status === "RED" ? "Caduco" : "Vigente"}
                        </div>
                    </div>
                </div>

                {/* Last Inspection */}
                <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/30">
                    {vehicle.lastInspection ? (
                        <div className="space-y-2">
                             <div className="flex gap-3 items-center">
                                <div className="h-7 w-7 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm">
                                    <User className="h-3.5 w-3.5 text-slate-400" />
                                </div>
                                <div className="overflow-hidden">
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Responsable</div>
                                    <div className="text-[11px] font-black text-slate-700 truncate uppercase">{vehicle.lastInspection.conductor}</div>
                                </div>
                             </div>
                             <div className="flex justify-between items-center text-[10px] pt-2 border-t border-slate-100 font-bold">
                                <span className="text-slate-400 uppercase tracking-widest">Último Reporte</span>
                                <span className="text-slate-600">
                                     {format(new Date(vehicle.lastInspection.fecha), "dd MMM, yyyy", { locale: es })}
                                </span>
                             </div>
                        </div>
                    ) : (
                        <div className="text-center py-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Sin reportes registrados</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-5">
                    <Link href={`/dashboard/vehiculos/${vehicle.id}`} className="flex-1">
                        <Button variant="outline" className="w-full h-10 rounded-lg text-[10px] font-black uppercase tracking-widest border-slate-200 hover:bg-slate-50">
                            Ver Expediente
                        </Button>
                    </Link>

                    {vehicle.lastInspection && (
                        <Button 
                            variant="secondary"
                            disabled={isDownloading}
                            onClick={handleDownloadPDF}
                            className="bg-slate-900 hover:bg-slate-800 text-white h-10 px-3 rounded-lg shadow-md transition-all active:scale-95"
                        >
                            {isDownloading ? (
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Download className="h-4 w-4" />
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

