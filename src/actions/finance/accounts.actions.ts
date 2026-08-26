/**
 * Server Actions para gestión de Cuentas Contables (PUC)
 *
 * Expone la funcionalidad del AccountService a la UI
 */

"use server";

import { z } from "zod";
import { Rol } from "@prisma/client";
import { withAuth } from "@/lib/safe-action";
import { AccountService } from "@/services/account.service";
import type { ActionResult } from "@/types";
import { serializeDecimal } from "@/lib/utils";

/**
 * Obtiene el árbol completo de cuentas contables
 */
export const getAccountTreeAction = withAuth(
    [Rol.ADMIN, Rol.SECRETARIA],
    async (): Promise<ActionResult> => {
        try {
            const tree = await AccountService.getAccountTree();

            return {
                success: true,
                data: serializeDecimal(tree),
            };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Error al obtener árbol de cuentas",
            };
        }
    },
    "getAccountTree",
);

/**
 * Schema para búsqueda de cuentas
 */
const searchAccountsSchema = z.object({
    query: z.string().min(1, "La búsqueda debe tener al menos 1 carácter"),
    limit: z.number().optional(),
});

/**
 * Busca cuentas por código o nombre
 */
export const searchAccountsAction = withAuth(
    [Rol.ADMIN, Rol.SECRETARIA],
    async (...args: unknown[]): Promise<ActionResult> => {
        const input = args[0] as z.infer<typeof searchAccountsSchema>;
        const result = searchAccountsSchema.safeParse(input);

        if (!result.success) {
            return {
                success: false,
                error: "Datos inválidos",
                errors: result.error.flatten().fieldErrors,
            };
        }

        try {
            const accounts = await AccountService.searchAccounts(
                result.data.query,
                result.data.limit,
            );

            return {
                success: true,
                data: serializeDecimal(accounts),
            };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Error al buscar cuentas",
            };
        }
    },
    "searchAccounts",
);

/**
 * Schema para obtener balance de cuenta
 */
const getAccountBalanceSchema = z.object({
    accountId: z.string().uuid("ID de cuenta inválido"),
});

/**
 * Obtiene el balance de una cuenta
 */
export const getAccountBalanceAction = withAuth(
    [Rol.ADMIN, Rol.SECRETARIA],
    async (...args: unknown[]): Promise<ActionResult> => {
        const input = args[0] as z.infer<typeof getAccountBalanceSchema>;
        const result = getAccountBalanceSchema.safeParse(input);

        if (!result.success) {
            return {
                success: false,
                error: "Datos inválidos",
                errors: result.error.flatten().fieldErrors,
            };
        }

        try {
            const balance = await AccountService.getAccountBalance(
                result.data.accountId,
            );

            return {
                success: true,
                data: {
                    ...balance,
                    // Convertir Decimal a string para serialización
                    debitos: balance.debitos.toString(),
                    creditos: balance.creditos.toString(),
                    saldo: balance.saldo.toString(),
                },
            };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Error al obtener balance",
            };
        }
    },
    "getAccountBalance",
);

/**
 * Obtiene cuentas auxiliares (para movimientos)
 */
export const getAuxiliaryAccountsAction = withAuth(
    [Rol.ADMIN, Rol.SECRETARIA],
    async (): Promise<ActionResult> => {
        try {
            const accounts = await AccountService.getAuxiliaryAccounts();

            return {
                success: true,
                data: serializeDecimal(accounts),
            };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Error al obtener cuentas auxiliares",
            };
        }
    },
    "getAuxiliaryAccounts",
);
