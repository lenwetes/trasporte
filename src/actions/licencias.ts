"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/actions/audit";
import { DetalleLicencia } from "@prisma/client";
import { withAuth } from "@/lib/safe-action";
import { ActionResult } from "@/types";
import { CacheService } from "@/lib/cache";

// Local type to handle IDE sync lag with Prisma Schema
export interface DetalleLicenciaWithActivo extends DetalleLicencia {
    activo: boolean;
}

/**
 * Get license history for a user (including inactive/renewed licenses)
 */
export const getHistorialLicencias = withAuth(
    "ALL",
    async (usuarioIdInput: unknown): Promise<ActionResult> => {
        const usuarioId = usuarioIdInput as string;
        const licencias = await prisma.detalleLicencia.findMany({
            where: { usuarioId },
            orderBy: [{ activo: "desc" }, { fechaVencimiento: "desc" }],
        });

        return {
            success: true,
            data: licencias as DetalleLicenciaWithActivo[],
        };
    },
    "getHistorialLicencias",
);

/**
 * Renew a license category - marks old one as inactive and creates new one
 */
export const renovarLicencia = withAuth(
    "ALL",
    async (...args: unknown[]): Promise<ActionResult> => {
        const usuarioId = args[0] as string;
        const categoria = args[1] as string;
        const servicio = args[2] as string;
        const nuevaFechaVencimiento = args[3] as Date;

        const { auth } = await import("@/auth");
        const session = await auth();

        // Only ADMIN, SECRETARIA and the OWNER can renew licenses
        const isOwner = session!.user.id === usuarioId;
        if (
            session!.user.rol !== "ADMIN" &&
            session!.user.rol !== "SECRETARIA" &&
            !isOwner
        ) {
            return {
                success: false,
                error: "No tienes permisos para renovar esta licencia",
            };
        }

        // Find the current active license for this category and service
        const currentLicense = await prisma.detalleLicencia.findFirst({
            where: {
                usuarioId,
                categoria,
                servicio,
                activo: true,
            },
        });

        if (!currentLicense) {
            return {
                success: false,
                error: "No se encontró una licencia activa para renovar",
            };
        }

        // Use a transaction to ensure atomicity
        const result = await prisma.$transaction(async (tx) => {
            // Mark the old license as inactive (historical)
            await tx.detalleLicencia.update({
                where: { id: currentLicense.id },
                data: { activo: false },
            });

            // Create the new license, preserving the archivoId if it exists
            const newLicense = await tx.detalleLicencia.create({
                data: {
                    usuarioId,
                    categoria,
                    servicio,
                    fechaVencimiento: nuevaFechaVencimiento,
                    activo: true,
                    archivoId: currentLicense.archivoId,
                },
            });

            return newLicense;
        });

        // Create audit log
        await createAuditLog(
            session!.user.id,
            "ACTUALIZAR",
            "DetalleLicencia",
            result.id,
            {
                accion: "RENOVACION",
                categoria,
                servicio,
                licenciaAnterior: currentLicense.id,
                fechaVencimientoAnterior: currentLicense.fechaVencimiento,
                nuevaFechaVencimiento,
            },
        );

        await CacheService.delete(`user:id:${usuarioId}`);
        revalidatePath(`/dashboard/conductores/${usuarioId}`);
        return { success: true, data: result as DetalleLicenciaWithActivo };
    },
    "renovarLicencia",
);
/**
 * Create a new license category
 */
