"use client";

import { useState } from "react";
import { generateSiniestroPDF } from "@/lib/pdf/siniestros/generator";
import { SiniestroPDFData } from "@/lib/pdf/siniestros/types";
import { SiniestroWithRelations } from "@/types";

interface SiniestroReportButtonProps {
    siniestro: SiniestroWithRelations;
    config?: import("@prisma/client").ConfiguracionGlobal | null;
}

import { toast } from "sonner";
import { FileText, Loader2 } from "lucide-react";

export function SiniestroReportButton({
    siniestro,
    config,
}: SiniestroReportButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        setIsGenerating(true);
        const toastId = toast.loading("Generando reporte para aseguradoras...");
        try {
            await generateSiniestroPDF({
                ...siniestro,
                config: config,
            } as SiniestroPDFData);
            toast.success("Reporte generado exitosamente", { id: toastId });
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast.error("Error al generar el PDF del siniestro", {
                id: toastId,
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isGenerating}
            style={{
                backgroundColor: "white",
                color: "#1e293b",
                border: "1px solid #e2e8f0",
                padding: "12px 24px",
                borderRadius: "14px",
                fontSize: "12px",
                fontWeight: "800",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: isGenerating ? "not-allowed" : "pointer",
                opacity: isGenerating ? 0.7 : 1,
                transition: "all 0.2s",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
            }}
        >
            {isGenerating ? (
                <Loader2 size={16} className="animate-spin" />
            ) : (
                <FileText size={16} />
            )}
            {isGenerating ? "GENERANDO..." : "REPORTE TÉCNICO VSM"}
        </button>
    );
}
