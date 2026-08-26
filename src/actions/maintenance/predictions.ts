"use server";

import { MaintenanceService } from "@/services/maintenance.service";
import { auth } from "@/auth";

/**
 * Patrón 5.1: Obtener Predicciones de Mantenimiento para un vehículo
 */
export async function getMaintenancePredictions(vehiculoId: string) {
    const session = await auth();
    if (!session?.user) return { success: false, error: "No autorizado"  };
    return await MaintenanceService.predictNextMaintenance(vehiculoId);
}

/**
 * Patrón 5.1: Obtener Predicciones de Mantenimiento para toda la flota
 * RBAC: Conductores ven solo sus vehículos, Admins ven todos
 */
export async function getAllMaintenancePredictions() {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.rol) {
        return { success: false, error: "No autorizado"  };
    }

    return await MaintenanceService.predictFleetMaintenance(
        session.user.id,
        session.user.rol,
    );
}
