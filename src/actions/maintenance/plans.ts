"use server";

import { MaintenanceService } from "@/services/maintenance.service";
import { createAuditLog } from "@/actions/audit";
import { revalidatePath } from "next/cache";
import { ActionResult } from "@/types";
import { withAuth } from "@/lib/safe-action";
import { hasPermission, unauthorizedResponse } from "@/lib/permissions";
import logger from "@/lib/logger";
import { Prisma } from "@prisma/client";

/**
 * 5.1 Patrón: Listar Planes de Mantenimiento
 */
export const getPlanesMantenimiento = withAuth(
    async (session): Promise<ActionResult> => {
        // 1. RBAC (Lectura general permitida usualmente, pero chequeamos)
        if (!hasPermission(session.user.rol, "MANTENIMIENTO", "READ")) {
            return unauthorizedResponse();
        }

        // 2. Logic (Delegar a Service)
        return await MaintenanceService.getPlans();
    },
);

/**
 * 5.1 Patrón: Crear un nuevo plan de mantenimiento
 */
export const createPlanMantenimiento = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        // 1. RBAC
        if (!hasPermission(session.user.rol, "MANTENIMIENTO", "CREATE")) {
            return unauthorizedResponse();
        }

        // 2. Logic (Delegar a Service)
        try {
            const result = await MaintenanceService.createPlan(
                dataInput as Prisma.PlanMantenimientoCreateInput,
            );
            if (!result.success || !result.data) return result;

            const plan = result.data as
                | { id: string; nombre: string }
                | undefined;
            if (!plan) return { success: false, error: "Plan inválido"  };
            // 3. Audit + Revalidate
            await createAuditLog(
                session.user.id,
                "CREAR",
                "PlanMantenimiento",
                plan.id,
                `Creación de plan de mantenimiento: ${plan.nombre}`,
                session.user.lastIp,
                session.user.lastUserAgent,
            );

            revalidatePath("/dashboard/mantenimiento");
            return result;
        } catch (error) {
            logger.error(
                { error, dataInput },
                "Error en createPlanMantenimiento action",
            );
            return { success: false, error: "Error interno del servidor"  };
        }
    },
);
