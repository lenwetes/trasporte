"use server";

import { revalidatePath } from "next/cache";
import { SafetyService } from "@/services/safety.service";
import { createAuditLog } from "@/actions/audit";
import {
    ExamenMedicoCreateSchema,
    EntregaDotacionCreateSchema,
    PreoperacionalCreateSchema,
    InvestigacionSiniestroSchema,
    ExamenMedicoCreate,
    EntregaDotacionCreate,
    PreoperacionalCreate,
    InvestigacionSiniestroCreate,
} from "@/lib/validations/safety";
import { ActionResult } from "@/types";
import { withAuth } from "@/lib/safe-action";
import { hasPermission, unauthorizedResponse } from "@/lib/permissions";
import logger from "@/lib/logger";

/**
 * 5.1 Patrón: Registrar Examen Médico
 */
export const createExamenMedico = withAuth(
    async (session, formDataInput: unknown): Promise<ActionResult> => {
        // 1. RBAC
        if (!hasPermission(session.user.rol, "SAFETY", "CREATE")) {
            return unauthorizedResponse();
        }

        // 2. Zod
        const validated = ExamenMedicoCreateSchema.safeParse(formDataInput);
        if (!validated.success) {
            return {
                success: false,
                error: "Datos de examen inválidos",
                errors: validated.error.flatten().fieldErrors,
            };
        }

        // 3. Logic + Audit + Revalidate
        try {
            const result = await SafetyService.createExamenMedico(
                validated.data,
            );

            if (result.success && result.data) {
                const entity = result.data as { id: string };
                await createAuditLog(
                    session.user.id,
                    "CREAR",
                    "ExamenMedico",
                    entity.id,
                    `Examen ${validated.data.tipo} para conductor ${validated.data.conductorId}`,
                    session.user.lastIp,
                    session.user.lastUserAgent,
                );
                revalidatePath("/dashboard/usuarios/[id]", "page");
            }

            return result;
        } catch (error) {
            logger.error(
                { error, userId: session.user.id },
                "Error en createExamenMedico",
            );
            return { success: false, error: "Error interno del servidor"  };
        }
    },
);

/**
 * 5.1 Patrón: Registrar Entrega de Dotación
 */
export const createEntregaDotacion = withAuth(
    async (session, formDataInput: unknown): Promise<ActionResult> => {
        // 1. RBAC
        if (!hasPermission(session.user.rol, "SAFETY", "CREATE")) {
            return unauthorizedResponse();
        }

        // 2. Zod
        const validated = EntregaDotacionCreateSchema.safeParse(formDataInput);
        if (!validated.success) {
            return {
                success: false,
                error: "Datos de dotación inválidos",
                errors: validated.error.flatten().fieldErrors,
            };
        }

        try {
            const result = await SafetyService.createEntregaDotacion(
                validated.data,
            );

            if (result.success && result.data) {
                const entity = result.data as { id: string };
                await createAuditLog(
                    session.user.id,
                    "CREAR",
                    "EntregaDotacion",
                    entity.id,
                    `Entrega de dotación para conductor ${validated.data.conductorId}`,
                    session.user.lastIp,
                    session.user.lastUserAgent,
                );
                revalidatePath("/dashboard/usuarios/[id]", "page");
            }

            return result;
        } catch (error) {
            logger.error(
                { error, userId: session.user.id },
                "Error en createEntregaDotacion",
            );
            return { success: false, error: "Error interno del servidor"  };
        }
    },
);

/**
 * 5.1 Patrón: Registrar Inspección Preoperacional (Kill Switch incluido)
 */
export const createPreoperacional = withAuth(
    async (session, formDataInput: unknown): Promise<ActionResult> => {
        // 1. Zod
        const validated = PreoperacionalCreateSchema.safeParse(formDataInput);
        if (!validated.success) {
            return {
                success: false,
                error: "Inspección inválida",
                errors: validated.error.flatten().fieldErrors,
            };
        }

        try {
            // 🔒 KILL SWITCH: Verificar mora financiera antes de permitir operar
            const { DebtService } = await import("@/services/debt.service");
            const status = await DebtService.canOperate(
                validated.data.conductorId,
            );

            if (!status.data) {
                return {
                    success: false,
                    error: `BLOQUEO FINANCIERO: El conductor ${validated.data.conductorId} excede el límite de mora permitido.`,
                };
            }

            const result = await SafetyService.createPreoperacional(
                validated.data,
            );

            if (result.success && result.data) {
                const entity = result.data as { id: string; resultado: string };
                await createAuditLog(
                    session.user.id,
                    "CREAR",
                    "Preoperacional",
                    entity.id,
                    `Inspección ${entity.resultado} para vehículo ${validated.data.vehiculoId}`,
                    session.user.lastIp,
                    session.user.lastUserAgent,
                );
                revalidatePath("/dashboard/vehiculos/[id]", "page");
            }

            return result;
        } catch (error) {
            logger.error(
                { error, userId: session.user.id },
                "Error en createPreoperacional",
            );
            return { success: false, error: "Error interno del servidor"  };
        }
    },
);

/**
 * 5.1 Patrón: Investigación de Siniestro
 */
export const createInvestigacionSiniestro = withAuth(
    async (session, formDataInput: unknown): Promise<ActionResult> => {
        // 1. RBAC
        if (!hasPermission(session.user.rol, "SAFETY", "CREATE")) {
            return unauthorizedResponse();
        }

        // 2. Zod
        const validated = InvestigacionSiniestroSchema.safeParse(formDataInput);
        if (!validated.success) {
            return {
                success: false,
                error: "Datos de investigación inválidos",
                errors: validated.error.flatten().fieldErrors,
            };
        }

        try {
            const result = await SafetyService.createInvestigacionSiniestro(
                validated.data,
            );

            if (result.success && result.data) {
                const entity = result.data as { id: string };
                await createAuditLog(
                    session.user.id,
                    "CREAR",
                    "InvestigacionSiniestro",
                    entity.id,
                    `Investigación para siniestro ${validated.data.siniestroId}`,
                    session.user.lastIp,
                    session.user.lastUserAgent,
                );
                revalidatePath("/dashboard/siniestros", "page");
            }

            return result;
        } catch (error) {
            logger.error(
                { error, userId: session.user.id },
                "Error en createInvestigacionSiniestro",
            );
            return { success: false, error: "Error interno del servidor"  };
        }
    },
);
