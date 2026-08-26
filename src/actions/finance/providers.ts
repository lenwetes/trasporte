"use server";

import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/safe-action";
import { serializeDecimal } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { TipoDocumento } from "@prisma/client";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import { createAuditLog } from "@/actions/audit";
import { auth } from "@/auth";

const providerSchema = z.object({
    id: z.string().optional(),
    nombres: z.string().min(3, "El nombre es obligatorio"),
    razonSocial: z.string().optional(),
    tipoDocumento: z.string(),
    numeroDocumento: z.string().min(5, "El documento es obligatorio"),
    celular: z.string().optional(),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    direccion: z.string().optional(),
    ciudad: z.string().optional(),
    contacto: z.string().optional(),
    activo: z.boolean().default(true),
});

/**
 * Obtiene lista de proveedores
 */
export const getProviders = withAuth(
    ["ADMIN"],
    async () => {
        try {
            const providers = await prisma.proveedor.findMany({
                orderBy: { creadoEn: "desc"  },
            });
            return serializeDecimal({ success: true, data: providers });
        } catch (error) {
            logger.error({ error }, "Error en getProviders");
            return { success: false, error: "Error al obtener proveedores"  };
        }
    },
    "getProviders",
);

/**
 * Crea o actualiza un proveedor
 */
export const upsertProvider = withAuth(
    ["ADMIN"],
    async (dataInput: unknown): Promise<ActionResult> => {
        try {
            const parsed = providerSchema.parse(dataInput);
            const { id, ...rest } = parsed;

            let result;
            if (id) {
                result = await prisma.proveedor.update({
                    where: { id },
                    data: {
                        ...rest,
                        tipoDocumento: rest.tipoDocumento as TipoDocumento,
                    },
                });
            } else {
                result = await prisma.proveedor.create({
                    data: {
                        ...rest,
                        tipoDocumento: rest.tipoDocumento as TipoDocumento,
                    },
                });
            }

            const session = await auth();
            if (session?.user?.id) {
                await createAuditLog(
                    session.user.id,
                    id ? "ACTUALIZAR" : "CREAR",
                    "Proveedor",
                    result.id,
                    `${id ? "Actualización" : "Creación"} de proveedor ${parsed.nombres}`,
                );
            }

            revalidatePath("/dashboard/finance/providers");
            return serializeDecimal({ success: true, data: result });
        } catch (error: unknown) {
            if (
                typeof error === "object" &&
                error !== null &&
                (error as { code: string }).code === "P2002"
            ) {
                return {
                    success: false,
                    error: "Ya existe un proveedor con este número de documento",
                };
            }
            logger.error({ error }, "Error en upsertProvider");
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Error al procesar proveedor",
            };
        }
    },
    "upsertProvider",
);

/**
 * Elimina (o desactiva) un proveedor
 */
export const deleteProvider = withAuth(
    ["ADMIN"],
    async (...args: unknown[]) => {
        const id = args[0] as string;
        try {
            // Verificamos si tiene transacciones antes de eliminar
            const hasTransactions = await prisma.transaccion.findFirst({
                where: { proveedorId: id },
            });

            const session = await auth();
            const currentUserId = session?.user?.id;

            if (hasTransactions) {
                // Si tiene transacciones, solo lo desactivamos
                await prisma.proveedor.update({
                    where: { id },
                    data: { activo: false },
                });

                if (currentUserId) {
                    await createAuditLog(
                        currentUserId,
                        "ACTUALIZAR",
                        "Proveedor",
                        id,
                        "Proveedor desactivado (tenía transacciones contables)",
                    );
                }

                return {
                    success: true,
                    message:
                        "Proveedor desactivado por tener historial contable",
                };
            }

            await prisma.proveedor.delete({ where: { id } });

            if (currentUserId) {
                await createAuditLog(
                    currentUserId,
                    "ELIMINAR",
                    "Proveedor",
                    id,
                    "Proveedor eliminado definitivamente (sin historial)",
                );
            }

            revalidatePath("/dashboard/finance/providers");
            return { success: true };
        } catch (error) {
            logger.error({ error, id }, "Error en deleteProvider");
            return { success: false, error: "Error al eliminar proveedor"  };
        }
    },
    "deleteProvider",
);
