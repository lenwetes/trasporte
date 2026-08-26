"use server";

import { prisma } from "@/lib/prisma";
import { storageProvider } from "@/lib/storage";
import { ActionResult } from "@/types";
import { RepositorioArchivo } from "@prisma/client";
import logger from "@/lib/logger";

/**
 * Upload file to server and save metadata to database
 */
export async function uploadFile(
    formData: FormData,
): Promise<ActionResult<RepositorioArchivo>> {
    try {
        const file = formData.get("file") as File;

        if (!file) {
            return {
                success: false,
                error: "No se proporcionó ningún archivo",
            };
        }

        // Validate file type
        const allowedTypes = [
            "application/pdf",
            "application/xml",
            "text/xml",
            "image/jpeg",
            "image/png",
            "image/jpg",
        ];
        if (!allowedTypes.includes(file.type)) {
            return { success: false, error: "Tipo de archivo no permitido" };
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            return {
                success: false,
                error: "El archivo excede el tamaño máximo de 10MB",
            };
        }

        // Use Storage Provider
        const savedFile = await storageProvider.save(file);

        // Save metadata to DB
        const archivo = await prisma.repositorioArchivo.create({
            data: {
                nombreOriginal: savedFile.originalName,
                nombreUnico: savedFile.filename,
                rutaAbsoluta: savedFile.path,
                tipoMime: savedFile.mimeType,
                tamano: savedFile.size,
            },
        });

        return { success: true, data: archivo };
    } catch (error) {
        logger.error({ error }, "Error uploading file");
        return { success: false, error: "Error al subir el archivo" };
    }
}
