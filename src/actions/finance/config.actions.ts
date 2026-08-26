"use server";

import { withAuth } from "@/lib/safe-action";
import { ActionResult } from "@/types";
import { FinanceConfigService } from "@/services/finance-config.service";
import { createAuditLog } from "@/actions/audit";
import { serializeDecimal } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Rol } from "@prisma/client";

const configSchema = z.object({
    montoCuotaAdministracion: z.number().min(0).optional(),
    diaCorteMensual: z.number().min(1).max(31).optional(),
    porcentajeMoraDiaria: z.number().min(0).max(100).optional(),
    nombreEmpresa: z.string().optional(),
    nit: z.string().optional(),
    direccion: z.string().optional(),
    email: z.string().optional(),
    telefono: z.string().optional(),
    representanteLegal: z.string().optional(),
    nombrePresidente: z.string().optional(),
});

type UpdateConfigInput = z.infer<typeof configSchema>;

export const getFinanceConfigAction = withAuth(
    [Rol.ADMIN, Rol.SECRETARIA],
    async (): Promise<ActionResult> => {
        const config = await FinanceConfigService.getConfig();
        return { success: true, data: serializeDecimal(config) };
    },
    "getFinanceConfig",
);

export const updateFinanceConfigAction = withAuth(
    [Rol.ADMIN],
    async (...args: unknown[]): Promise<ActionResult> => {
        const input = args[0] as UpdateConfigInput;
        const result = configSchema.safeParse(input);

        if (!result.success) {
            return {
                success: false,
                error: "Datos inválidos",
                errors: result.error.flatten().fieldErrors,
            };
        }

        const { auth } = await import("@/auth");
        const session = await auth();

        if (!session?.user?.id) {
            return { success: false, error: "No autorizado"  };
        }

        const serviceResult = await FinanceConfigService.updateConfig(
            result.data,
        );

        if (serviceResult.success) {
            await createAuditLog(
                session.user.id,
                "ACTUALIZAR",
                "ConfiguracionGlobal",
                "default",
                `Actualización conf. financiera: ${JSON.stringify(result.data)}`,
            );
            revalidatePath("/dashboard/finance/config");
        }

        return serviceResult;
    },
    "updateFinanceConfig",
);
