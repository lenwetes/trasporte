"use server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

import { revalidatePath } from "next/cache";
import { FuecService } from "@/services/fuec.service";
import { createAuditLog } from "@/actions/audit";
import {
    fuecSchema,
    contratoEmpresaSchema,
    resolucionFuecSchema,
    ClientCreateSchema,
} from "@/lib/validations/fuec";
import { ActionResult } from "@/types";
import { withAuth } from "@/lib/safe-action";
import { hasPermission, unauthorizedResponse } from "@/lib/permissions";
import logger from "@/lib/logger";

/**
 * Obtiene los próximos valores sugeridos para S5 y S6
 * dado un contratoId — usado para previsualización en tiempo real.
 */
export const getNextConsecutivos = withAuth(
    async (session, contratoId: unknown): Promise<ActionResult> => {
        if (!contratoId || typeof contratoId !== "string") {
            return { success: false, error: "contratoId inválido" };
        }
        try {
            const contrato = await prisma.contratoEmpresa.findUnique({
                where: { id: contratoId },
                select: { consecutivoNumerico: true },
            });

            const countExtractos = await prisma.planillaFUEC.count({
                where: { contratoId: contratoId as string },
            });

            return JSON.parse(JSON.stringify({
                success: true,
                data: {
                    s5: contrato?.consecutivoNumerico ?? 1,
                    s6: countExtractos + 1,
                },
            }));
        } catch (error) {
            return { success: false, error: "Error obteniendo consecutivos" };
        }
    },
    "getNextConsecutivos"
);


/**
 * 5.1 Patrón: Generar Planilla FUEC
 */
export const generateFuec = withAuth(
    async (session, formDataInput: unknown): Promise<ActionResult> => {
        // 1. RBAC
        if (!hasPermission(session.user.rol, "FUEC", "CREATE")) {
            return unauthorizedResponse();
        }

        // 2. Zod
        const validated = fuecSchema.safeParse(formDataInput);
        if (!validated.success) {
            return {
                success: false,
                error: "Datos de planilla inválidos",
                errors: validated.error.flatten().fieldErrors,
            };
        }

        // 3. Logic + Audit + Revalidate
        try {
            const result = await FuecService.generate({
                ...validated.data,
                rutas: validated.data.rutas as { origen: string; destino: string; perimetroUrbano?: boolean }[],
                creadoPorId: session.user.id,
            });

            if (!result.success || !result.data) {
                return result;
            }

            const fuec = result.data;
            await createAuditLog(
                session.user.id,
                "CREAR",
                "PlanillaFUEC",
                fuec.id,
                `Generación de FUEC ${fuec.consecutivo}`,
                session.user.lastIp,
                session.user.lastUserAgent,
            );

            revalidatePath("/dashboard/fuec");
            revalidatePath(`/dashboard/vehiculos/${validated.data.vehiculoId}`);

            return JSON.parse(JSON.stringify(result));
        } catch (error) {
            logger.error(
                { error, userId: session.user.id },
                "Error en generateFuec",
            );
            return { success: false, error: "Error interno del servidor"  };
        }
    },
);

/**
 * 5.1 Patrón: Anular FUEC
 */
export const invalidateFuec = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        // 1. RBAC
        if (!hasPermission(session.user.rol, "FUEC", "UPDATE")) {
            return unauthorizedResponse();
        }

        const data = dataInput as { id: string; motivo: string };
        if (!data.id || !data.motivo) {
            return { success: false, error: "ID y motivo son obligatorios"  };
        }

        try {
            const result = await FuecService.invalidate(data.id, data.motivo);

            if (result.success) {
                await createAuditLog(
                    session.user.id,
                    "ACTUALIZAR",
                    "PlanillaFUEC",
                    data.id,
                    `Anulación de FUEC: ${data.motivo}`,
                    session.user.lastIp,
                    session.user.lastUserAgent,
                );
                revalidatePath("/dashboard/fuec");
            }

            return result;
        } catch (error) {
            logger.error(
                { error, userId: session.user.id, id: data.id },
                "Error en invalidateFuec",
            );
            return { success: false, error: "Error interno del servidor"  };
        }
    },
);

/**
 * Acciones de Lectura y Auxiliares (Delegadas a Service)
 */

export const getVehiculoConductor = withAuth(
    async (session, vehiculoId: unknown): Promise<ActionResult> => {
        return await FuecService.getVehiculoConductor(vehiculoId as string);
    },
);

export const getConductoresSearch = withAuth(
    async (session, query: unknown): Promise<ActionResult> => {
        return await FuecService.searchConductores(query as string);
    },
);

