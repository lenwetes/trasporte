"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { VinculacionCreateSchema, VinculacionCreate } from "@/lib/validations";
import { ActionResult } from "@/types";
import { withAuth } from "@/lib/safe-action";

/**
 * Create a new vinculacion
 */
export const createVinculacion = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (data: unknown): Promise<ActionResult> => {
        const vinculacionData = data as VinculacionCreate;
        const validatedFields =
            VinculacionCreateSchema.safeParse(vinculacionData);

        if (!validatedFields.success) {
            return {
                success: false,
                error: validatedFields.error.issues[0].message,
            };
        }

        await prisma.vinculacion.updateMany({
            where: {
                vehiculoId: validatedFields.data.vehiculoId,
                activo: true,
            },
            data: {
                activo: false,
                fechaFin: new Date(),
            },
        });

        const vinculacion = await prisma.vinculacion.create({
            data: {
                ...validatedFields.data,
                activo: true,
            },
            include: {
                conductor: true,
                vehiculo: true,
            },
        });

        revalidatePath(
            `/dashboard/vehiculos/${validatedFields.data.vehiculoId}`,
        );
        revalidatePath("/dashboard");
        return { success: true, data: vinculacion };
    },
    "createVinculacion",
);

/**
 * Finalize an active vinculation
 */
export const finalizeVinculacion = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (id: unknown): Promise<ActionResult> => {
        const vinculacionId = id as string;
        const vinculacion = await prisma.vinculacion.update({
            where: { id: vinculacionId },
            data: {
                activo: false,
                fechaFin: new Date(),
            },
        });

        revalidatePath(`/dashboard/vehiculos/${vinculacion.vehiculoId}`);
        revalidatePath("/dashboard");
        return { success: true, message: "Vinculación finalizada"  };
    },
    "finalizeVinculacion",
);

/**
 * Link multiple drivers to a vehicle
 */
export const vincularConductoresMasivo = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (data: unknown): Promise<ActionResult> => {
        const { vehiculoId, conductorIds } = data as {
            vehiculoId: string;
            conductorIds: string[];
        };

        if (!vehiculoId || !conductorIds || conductorIds.length === 0) {
            return { success: false, error: "Datos insuficientes"  };
        }

        // We only create new ones for those NOT already active for this vehicle
        const existingActive = await prisma.vinculacion.findMany({
            where: {
                vehiculoId,
                conductorId: { in: conductorIds },
                activo: true,
            },
            select: { conductorId: true },
        });

        const activeIds = new Set(existingActive.map((v) => v.conductorId));
        const newIds = conductorIds.filter((id) => !activeIds.has(id));

        if (newIds.length === 0) {
            return {
                success: true,
                message: "Todos los conductores ya están vinculados",
            };
        }

        await prisma.vinculacion.createMany({
            data: newIds.map((conductorId) => ({
                vehiculoId,
                conductorId,
                activo: true,
                fechaInicio: new Date(),
            })),
        });

        revalidatePath(`/dashboard/vehiculos/${vehiculoId}`);
        revalidatePath("/dashboard");

        return {
            success: true,
            message: `${newIds.length} conductor(es) vinculado(s) correctamente`,
        };
    },
    "vincularConductoresMasivo",
);
