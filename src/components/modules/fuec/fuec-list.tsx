"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    FileText,
    Download,
    Eye,
    ShieldCheck,
    Calendar,
    MapPin,
    AlertCircle,
    CheckCircle2,
    Clock,
    XCircle,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { PlanillaFUEC, ResolucionFUEC } from "@prisma/client";
import { FuecValidationDialog } from "./fuec-validation-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";

interface FuecWithRelations extends PlanillaFUEC {
    resolucion?: ResolucionFUEC | null;
}

interface RutaFUEC {
    origen: string;
    destino: string;
    perimetroUrbano: boolean;
}

interface FuecListProps {
    planillas: FuecWithRelations[];
}

export function FuecList({ planillas }: FuecListProps) {
    const [previewFuec, setPreviewFuec] = useState<FuecWithRelations | null>(null);
    const [validationFuec, setValidationFuec] = useState<PlanillaFUEC | null>(null);

    if (planillas.length === 0) {
        return (
            <div className="py-20">
                <EmptyState 
                    icon={<FileText className="h-12 w-12 text-primary/20" />}
                    title="No hay planillas generadas"
                    description="Cuando generes tu primer FUEC, aparecerá aquí para descarga y visualización técnica."
                />
            </div>
        );
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px]">Consecutivo</TableHead>
                        <TableHead>Vigencia Operativa</TableHead>
                        <TableHead>Corredor Vial (Origen - Destino)</TableHead>
                        <TableHead>Estado Doc.</TableHead>
                        <TableHead className="text-right">Control</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {planillas.map((p) => {
                        const rutas = (p.ruta as unknown as RutaFUEC[]) || [];
                        return (
                            <TableRow key={p.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-primary/5 flex items-center justify-center text-primary">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-primary leading-none">FUEC {p.consecutivo}</p>
                                            <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                                                Res: {p.resolucion?.numeroResolucion || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-primary/60">
                                            <Calendar className="h-3 w-3" />
                                            <span>Desde: {format(new Date(p.fechaInicio), "d MMM, yyyy", { locale: es })}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                                            <Clock className="h-3 w-3" />
                                            <span>Hasta: {format(new Date(p.fechaFin), "d MMM, yyyy", { locale: es })}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-3 w-3 text-accent" />
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="font-medium text-primary uppercase">
                                                {rutas[0]?.origen || "N/A"}
                                            </span>
                                            <ArrowRight className="h-3 w-3 text-primary/20" />
                                            <span className="font-medium text-primary uppercase">
                                                {rutas.slice(-1)[0]?.destino || "N/A"}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={p.estado} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-none text-primary/60 hover:text-primary hover:bg-primary/5"
                                            onClick={() => setPreviewFuec(p)}
                                            title="Previsualizar"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-none text-primary/60 hover:text-accent hover:bg-accent/5"
                                            onClick={() => setValidationFuec(p)}
                                            title="Auditoría"
                                        >
                                            <ShieldCheck className="h-4 w-4" />
                                        </Button>
                                        <a href={`/api/fuec/${p.id}/download`} download={`FUEC_${p.consecutivo}.pdf`}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-none text-primary/60 hover:text-brand hover:bg-brand/5"
                                                title="Descargar"
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </a>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            {/* Preview Modal */}
            <Dialog open={!!previewFuec} onOpenChange={(open) => !open && setPreviewFuec(null)}>
                <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
                    <DialogHeader className="p-6 border-b border-primary/10 bg-primary/[0.02]">
                        <div className="flex items-center justify-between w-full pr-8">
                            <div>
                                <DialogTitle className="text-primary flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-accent" />
                                    Vista Previa del Extracto
                                </DialogTitle>
                                <DialogDescription className="text-[10px] font-mono mt-1">
                                    DOCUMENTO INTERNO NO. {previewFuec?.consecutivo}
                                </DialogDescription>
                            </div>
                            <a 
                                href={previewFuec ? `/api/fuec/${previewFuec.id}/download` : "#"} 
                                download={previewFuec ? `FUEC_${previewFuec.consecutivo}.pdf` : undefined}
                            >
                                <Button className="h-9 gap-2">
                                    <Download className="h-4 w-4" />
                                    Descargar PDF
                                </Button>
                            </a>
                        </div>
                    </DialogHeader>
                    <div className="flex-1 bg-muted/30 p-4">
                        {previewFuec && (
                            <iframe
                                src={`/api/fuec/${previewFuec.id}/preview`}
                                className="w-full h-full border border-primary/10 shadow-inner bg-white"
                                title={`Vista previa FUEC ${previewFuec.consecutivo}`}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Validation Modal */}
            <FuecValidationDialog
                fuec={validationFuec}
                onClose={() => setValidationFuec(null)}
            />
        </>
    );
}

function StatusBadge({ status }: { status: string }) {
    const configs: Record<string, { label: string; icon: React.ElementType; className: string }> = {
        ACTIVO: {
            label: "Vigente",
            icon: CheckCircle2,
            className: "text-accent bg-accent/10 border-accent/20",
        },
        VENCIDO: {
            label: "Vencido",
            icon: Clock,
            className: "text-amber-600 bg-amber-50 border-amber-200",
        },
        ANULADO: {
            label: "Anulado",
            icon: XCircle,
            className: "text-red-600 bg-red-50 border-red-200",
        },
    };

    const config = configs[status] || configs.ACTIVO;
    const Icon = config.icon;

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border rounded-none",
            config.className
        )}>
            <Icon className="h-3.5 w-3.5" />
            {config.label}
        </span>
    );
}
