"use server";
/**
 * Acción de servidor para obtener la información de empresa
 * y el logo codificado en base64 para los reportes Excel.
 */

import fs from "node:fs";
import nodePath from "node:path";
import { prisma } from "@/lib/prisma";

export interface EmpresaExcelInfo {
    nombreEmpresa: string;
    telefono: string | null;
    email: string | null;
    direccion: string | null;
    representanteLegal: string | null;
    logoBase64: string | null;
    logoExtension: string | null;
}

export async function getEmpresaExcelInfo(): Promise<EmpresaExcelInfo> {
    let config: { 
        nombreEmpresa: string;
        logoLocalPath: string | null;
        telefono: string | null;
        email: string | null;
        direccion: string | null;
        representanteLegal: string | null;
    } | null = null;

    try {
        config = await prisma.configuracionGlobal.findUnique({
            where: { id: "default" },
            select: {
                nombreEmpresa: true,
                logoLocalPath: true,
                telefono: true,
                email: true,
                direccion: true,
                representanteLegal: true,
            },
        });
    } catch {
        // Sin conexión a BD, usar defaults
    }

    const nombre = config?.nombreEmpresa ?? "COOPETRAES";

    // Intentar leer el logo desde disco
    let logoBase64: string | null = null;
    let logoExtension: string | null = null;

    const candidatos = [
        config?.logoLocalPath,
        nodePath.join(process.cwd(), "public", "logo-empresa.png"),        // Logo horizontal (correcto)
        nodePath.join(process.cwd(), "public", "images", "fuec", "logo-coopetraes.png"),
        nodePath.join(process.cwd(), "public", "logo-coopetraes.png"),     // Ícono cuadrado (fallback)
    ].filter((p): p is string => Boolean(p));

    for (const ruta of candidatos) {
        try {
            if (fs.existsSync(ruta)) {
                const buffer = fs.readFileSync(ruta);
                logoBase64 = buffer.toString("base64");
                logoExtension = nodePath.extname(ruta).replace(".", "").toLowerCase();
                break;
            }
        } catch {
            continue;
        }
    }

    return {
        nombreEmpresa: nombre,
        telefono: config?.telefono ?? null,
        email: config?.email ?? null,
        direccion: config?.direccion ?? null,
        representanteLegal: config?.representanteLegal ?? null,
        logoBase64,
        logoExtension,
    };
}
