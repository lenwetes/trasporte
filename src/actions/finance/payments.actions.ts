"use server";

import { revalidatePath } from "next/cache";
import { withAuth } from "@/lib/safe-action";
import { PaymentService } from "@/services/payment.service";
import { DebtService } from "@/services/debt.service";
import {
    registerPaymentSchema,
    RegisterPaymentInput,
} from "@/lib/validations/finance.schema";
import { createAuditLog } from "@/actions/audit";
import { serializeDecimal } from "@/lib/utils";
import { hasPermission, unauthorizedResponse } from "@/lib/permissions";
import logger from "@/lib/logger";
import { ActionResult } from "@/types";

/**
 * 5.1 Patrón: Registrar Pago
 */
export const registerPaymentAction = withAuth(
    async (session, data: unknown): Promise<ActionResult> => {
        // 1. RBAC
        if (!hasPermission(session.user.rol, "FINANCIERO", "CREATE")) {
            return unauthorizedResponse();
        }

        // 2. Zod
        const validation = registerPaymentSchema.safeParse(data);
        if (!validation.success) {
            return {
                success: false,
                error: "Datos de pago inválidos",
                errors: validation.error.flatten().fieldErrors,
            };
        }

        // 3. Logic + Audit + Revalidate
        try {
            const result = await PaymentService.registerPayment({
                usuarioId: validation.data.usuarioId,
                obligacionId: validation.data.obligacionId,
                monto: validation.data.monto,
                metodoPago: validation.data.metodoPago,
                referencia: validation.data.referencia,
                registradoPorId: session.user.id,
                comprobanteUrl: validation.data.comprobanteUrl,
            });

            if (!result.success) return result;

            await createAuditLog(
                session.user.id,
                "CREAR",
                "Pago",
                validation.data.obligacionId,
                `Pago registrado: $${validation.data.monto}`,
                session.user.lastIp,
                session.user.lastUserAgent,
            );

            revalidatePath("/dashboard/finance");
            revalidatePath("/dashboard/finance/payments");
            revalidatePath("/dashboard/users");

            return serializeDecimal(result);
        } catch (error) {
            logger.error(
                { error, userId: session.user.id },
                "Error en registerPaymentAction",
            );
            return { success: false, error: "Error interno del servidor"  };
        }
    },
);

/**
 * 5.1 Patrón: Verificar Estado Financiero (Kill Switch)
 */
export const checkUserFinancialStatusAction = withAuth(
    async (session, targetUserId: unknown): Promise<ActionResult> => {
        const userIdToCheck = (targetUserId as string) || session.user.id;

        // RBAC: Solo ADMIN/SECRETARIA pueden ver estado de otros
        if (userIdToCheck !== session.user.id) {
            if (!hasPermission(session.user.rol, "FINANCIERO", "READ")) {
                return unauthorizedResponse();
            }
        }

        try {
            const result = await DebtService.canOperate(userIdToCheck);
            return serializeDecimal(result);
        } catch (error) {
            logger.error(
                { error, userIdToCheck },
                "Error en checkUserFinancialStatusAction",
            );
            return {
                success: false,
                error: "Error al verificar estado financiero",
            };
        }
    },
);

/**
 * 5.1 Patrón: Listar Obligaciones Pendientes
 */
export const getPendingObligationsAction = withAuth(
    async (session, params: unknown): Promise<ActionResult> => {
        // 1. RBAC
        if (!hasPermission(session.user.rol, "FINANCIERO", "READ")) {
            return unauthorizedResponse();
        }

        const { page = 1, limit = 20 } =
            (params as { page?: number; limit?: number }) || {};
        const result = await PaymentService.getPending({
            page,
            pageSize: limit,
        });
        return serializeDecimal(result);
    },
);

/**
 * 5.1 Patrón: Obtener Obligaciones de Usuario
 */
export const getUserPendingObligationsAction = withAuth(
    async (session, userId: unknown): Promise<ActionResult> => {
        if (typeof userId !== "string") {
            return { success: false, error: "ID de usuario requerido"  };
        }

        // 1. RBAC: Only self or Staff
        if (
            userId !== session.user.id &&
            !hasPermission(session.user.rol, "FINANCIERO", "READ")
        ) {
            return unauthorizedResponse();
        }

        const result = await PaymentService.getByUser(userId);
        return serializeDecimal(result);
    },
);
