import React from "react";
import { pdf } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import { CVReportPDF } from "./pdf/reports/cv-report-view";
import type { CVData } from "./pdf/cv-types";
import { toast } from "sonner";

export type { CVData };

/**
 * Genera y descarga la Hoja de Vida en PDF de un conductor.
 * Usa React-PDF para renderizado de alta fidelidad.
 * @param data - Datos completos del conductor tipados con CVData.
 * @param preview - Si true, retorna un ObjectURL para previsualización en lugar de descargar.
 */
export const generateCV = async (data: CVData, preview = false): Promise<string | undefined> => {
    try {
        // CVReportPDF retorna un <Document> de @react-pdf/renderer.
        // El casteo tipado a ReactElement<DocumentProps> es correcto
        // ya que el componente wrapper devuelve exactamente ese tipo en su JSX raíz.
        const element = React.createElement(CVReportPDF, { data }) as React.ReactElement<DocumentProps>;
        const docBlob = await pdf(element).toBlob();

        if (preview) {
            return URL.createObjectURL(docBlob);
        }

        const url = URL.createObjectURL(docBlob);
        const a = document.createElement("a");
        a.href = url;
        const filename = `CV_${data.usuario.nombres}_${data.usuario.apellidos}_${new Date().toISOString().split("T")[0]}.pdf`
            .replace(/\s+/g, "_");
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);

        toast.success("Hoja de Vida generada correctamente");
        return url;
    } catch (error) {
        console.error("Error generating CV:", error);
        toast.error("Error al generar la Hoja de Vida digital.");
        return undefined;
    }
};
