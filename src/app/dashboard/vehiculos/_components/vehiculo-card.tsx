"use client";

import Link from "next/link";
import { DeleteVehicleButton } from "@/components/delete-vehicle-button";
import { VehiclePDFButton } from "./vehicle-pdf-button";
import { formatPlaca } from "@/lib/utils";
import type { VehiculoWithRelations } from "@/types";
import { 
    Truck, 
    ShieldCheck, 
    ShieldAlert, 
    User, 
    FileText, 
    Link as LinkIcon, 
    Settings, 
    Eye,
    Lock,
    Unlock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface VehiculoCardProps {
    vehiculo: VehiculoWithRelations;
}

export function VehiculoCard({ vehiculo }: VehiculoCardProps) {
    const isBlocked = vehiculo.bloqueadoManualmente;
    const isOverride = vehiculo.overrideActivo;

    return (
        <div className="group relative bg-white border border-primary/10 transition-all duration-300 hover:border-primary/30 shadow-sm hover:shadow-xl flex flex-col min-h-[380px]">
            {/* Status Indicator Bar */}
            <div className={cn(
                "h-1.5 w-full",
                isBlocked ? "bg-red-600" : isOverride ? "bg-accent" : "bg-primary/20"
            )} />

            {/* Content Area */}
            <div className="p-6 flex-1 flex flex-col space-y-6">
                {/* Header: Plate & Core Status */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-2xl font-black text-primary font-mono tracking-tighter">
                                {formatPlaca(vehiculo.placa)}
                            </h3>
                            {isBlocked ? (
                                <Lock className="h-4 w-4 text-red-600" />
                            ) : (
                                <Unlock className="h-4 w-4 text-accent/40" />
                            )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            <Badge className={cn(
                                "rounded-none text-[9px] font-black uppercase tracking-widest border-none px-2",
                                isBlocked ? "bg-red-600 text-white" : isOverride ? "bg-accent text-white" : "bg-slate-100 text-primary"
                            )}>
                                {isBlocked ? "BLOQUEADO" : isOverride ? "OVERRIDE" : "OPERATIVO"}
                            </Badge>
                            <Badge variant="outline" className="rounded-none text-[9px] font-black uppercase tracking-widest border-primary/10 text-slate-900">
                                {vehiculo.clase || "N/A"}
                            </Badge>
                        </div>
                    </div>
                    <div className="h-12 w-12 bg-slate-50 border border-primary/5 flex items-center justify-center text-primary/20 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                        <Truck className="h-6 w-6" />
                    </div>
                </div>

                {/* Technical Specs */}
                <div className="space-y-3">
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Especificaciones Técnicas</p>
                        <p className="text-sm font-black text-primary uppercase tracking-tight truncate">
                            {vehiculo.marca} {vehiculo.modelo} <span className="text-slate-900 font-bold ml-1">{vehiculo.anho}</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pb-4 border-b border-primary/5">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
                                <FileText className="h-2.5 w-2.5" /> Documentos
                            </p>
                            <p className="text-xs font-black text-primary">{vehiculo._count?.documentos || 0}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
                                <LinkIcon className="h-2.5 w-2.5" /> Vinculaciones
                            </p>
                            <p className="text-xs font-black text-primary">{vehiculo._count?.vinculaciones || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Owner Information */}
                <div className="bg-slate-50/80 p-3 border border-primary/5 flex items-center gap-3">
                    <div className="h-8 w-8 bg-white border border-primary/10 flex items-center justify-center text-primary shrink-0">
                        <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[8px] font-black text-slate-900 uppercase tracking-widest leading-none">Propietario</p>
                        <p className="text-[10px] font-black text-primary uppercase tracking-tighter truncate mt-1">
                            {vehiculo.propietario || "GESTIÓN CENTRAL"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions Grid - Solid Minimalism */}
            <div className="grid grid-cols-4 gap-0 border-t border-primary/10 bg-slate-50/50">
                <Link 
                    href={`/dashboard/vehiculos/${vehiculo.id}`} 
                    className="col-span-2 group/btn h-14 flex items-center justify-center border-r border-primary/10 hover:bg-primary transition-all duration-300"
                >
                    <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-slate-900 group-hover/btn:text-accent transition-colors" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] group-hover/btn:text-white">Gestión</span>
                    </div>
                </Link>
                <div className="flex h-14">
                    <Link 
                        href={`/dashboard/vehiculos/${vehiculo.id}/editar`}
                        className="flex-1 flex items-center justify-center hover:bg-slate-100 transition-colors border-r border-primary/10"
                        title="Configurar Vehículo"
                    >
                        <Settings className="h-4 w-4 text-slate-900 hover:text-primary transition-colors" />
                    </Link>
                    <div className="flex-1 flex items-center justify-center hover:bg-slate-100 transition-colors border-r border-primary/10">
                         <VehiclePDFButton vehicleId={vehiculo.id} className="h-full w-full bg-transparent border-none shadow-none text-slate-900 hover:text-primary p-0 flex items-center justify-center" />
                    </div>
                </div>
                <div className="flex items-center justify-center hover:bg-red-50 transition-colors">
                    <DeleteVehicleButton vehicleId={vehiculo.id} placa={vehiculo.placa} className="bg-transparent hover:bg-transparent border-none text-red-600/30 hover:text-red-600" />
                </div>
            </div>
        </div>
    );
}
