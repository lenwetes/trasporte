import {
    MaintenancePredictionService,
    MaintenancePrediction,
    FleetMaintenancePrediction,
} from "./maintenance-prediction.service";
import { MaintenanceStatsService } from "./maintenance-stats.service";
import { ActionResult } from "@/types";

export type { MaintenancePrediction, FleetMaintenancePrediction };

/**
 * MaintenanceCoreService
 * Facade for maintenance prediction and stats.
 */
export class MaintenanceCoreService {
    static async predictNextMaintenance(
        vehiculoId: string,
    ): Promise<ActionResult<unknown>> {
        return MaintenancePredictionService.predictNextMaintenance(vehiculoId);
    }

    static async predictFleetMaintenance(
        userId: string,
        userRole: string,
    ): Promise<ActionResult<unknown>> {
        return MaintenancePredictionService.predictFleetMaintenance(
            userId,
            userRole,
        );
    }

    static async getStats(
        filters: { conductorId?: string } = {},
    ): Promise<ActionResult> {
        return MaintenanceStatsService.getStats(filters);
    }

    static async calculateUsageStats(
        vehiculoId: string,
        currentKm: number,
    ): Promise<{ dailyKm: number }> {
        return MaintenancePredictionService.calculateUsageStats(
            vehiculoId,
            currentKm,
        );
    }
}
