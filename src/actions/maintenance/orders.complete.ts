"use server";

import { createAuditLog } from "@/actions/audit";
import { revalidatePath } from "next/cache";
import { ActionResult } from "@/types";
import { withAuth } from "@/lib/safe-action";
import { MaintenanceService } from "@/services/maintenance.service";
import { hasPermission, unauthorizedResponse } from "@/lib/permissions";
import logger from "@/lib/logger";

/**
 * 5.1 Patrón: Completar Orden de Servicio (Admin directo)
 */
export const completeOrdenServicio = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        // 1. RBAC
        if (!hasPermission(session.user.rol, "MANTENIMIENTO", "UPDATE")) {
            return unauthorizedResponse();
        }

        const data = dataInput as {
            ordenId: string;
            kilometraje: number;
            costo: number;
            observaciones?: string;
            archivoId?: string;
        };

        if (!data.ordenId)
            return { success: false, error: "ID de orden obligatorio"  };
        try {
            // 2. Logic (Delegar a Service)
            const result = await MaintenanceService.completeOrder({
                ...data,
                userId: session.user.id,
            });

            if (!result.success || !result.data) return result;

            const orden = result.data as
                | { id: string; codigo: string }
                | undefined;
            if (!orden) return { success: false, error: "Orden inválida"  };
            // 3. Audit + Revalidate
            await createAuditLog(
                session.user.id,
                "ACTUALIZAR",
                "OrdenServicio",
                orden.id,
                `Orden de servicio ${orden.codigo} completada directamente con integración contable`,
                session.user.lastIp,
                session.user.lastUserAgent,
            );

            revalidatePath("/dashboard/mantenimiento");
            return result;
        } catch (error) {
            logger.error(
                { error, data },
                "Error en completeOrdenServicio action",
            );
            return {
                success: false,
                error: error instanceof Error ? error.message : "Error interno",
            };
        }
    },
);