export const crearLicenciaCategoria = withAuth(
    "ALL",
    async (...args: unknown[]): Promise<ActionResult> => {
        const usuarioId = args[0] as string;
        const categoria = args[1] as string;
        const servicio = args[2] as string;
        const fechaVencimiento = args[3] as Date;

        const { auth } = await import("@/auth");
        const session = await auth();

        if (
            session!.user.rol !== "ADMIN" &&
            session!.user.rol !== "SECRETARIA" &&
            session!.user.id !== usuarioId
        ) {
            return { success: false, error: "No tienes permisos"  };
        }

        // Check if there is an existing archivoId for other active licenses
        const existingActive = await prisma.detalleLicencia.findFirst({
            where: { usuarioId, activo: true, archivoId: { not: null } },
            select: { archivoId: true },
        });

        // Desactivar licencias previas idénticas para evitar duplicados activos
        await prisma.detalleLicencia.updateMany({
            where: { usuarioId, categoria, servicio, activo: true },
            data: { activo: false }
        });

        // Evitamos asociar el mismo archivoId si ya está en uso por otra licencia activa
        // debido a la restricción UNIQUE del esquema.
        const result = await prisma.detalleLicencia.create({
            data: {
                usuarioId,
                categoria,
                servicio,
                fechaVencimiento,
                activo: true,
                archivoId: null, // No podemos compartir archivoId por la restricción UNIQUE
            },
        });

        await createAuditLog(
            session!.user.id,
            "CREAR",
            "DetalleLicencia",
            result.id,
            { categoria, servicio, fechaVencimiento },
        );

        await CacheService.delete(`user:id:${usuarioId}`);
        revalidatePath(`/dashboard/conductores/${usuarioId}`);
        return { success: true, data: result };
    },
    "crearLicenciaCategoria",
);

/**
 * Associate a digital file to all active licenses of a user
 */
export const vincularArchivoALicencias = withAuth(
    "ALL",
    async (...args: unknown[]): Promise<ActionResult> => {
        const usuarioId = args[0] as string;
        const archivoId = args[1] as string;

        const { auth } = await import("@/auth");
        const session = await auth();

        if (
            session!.user.rol !== "ADMIN" &&
            session!.user.rol !== "SECRETARIA" &&
            session!.user.id !== usuarioId
        ) {
            return { success: false, error: "No tienes permisos"  };
        }

        // 1. Primero desvinculamos este archivo de cualquier licencia donde esté para evitar duplicados UNIQUE
        if (archivoId) {
            await prisma.detalleLicencia.updateMany({
                where: { archivoId },
                data: { archivoId: null },
            });
        }

        // 2. Buscamos todas las licencias activas del usuario
        const activeLicenses = await prisma.detalleLicencia.findMany({
            where: { usuarioId, activo: true },
            orderBy: { creadoEn: "desc" },
        });

        // 3. Vinculamos el archivo solo a la primera para cumplir con la restricción UNIQUE de la base de datos
        let updateCount = 0;
        if (activeLicenses.length > 0 && archivoId) {
            await prisma.detalleLicencia.update({
                where: { id: activeLicenses[0].id },
                data: { archivoId },
            });
            updateCount = activeLicenses.length;
        }

        // Si no se actualizó nada (el conductor no tiene categorías), creamos una base
        if (updateCount === 0) {
            await prisma.detalleLicencia.create({
                data: {
                    usuarioId,
                    categoria: "SIN CATEGORÍA",
                    servicio: "PÚBLICO",
                    fechaVencimiento: new Date(
                        new Date().setFullYear(new Date().getFullYear() + 1),
                    ), // 1 año por defecto
                    activo: true,
                    archivoId,
                },
            });
        }

        await CacheService.delete(`user:id:${usuarioId}`);
        revalidatePath(`/dashboard/conductores/${usuarioId}`);
        return { success: true };
    },
    "vincularArchivoALicencias",
);
/**
 * Complete synchronization of habilitation (License info + Categories + File)
 */
