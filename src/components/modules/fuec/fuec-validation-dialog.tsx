"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    ShieldCheck,
    ShieldAlert,
    Loader2,
    User,
    Clock,
    CheckCircle2,
    History,
    ShieldX
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { getFuecValidationDetails } from "@/actions/fuec";
import { PlanillaFUEC } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface FuecValidationDetails {
    forzado: boolean;
    justificacion: string | null;
    fecha: Date | string;
    actor: {
        nombres: string;
        apellidos: string;
        rol: string;
    } | null;
}

interface FuecValidationDialogProps {
    fuec: PlanillaFUEC | null;
    onClose: () => void;
}

export function FuecValidationDialog({
    fuec,
    onClose,
}: FuecValidationDialogProps) {
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState<FuecValidationDetails | null>(null);

    useEffect(() => {
        if (!fuec) return;

        setLoading(true);
        getFuecValidationDetails(fuec.id)
            .then((res) => {
                if (res.success && res.data) {
                    setDetails(res.data as FuecValidationDetails);
                } else {
                    setDetails(null);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [fuec]);

    if (!fuec) return null;

    return (
        <Dialog
            open={!!fuec}
            onOpenChange={(isOpen) => !isOpen && onClose()}
        >
            <DialogContent className="max-w-md p-0 overflow-hidden">
                <DialogTitle className="sr-only">Detalles de Validación FUEC</DialogTitle>
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
                        <Loader2 className="h-10 w-10 text-accent animate-spin" />
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Consultando Auditoría</h3>
                            <p className="text-xs text-muted-foreground">Verificando firmas digitales y estados técnicos...</p>
                        </div>
                    </div>
                ) : !details ? (
                    <div className="p-12 text-center space-y-6">
                        <div className="h-16 w-16 bg-primary/5 flex items-center justify-center mx-auto">
                            <ShieldX className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-primary uppercase tracking-tight">Registro No Encontrado</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                No se encontraron metadatos de validación para esta planilla. 
                                Es posible que fuera generada en una versión anterior del motor de FUEC.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {/* Status Header */}
                        <div className={cn(
                            "p-8 flex flex-col items-center text-center space-y-4 border-b",
                            details.forzado ? "bg-red-50/50 border-red-100" : "bg-accent/5 border-accent/10"
                        )}>
                            <div className={cn(
                                "h-16 w-16 flex items-center justify-center",
                                details.forzado ? "bg-red-100 text-red-600" : "bg-accent text-white"
                            )}>
                                {details.forzado ? (
                                    <ShieldAlert className="h-8 w-8" />
                                ) : (
                                    <CheckCircle2 className="h-8 w-8" />
                                )}
                            </div>
                            
                            <div className="space-y-1">
                                <h3 className={cn(
                                    "text-xl font-black uppercase tracking-tighter",
                                    details.forzado ? "text-red-700" : "text-primary"
                                )}>
                                    {details.forzado ? "SISTEMA FORZADO" : "VALIDACIÓN EXITOSA"}
                                </h3>
                                <p className="text-xs text-muted-foreground max-w-[280px]">
                                    {details.forzado 
                                        ? "Emisión manual autorizada por supervisor bajo responsabilidad administrativa."
                                        : "Todos los parámetros técnicos y financieros cumplen con la normativa vigente."}
                                </p>
                            </div>
                        </div>

                        {/* Audit Details */}
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Operador Responsable</p>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-primary/5 flex items-center justify-center text-primary">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div className="leading-tight">
                                            <p className="text-sm font-bold text-primary truncate">
                                                {details.actor?.nombres}
                                            </p>
                                            <p className="text-[10px] text-accent font-bold uppercase">
                                                {details.actor?.rol}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Timestamp Técnico</p>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-primary/5 flex items-center justify-center text-primary">
                                            <History className="h-4 w-4" />
                                        </div>
                                        <div className="leading-tight">
                                            <p className="text-sm font-bold text-primary">
                                                {format(new Date(details.fecha), "dd MMM, yyyy", { locale: es })}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground font-mono">
                                                {format(new Date(details.fecha), "HH:mm:ss 'HRS'")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {details.forzado && details.justificacion && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 space-y-2">
                                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                                        <ShieldAlert className="h-3 w-3" />
                                        JUSTIFICACIÓN TÉCNICA
                                    </p>
                                    <p className="text-sm text-red-900 italic leading-relaxed">
                                        &quot;{details.justificacion}&quot;
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-primary/5 border-t border-primary/10 flex justify-center">
                            <p className="text-[9px] font-mono text-primary uppercase tracking-[0.2em]">
                                ID Auditoría: {fuec.id.slice(0, 18).toUpperCase()}
                            </p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
