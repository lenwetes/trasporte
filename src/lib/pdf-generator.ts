"use client";

import React from "react";

export type ReportConfig = {
    nombreEmpresa?: string | null;
    colorPrimario?: string | null;
    telefono?: string | null;
    email?: string | null;
    direccion?: string | null;
    nit?: string | null;
    nombrePresidente?: string | null;
    logoLocalPath?: string | null;
    logoUrl?: string | null;
};

interface ReportOptions {
    title: string;
    subtitle?: string;
    filename: string;
    columns: { header: string; dataKey: string }[];
    data: Record<string, unknown>[];
    config?: ReportConfig | null;
}

export const generatePDFReport = async ({
    title,
    subtitle,
    filename,
    columns,
    data,
    config,
}: ReportOptions) => {
    const { pdf } = await import("@react-pdf/renderer");
    const { saveAs } = await import("file-saver");
    const { GenericReportPDF } = await import("./pdf/reports/generic-report-view");

    const blob = await pdf(
        React.createElement(GenericReportPDF, {
            title,
            subtitle,
            columns,
            data,
            config: config ? {
                nombreEmpresa: config.nombreEmpresa,
                nit: config.nit,
                direccion: config.direccion,
                telefono: config.telefono,
                email: config.email,
                logoUrl: config.logoUrl,
                colorPrimario: config.colorPrimario
            } : null
        })
    ).toBlob();

    saveAs(blob, `${filename}.pdf`);
};
