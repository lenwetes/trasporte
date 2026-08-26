"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConceptoFinanciero, CuentaContable } from "@prisma/client";
import { createCashMovement } from "@/actions/finance/cash-movements";
import { formatCurrency } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, Zap } from "lucide-react";
import { toast } from "sonner";

interface QuickConceptButtonsProps {
    conceptos: (ConceptoFinanciero & { cuenta: CuentaContable })[];
}

export function QuickConceptButtons({ conceptos }: QuickConceptButtonsProps) {
    const [selectedConcept, setSelectedConcept] = useState<
        (ConceptoFinanciero & { cuenta: CuentaContable }) | null
    >(null);
    const [monto, setMonto] = useState("");
    const [tercero, setTercero] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filtrar conceptos con valor por defecto o simplemente los primeros 6 para accesibilidad
    const quickConcepts = conceptos
        .filter((c) => c.activo)
        .sort((a, b) => {
            // Priorizar los que tienen valor por defecto
            if (a.valorPorDefecto && !b.valorPorDefecto) return -1;
            if (!a.valorPorDefecto && b.valorPorDefecto) return 1;
            return 0;
        })
        .slice(0, 6);

    const handleOpenDialog = (
        concepto: ConceptoFinanciero & { cuenta: CuentaContable },
    ) => {
        setSelectedConcept(concepto);
        setMonto(concepto.valorPorDefecto?.toString() || "");
        setTercero("");
    };

    const handleClose = () => {
        setSelectedConcept(null);
        setMonto("");
        setTercero("");
    };

    const handleSubmit = async () => {
        if (!selectedConcept || !monto) return;

        setIsSubmitting(true);
        try {
            const result = await createCashMovement({
                tipo: selectedConcept.tipo as "INGRESO" | "EGRESO",
                conceptoId: selectedConcept.id,
                monto: parseFloat(monto),
                terceroId: tercero || undefined,
                detallesPago: [{ metodo: "EFECTIVO", monto: parseFloat(monto) }],
            });

            if (result.success) {
                toast.success(`✅ ${selectedConcept.nombre} registrado`);
                handleClose();
            } else {
                toast.error(result.error || "Error al registrar movimiento");
            }
        } catch {
            toast.error("Error inesperado");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            {quickConcepts.map((concepto) => (
                <Button
                    key={concepto.id}
                    variant="outline"
                    onClick={() => handleOpenDialog(concepto)}
                >
                    <div />

                    <div>
                        <div>
                            {concepto.tipo === "INGRESO" ? (
                                <ArrowUpRight />
                            ) : (
                                <ArrowDownRight />
                            )}
                        </div>
                        {concepto.valorPorDefecto && (
                            <span>
                                {formatCurrency(
                                    Number(concepto.valorPorDefecto),
                                )}
                            </span>
                        )}
                    </div>
                    <span>
                        {concepto.nombre}
                    </span>
                    <span>
                        PUC {concepto.cuenta.codigo}
                    </span>
                </Button>
            ))}

            <Dialog
                open={!!selectedConcept}
                onOpenChange={(open: boolean) => !open && handleClose()}
            >
                <DialogContent>
                    <DialogHeader>
                        <div />
                        <DialogTitle>
                            <div>
                                <Zap />
                            </div>
                            Registro Expreso
                        </DialogTitle>
                    </DialogHeader>
                    <div>
                        <div>
                            <Label>
                                <div />
                                Concepto Operativo
                            </Label>
                            <p>
                                {selectedConcept?.nombre}
                            </p>
                            <div>
                                <span>
                                    PUC {selectedConcept?.cuenta.codigo}
                                </span>
                                <span>
                                    {selectedConcept?.cuenta.nombre.toLowerCase()}
                                </span>
                            </div>
                        </div>

                        <div>
                            <Label
                                htmlFor="monto_rapido"
                                
                            >
                                Valor Transaccional
                            </Label>
                            <div>
                                <span>
                                    $
                                </span>
                                <Input
                                    id="monto_rapido"
                                    type="number"
                                    value={monto}
                                    onChange={(e) => setMonto(e.target.value)}
                                    placeholder="0.00"
                                    
                                    autoFocus
                                />
                            </div>
                        </div>

                        {selectedConcept?.requiereTercero && (
                            <div>
                                <Label
                                    htmlFor="tercero_rapido"
                                    
                                >
                                    Tercero / Beneficiario
                                </Label>
                                <Input
                                    id="tercero_rapido"
                                    value={tercero}
                                    onChange={(e) => setTercero(e.target.value)}
                                    placeholder="Identidad de contraparte"
                                    
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={handleClose}>
                            Descartar
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting || !monto}>
                            {isSubmitting ? <span>[LOADER2]</span> : (
                                <>
                                    <div />
                                    Confirmar Registro
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
