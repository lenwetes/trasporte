"use server";

import { ActionResult, TransaccionWithRelations } from "@/types";
import { CuentaContable, Rol, TipoTransaccion } from "@prisma/client";
import { withAuth } from "@/lib/safe-action";
import { FinanceService } from "@/services/finance.service";
import {
    createTransactionSchema,
    CreateTransactionInput,
} from "@/lib/validations/finance.schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/actions/audit";
import { serializeDecimal } from "@/lib/utils";

/**
 * Crea una transacción financiera con partida doble
 * @requires ADMIN, SECRETARIA
 */
export const createTransactionAction = withAuth(
    [Rol.ADMIN, Rol.SECRETARIA],
    async (...args: unknown[]): Promise<ActionResult<unknown>> => {
        const input = args[0] as CreateTransactionInput;
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Usuario no autenticado" };
        }

        const validation = createTransactionSchema.safeParse(input);
        if (!validation.success) {
            return {
                success: false,
                error: "Validación fallida",
                errors: validation.error.flatten().fieldErrors,
            };
        }

        const result = await FinanceService.createTransaction({
            ...validation.data,
            creadoPorId: session.user.id,
            asientos: validation.data.asientos.map((a) => ({
                cuentaId: a.cuentaId,
                debito: a.debito,
                credito: a.credito,
            })),
        });

        if (result.success && result.data) {
            await createAuditLog(
                session.user.id,
                "CREAR",
                "Transaccion",
                (result.data as { id: string }).id,
                `Transacción ${validation.data.tipo}: ${validation.data.descripcion}`,
            );
            revalidatePath("/dashboard/finance");
            revalidatePath("/dashboard/finance/transactions");
        }

        return serializeDecimal(result);
    },
    "createTransaction",
);

/**
 * Obtiene el balance de una cuenta contable
 * @requires ADMIN, SECRETARIA
 */
export const getAccountBalanceAction = withAuth(
    [Rol.ADMIN, Rol.SECRETARIA],
    async (...args: unknown[]): Promise<ActionResult<unknown>> => {
        const cuentaId = args[0] as string;
        if (!cuentaId) {
            return { success: false, error: "ID de cuenta requerido" };
        }
        return await FinanceService.getAccountBalance(cuentaId);
    },
    "getAccountBalance",
);

/**
 * Obtiene el plan de cuentas activo
 * @requires ADMIN, SECRETARIA
 */
export const getPlanCuentasAction = withAuth(
    [Rol.ADMIN, Rol.SECRETARIA],
    async (): Promise<ActionResult<unknown>> => {
        const result = await FinanceService.getPlanCuentas();
        return serializeDecimal(result);
    },
    "getPlanCuentas",
);

/**
 * Lista transacciones con paginación
 * @requires ADMIN, SECRETARIA
 */
export const getTransactionsAction = withAuth(
    [Rol.ADMIN, Rol.SECRETARIA],
    async (...args: unknown[]): Promise<ActionResult<unknown>> => {
        const input = (args[0] as {
            page: number;
            limit?: number;
            type?: TipoTransaccion;
        }) || { page: 1 };

        const result = await FinanceService.getTransactions({
            page: input.page,
            pageSize: input.limit,
            type: input.type,
        });

        return serializeDecimal(result);
    },
    "getTransactions",
);
