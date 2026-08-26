"use server";

import { SafetyService } from "@/services/safety.service";
import { ActionResult } from "@/types";
import { withAuth } from "@/lib/safe-action";
import logger from "@/lib/logger";

/**
 * Obtiene los exámenes médicos de un conductor
 */
export const getExamenesConductor = withAuth(
    "ALL",
    async (conductorId: unknown): Promise<ActionResult> => {
        return await SafetyService.getExamenesByConductor(
            conductorId as string,
        );
    },
    "getExamenesConductor",
);

/**
 * Obtiene las entregas de dotación de un conductor
 */
export const getEntregasConductor = withAuth(
    "ALL",
    async (conductorId: unknown): Promise<ActionResult> => {
        return await SafetyService.getEntregasByConductor(
            conductorId as string,
        );
    },
    "getEntregasConductor",
);

/**
 * Obtiene el historial preoperacional de un vehículo
 */
export const getPreoperacionalesVehiculo = withAuth(
    "ALL",
    async (vehiculoId: unknown): Promise<ActionResult> => {
        return await SafetyService.getPreoperacionalesByVehiculo(
            vehiculoId as string,
        );
    },
    "getPreoperacionalesVehiculo",
);

/**
 * Obtiene la última inspección preoperacional de un vehículo
 */
export const getLatestPreoperacional = withAuth(
    "ALL",
    async (vehiculoId: unknown): Promise<ActionResult> => {
        return await SafetyService.getLatestPreoperacional(
            vehiculoId as string,
        );
    },
    "getLatestPreoperacional",
);

/**
 * Obtiene una inspección preoperacional por ID
 */
export const getPreoperacionalById = withAuth(
    "ALL",
    async (id: unknown): Promise<ActionResult> => {
        return await SafetyService.getPreoperacionalById(id as string);
    },
    "getPreoperacionalById",
);

/**
 * Obtiene una entrega de dotación por ID
 */
export const getEntregaDotacionById = withAuth(
    "ALL",
    async (id: unknown): Promise<ActionResult> => {
        return await SafetyService.getEntregaDotacionById(id as string);
    },
    "getEntregaDotacionById",
);

/**
 * Obtiene los indicadores de seguridad para un año específico
 */
export const getSafetyKPIs = withAuth(
    "ADMIN",
    async (yearParams: unknown): Promise<ActionResult> => {
        const year = (yearParams as number) || new Date().getFullYear();
        return await SafetyService.getSafetyKPIs(year);
    },
    "getSafetyKPIs",
);

/**
 * Obtiene el expediente digital consolidado de un conductor
 */
export const getExpedienteDigital = withAuth(
    "ALL",
    async (conductorId: unknown): Promise<ActionResult> => {
        const id = conductorId as string;
        const { auth } = await import("@/auth");
        const session = await auth();

        const isAuthorized =
            session!.user.rol === "ADMIN" ||
            session!.user.rol === "SECRETARIA" ||
            session!.user.id === id;

        if (!isAuthorized) return { success: false, error: "No autorizado"  };
        return await SafetyService.getExpedienteDigital(id);
    },
    "getExpedienteDigital",
);

/**
 * Obtiene el resumen del estado de la flota (semáforo)
 */
export const getFleetStatus = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (): Promise<ActionResult> => {
        return await SafetyService.getFleetStatus();
    },
    "getFleetStatus",
);

/**
 * Obtiene el resumen de SG-SST para el dashboard administrativo
 */
export const getSGSSTSummary = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (): Promise<ActionResult> => {
        return await SafetyService.getSGSSTSummary();
    },
    "getSGSSTSummary",
);

/**
 * Obtiene los datos del heatmap de riesgo operacional
 */
export const getOperationalRiskHeatmapData = withAuth(
    "ADMIN",
    async (): Promise<ActionResult> => {
        return await SafetyService.getOperationalRiskHeatmap();
    },
    "getOperationalRiskHeatmapData",
);
export const getSafetyCalendarEvents = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (monthParams: unknown): Promise<ActionResult> => {
        try {
            const dateInput =
                typeof monthParams === "string"
                    ? new Date(monthParams)
                    : (monthParams as Date) || new Date();
            const events =
                await SafetyService.getSafetyCalendarEvents(dateInput);
            return { success: true, data: events };
        } catch (error) {
            logger.error(
                { error },
                "[safety] Error al obtener eventos del calendario",
            );
            return {
                success: false,
                error: "Error al obtener eventos del calendario",
            };
        }
    },
    "getSafetyCalendarEvents",
);
