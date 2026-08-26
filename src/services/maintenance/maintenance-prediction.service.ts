import { ActionResult } from "@/types";
import {
    PredictionEngine,
    MaintenancePrediction,
} from "./prediction/prediction-engine";
import {
    FleetPredictionService,
    FleetMaintenancePrediction,
} from "./prediction/fleet-prediction";
import { UsageStatsService } from "./prediction/usage-stats";

export type { MaintenancePrediction, FleetMaintenancePrediction };

export class MaintenancePredictionService {
    static async predictNextMaintenance(
        vehiculoId: string,
    ): Promise<ActionResult<unknown>> {return PredictionEngine.predictNextMaintenance(vehiculoId);
    }

    static async predictFleetMaintenance(
        userId: string,
        userRole: string,
    ): Promise<ActionResult<unknown>> {return FleetPredictionService.predictFleetMaintenance(userId, userRole);
    }

    static async calculateUsageStats(
        vehiculoId: string,
        currentKm: number,
    ): Promise<{ dailyKm: number }> {
        return UsageStatsService.calculateUsageStats(vehiculoId, currentKm);
    }
}
