import { CVData } from "./cv-types";
import { rgb, StandardFonts } from "pdf-lib";

export const mergeCertificates = async (
    mainPdfBytes: ArrayBuffer,
    data: CVData,
) => {
    const { PDFDocument } = await import("pdf-lib");
    const mergedPdf = await PDFDocument.load(mainPdfBytes);
    const fontBold = await mergedPdf.embedFont(StandardFonts.HelveticaBold);
    const fontNormal = await mergedPdf.embedFont(StandardFonts.Helvetica);

    const brandColor = rgb(0.004, 0.329, 0.38); // #015461 primary
    const accentColor = rgb(0.004, 0.529, 0.564); // #018790 brand

    const addSeparatorPage = async (title: string, subtitle: string) => {
        const page = mergedPdf.addPage();
        const { width, height } = page.getSize();
        page.drawRectangle({ x: 0, y: height / 2 - 50, width: width, height: 100, color: rgb(0.96, 0.97, 0.98) });
        page.drawRectangle({ x: 40, y: height / 2 - 40, width: 8, height: 80, color: accentColor });
        page.drawText(title.toUpperCase(), { x: 65, y: height / 2 + 10, size: 28, font: fontBold, color: brandColor });
        page.drawText(subtitle.toUpperCase(), { x: 65, y: height / 2 - 20, size: 10, font: fontBold, color: rgb(0.4, 0.45, 0.5) });
        
        // Identity info at bottom of separator
        page.drawText(`HOJA DE VIDA: ${data.usuario.nombres} ${data.usuario.apellidos}`, { x: 65, y: 50, size: 8, font: fontNormal, color: rgb(0.6, 0.6, 0.6) });
        page.drawText(`ID: ${data.usuario.numeroDocumento} | GENERADO: ${new Date().toLocaleDateString()}`, { x: 65, y: 38, size: 8, font: fontNormal, color: rgb(0.6, 0.6, 0.6) });
    };

    const applyWatermark = (page: import("pdf-lib").PDFPage, label: string) => {
        const { width, height } = page.getSize();
        // Technical Header Overlay
        page.drawRectangle({
            x: 0,
            y: height - 40,
            width: width,
            height: 40,
            color: rgb(0.98, 0.99, 1),
            opacity: 0.9,
        });
        page.drawRectangle({ x: 0, y: height - 40, width: width, height: 1, color: brandColor });
        
        page.drawText("ANEXO DIGITAL - COOPETRAES", {
            x: 20,
            y: height - 20,
            size: 9,
            font: fontBold,
            color: brandColor,
        });

        const idText = `DOCUMENTO: ${label} | HV-ID: ${data.usuario.numeroDocumento}`;
        page.drawText(idText.toUpperCase(), {
            x: 20,
            y: height - 32,
            size: 7,
            font: fontNormal,
            color: rgb(0.4, 0.4, 0.4),
        });
        
        page.drawText(`PÁGINA SISTEMA ID: ${data.usuario.id.substring(0,8)}`, {
            x: width - 150,
            y: height - 20,
            size: 6,
            font: fontNormal,
            color: rgb(0.5, 0.5, 0.5),
        });
    };

    const appendFile = async (nombreUnico: string, label: string) => {
        try {
            const response = await fetch(`/api/files/${nombreUnico}`);
            if (!response.ok) return false;
            const fileBytes = await response.arrayBuffer();
            const uint8 = new Uint8Array(fileBytes);
            const isPdf = uint8.length > 4 && uint8[0] === 0x25 && uint8[1] === 0x50 && uint8[2] === 0x44 && uint8[3] === 0x46;

            if (isPdf) {
                const donorPdf = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
                const copiedPages = await mergedPdf.copyPages(donorPdf, donorPdf.getPageIndices());
                copiedPages.forEach((page) => {
                    mergedPdf.addPage(page);
                    applyWatermark(page, label);
                });
            } else {
                let image;
                try { image = await mergedPdf.embedJpg(fileBytes); } catch {
                    try { image = await mergedPdf.embedPng(fileBytes); } catch { return false; }
                }
                if (image) {
                    const page = mergedPdf.addPage();
                    const { width, height } = page.getSize();
                    const margin = 50;
                    const scale = Math.min((width - margin * 2) / image.width, (height - margin * 2 - 40) / image.height);
                    page.drawImage(image, {
                        x: (width - image.width * scale) / 2,
                        y: (height - image.height * scale) / 2 - 20,
                        width: image.width * scale,
                        height: image.height * scale,
                    });
                    applyWatermark(page, label);
                }
            }
            return true;
        } catch (err) {
            console.error(`Error merging ${label}:`, err);
            return false;
        }
    };

    // SEQUENCE
    if (data.usuario.documentoIdentidad?.nombreUnico) {
        await addSeparatorPage("Documento de Identidad", "Cédula de ciudadanía y registro legal.");
        await appendFile(data.usuario.documentoIdentidad.nombreUnico, "DOC_IDENTIDAD");
    }

    const licsWithFiles = data.licencias?.filter(l => l.archivo?.nombreUnico) || [];
    if (licsWithFiles.length > 0) {
        await addSeparatorPage("Licencias y Tránsito", "Habilitaciones vigentes del Ministerio de Transporte.");
        for (const lic of licsWithFiles) {
            await appendFile(lic.archivo!.nombreUnico, `LIC_${lic.categoria}`);
        }
    }

    const certsWithFiles = data.certificados.filter(c => c.archivo?.nombreUnico);
    if (certsWithFiles.length > 0) {
        await addSeparatorPage("Estudios y Capacitación", "Títulos académicos y cursos de actualización profesional.");
        for (const cert of certsWithFiles) {
            await appendFile(cert.archivo!.nombreUnico, cert.nombre.substring(0, 15));
        }
    }

    const expsWithFiles = data.experienciasLaborales.filter(e => e.archivo?.nombreUnico);
    if (expsWithFiles.length > 0) {
        await addSeparatorPage("Experiencia Laboral", "Historial de desempeño y referencias de empleadores previos.");
        for (const exp of expsWithFiles) {
            await appendFile(exp.archivo!.nombreUnico, `EXP_${exp.empresa.substring(0, 10)}`);
        }
    }

    return await mergedPdf.save();
};

