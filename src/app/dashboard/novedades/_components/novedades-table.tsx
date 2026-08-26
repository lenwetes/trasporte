"use client";

import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
    AlertCircle, 
    Wrench, 
    CreditCard, 
    AlertTriangle, 
    User, 
    Truck, 
    Clock, 
    CheckCircle2, 
    ChevronRight,
    CircleDot,
    FileSearch2,
    Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateNovedadStatus } from "@/actions";
import { toast } from "sonner";
import { useState } from "react";
import { EstadoNovedad } from "@prisma/client";

interface Novedad {
    id: string;
    tipo: string;
    fecha: Date | string;
    descripcion: string | null;
    estado: string;
    conductor?: {
        nombres: string;
        apellidos: string | null;
    } | null;
    vehiculo?: {
        placa: string;
    } | null;
}

interface NovedadesTableProps {
    novedades: Novedad[];
    userRole?: string;
}

const getTypeIcon = (tipoNovedad: string) => {
    switch (tipoNovedad) {
        case "MULTA":
        case "COMPARENDO":
            return { icon: CreditCard, color: "text-amber-500", bg: "bg-amber-50" };
        case "FALLA_MECANICA":
            return { icon: Wrench, color: "text-blue-500", bg: "bg-blue-50" };
        default:
            return { icon: AlertTriangle, color: "text-primary", bg: "bg-primary/5" };
    }
};

const getStatusConfig = (estado: string) => {
    switch (estado) {
        case "RESUELTO":
            return { label: "RESUELTO", color: "bg-accent text-white", icon: CheckCircle2 };
        case "EN_PROCESO":
            return { label: "EN PROCESO", color: "bg-amber-500 text-white", icon: Clock };
        case "ANULADO":
            return { label: "ANULADO", color: "bg-red-500 text-white", icon: CircleDot };
        default:
            return { label: "PENDIENTE", color: "bg-primary text-white", icon: CircleDot };
    }
};

export function NovedadesTable({ novedades, userRole }: NovedadesTableProps) {
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        try {
            const result = await updateNovedadStatus({ id, estado: newStatus as EstadoNovedad });
            if (result.success) {
                toast.success("Estado actualizado exitosamente");
            } else {
                toast.error("Error al actualizar estado");
            }
        } catch (error) {
            toast.error("Error crítico de conexión");
        } finally {
            setUpdatingId(null);
        }
    };

    if (novedades.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-primary/10 bg-slate-50/50 text-center space-y-4">
                <div className="h-16 w-16 bg-white flex items-center justify-center text-primary/20 shadow-sm border border-primary/5">
                    <FileSearch2 className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-sm font-black text-primary uppercase tracking-widest">Sin Eventos Registrados</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed max-w-xs mx-auto">
                        Cuando se registren multas o fallas operativas aparecerán aquí para el seguimiento institucional.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="border border-primary/10 bg-white overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-primary/[0.02]">
                    <TableRow className="hover:bg-transparent border-b-2 border-primary/10">
                        <TableHead className="w-[200px] h-14 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] px-6">Tipo / Registro</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Detalle Técnico</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Responsabilidad</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] text-center w-[180px]">Estado</TableHead>
                        <TableHead className="w-10"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {novedades.map((novedad) => {
                        const { icon: TypeIcon, color, bg } = getTypeIcon(novedad.tipo);
                        const status = getStatusConfig(novedad.estado);
                        const StatusIcon = status.icon;
                        const canEditStatus = userRole === "ADMIN" || userRole === "SECRETARIA";

                        return (
                            <TableRow key={novedad.id} className="group hover:bg-slate-50/80 transition-colors border-primary/5 h-20">
                                <TableCell className="px-6">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("h-10 w-10 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", bg, color)}>
                                            <TypeIcon className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-black text-primary uppercase tracking-wider leading-none">
                                                {novedad.tipo.replace("_", " ")}
                                            </div>
                                            <div className="text-[9px] font-mono text-muted-foreground uppercase flex items-center gap-1">
                                                <Clock className="h-3 w-3 opacity-30" />
                                                {format(new Date(novedad.fecha), "dd MMM yyyy", { locale: es })}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="text-[11px] font-medium text-slate-600 line-clamp-2 leading-relaxed max-w-md">
                                        {novedad.descripcion || "Sin descripción técnica adicional..."}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1.5">
                                        {novedad.conductor && (
                                            <div className="flex items-center gap-2 group/driver cursor-pointer">
                                                <div className="h-5 w-5 bg-slate-100 flex items-center justify-center text-slate-900">
                                                    <User className="h-3 w-3" />
                                                </div>
                                                <span className="text-[10px] font-black text-primary group-hover/driver:text-accent transition-colors uppercase leading-none">
                                                    {novedad.conductor.nombres.split(' ')[0]} {novedad.conductor.apellidos?.split(' ')[0]}
                                                </span>
                                            </div>
                                        )}
                                        {novedad.vehiculo && (
                                            <div className="flex items-center gap-2 group/vehicle cursor-pointer">
                                                <div className="h-5 w-5 bg-primary/5 flex items-center justify-center text-accent/60">
                                                    <Truck className="h-3 w-3" />
                                                </div>
                                                <span className="text-[10px] font-black text-accent group-hover/vehicle:underline transition-all font-mono">
                                                    {novedad.vehiculo.placa}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center px-6">
                                    {canEditStatus ? (
                                        <Select
                                            disabled={updatingId === novedad.id}
                                            value={novedad.estado}
                                            onValueChange={(val) => handleStatusUpdate(novedad.id, val)}
                                        >
                                            <SelectTrigger className={cn(
                                                "h-8 border-none rounded-none text-[10px] font-black uppercase tracking-widest px-3",
                                                status.color,
                                                updatingId === novedad.id && "opacity-50"
                                            )}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-none border-primary/10 shadow-2xl">
                                                <SelectItem value="PENDIENTE" className="text-[10px] font-black uppercase tracking-widest">Pendiente</SelectItem>
                                                <SelectItem value="EN_PROCESO" className="text-[10px] font-black uppercase tracking-widest">En Proceso</SelectItem>
                                                <SelectItem value="RESUELTO" className="text-[10px] font-black uppercase tracking-widest">Resuelto</SelectItem>
                                                <SelectItem value="ANULADO" className="text-[10px] font-black uppercase tracking-widest">Anulado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className={cn(
                                            "inline-flex items-center gap-2 px-3 h-7 text-[9px] font-black uppercase tracking-widest",
                                            status.color
                                        )}>
                                            <StatusIcon className="h-3 w-3" />
                                            {status.label}
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="px-6">
                                    <button className="h-8 w-8 flex items-center justify-center text-primary/20 hover:text-primary hover:bg-slate-100 transition-all group-hover:translate-x-1">
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
