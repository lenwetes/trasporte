"use client";

import JSZip from "jszip";
import { format } from "date-fns";

export interface ExpedienteData {
    examenes: any[];
    entregas: any[];
    preoperacionales: any[];
}

export async function generateSafetyArchive(
    conductorNombre: string,
    data: ExpedienteData,
    config?: any,
) {
    const zip = new JSZip();
    const folderExamenes = zip.folder("1_Examenes_Medicos");

    // 1. Procesar Exámenes Médicos (Local / S3)
    for (const exam of data.examenes) {
        if (exam.archivo?.nombreUnico) {
            try {
                const response = await fetch(
                    `/api/files/${exam.archivo.nombreUnico}`,
                );
                if (response.ok) {
                    const blob = await response.blob();
                    const fileName = `${format(new Date(exam.fechaRealizacion || new Date()), "yyyy-MM-dd")}_${exam.tipo}.pdf`;
                    folderExamenes?.file(fileName, blob);
                }
            } catch (error) {
                console.error("Error fetching exam", error);
            }
        }
    }

    zip.file("README.txt", "Motor de PDF (jsPDF) purgado (Fase 3). Certificados de Dotación y Preoperacionales migrarán próximamente a @react-pdf/renderer.");

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Expediente_${conductorNombre.replace(/\s+/g, "_")}_${format(new Date(), "yyyy-MM-dd")}.zip`;
    link.click();
    URL.revokeObjectURL(url);
}
