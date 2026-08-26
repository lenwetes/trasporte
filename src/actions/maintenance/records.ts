"use server";

import { MaintenanceService } from "@/services/maintenance.service";
import { createAuditLog } from "@/actions/audit";
import { revalidatePath } from "next/cache";
import { MantenimientoRealizadoCreateSchema } from "@/lib/validations";
import { withAuth } from "@/lib/safe-action";
import { ActionResult } from "@/types";
import { hasPermission, unauthorizedResponse } from "@/lib/permissions";
import logger from "@/lib/logger";

/**
 * 5.1 Patrón: Registrar un mantenimiento realizado
 */
export const createMantenimientoRealizado = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        // 1. RBAC
        if (!hasPermission(session.user.rol, "MANTENIMIENTO", "CREATE")) {
            return unauthorizedResponse();
        }

        // 2. Zod Validation
        const validation =
            MantenimientoRealizadoCreateSchema.safeParse(dataInput);
        if (!validation.success) {
            return {
                success: false,
                error: "Datos de registro inválidos",
                errors: validation.error.flatten().fieldErrors,
            };
        }

        const data = validation.data;

        try {
            // Construir el objeto compatible con Prisma (relaciones anidadas)
            const prismaData = {
                fecha: data.fecha,
                kilometraje: data.kilometraje,
                costo: data.costo ?? null,
                observaciones: data.observaciones ?? null,
                vehiculo: { connect: { id: data.vehiculoId } },
                plan: { connect: { id: data.planId } },
                ...(data.archivoId
                    ? { factura: { connect: { id: data.archivoId } } }
                    : {}),
            };

            // 3. Logic (Delegar a Service)
            const result = await MaintenanceService.createRecord(prismaData);
            if (!result.success || !result.data) return result;

            const maintenance = result.data as {
                id: string;
                plan?: { nombre?: string };
                vehiculo?: { placa?: string };
                vehiculoId: string;
            };

            // 4. Audit + Revalidate
            await createAuditLog(
                session.user.id,
                "CREAR",
                "MantenimientoRealizado",
                maintenance.id,
                `Registro de mantenimiento ${maintenance.plan?.nombre ?? ""} para vehículo ${maintenance.vehiculo?.placa ?? ""}`,
                session.user.lastIp,
                session.user.lastUserAgent,
            );

            revalidatePath("/dashboard/mantenimiento");
            revalidatePath(`/dashboard/vehiculos/${data.vehiculoId}`);
            return result;
        } catch (error) {
            logger.error(
                { error, vehiculoId: data.vehiculoId },
                "Error en createMantenimientoRealizado action",
            );
            return { success: false, error: "Error interno del servidor"  };
        }
    },
);

/**
 * 5.1 Patrón: Obtener historial de mantenimiento por vehículo
 */
export const getHistorialMantenimiento = withAuth(
    async (session, vehiculoId: unknown): Promise<ActionResult> => {
        if (typeof vehiculoId !== "string")
            return { success: false, error: "Vehículo ID inválido"  };
        if (!hasPermission(session.user.rol, "MANTENIMIENTO", "READ")) {
            return unauthorizedResponse();
        }

        return await MaintenanceService.getHistory({ vehiculoId });
    },
);

/**
 * 5.1 Patrón: Obtener historial global (filtrado por rol)
 */
export const getHistorialGlobal = withAuth(
    async (session): Promise<ActionResult> => {
        if (!hasPermission(session.user.rol, "MANTENIMIENTO", "READ")) {
            return unauthorizedResponse();
        }

        const conductorId =
            session.user.rol === "CONDUCTOR" ? session.user.id : undefined;

        return await MaintenanceService.getHistory({ conductorId });
    },
);
