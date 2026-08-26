"use server";

import { ActionResult } from "@/types";
import { withAuth } from "@/lib/safe-action";
import { Rol } from "@prisma/client";
import { BillingService } from "@/services/billing.service";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { serializeDecimal } from "@/lib/utils";

// Validación simple inline o importada
const generateChargesSchema = z.object({
    periodo: z.date().optional(), // Fecha referencia, por defecto "hoy"
});

// Acción: Generar Cuotas de Administración (Masivo)
export const generateMonthlyFeesAction = withAuth(
    [Rol.ADMIN], // Solo Admin debería ejecutar procesos masivos críticos
    async (...args: unknown[]): Promise<ActionResult> => {
        const input = args[0] as { periodo?: Date } | undefined;
        const data = input || {};
        const validation = generateChargesSchema.safeParse(data);
        if (!validation.success)
            return { success: false, error: "Fecha inválida"  };
        const session = await auth();
        if (!session?.user?.id)
            return {
                success: false,
                error: "Identidad del administrador no encontrada",
            };

        const result = await BillingService.generateMonthlyFees(
            validation.data.periodo || new Date(),
            session.user.id,
        );

        if (result.success) {
            revalidatePath("/dashboard/finance");
            revalidatePath("/dashboard/users");
        }

        return serializeDecimal(result);
    },
    "generateMonthlyFees",
);
