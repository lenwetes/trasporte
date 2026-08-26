"use server";

import { MaintenanceService } from "@/services/maintenance.service";
import { ActionResult } from "@/types";
import { withAuth } from "@/lib/safe-action";
import { hasPermission, unauthorizedResponse } from "@/lib/permissions";
import logger from "@/lib/logger";

/**
 * 5.1 Patrón: Obtener estadísticas de mantenimiento
 */
export const getMaintenanceStats = withAuth(
    async (session): Promise<ActionResult> => {
        // 1. RBAC
        if (!hasPermission(session.user.rol, "MANTENIMIENTO", "READ")) {
            return unauthorizedResponse();
        }

        const conductorId =
            session.user.rol === "CONDUCTOR" ? session.user.id : undefined;

        // 2. Logic (Delegar a Service)
        return await MaintenanceService.getStats({ conductorId });
    },
);
