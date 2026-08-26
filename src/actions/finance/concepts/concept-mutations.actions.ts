"use server";

import { z } from "zod";
import { Rol, TipoTransaccion } from "@prisma/client";
import { withAuth } from "@/lib/safe-action";
import { ConceptService } from "@/services/concept.service";
import type { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/actions/audit";
import { serializeDecimal } from "@/lib/utils";
import { hasPermission, unauthorizedResponse } from "@/lib/permissions";
import logger from "@/lib/logger";

/**
 * Schemas para mutaciones de conceptos
 */
const createConceptSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    tipo: z.nativeEnum(TipoTransaccion),
    cuentaId: z.string().uuid("ID de cuenta inválido"),
    requiereTercero: z.boolean().optional(),
    valorPorDefecto: z
        .number()
        .positive("El valor debe ser positivo")
        .optional(),
});

const updateConceptSchema = z.object({
    id: z.string().uuid("ID inválido"),
    nombre: z
        .string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .optional(),
    cuentaId: z.string().uuid("ID de cuenta inválido").optional(),
    requiereTercero: z.boolean().optional(),
    valorPorDefecto: z
        .number()
        .positive("El valor debe ser positivo")
        .optional()
        .nullable(),
    activo: z.boolean().optional(),
});

/**
 * Patrón 5.1: Crear un nuevo concepto financiero
 */
export const createConceptAction = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        if (!hasPermission(session.user.rol, "FINANCIERO", "CREATE")) {
            return unauthorizedResponse();
        }

        const result = createConceptSchema.safeParse(dataInput);
        if (!result.success) {
            return {
                success: false,
                error: "Datos inválidos",
                errors: result.error.flatten().fieldErrors,
            };
        }

        try {
            const concept = await ConceptService.createConcept(result.data);

            await createAuditLog(
                session.user.id,
                "CREAR",
                "ConceptoFinanciero",
                concept.id,
                `Concepto creado: ${concept.nombre}`,
                session.user.lastIp,
                session.user.lastUserAgent,
            );

            revalidatePath("/dashboard/finance/concepts");

            return serializeDecimal({
                success: true,
                data: concept,
            });
        } catch (error) {
            logger.error(
                { error, data: dataInput },
                "createConceptAction error",
            );
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Error al crear concepto",
            };
        }
    },
);

/**
 * Patrón 5.1: Actualizar un concepto existente
 */
export const updateConceptAction = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        if (!hasPermission(session.user.rol, "FINANCIERO", "UPDATE")) {
            return unauthorizedResponse();
        }

        const result = updateConceptSchema.safeParse(dataInput);
        if (!result.success) {
            return {
                success: false,
                error: "Datos inválidos",
                errors: result.error.flatten().fieldErrors,
            };
        }

        try {
            const { id, ...updateData } = result.data;
            const concept = await ConceptService.updateConcept(id, updateData);

            await createAuditLog(
                session.user.id,
                "ACTUALIZAR",
                "ConceptoFinanciero",
                id,
                `Concepto actualizado: ${concept.nombre}`,
                session.user.lastIp,
                session.user.lastUserAgent,
            );

            revalidatePath("/dashboard/finance/concepts");

            return serializeDecimal({
                success: true,
                data: concept,
            });
        } catch (error) {
            logger.error(
                { error, id: (dataInput as { id?: string })?.id },
                "updateConceptAction error",
            );
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Error al actualizar concepto",
            };
        }
    },
);

/**
 * Patrón 5.1: Desactivar un concepto (soft delete)
 */
export const deactivateConceptAction = withAuth(
    async (session, idInput: unknown): Promise<ActionResult> => {
        if (session.user.rol !== "ADMIN") {
            return unauthorizedResponse();
        }

        const id =
            typeof idInput === "string"
                ? idInput
                : (idInput as { id?: string })?.id;

        if (!id || typeof id !== "string") {
            return { success: false, error: "ID de concepto inválido"  };
        }

        try {
            const concept = await ConceptService.deactivateConcept(id);

            await createAuditLog(
                session.user.id,
                "ACTUALIZAR",
                "ConceptoFinanciero",
                id,
                `Concepto desactivado: ${concept.nombre}`,
                session.user.lastIp,
                session.user.lastUserAgent,
            );

            revalidatePath("/dashboard/finance/concepts");

            return serializeDecimal({
                success: true,
                data: concept,
            });
        } catch (error) {
            logger.error({ error, id }, "deactivateConceptAction error");
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Error al desactivar concepto",
            };
        }
    },
);

/**
 * Legacy: Crear concepto usando Código de Cuenta (PUC)
 * @deprecated Úsese createConceptAction con cuentaId
 */
export async function createConcepto(input: {
    nombre: string;
    tipo: TipoTransaccion;
    cuentaCodigo: string;
    requiereTercero?: boolean;
    valorPorDefecto?: number;
}): Promise<ActionResult> {
    const { prisma } = await import("@/lib/prisma");
    const cuenta = await prisma.cuentaContable.findUnique({
        where: { codigo: input.cuentaCodigo },
    });

    if (!cuenta) {
        return { success: false, error: "Cuenta contable no encontrada"  };
    }

    return createConceptAction({
        nombre: input.nombre,
        tipo: input.tipo,
        cuentaId: cuenta.id,
        requiereTercero: input.requiereTercero,
        valorPorDefecto: input.valorPorDefecto,
    });
}