export const getResolucionesFuec = withAuth(
    async (session): Promise<ActionResult> => {
        if (session.user.rol !== "ADMIN") return unauthorizedResponse();
        const result = await FuecService.getResoluciones();
        return JSON.parse(JSON.stringify(result));
    },
);

export const createResolucion = withAuth(
    async (session, formDataInput: unknown): Promise<ActionResult> => {
        if (session.user.rol !== "ADMIN") return unauthorizedResponse();

        const validatedToken = resolucionFuecSchema.safeParse(formDataInput);
        if (!validatedToken.success) {
            return {
                success: false,
                error: "Datos de resolución inválidos",
                errors: validatedToken.error.flatten().fieldErrors,
            };
        }

        const result = await FuecService.createResolucion(
            { ...validatedToken.data, actual: validatedToken.data.rangoDesde }
        );
        if (result.success) {
            revalidatePath("/dashboard/fuec/configuracion");
        }
        return result;
    },
);

export const updateResolucionConsecutivo = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        if (session.user.rol !== "ADMIN") return unauthorizedResponse();
        const { id, actual } = dataInput as { id: string; actual: number };
        return await FuecService.updateResolucionConsecutivo(id, actual);
    },
);

export const createContrato = withAuth(
    async (session, formDataInput: unknown): Promise<ActionResult> => {
        if (!hasPermission(session.user.rol, "FUEC", "CREATE")) {
            return unauthorizedResponse();
        }

        const validatedToken = contratoEmpresaSchema.safeParse(formDataInput);
        if (!validatedToken.success) {
            return { success: false, error: "Datos inválidos"  };
        }

        const result = await FuecService.createContrato(validatedToken.data);
        if (result.success) {
            revalidatePath("/dashboard/fuec");
        }
        return JSON.parse(JSON.stringify(result));
    },
);

export const updateContrato = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        const { id, data } = dataInput as { id: string; data: unknown };
        if (!hasPermission(session.user.rol, "FUEC", "UPDATE")) {
            return unauthorizedResponse();
        }

        const validatedToken = contratoEmpresaSchema.safeParse(data);
        if (!validatedToken.success) {
            return { success: false, error: "Datos inválidos" };
        }

        const result = await FuecService.updateContrato(id, validatedToken.data);
        if (result.success) {
            revalidatePath("/dashboard/fuec");
        }
        return result;
    },
);

export const deleteContrato = withAuth(
    async (session, id: unknown): Promise<ActionResult> => {
        if (!hasPermission(session.user.rol, "FUEC", "DELETE")) {
            return unauthorizedResponse();
        }

        const result = await FuecService.deleteContrato(id as string);
        if (result.success) {
            revalidatePath("/dashboard/fuec");
        }
        return result;
    },
);

export const getFuecValidationDetails = withAuth(
    async (session, fuecId: unknown): Promise<ActionResult> => {
        return await FuecService.getValidationDetails(fuecId as string);
    },
);
export const createClient = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        if (!hasPermission(session.user.rol, "USUARIOS", "CREATE")) {
            return unauthorizedResponse();
        }

        const validatedToken = ClientCreateSchema.safeParse(dataInput);
        if (!validatedToken.success) {
            return {
                success: false,
                error: "Datos de cliente inválidos",
                errors: validatedToken.error.flatten().fieldErrors,
            };
        }

        return await FuecService.createClient(validatedToken.data);
    },
);

export const getClientesFrecuentes = withAuth(
    async (session): Promise<ActionResult> => {
        return await FuecService.getClientesFrecuentes();
    },
);

export const createClienteFrecuente = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        if (!hasPermission(session.user.rol, "FUEC", "CREATE")) return unauthorizedResponse();
        return await FuecService.createClienteFrecuente(dataInput as { nombre: string; nit?: string });
    },
);

export const getResponsablesFrecuentes = withAuth(
    async (session): Promise<ActionResult> => {
        return await FuecService.getResponsablesFrecuentes();
    },
);

export const createResponsableFrecuente = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        if (!hasPermission(session.user.rol, "FUEC", "CREATE")) return unauthorizedResponse();
        return await FuecService.createResponsableFrecuente(dataInput as { nombre: string; cedula?: string; telefono?: string; direccion?: string });
    },
);

export const deleteResolucion = withAuth(
    async (session, idInput: unknown): Promise<ActionResult> => {
        if (session.user.rol !== "ADMIN") return unauthorizedResponse();
        const id = idInput as string;
        try {
            await prisma.resolucionFUEC.delete({ where: { id } });
            revalidatePath("/dashboard/fuec/config");
            return { success: true };
        } catch (error) {
            return { success: false, error: "No se puede eliminar. Posiblemente en uso." };
        }
    },
    "deleteResolucion"
);
