"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/actions/audit";
import { Session } from "next-auth";
import { ActionResult } from "@/types";
import { storageProvider } from "@/lib/storage";
import {
    DocumentoVehiculoCreateSchema,
    DocumentoVehiculoCreate,
    DocumentoVehiculoUpdateSchema,
    DocumentoVehiculoUpdate,
} from "@/lib/validations";
import { withAuth } from "@/lib/safe-action";
import { hasPermission, unauthorizedResponse } from "@/lib/permissions";
import logger from "@/lib/logger";
import { CacheService } from "@/lib/cache";
import { AlertsService } from "@/services/alerts.service";

/**
 * Patrón 5.1: Crear documento de vehículo
 */
export const createDocumentoVehiculo = withAuth(
    async (session: Session, dataInput: unknown): Promise<ActionResult> => {
        if (!hasPermission(session.user.rol, "VEHICULOS", "UPDATE")) {
            return unauthorizedResponse();
        }

        const data = dataInput as DocumentoVehiculoCreate;
        const validatedFields = DocumentoVehiculoCreateSchema.safeParse(data);

        if (!validatedFields.success) {
            return {
                success: false,
                error: validatedFields.error.issues[0].message,
            };
        }

        try {
            const documento = await prisma.documentoVehiculo.create({
                data: validatedFields.data as any,
                include: {
                    archivo: true,
                    vehiculo: true,
                },
            });

            await createAuditLog(
                session.user.id,
                "CREAR",
                "DocumentoVehiculo",
                documento.id,
                `Carga de documento ${documento.tipo} para vehículo ${documento.vehiculo.placa}`,
                session.user.lastIp,
                session.user.lastUserAgent,
            );

            revalidatePath(
                `/dashboard/vehiculos/${validatedFields.data.vehiculoId}`,
            );
            revalidatePath("/dashboard");
            await Promise.all([
                CacheService.invalidate("vehicle"),
                AlertsService.triggerUpdate()
            ]);
            return { success: true, data: documento };
        } catch (error) {
            logger.error(
                { error, userId: session.user.id },
                "createDocumentoVehiculo error",
            );
            return { success: false, error: "Error al crear documento" };
        }
    },
    "createDocumentoVehiculo"
);

/**
 * Patrón 5.1: Obtener documento por ID
 */
export const getDocumentoById = withAuth(
    async (session: Session, idInput: unknown): Promise<ActionResult> => {
        const id = idInput as string;
        try {
            const documento = await prisma.documentoVehiculo.findUnique({
                where: { id },
                include: {
                    archivo: true,
                    vehiculo: true,
                },
            });
            return { success: true, data: documento };
        } catch (error) {
            logger.error({ error, id }, "getDocumentoById error");
            return { success: false, error: "Error al obtener documento" };
        }
    },
    "getDocumentoById"
);

/**
 * Patrón 5.1: Actualizar documento de vehículo
 */
export const updateDocumentoVehiculo = withAuth(
    async (session: Session, dataInput: unknown): Promise<ActionResult> => {
        if (!hasPermission(session.user.rol, "VEHICULOS", "UPDATE")) {
            return unauthorizedResponse();
        }

        const typedInput = dataInput as {
            id: string;
        } & DocumentoVehiculoUpdate;
        const { id, ...data } = typedInput;
        const validatedFields = DocumentoVehiculoUpdateSchema.safeParse(data);

        if (!validatedFields.success) {
            return {
                success: false,
                error: validatedFields.error.issues[0].message,
            };
        }

        try {
            const documento = await prisma.documentoVehiculo.update({
                where: { id },
                data: validatedFields.data as any,
                include: { vehiculo: true },
            });

            await createAuditLog(
                session.user.id,
                "ACTUALIZAR",
                "DocumentoVehiculo",
                id,
                `Actualización de documento ${documento.tipo} para vehículo ${documento.vehiculo.placa}`,
                session.user.lastIp,
                session.user.lastUserAgent,
            );

            revalidatePath(`/dashboard/vehiculos/${documento.vehiculoId}`);
            revalidatePath("/dashboard");
            await Promise.all([
                CacheService.invalidate("vehicle"),
                AlertsService.triggerUpdate()
            ]);
            return { success: true, data: documento };
        } catch (error) {
            logger.error({ error, id }, "updateDocumentoVehiculo error");
            return { success: false, error: "Error al actualizar documento" };
        }
    },
    "updateDocumentoVehiculo"
);

