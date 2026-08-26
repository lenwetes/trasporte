"use server";

import { withAuth } from "@/lib/safe-action";
import { ActionResult, TransaccionWithRelations } from "@/types";
import { ExpenseService } from "@/services/expense.service";
import { createAuditLog } from "@/actions/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Rol, MetodoPago } from "@prisma/client";
import { serializeDecimal } from "@/lib/utils";

const expenseSchema = z.object({
    descripcion: z
        .string()
        .min(5, "La descripción debe tener al menos 5 caracteres"),
    monto: z.number().min(1, "El monto debe ser mayor a 0"),
    categoria: z.enum(["PERSONAL", "SERVICIOS", "MANTENIMIENTO", "DIVERSOS"]),
    metodoPago: z.nativeEnum(MetodoPago),
    soporteUrl: z.string().optional(),
    terceroId: z.string().optional(),
});

type CreateExpenseInput = z.infer<typeof expenseSchema>;

export const registerExpenseAction = withAuth<TransaccionWithRelations, [CreateExpenseInput]>(
    [Rol.ADMIN, Rol.SECRETARIA],
    async (input: CreateExpenseInput): Promise<ActionResult<TransaccionWithRelations>> => {
        const result = expenseSchema.safeParse(input);

        if (!result.success) {
            return {
                success: false,
                error: "Datos inválidos",
                errors: result.error.flatten().fieldErrors,
            };
        }

        const data = result.data;
        const { auth } = await import("@/auth");
        const session = await auth();

        if (!session?.user?.id) {
            return { success: false, error: "No autorizado"  };
        }

        const serviceResult = await ExpenseService.registerExpense({
            ...data,
            creadoPorId: session.user.id,
        });

        if (serviceResult.success && serviceResult.data) {
            const txData = serviceResult.data as TransaccionWithRelations;
            await createAuditLog(
                session.user.id,
                "CREAR",
                "Transaccion",
                txData.id,
                `Gasto registrado: ${data.categoria} - ${data.monto}`,
            );
            revalidatePath("/dashboard/finance/egresos");
            revalidatePath("/dashboard/finance");
        }

        return serializeDecimal(serviceResult);
    },
    "registerExpense",
);

export const getExpenseSummaryAction = withAuth(
    [Rol.ADMIN, Rol.SECRETARIA],
    async (): Promise<ActionResult<unknown>> => {
        return serializeDecimal(
            await ExpenseService.getMonthlyExpensesBreakdown(),
        );
    },
    "getExpenseSummary",
);
