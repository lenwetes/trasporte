"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    CheckCircle2,
    ShieldAlert,
    FileText,
    Car,
    Users,
    Briefcase,
    Calendar as CalendarIcon,
    Download,
    Eye,
    ArrowRight,
    BadgeCheck,
    Hash,
    DollarSign,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

/** Datos del FUEC generado que vienen del server action */
interface FuecCreatedData {
    id: string;
    consecutivo: string;
    numeroFUEC: number;
    fechaInicio: Date | string;
    fechaFin: Date | string;
    pagoValor?: { toString: () => string } | number | null;
    vehiculo?: {
        placa: string;
        marca?: string;
        modelo?: string;
    } | null;
    conductor1?: {
        nombres: string;
        apellidos: string;
        numeroDocumento?: string;
    } | null;
    contrato?: {
        numeroContrato: string;
        cliente: string;
    } | null;
}

interface FuecSuccessModalProps {
    open: boolean;
    onClose: () => void;
    fuecData: FuecCreatedData | null;
    wasForced: boolean;
    justificacion?: string;
}

export function FuecSuccessModal({
    open,
    onClose,
    fuecData,
    wasForced,
    justificacion,
}: FuecSuccessModalProps) {
    if (!fuecData) return null;

    const formatDate = (date: Date | string): string => {
        try {
            return format(new Date(date), "d MMM, yyyy", { locale: es });
        } catch {
            return "—";
        }
    };

    const valorPago = fuecData.pagoValor
        ? Number(fuecData.pagoValor.toString()).toLocaleString("es-CO")
        : "—";

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) onClose();
            }}
        >
            <DialogContent className="max-w-2xl p-0 border-none rounded-none overflow-hidden shadow-2xl">
                {/* Status Header */}
                <div className={cn(
                    "p-8 flex flex-col items-center text-center space-y-4 relative overflow-hidden",
                    wasForced ? "bg-red-600 text-white" : "bg-accent text-white"
                )}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 translate-x-1/2 -translate-y-1/2 rotate-45" />
                    </div>

                    <div className="relative h-20 w-20 bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        {wasForced ? (
                            <ShieldAlert className="h-10 w-10 text-white" />
                        ) : (
                            <CheckCircle2 className="h-10 w-10 text-white" />
                        )}
                    </div>
                    
                    <div className="relative space-y-2">
                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
                            {wasForced ? "EMISIÓN POR FUERZA" : "FUEC GENERADO CON ÉXITO"}
                        </DialogTitle>
                        <DialogDescription className="text-sm font-medium opacity-80 max-w-md mx-auto">
                            {wasForced 
                                ? "Planilla emitida bajo supervisión omitiendo protocolos estándar."
                                : "El extracto de contrato ha sido firmado y registrado en la base de datos nacional."}
                        </DialogDescription>
                    </div>
                </div>

                <div className="p-8 space-y-8 bg-white">
                    {/* Consecutivo Highlight */}
                    <div className="bg-primary/5 p-6 border border-primary/10 flex flex-col items-center text-center space-y-2">
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">IDENTIFICADOR ÚNICO DE TRÁNSITO</span>
                        <p className="text-2xl font-black text-primary font-mono tracking-tight leading-none uppercase">
                            {fuecData.consecutivo}
                        </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-8">
                        <DetailItem 
                            label="VEHÍCULO OPERATIVO"
                            value={fuecData.vehiculo?.placa ?? "—"}
                            subValue={fuecData.vehiculo ? `${fuecData.vehiculo.marca ?? ""} ${fuecData.vehiculo.modelo ?? ""}` : ""}
                        />
                        <DetailItem 
                            label="OPERADOR RESPONSABLE"
                            value={fuecData.conductor1 ? `${fuecData.conductor1.nombres.split(" ")[0]} ${fuecData.conductor1.apellidos.split(" ")[0]}` : "—"}
                            subValue={fuecData.conductor1?.numeroDocumento ? `CC ${fuecData.conductor1.numeroDocumento}` : ""}
                        />
                        <DetailItem 
                            label="CONTRATO BASE"
                            value={fuecData.contrato?.numeroContrato ?? "—"}
                            subValue={fuecData.contrato?.cliente ?? ""}
                        />
                        <DetailItem 
                            label="PERÍODO DE VIGENCIA"
                            value={`${formatDate(fuecData.fechaInicio)}`}
                            subValue={`HASTA ${formatDate(fuecData.fechaFin)}`}
                        />
                    </div>

                    <Separator className="bg-primary/5" />

                    {/* Footer Actions */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <a
                                href={`/api/fuec/${fuecData.id}/preview`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contents"
                            >
                                <Button variant="outline" className="h-12 font-bold rounded-none border-primary/20 gap-2">
                                    <Eye className="h-4 w-4" /> PREVISUALIZAR
                                </Button>
                            </a>
                            <a
                                href={`/api/fuec/${fuecData.id}/download`}
                                download={`FUEC_${fuecData.consecutivo}.pdf`}
                                className="contents"
                            >
                                <Button variant="outline" className="h-12 font-bold rounded-none border-primary/20 gap-2">
                                    <Download className="h-4 w-4" /> DESCARGAR PDF
                                </Button>
                            </a>
                        </div>
                        <Button 
                            onClick={onClose}
                            className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black text-base rounded-none gap-3 shadow-xl"
                        >
                            FINALIZAR Y VOLVER AL LISTADO <ArrowRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Audit ID */}
                <div className="p-3 bg-primary/5 border-t border-primary/10 flex justify-center">
                    <p className="text-[9px] font-mono text-primary uppercase tracking-[0.2em]">
                        UUID Auditoría: {fuecData.id.toUpperCase()}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function DetailItem({ label, value, subValue }: { label: string, value: string, subValue?: string }) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">{label}</p>
            <p className="text-base font-bold text-primary leading-tight">{value}</p>
            {subValue && <p className="text-[11px] text-muted-foreground font-medium truncate uppercase">{subValue}</p>}
        </div>
    );
}