/**
 * Patrón 5.1: Eliminar documento de vehículo
 */
export const deleteDocumentoVehiculo = withAuth(
    async (session: Session, idInput: unknown): Promise<ActionResult> => {
        if (session.user.rol !== "ADMIN") {
            return unauthorizedResponse();
        }

        const id = idInput as string;
        try {
            const docToDelete = await prisma.documentoVehiculo.findUnique({
                where: { id },
                include: {
                    vehiculo: true,
                    archivo: true,
                },
            });

            if (!docToDelete)
                return { success: false, error: "Documento no encontrado" };

            await prisma.$transaction(async (tx) => {
                await tx.documentoVehiculo.delete({
                    where: { id },
                });

                if (docToDelete.archivoId) {
                    await tx.repositorioArchivo.delete({
                        where: { id: docToDelete.archivoId },
                    });
                }
            });

            if (docToDelete.archivo) {
                try {
                    await storageProvider.delete(
                        docToDelete.archivo.rutaAbsoluta,
                    );
                } catch (storageError) {
                    logger.error(
                        { storageError },
                        "Storage deletion error (non-blocking)",
                    );
                }
            }

            await createAuditLog(
                session.user.id,
                "ELIMINAR",
                "DocumentoVehiculo",
                id,
                `Eliminación de documento para vehículo ${docToDelete.vehiculo.placa}`,
                session.user.lastIp,
                session.user.lastUserAgent,
            );

            revalidatePath(`/dashboard/vehiculos/${docToDelete.vehiculoId}`);
            revalidatePath("/dashboard");
            await Promise.all([
                CacheService.invalidate("vehicle"),
                AlertsService.triggerUpdate()
            ]);
            return {
                success: true,
                message: "Documento y archivos eliminados exitosamente",
            };
        } catch (error) {
            logger.error({ error, id }, "deleteDocumentoVehiculo error");
            return { success: false, error: "Error al eliminar documento" };
        }
    },
    "deleteDocumentoVehiculo"
);

/**
 * Patrón 5.1: Eliminar documento como súper usuario
 */
export const deleteDocumentoSuperUserAction = withAuth(
    async (session: Session, paramsInput: unknown): Promise<ActionResult> => {
        if (session.user.rol !== "ADMIN") {
            return unauthorizedResponse();
        }

        const params = paramsInput as { id: string; justificacion: string };
        const { id, justificacion } = params;

        if (!justificacion || justificacion.trim().length < 10) {
            return {
                success: false,
                error: "La justificación debe tener al menos 10 caracteres para fines forenses",
            };
        }

        try {
            const docToDelete = await prisma.documentoVehiculo.findUnique({
                where: { id },
                include: { vehiculo: true, archivo: true },
            });

            if (!docToDelete)
                return { success: false, error: "Documento no encontrado" };

            await prisma.$transaction(async (tx) => {
                await tx.documentoVehiculo.delete({ where: { id } });
                if (docToDelete.archivoId) {
                    await tx.repositorioArchivo.delete({
                        where: { id: docToDelete.archivoId },
                    });
                }

                await createAuditLog(
                    session.user.id,
                    "ELIMINAR",
                    "DocumentoVehiculo",
                    id,
                    {
                        motivo: "BORRADO_SUPER_USER",
                        justificacion,
                        placa: docToDelete.vehiculo.placa,
                        tipo: docToDelete.tipo,
                    },
                    session.user.lastIp,
                    session.user.lastUserAgent,
                );
            });

            if (docToDelete.archivo) {
                try {
                    await storageProvider.delete(
                        docToDelete.archivo.rutaAbsoluta,
                    );
                } catch (e) {
                    logger.error({ e }, "Storage delete error");
                }
            }

            revalidatePath(`/dashboard/vehiculos/${docToDelete.vehiculoId}`);
            revalidatePath("/dashboard");
            await Promise.all([
                CacheService.invalidate("vehicle"),
                AlertsService.triggerUpdate()
            ]);
            return {
                success: true,
                message:
                    "Documento eliminado permanentemente con registro forense",
            };
        } catch (error) {
            logger.error({ error, id }, "deleteDocumentoSuperUserAction error");
            return { success: false, error: "Error interno del servidor" };
        }
    },
    "deleteDocumentoSuperUserAction"
);
