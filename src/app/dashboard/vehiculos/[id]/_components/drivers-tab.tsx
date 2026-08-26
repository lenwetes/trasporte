"use client";

import { LinkDriversButton } from "@/components/link-drivers-button";
import { FinalizeVinculacionButton } from "@/components/finalize-vinculacion-button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Users, User, Calendar, ShieldCheck, History, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DriverInfo {
    id: string;
    nombres: string;
    apellidos: string;
}

interface Vinculacion {
    id: string;
    conductorId: string;
    conductor: DriverInfo;
    fechaInicio: Date;
    fechaFin: Date | null;
    activo: boolean;
}

interface DriversTabProps {
    vinculaciones: Vinculacion[];
    vehiculoId: string;
}

export function DriversTab({ vinculaciones, vehiculoId }: DriversTabProps) {
    const activeConductorIds = vinculaciones
        .filter((v: any) => v.activo)
        .map((v: any) => v.conductor.id);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="bg-white border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="h-14 w-14 bg-slate-900 flex items-center justify-center text-white shadow-lg">
                        <Users className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Administración de Flota</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 mt-1 flex items-center gap-2">
                            <ShieldCheck className="h-3 w-3 text-cyan-600" />
                            Histórico de Vinculaciones Activas & Pasadas
                        </p>
                    </div>
                </div>
                <div className="w-full md:w-auto">
                    <LinkDriversButton
                        vehiculoId={vehiculoId}
                        alreadyLinkedIds={activeConductorIds}
                    />
                </div>
            </div>

            {/* List Section */}
            <div className="grid grid-cols-1 gap-4">
                {vinculaciones.length === 0 ? (
                    <div className="border border-slate-200 border-dashed p-16 text-center bg-slate-50/50">
                        <User className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                        <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">Sin Registros de Conducción</p>
                    </div>
                ) : (
                    vinculaciones.map((vinc) => (
                        <div key={vinc.id} className={cn(
                            "group border bg-white p-6 flex flex-col md:flex-row justify-between items-center gap-6 transition-all hover:shadow-md",
                            vinc.activo ? "border-slate-200" : "border-slate-100 opacity-70"
                        )}>
                            <div className="flex items-center gap-6 flex-1 w-full md:w-auto">
                                <div className={cn(
                                    "h-12 w-12 flex items-center justify-center font-black text-xs shadow-sm",
                                    vinc.activo ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
                                )}>
                                    {vinc.conductor.nombres[0]}{vinc.conductor.apellidos[0]}
                                </div>
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 group-hover:text-cyan-600 transition-colors">
                                        {vinc.conductor.nombres.toLowerCase()} {vinc.conductor.apellidos.toLowerCase()}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest">
                                            <Calendar className="h-3 w-3" />
                                            DESDE: {format(new Date(vinc.fechaInicio), "d MMM yyyy", { locale: es })}
                                        </div>
                                        <div className="h-1 w-1 rounded-full bg-slate-200" />
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest">
                                            <History className="h-3 w-3" />
                                            HASTA: {vinc.fechaFin ? format(new Date(vinc.fechaFin), "d MMM yyyy", { locale: es }) : "ACTUALIDAD"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                                <Badge className={cn(
                                    "rounded-none border-none text-[8px] font-black px-2 py-1 uppercase tracking-widest",
                                    vinc.activo ? "bg-emerald-100 text-emerald-800 font-black" : "bg-slate-100 text-slate-400"
                                )}>
                                    {vinc.activo ? "VINVULACIÓN ACTIVA" : "CONTRATO FINALIZADO"}
                                </Badge>
                                
                                {vinc.activo && (
                                    <FinalizeVinculacionButton
                                        vinculacionId={vinc.id}
                                    />
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
