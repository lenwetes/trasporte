"use server";

import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { withAuth } from "@/lib/safe-action";
import { hasPermission, unauthorizedResponse } from "@/lib/permissions";
import logger from "@/lib/logger";
import { storageProvider } from "@/lib/storage";
import { Session } from "next-auth";

/**
 * Patrón 5.1: Obtener repositorio unificado de archivos
 */
export const getUnifiedRepository = withAuth(
    async (session): Promise<ActionResult> => {
        if (!hasPermission(session.user.rol, "USUARIOS", "READ")) {
            return unauthorizedResponse();
        }

        try {
            const files = await prisma.repositorioArchivo.findMany({
                include: {
                    documento: {
                        include: { vehiculo: true },
                    },
                    licencias: {
                        include: { usuario: true },
                    },
                    examenMedico: {
                        include: { conductor: true },
                    },
                    certificados: {
                        include: { usuario: true },
                    },
                    mantenimiento: {
                        include: { vehiculo: true },
                    },
                    comprobanteOrden: {
                        include: { vehiculo: true },
                    },
                    siniestro: {
                        include: { vehiculo: true, conductor: true },
                    },
                    transaccion: {
                        include: { tercero: true, proveedor: true },
                    },
                    fotoPerfilDe: true,
                },
                orderBy: {
                    creadoEn: "desc",
                },
            });
            return { success: true, data: files };
        } catch (error) {
            logger.error({ error }, "getUnifiedRepository error");
            return {
                success: false,
                error: "Error al obtener repositorio de archivos",
            };
        }
    },
);

/**
 * Get file content as base64 for PDF merging/display
 */
export const getArchivoData = withAuth<{ base64: string; mimeType: string }>(
    async (session: Session, idInput: unknown): Promise<ActionResult<{ base64: string; mimeType: string }>> => {
        const id = idInput as string;
        try {
            const archivo = await prisma.repositorioArchivo.findUnique({
                where: { id },
            });

            if (!archivo) {
                return { success: false, error: "Archivo no encontrado" };
            }

            const stream = await storageProvider.getFileStream(archivo.rutaAbsoluta);
            if (!stream) {
                return { success: false, error: "No se pudo leer el archivo" };
            }

            const chunks: any[] = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);
            const base64 = buffer.toString("base64");

            return {
                success: true,
                data: {
                    base64,
                    mimeType: archivo.tipoMime,
                },
            };
        } catch (error) {
            logger.error({ error, id }, "getArchivoData error");
            return { success: false, error: "Error interno al recuperar archivo" };
        }
    },
    "getArchivoData"
);