export const sincronizarHabilitacionCompleta = withAuth(
    "ALL",
    async (...args: unknown[]): Promise<ActionResult> => {
        const { usuarioId, numeroLicencia, categorias, archivoId } =
            args[0] as {
                usuarioId: string;
                numeroLicencia: string;
                categorias: {
                    categoria: string;
                    servicio: string;
                    fechaVencimiento: Date;
                }[];
                archivoId?: string;
            };

        const { auth } = await import("@/auth");
        const session = await auth();

        if (
            session!.user.rol !== "ADMIN" &&
            session!.user.rol !== "SECRETARIA" &&
            session!.user.id !== usuarioId
        ) {
            return { success: false, error: "No tienes permisos"  };
        }

        try {
            const result = await prisma.$transaction(async (tx) => {
                // 1. Update User License Number
                await tx.usuario.update({
                    where: { id: usuarioId },
                    data: { numeroLicencia },
                });

                // 2. Mark existing active licenses as inactive
                await tx.detalleLicencia.updateMany({
                    where: { usuarioId, activo: true },
                    data: { activo: false },
                });

                // 2.1 Desvincular el archivoId de cualquier licencia previa para evitar conflicto por restricción UNIQUE
                if (archivoId) {
                    await tx.detalleLicencia.updateMany({
                        where: { archivoId },
                        data: { archivoId: null },
                    });
                }

                // 3. Create new categories
                const createdCategories = [];
                let isFirst = true;
                for (const cat of categorias) {
                    const created = await tx.detalleLicencia.create({
                        data: {
                            usuarioId,
                            categoria: cat.categoria.toUpperCase(),
                            servicio: cat.servicio,
                            fechaVencimiento: new Date(cat.fechaVencimiento),
                            activo: true,
                            // Solo asociamos el archivo a la primera categoría si el esquema es 1-a-1
                            // o a todos si el esquema permitiera muchos-a-uno (pero fallaría si es único)
                            archivoId: isFirst && archivoId ? archivoId : null,
                        },
                    });
                    if (archivoId) isFirst = false;
                    createdCategories.push(created);
                }

                // 4. If no categories provided but there is a file, create a default "SIN CATEGORÍA"
                if (categorias.length === 0 && archivoId) {
                    await tx.detalleLicencia.create({
                        data: {
                            usuarioId,
                            categoria: "SIN CATEGORÍA",
                            servicio: "PÚBLICO",
                            fechaVencimiento: new Date(
                                new Date().setFullYear(
                                    new Date().getFullYear() + 1,
                                ),
                            ),
                            activo: true,
                            archivoId,
                        },
                    });
                }

                return createdCategories;
            });

            await createAuditLog(
                session!.user.id,
                "ACTUALIZAR",
                "Habilitacion",
                usuarioId,
                {
                    numeroLicencia,
                    categoriasCount: categorias.length,
                    hasFile: !!archivoId,
                },
            );

            await CacheService.delete(`user:id:${usuarioId}`);
            revalidatePath(`/dashboard/conductores/${usuarioId}`);
            revalidatePath(`/dashboard/usuarios/${usuarioId}`);

            return { success: true, data: result };
        } catch (error) {
            console.error("Error en sincronizarHabilitacionCompleta:", error);
            return {
                success: false,
                error: "Error al sincronizar la habilitación",
            };
        }
    },
    "sincronizarHabilitacionCompleta",
);

/**
 * Deactivates a specific license (Soft Delete for the active view)
 */
export const eliminarLicencia = withAuth(
    "ALL",
    async (licenciaIdInput: unknown): Promise<ActionResult> => {
        const id = licenciaIdInput as string;
        try {
            const result = await prisma.detalleLicencia.update({
                where: { id },
                data: { activo: false },
                select: { usuarioId: true }
            });

            await CacheService.delete(`user:id:${result.usuarioId}`);
            revalidatePath(`/dashboard/conductores/${result.usuarioId}`);
            return { success: true };
        } catch (error) {
            console.error("Error al eliminar licencia:", error);
            return { success: false, error: "No se pudo eliminar el registro" };
        }
    },
    "eliminarLicencia",
);

/**
 * Removes the digital file support from all licenses for a user
 */
export const eliminarSoporteLicencia = withAuth(
    "ALL",
    async (usuarioIdInput: unknown): Promise<ActionResult> => {
        const usuarioId = usuarioIdInput as string;

        const { auth } = await import("@/auth");
        const session = await auth();

        if (
            session!.user.rol !== "ADMIN" &&
            session!.user.rol !== "SECRETARIA" &&
            session!.user.id !== usuarioId
        ) {
            return { success: false, error: "No tienes permisos" };
        }

        try {
            await prisma.detalleLicencia.updateMany({
                where: { usuarioId },
                data: { archivoId: null },
            });
            await CacheService.delete(`user:id:${usuarioId}`);
            revalidatePath(`/dashboard/conductores/${usuarioId}`);
            return { success: true };
        } catch (error) {
            console.error("Error al eliminar soporte:", error);
            return { success: false, error: "Error al eliminar el soporte digital" };
        }
    },
    "eliminarSoporteLicencia",
);