export const mergeVehicleDocuments = async (
    mainPdfBytes: ArrayBuffer,
    vehiculo: any,
) => {
    const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
    const mergedPdf = await PDFDocument.load(mainPdfBytes);
    const fontBold = await mergedPdf.embedFont(StandardFonts.HelveticaBold);
    const fontNormal = await mergedPdf.embedFont(StandardFonts.Helvetica);

    const brandColor = rgb(0.004, 0.329, 0.38); // #015461 primary
    const accentColor = rgb(0.004, 0.529, 0.564); // #018790 brand

    const addSeparatorPage = async (title: string, subtitle: string) => {
        const page = mergedPdf.addPage();
        const { width, height } = page.getSize();
        page.drawRectangle({ x: 0, y: height / 2 - 50, width: width, height: 100, color: rgb(0.96, 0.97, 0.98) });
        page.drawRectangle({ x: 40, y: height / 2 - 40, width: 8, height: 80, color: accentColor });
        page.drawText(title.toUpperCase(), { x: 65, y: height / 2 + 10, size: 28, font: fontBold, color: brandColor });
        page.drawText(subtitle.toUpperCase(), { x: 65, y: height / 2 - 20, size: 10, font: fontBold, color: rgb(0.4, 0.45, 0.5) });
        
        // Identity info at bottom of separator
        page.drawText(`VEHÍCULO: ${vehiculo.placa}`, { x: 65, y: 50, size: 8, font: fontNormal, color: rgb(0.6, 0.6, 0.6) });
        page.drawText(`CLASE: ${vehiculo.clase} | GENERADO: ${new Date().toLocaleDateString()}`, { x: 65, y: 38, size: 8, font: fontNormal, color: rgb(0.6, 0.6, 0.6) });
    };

    const applyWatermark = (page: import("pdf-lib").PDFPage, label: string) => {
        const { width, height } = page.getSize();
        // Technical Header Overlay
        page.drawRectangle({
            x: 0,
            y: height - 40,
            width: width,
            height: 40,
            color: rgb(0.98, 0.99, 1),
            opacity: 0.9,
        });
        page.drawRectangle({ x: 0, y: height - 40, width: width, height: 1, color: brandColor });
        
        page.drawText("ANEXO DIGITAL - COOPETRAES", {
            x: 20,
            y: height - 20,
            size: 9,
            font: fontBold,
            color: brandColor,
        });

        const idText = `DOCUMENTO: ${label} | PLACA: ${vehiculo.placa}`;
        page.drawText(idText.toUpperCase(), {
            x: 20,
            y: height - 32,
            size: 7,
            font: fontNormal,
            color: rgb(0.4, 0.4, 0.4),
        });
        
        page.drawText(`SISTEMA ID: ${vehiculo.id.substring(0,8)}`, {
            x: width - 150,
            y: height - 20,
            size: 6,
            font: fontNormal,
            color: rgb(0.5, 0.5, 0.5),
        });
    };

    const appendFile = async (nombreUnico: string, label: string) => {
        try {
            const response = await fetch(`/api/files/${nombreUnico}`);
            if (!response.ok) return false;
            const fileBytes = await response.arrayBuffer();
            const uint8 = new Uint8Array(fileBytes);
            const isPdf = uint8.length > 4 && uint8[0] === 0x25 && uint8[1] === 0x50 && uint8[2] === 0x44 && uint8[3] === 0x46;

            if (isPdf) {
                const donorPdf = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
                const copiedPages = await mergedPdf.copyPages(donorPdf, donorPdf.getPageIndices());
                copiedPages.forEach((page) => {
                    mergedPdf.addPage(page);
                    applyWatermark(page, label);
                });
            } else {
                let image;
                try { image = await mergedPdf.embedJpg(fileBytes); } catch {
                    try { image = await mergedPdf.embedPng(fileBytes); } catch { return false; }
                }
                if (image) {
                    const page = mergedPdf.addPage();
                    const { width, height } = page.getSize();
                    const margin = 50;
                    const scale = Math.min((width - margin * 2) / image.width, (height - margin * 2 - 40) / image.height);
                    page.drawImage(image, {
                        x: (width - image.width * scale) / 2,
                        y: (height - image.height * scale) / 2 - 20,
                        width: image.width * scale,
                        height: image.height * scale,
                    });
                    applyWatermark(page, label);
                }
            }
            return true;
        } catch (err) {
            console.error(`Error merging ${label}:`, err);
            return false;
        }
    };

    const docsWithFiles = vehiculo.documentos?.filter((d: any) => d.archivo?.nombreUnico) || [];
    if (docsWithFiles.length > 0) {
        await addSeparatorPage("Documentación de Vehículo", "Anexos y soportes legales de operatividad.");
        for (const doc of docsWithFiles) {
            await appendFile(doc.archivo!.nombreUnico, `DOC_${doc.tipo}`);
        }
    }

    return await mergedPdf.save();
};

