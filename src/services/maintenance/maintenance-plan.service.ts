import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import { CacheService } from "@/lib/cache";
import { PlanMantenimiento, Prisma } from "@prisma/client";
import { serializeDecimal } from "@/lib/utils";

export class MaintenancePlanService {
    /**
     * Gestión de Planes
     */
    static async getPlans(): Promise<ActionResult<PlanMantenimiento[]>> {
        return await CacheService.remember("maint:plans", 86400, async () => {
            try {
                const planes = await prisma.planMantenimiento.findMany({
                    orderBy: { nombre: "asc" },
                });
                return { success: true, data: serializeDecimal(planes) as PlanMantenimiento[] };
            } catch (error) {
                logger.error(
                    { error },
                    "MaintenancePlanService.getPlans error",
                );
                return { success: false, error: "Error al listar planes" };
            }
        });
    }

    static async createPlan(
        data: Prisma.PlanMantenimientoCreateInput,
    ): Promise<ActionResult<PlanMantenimiento>> {
        try {
            const plan = await prisma.planMantenimiento.create({ data });

            await CacheService.invalidate("maint");
            await CacheService.invalidate("maint:plans");

            return { success: true, data: serializeDecimal(plan) as PlanMantenimiento };
        } catch (error) {
            logger.error(
                { data, error },
                "MaintenancePlanService.createPlan error",
            );
            return { success: false, error: "Error al crear plan" };
        }
    }
}

