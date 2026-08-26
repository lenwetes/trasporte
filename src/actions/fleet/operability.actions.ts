"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { ActionResult } from "@/types";
import { VehicleOperabilityService } from "@/services/vehicle-operability.service";
import { prisma } from "@/lib/prisma";
import { EstadoOperativo } from "@prisma/client";

/**
 * Evalúa manualmente la operatividad de un vehículo.
 */
export async function evaluateVehicleAction(
    vehiculoId: string,
): Promise<ActionResult<unknown>> {
    const session = await auth();
    if (!session?.user) return { success: false, error: "No autorizado" };
    const result = await VehicleOperabilityService.evaluateOperability(
        vehiculoId,
        session.user.id,
    );

    if (result.success) {
        revalidatePath(`/dashboard/vehiculos/${vehiculoId}`);
        revalidatePath("/dashboard/vehiculos");
    }

    return result;
}

/**
 * Bloquea o desbloquea un vehículo manualmente.
 */
export async function toggleVehicleBlockAction(
    vehiculoId: string,
    bloquear: boolean,
    razon: string,
): Promise<ActionResult> {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "No autorizado" };
    const result = await VehicleOperabilityService.toggleManualBlock(
        vehiculoId,
        session.user.id,
        bloquear,
        razon,
    );

    if (result.success) {
        revalidatePath(`/dashboard/vehiculos/${vehiculoId}`);
        revalidatePath("/dashboard/vehiculos");
    }

    return result;
}

/**
 * Bloquea o desbloquea todos los vehículos de un propietario.
 */
export async function toggleOwnerBlockAction(
    ownerId: string,
    bloquear: boolean,
    razon: string,
): Promise<ActionResult> {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "No autorizado" };
    const result = await VehicleOperabilityService.toggleOwnerBlock(
        ownerId,
        session.user.id,
        bloquear,
        razon,
    );

    if (result.success) {
        revalidatePath("/dashboard/vehiculos");
        revalidatePath("/dashboard/users"); // Si hay una vista de usuario con sus vehículos
    }

    return result;
}

/**
 * Obtiene el historial de operatividad de un vehículo.
 */
export async function getVehicleOperabilityHistory(vehiculoId: string) {
    try {
        const history = await prisma.historialEstadoVehiculo.findMany({
            where: { vehiculoId },
            include: {
                usuario: {
                    select: { nombres: true, apellidos: true },
                },
            },
            orderBy: { creadoEn: "desc" },
        });

        return { success: true, data: history };
    } catch (error) {
        return { success: false, error: "Error al obtener historial" };
    }
}

/**
 * Obtiene la lista de propietarios y su conteo de vehículos para el módulo de bloqueos.
 */
export async function getOwnersForBlockingAction(): Promise<ActionResult> {
    const session = await auth();
    if (session?.user?.rol !== "ADMIN")
        return { success: false, error: "No autorizado" };
    try {
        const owners = await prisma.usuario.findMany({
            where: { rol: "PROPIETARIO", activo: true },
            select: {
                id: true,
                nombres: true,
                apellidos: true,
                email: true,
                numeroDocumento: true,
                _count: {
                    select: { vehiculosPropiedad: true },
                },
            },
            orderBy: { nombres: "asc" },
        });

        return { success: true, data: owners };
    } catch (error) {
        return { success: false, error: "Error al obtener propietarios" };
    }
}

/**
 * Obtiene todos los vehículos con su estado de bloqueo manual.
 */
export async function getVehiclesForBlockingAction(): Promise<ActionResult> {
    const session = await auth();
    if (session?.user?.rol !== "ADMIN")
        return { success: false, error: "No autorizado" };
    try {
        const vehicles = await prisma.vehiculo.findMany({
            where: { activo: true },
            select: {
                id: true,
                placa: true,
                marca: true,
                modelo: true,
                bloqueadoManualmente: true,
                razonBloqueo: true,
                estadoOperativo: true,
                propietario: true,
            },
            orderBy: { placa: "asc" },
        });

        return { success: true, data: vehicles };
    } catch (error) {
        return { success: false, error: "Error al obtener vehículos" };
    }
}

/**
 * Aplica o remueve un override de super usuario.
 */
export async function toggleSuperOverrideAction(
    vehiculoId: string,
    activar: boolean,
    justificacion: string,
): Promise<ActionResult> {
    const session = await auth();
    if (session?.user?.rol !== "ADMIN")
        return {
            success: false,
            error: "Solo administradores pueden aplicar overrides",
        };

    const result = await VehicleOperabilityService.toggleSuperOverride(
        vehiculoId,
        session.user.id,
        activar,
        justificacion,
    );

    if (result.success) {
        revalidatePath(`/dashboard/vehiculos/${vehiculoId}`);
        revalidatePath("/dashboard/vehiculos");
    }

    return result;
}
