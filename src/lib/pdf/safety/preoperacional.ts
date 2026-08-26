import React from "react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import { PreoperacionalPDFView } from "./preoperacional-pdf-view";
import type { PreoperacionalPDFData } from "./types";

export const generatePreoperacionalPDF = async (
    data: PreoperacionalPDFData,
) => {
    try {
        const blob = await pdf(
            (PreoperacionalPDFView as any)({ data })
        ).toBlob();
        
        const filename = `Preoperacional_${data.vehiculo.placa}_${format(new Date(data.fecha), "yyyy-MM-dd")}.pdf`;
        saveAs(blob, filename);
        return { success: true };
    } catch (error) {
        console.error("PDF Generation Error:", error);
        throw error;
    }
};
