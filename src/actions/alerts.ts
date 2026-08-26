"use server";

import { AlertsService } from "@/services/alerts.service";
import { ActionResult } from "@/types";
import { AlertNotification, AlertLevel } from "@/lib/alerts";
import { withAuth } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";

/**
 * Obtiene las alertas activas del sistema para hidratación del Header.
 */
export const getActiveAlerts = withAuth(
    "ALL",
    async (limit: number = 20): Promise<ActionResult<AlertNotification[]>> => {
        try {
            const alertsResult = await AlertsService.getResumen(limit);

            const alerts: AlertNotification[] = (alertsResult.alertas || []).map(a => ({
                documentId: a.id,
                tipo: a.tipo,
                fechaVencimiento: a.fechaVencimiento,
                daysUntilExpiry: a.diasRestantes,
                status: (a.estado === "VENCIDO" ? "red" : "yellow") as AlertLevel,
                vehiculoPlaca: a.placa,
                vehiculoId: a.vehiculoId,
            }));

            return { success: true, data: alerts };
        } catch (error) {
            return { success: false, error: "Error al obtener alertas del sistema" };
        }
    },
    "getActiveAlerts",
);

/**
 * Ejecuta manualmente el motor de actualización de alertas de vencimiento.
 * Recalcula los estados VENCIDO / POR_VENCER / OK de todos los documentos.
 */
export const triggerAlertasUpdate = withAuth(
    "ALL",
    async (): Promise<ActionResult<{ vencidos: number; porVencer: number }>> => {
        try {
            const result = await AlertsService.triggerUpdate();
            revalidatePath("/dashboard/vehiculos");
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: "Error al ejecutar el motor de alertas" };
        }
    },
    "triggerAlertasUpdate",
);

interface UpsertReglaInput {
    tipoDocumento: string;
    diasAnticipacion: number;
    activo: boolean;
}

/**
 * Crea o actualiza una regla de alerta de vencimiento para un tipo de documento.
 */
export const upsertReglaAlerta = withAuth(
    "ADMIN",
    async (input: UpsertReglaInput): Promise<ActionResult> => {
        if (!input.tipoDocumento || input.diasAnticipacion < 1) {
            return { success: false, error: "Datos de regla inválidos" };
        }
        try {
            const regla = await AlertsService.upsertRegla(
                input.tipoDocumento,
                input.diasAnticipacion,
                input.activo,
            );
            revalidatePath("/dashboard/vehiculos");
            return { success: true, data: regla };
        } catch (error) {
            return { success: false, error: "Error al guardar la regla de alerta" };
        }
    },
    "upsertReglaAlerta",
);
