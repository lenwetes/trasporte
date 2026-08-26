"use client";

import { useState } from "react";
import {
    generateSafetyIndicatorsPDF,
    SafetyIndicatorsReportData,
} from "@/lib/pdf-generator-safety";
import { trackExport } from "@/actions";
import { toast } from "sonner";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportActionsProps {
    data: SafetyIndicatorsReportData;
    companyConfig?: import("@prisma/client").ConfiguracionGlobal | null;
}

export function ReportActions({ data, companyConfig }: ReportActionsProps) {
    const [isExportingPDF, setIsExportingPDF] = useState(false);

    const handleExportPDF = async () => {
        setIsExportingPDF(true);
        const toastId = toast.loading("Procesando inteligencia de datos y generando PDF...");
        try {
            await generateSafetyIndicatorsPDF({
                ...data,
                config: companyConfig,
            });
            await trackExport({
                tipo: "Indicadores Safety PDF",
                entidadId: undefined,
                detalles: `Año: ${data.periodo}`,
            });
            toast.success("Reporte de seguridad generado con éxito", { id: toastId });
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast.error("Error crítico al generar el reporte PDF", { id: toastId });
        } finally {
            setIsExportingPDF(false);
        }
    };

    return (
        <div className="flex gap-4">
            <Button
                onClick={handleExportPDF}
                disabled={isExportingPDF}
                className="h-11 px-8 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-md shadow-slate-200"
            >
                {isExportingPDF ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generando...
                    </>
                ) : (
                    <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generar Reporte Ejecutivo
                    </>
                )}
            </Button>
        </div>
    );
}

