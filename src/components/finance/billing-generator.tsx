"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { generateMonthlyFeesAction } from "@/actions/finance/charges.actions";

export function BillingGenerator() {
    const [isPending, startTransition] = useTransition();

    // Obtener nombre del mes actual
    const currentMonth = new Date().toLocaleString("es-CO", {
        month: "long",
        year: "numeric",
    });

    const handleGenerate = () => {
        startTransition(async () => {
            const result = await generateMonthlyFeesAction({
                periodo: new Date(),
            });

            if (result.success) {
                console.log("Proceso exitoso");
            } else {
                console.error("Error en el procesos masivo", result.error);
            }
        });
    };

    return (
        <div>
            <div>
                <div />
                <div>
                    <h3>
                        Generación Masiva
                    </h3>
                    <p>
                        Facturación de Cuotas Mensuales
                    </p>
                </div>
                <div>
                    <span>[ZAP]</span>
                </div>
            </div>

            <div>
                <div>
                    <p>
                        Análisis del Periodo
                    </p>
                    <div>
                        <span>
                            Corte Contable Vigente
                        </span>
                        <span>
                            {currentMonth}
                        </span>
                    </div>
                </div>

                <div>
                    <div>
                        <span>[SHIELD_CHECK]</span>
                    </div>
                    <div>
                        <p>
                            Impacto de Operación
                        </p>
                        <p>
                            Generación inmediata de obligaciones para asociados
                            activos.
                        </p>
                    </div>
                </div>

                <Button onClick={handleGenerate} disabled={isPending}>
                    {isPending ? (
                        <>
                            <span>[LOADER2]</span>
                            <span>Procesando Lote...</span>
                        </>
                    ) : (
                        <>
                            <span>Lanzar Proceso Masivo</span>
                            <span>[ARROW_RIGHT]</span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
