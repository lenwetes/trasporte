"use server";

import { withAuth } from "@/lib/safe-action";
import { BillingService } from "@/services/billing.service";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/actions/audit";
import { serializeDecimal } from "@/lib/utils";

/**
 * Ejecuta la facturación masiva del mes actual o uno específico.
 */
export const runMassBilling = withAuth(
    ["ADMIN"],
    async (dataInput: unknown): Promise<ActionResult> => {
        const { periodo } = dataInput as { periodo?: string };
        const selectedDate = periodo ? new Date(periodo) : new Date();

        const { auth } = await import("@/auth");
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) return { success: false, error: "Sesión no válida" };

        const result = await BillingService.generateMonthlyFees(
            selectedDate,
            userId,
        );

        if (result.success) {
            await createAuditLog(
                userId,
                "CREAR",
                "FacturacionMasiva",
                null,
                `Ejecución de facturación masiva para el periodo ${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`,
            );
            revalidatePath("/dashboard/finance");
            revalidatePath("/dashboard/finance/payments");
        }

        return serializeDecimal(result);
    },
    "runMassBilling",
);

/**
 * Previsualiza el impacto de la facturación masiva.
 */
export const previewMassBilling = withAuth(
    ["ADMIN"],
    async (dataInput: unknown): Promise<ActionResult> => {
        const { periodo } = dataInput as { periodo?: string };
        const selectedDate = periodo ? new Date(periodo) : new Date();

        return serializeDecimal(
            await BillingService.previewMonthlyFees(selectedDate),
        );
    },
    "previewMassBilling",
);
