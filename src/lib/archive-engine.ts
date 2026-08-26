import { prisma } from "@/lib/prisma";
import { storageProvider } from "@/lib/storage";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import path from "path";

export interface ArchiveOptions {
    nombreOriginal: string;
    tipoMime: string;
    tamano: number;
    entidadTipo?: string;
    entidadId?: string;
}

/**
 * ArchiveEngine: Unified service for file registration and entity linking.
 * "One-click" record creation in RepositorioArchivo.
 */
export class ArchiveEngine {
    /**
     * Registers a file that has ALREADY been physically uploaded.
     */
    static async registerFile(
        rutaAbsoluta: string,
        options: ArchiveOptions,
    ): Promise<ActionResult> {
        try {
            const nombreUnico = path.basename(rutaAbsoluta);

            const fileRecord = await prisma.repositorioArchivo.create({
                data: {
                    nombreOriginal: options.nombreOriginal,
                    nombreUnico,
                    rutaAbsoluta,
                    tipoMime: options.tipoMime,
                    tamano: options.tamano,
                },
            });

            logger.info(
                { fileId: fileRecord.id },
                "File registered in RepositorioArchivo",
            );
            return { success: true, data: fileRecord };
        } catch (error) {
            logger.error({ error, options }, "Error registering file in DB");
            return {
                success: false,
                error: "Error al registrar archivo en base de datos",
            };
        }
    }

    /**
     * Integrated Archive: Uploads a Buffer and registers it in one go.
     */
    static async archiveBuffer(
        buffer: Buffer,
        options: ArchiveOptions,
    ): Promise<ActionResult> {
        try {
            // In Node.js environment, we might need a dummy File-like object if storageProvider strictly checks 'instanceof File'
            // However, our LocalStorageProvider uses arrayBuffer() and size/type/name.
            // We can mock it or use Blob/File if available in the environment.

            const file = {
                name: options.nombreOriginal,
                size: options.tamano,
                type: options.tipoMime,
                arrayBuffer: async () =>
                    buffer.buffer.slice(
                        buffer.byteOffset,
                        buffer.byteOffset + buffer.byteLength,
                    ),
            } as unknown as File;

            // Save to physical storage
            const uploadResult = await storageProvider.save(file);

            // Register in DB
            return await this.registerFile(uploadResult.path, options);
        } catch (error) {
            logger.error({ error, options }, "Error archiving buffer");
            return { success: false, error: "Error en el motor de archivado"  };
        }
    }

    /**
     * Links an existing archive to a specific model.
     */
    static async linkToEntity(
        archivoId: string,
        model: string,
        entityId: string,
    ): Promise<ActionResult> {
        try {
            let result;
            switch (model.toLowerCase()) {
                case "detallelicencia":
                    result = await prisma.detalleLicencia.update({
                        where: { id: entityId },
                        data: { archivoId },
                    });
                    break;
                case "certificado":
                    result = await prisma.certificado.update({
                        where: { id: entityId },
                        data: { archivoId },
                    });
                    break;
                case "documentovehiculo":
                    result = await prisma.documentoVehiculo.update({
                        where: { id: entityId },
                        data: { archivoId },
                    });
                    break;
                case "examenmedico":
                    result = await prisma.examenMedico.update({
                        where: { id: entityId },
                        data: { archivoId },
                    });
                    break;
                case "mantenimientorealizado":
                    result = await prisma.mantenimientoRealizado.update({
                        where: { id: entityId },
                        data: { archivoId },
                    });
                    break;
                case "ordenservicio":
                    result = await prisma.ordenServicio.update({
                        where: { id: entityId },
                        data: { comprobanteId: archivoId },
                    });
                    break;
                default:
                    throw new Error(
                        `Modelo ${model} no soportado para vinculación automática`,
                    );
            }

            return { success: true, data: result };
        } catch (error) {
            logger.error(
                { error, archivoId, model, entityId },
                "Error linking archive to entity",
            );
            return {
                success: false,
                error: "Error al vincular archivo con la entidad",
            };
        }
    }
}
