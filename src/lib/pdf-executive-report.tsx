import React from "react";
import { pdf } from "@react-pdf/renderer";
import { ExecutiveReportPDF } from "./pdf/reports/executive-report-view";
import { toast } from "sonner";

interface ExecutiveReportData {
    periodo: string;
    empresa: {
        nombre: string;
        nit: string;
    };
    kpis: {
        disponibilidadFlota: number;
        siniestralidad: number;
        cumplimientoMantenimiento: number;
        vencimientosProximos: number;
    };
    analisis: string;
}

export const generateExecutiveReportPDF = async (data: ExecutiveReportData) => {
    try {
        const docBlob = await pdf(<ExecutiveReportPDF data={data} />).toBlob();
        const url = URL.createObjectURL(docBlob);
        
        const a = document.createElement("a");
        a.href = url;
        a.download = `Reporte_Ejecutivo_${data.periodo.replace(/\s+/g, '_')}.pdf`;
        a.click();
        
        URL.revokeObjectURL(url);
        toast.success("Reporte Ejecutivo descargado exitosamente");
        return url;
    } catch (error) {
        console.error("Error generating executive report:", error);
        toast.error("Error al generar el reporte ejecutivo digital.");
        return undefined;
    }
};
