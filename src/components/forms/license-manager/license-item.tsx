"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { renovarLicencia, eliminarLicencia } from "@/actions/licencias";
import { DetalleLicencia } from "@prisma/client";
import { 
    Calendar, 
    RefreshCw, 
    Trash2,
    ArrowRight,
    Search,
    ShieldCheck,
    AlertTriangle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface LicenseItemProps {
    licencia: DetalleLicencia;
    usuarioId: string;
    variant: "light" | "dark";
}

export function LicenseItem({
    licencia,
    usuarioId,
    variant,
}: LicenseItemProps) {
    const [renovating, setRenovating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [renewalDate, setRenewalDate] = useState("");

    const daysUntilExpiry = Math.ceil(
        (new Date(licencia.fechaVencimiento).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
    );
    const isExpired = daysUntilExpiry < 0;
    const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry >= 0;

    const handleRenew = async () => {
        if (!renewalDate) {
            toast.error("Por favor selecciona una fecha de renovación");
            return;
        }

        setRenovating(true);
        try {
            const result = await renovarLicencia(
                usuarioId,
                licencia.categoria,
                licencia.servicio,
                new Date(`${renewalDate}T12:00:00Z`),
            );

            if (result.success) {
                toast.success("Categoría renovada exitosamente");
                setRenewalDate("");
            } else {
                toast.error(result.error || "No se pudo renovar");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al procesar la renovación");
        } finally {
            setRenovating(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const result = await eliminarLicencia(licencia.id);
            if (result.success) {
                toast.success("Categoría eliminada correctamente");
            } else {
                toast.error(result.error || "No se pudo eliminar");
            }
        } catch (error) {
            toast.error("Error al eliminar");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="bg-white border border-primary/10 p-4 rounded-none group hover:border-primary/20 transition-all duration-300 shadow-sm relative overflow-hidden w-full">
            {/* Expiry Status Overlay Line */}
            <div className={cn(
                "absolute top-0 left-0 h-1 transition-all duration-500",
                isExpired ? "w-full bg-red-500" : isExpiringSoon ? "w-full bg-amber-500" : "w-1 bg-emerald-500"
            )} />

            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start w-full">
                    <div className="flex gap-3 items-center">
                        <div className={cn(
                            "h-10 w-10 flex items-center justify-center font-black text-lg transition-all duration-300",
                            isExpired ? "bg-red-50 text-red-600 border border-red-100" : "bg-slate-50 text-primary border border-primary/5"
                        )}>
                            {licencia.categoria}
                        </div>
                        <div className="space-y-1">
                            <div className="flex gap-2 items-center">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{licencia.servicio}</span>
                                {isExpired && (
                                    <Badge className="bg-red-100 text-red-700 border-none rounded-none text-[8px] font-black uppercase px-2 py-0">VENCIDA</Badge>
                                )}
                                {isExpiringSoon && !isExpired && (
                                    <Badge className="bg-amber-100 text-amber-700 border-none rounded-none text-[8px] font-black uppercase px-2 py-0">POR VENCER</Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-tight">
                                <Calendar className="h-4 w-4 text-accent" />
                                <span>VENCE: {format(new Date(licencia.fechaVencimiento), "dd 'de' MMMM, yyyy", { locale: es }).toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            {(isExpired || isExpiringSoon) && (
                                <p className={cn(
                                    "text-[10px] font-black uppercase tracking-tighter",
                                    isExpired ? "text-red-500" : "text-amber-500"
                                )}>
                                    {isExpired ? `VENCIDO HACE ${Math.abs(daysUntilExpiry)} DÍAS` : `VENCE EN ${daysUntilExpiry} DÍAS`}
                                </p>
                            )}
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            disabled={deleting}
                            onClick={handleDelete}
                            title="Eliminar categoría"
                            className="h-8 w-8 text-slate-900 hover:text-red-600 hover:bg-red-50 transition-all rounded-none border border-transparent hover:border-red-100 shrink-0"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Renewal Control Bar - REDESIGNED FOR SPACE */}
                <div className="bg-slate-50/80 border border-primary/5 p-3 flex flex-col sm:flex-row items-center gap-3 group/renew transition-all duration-300 hover:bg-white w-full">
                    <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                        <div className="h-8 w-8 bg-white border border-primary/5 flex items-center justify-center text-primary group-hover/renew:text-accent transition-colors">
                            <RefreshCw className={cn("h-4 w-4", renovating && "animate-spin")} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest">Renovaci&oacute;n</span>
                            <span className="text-[7.5px] font-bold text-muted-foreground uppercase">Actualizar vigencia</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col sm:flex-row gap-2 w-full">
                        <Input 
                            type="date" 
                            defaultValue={renewalDate} 
                            onChange={(e) => setRenewalDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className="h-8 rounded-none bg-white border-primary/10 text-xs font-bold focus-visible:ring-accent/20 flex-1"
                        />
                        <Button 
                            onClick={handleRenew}
                            disabled={!renewalDate || renovating}
                            className="h-8 rounded-none bg-primary hover:bg-primary/90 text-white font-black text-[9px] uppercase tracking-[0.2em] px-4 shadow-sm shadow-primary/10 gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0"
                        >
                            {renovating ? "PROCESANDO..." : <><ArrowRight className="h-3 w-3" /> ACTUALIZAR</>}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
