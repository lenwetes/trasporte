"use client";

import { hexToRgb, formatCurrency } from "@/lib/utils";
import { ReportConfig } from "../pdf-generator";

export interface ReceiptPayer {
    nombre: string;
    documento: string;
    telefono?: string;
}

export interface ReceiptItem {
    description: string;
    amount: number;
}

export interface ReceiptOptions {
    numero: string;
    fecha: Date;
    payer: ReceiptPayer;
    items: ReceiptItem[];
    total: number;
    metodoPago: string;
    referencia?: string;
    elaboradoPor: string;
    config?: ReportConfig | null;
    title?: string; // Por defecto "RECIBO DE CAJA"
    anexoUrl?: string;
    anexoType?: string;
    uniqueId?: string; // ID único para evitar conflictos en descargas
}

// import { drawReportHeader } from "./shared-header";

import { pdf } from "@react-pdf/renderer";
import React from "react";
import { saveAs } from "file-saver";
import { FinanceReceiptPDFView } from "./finance/finance-receipt-pdf-view";

export const generatePaymentReceiptPDF = async (options: ReceiptOptions) => {
    const { PDFDocument } = await import("pdf-lib");

    try {
        // 1. Generar el PDF principal con React-PDF
        const mainBlob = await pdf(
            (FinanceReceiptPDFView as any)({ options })
        ).toBlob();

        let finalBlob = mainBlob;

        // 2. Manejo de Anexos (Si existen)
        if (options.anexoUrl) {
            try {
                const response = await fetch(options.anexoUrl);
                const anexoBlob = await response.blob();

                if (options.anexoType?.includes("image")) {
                    // Para imágenes, React-PDF podría manejarlas si las pasamos al componente,
                    // pero para mantener compatibilidad con la lógica anterior de "página extra",
                    // podríamos simplemente regenerar o usar pdf-lib para añadir la imagen.
                    // Por simplicidad en esta unificación, mantenemos la lógica de descarga del principal
                    // y el anexo como una página adicional si es PDF.
                    // Si es imagen, en esta versión unificada, el usuario debería verla en el sistema.
                    // Si se requiere en el PDF, el componente FinanceReceiptPDFView debería recibirla.
                } else if (options.anexoType?.includes("pdf")) {
                    const existingPdfBytes = await anexoBlob.arrayBuffer();
                    const mainPdfBytes = await mainBlob.arrayBuffer();

                    const mainPdfDoc = await PDFDocument.load(mainPdfBytes);
                    const anexoPdfDoc = await PDFDocument.load(existingPdfBytes);

                    const copiedPages = await mainPdfDoc.copyPages(
                        anexoPdfDoc,
                        anexoPdfDoc.getPageIndices(),
                    );
                    copiedPages.forEach((page) => mainPdfDoc.addPage(page));

                    const mergedPdfBytes = await mainPdfDoc.save();
                    finalBlob = new Blob(
                        [mergedPdfBytes.buffer as ArrayBuffer],
                        { type: "application/pdf" },
                    );
                }
            } catch (error) {
                console.error("Error al procesar anexo PDF:", error);
            }
        }

        // 3. Descarga final
        const filename = options.uniqueId
            ? `${options.title?.replace(/ /g, "_") || "Comprobante"}_${options.numero}_${options.uniqueId}.pdf`
            : `${options.title?.replace(/ /g, "_") || "Comprobante"}_${options.numero}.pdf`;
        
        saveAs(finalBlob, filename);
        return { success: true };
    } catch (error) {
        console.error("Error generating Finance PDF:", error);
        throw error;
    }
};
