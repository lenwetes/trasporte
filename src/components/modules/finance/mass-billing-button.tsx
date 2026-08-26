"use client";

import { useState, useEffect } from "react";
import { runMassBilling, previewMassBilling } from "@/actions/finance/billing";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Calendar,
    Play,
    AlertTriangle,
    CheckCircle2,
    Loader2,
    Coins,
    Receipt,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
export function MassBillingButton() {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<{
        count: number;
        total: number;
        amount: number;
    } | null>(null);
    const [result, setResult] = useState<{
        procesados: number;
        errors?: string[];
    } | null>(null);

    const currentMonth = new Date().toLocaleString("es-CO", {
        month: "long",
        year: "numeric",
    });

    useEffect(() => {
        if (open && !result) {
            loadPreview();
        }
    }, [open]);

    const loadPreview = async () => {
        setLoading(true);
        try {
            const res = await previewMassBilling({});
            if (res.success) {
                setPreview(
                    res.data as {
                        count: number;
                        total: number;
                        amount: number;
                    },
                );
            }
        } catch (error) {
            toast.error("Error al cargar previsualización");
        } finally {
            setLoading(false);
        }
    };

    const handleRun = async () => {
        setLoading(true);
        try {
            const res = await runMassBilling({});
            if (res.success) {
                setResult(
                    res.data as { procesados: number; errors?: string[] },
                );
                toast.success(res.message);
                setPreview(null);
            } else {
                toast.error(res.error);
                setOpen(false);
            }
        } catch (error) {
            toast.error("Error al procesar la facturación");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setResult(null);
        setPreview(null);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>
                    <Play />
                    Generar Facturación {currentMonth}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <span>[CALENDAR]</span>
                        Facturación Mensual Masiva
                    </DialogTitle>
                    <DialogDescription>
                        Causación automática de obligaciones para el periodo
                        actual.
                    </DialogDescription>
                </DialogHeader>

                {!result ? (
                    <div>
                        {loading && !preview ? (
                            <div>
                                <span>[LOADER2]</span>
                                <span>
                                    Calculando proyección...
                                </span>
                            </div>
                        ) : preview ? (
                            <>
                                <div>
                                    <div>
                                        <span>
                                            <Receipt />A
                                            Generar
                                        </span>
                                        <span>
                                            {preview.count}
                                        </span>
                                        <span>
                                            Cuentas de Cobro
                                        </span>
                                    </div>
                                    <div>
                                        <span>
                                            <Coins />
                                            Valor Total
                                        </span>
                                        <span>
                                            {formatCurrency(preview.total)}
                                        </span>
                                        <span>
                                            Proyección de Ingresos
                                        </span>
                                    </div>
                                </div>

                                {preview.count > 0 ? (
                                    <div>
                                        <span>[ALERTTRIANGLE]</span>
                                        <p>
                                            Al confirmar, se generarán{" "}
                                            {preview.count} obligaciones por
                                            valor de{" "}
                                            {formatCurrency(preview.amount)}{" "}
                                            c/u. Esta acción afectará la
                                            contabilidad automáticamente.
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <span>[CHECK]</span>
                                        <p>
                                            Todo al día. No hay vehículos
                                            pendientes por facturar en este
                                            periodo.
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : null}
                    </div>
                ) : (
                    <div>
                        <div>
                            <div>
                                <span>[CHECK]</span>
                            </div>
                            <div>
                                <h4>
                                    Proceso Completado
                                </h4>
                                <p>
                                    Se generaron exitosamente{" "}
                                    {result.procesados} obligaciones.
                                </p>
                            </div>
                        </div>
                        {(result.errors?.length ?? 0) > 0 && (
                            <div>
                                <p>
                                    <span>[ALERTTRIANGLE]</span>
                                    Inconsistencias ({result.errors?.length}):
                                </p>
                                <ul>
                                    {result.errors?.map(
                                        (err: string, i: number) => (
                                            <li key={i}>{err}</li>
                                        ),
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter>
                    <Button variant="ghost" onClick={handleClose}>
                        {result ? "Cerrar" : "Cancelar"}
                    </Button>
                    {!result && (preview?.count ?? 0) > 0 && (
                        <Button onClick={handleRun} disabled={loading}>
                            {loading && <span>[LOADER2]</span>}
                            Confirmar y Facturar
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
