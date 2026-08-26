"use server";

import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/actions/audit";
import { ActionResult } from "@/types";
import { VehicleService } from "@/services/vehicle.service";
import { CacheService } from "@/lib/cache";
import { withAuth } from "@/lib/safe-action";
import { hasPermission, unauthorizedResponse } from "@/lib/permissions";
import logger from "@/lib/logger";

import {
    VehiculoCreateSchema,
    VehiculoCreate,
    VehiculoUpdateSchema,
    VehiculoUpdate,
} from "@/lib/validations";

/**
 * 5.1 Patrón: Crear Vehículo
 */
export const createVehiculo = withAuth(
    async (session, data: unknown): Promise<ActionResult> => {
        // 1. RBAC
        if (!hasPermission(session.user.rol, "VEHICULOS", "CREATE")) {
            return unauthorizedResponse();
        }

        const isAdmin = session.user.rol === "ADMIN";

        // 2. Zod
        // Relaxed validation for ADMINs but keeping essential fields
        const schema = isAdmin
            ? VehiculoCreateSchema.partial({
                  marca: true,
                  modelo: true,
                  anho: true,
                  color: true,
                  cilindraje: true,
                  peso: true,
                  capacidadPuestos: true,
                  numeroMotor: true,
                  numeroChasis: true,
                  lugarExpedicion: true,
              })
            : VehiculoCreateSchema;

        const validatedFields = schema.safeParse(data);
        if (!validatedFields.success) {
            return {
                success: false,
                error: "Error de validación: Verifique los detalles técnicos",
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        // 3. Logic + Audit + Revalidate
        try {
            const result = await VehicleService.create(
                validatedFields.data as VehiculoCreate,
            );

            if (!result.success || !result.data) {
                return result;
            }

            const vehiculo = result.data as import("@prisma/client").Vehiculo;

            await createAuditLog(
                session.user.id,
                "CREAR",
                "Vehiculo",
                vehiculo.id,
                `Creación de vehículo placa ${vehiculo.placa}`,
                session.user.lastIp,
                session.user.lastUserAgent,
            );

            revalidatePath("/dashboard/vehiculos");
            revalidatePath("/dashboard");
            await CacheService.invalidate("vehicles");

            return result;
        } catch (error) {
            logger.error(
                { error, userId: session.user.id },
                "Error en createVehiculo",
            );
            return { success: false, error: "Error interno del servidor"  };
        }
    },
);

/**
 * 5.1 Patrón: Actualizar Vehículo
 */
export const updateVehiculo = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        const { id, ...data } = dataInput as { id: string } & VehiculoUpdate;

        // 1. RBAC
        if (!hasPermission(session.user.rol, "VEHICULOS", "UPDATE")) {
            return unauthorizedResponse();
        }

        const isAdmin = session.user.rol === "ADMIN";

        // 2. Zod
        const schema = isAdmin
            ? VehiculoUpdateSchema.partial()
            : VehiculoUpdateSchema;

        const validatedFields = schema.safeParse(data);
        if (!validatedFields.success) {
            return {
                success: false,
                error: "Error de validación al actualizar vehículo",
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        // 3. Logic + Audit + Revalidate
        try {
            const result = await VehicleService.update(
                id,
                validatedFields.data as VehiculoUpdate,
            );

            if (!result.success || !result.data) {
                return result;
            }

            const vehiculo = result.data as import("@prisma/client").Vehiculo;

            await createAuditLog(
                session.user.id,
                "ACTUALIZAR",
                "Vehiculo",
                id,
                `Actualización de vehículo ${vehiculo.placa}`,
                session.user.lastIp,
                session.user.lastUserAgent,
            );

            revalidatePath("/dashboard/vehiculos");
            revalidatePath(`/dashboard/vehiculos/${id}`);
            revalidatePath("/dashboard");
            await CacheService.invalidate("vehicles");

            return result;
        } catch (error) {
            logger.error(
                { error, userId: session.user.id, id },
                "Error en updateVehiculo",
            );
            return { success: false, error: "Error interno del servidor"  };
        }
    },
);

/**
 * 5.1 Patrón: Eliminar Vehículo
 */
export const deleteVehiculo = withAuth(
    async (session, id: unknown): Promise<ActionResult> => {
        // 1. RBAC
        if (!hasPermission(session.user.rol, "VEHICULOS", "DELETE")) {
            return unauthorizedResponse();
        }

        if (typeof id !== "string") {
            return { success: false, error: "ID de vehículo inválido"  };
        }

        // 2. Logic + Audit + Revalidate
        try {
            const result = await VehicleService.delete(id);

            if (!result.success) {
                return result;
            }

            await createAuditLog(
                session.user.id,
                "ELIMINAR",
                "Vehiculo",
                id,
                "Eliminación de vehículo",
                session.user.lastIp,
                session.user.lastUserAgent,
            );

            revalidatePath("/dashboard/vehiculos");
            revalidatePath("/dashboard");
            await CacheService.invalidate("vehicles");

            return result;
        } catch (error) {
            logger.error(
                { error, userId: session.user.id, id },
                "Error en deleteVehiculo",
            );
            return { success: false, error: "Error interno del servidor"  };
        }
    },
);
