import { VehicleOperabilityEvaluatorService } from "./vehicle/vehicle-operability-evaluator.service";
import { VehicleOperabilityControlService } from "./vehicle/vehicle-operability-control.service";
import { ActionResult } from "@/types";
import { EstadoOperativo } from "@prisma/client";

/**
 * @deprecated Use specific services in src/services/vehicle/ instead.
 */
export class VehicleOperabilityService {
    static async evaluateOperability(
        vehiculoId: string,
        userId?: string,
    ): Promise<ActionResult<unknown>> {
        return VehicleOperabilityEvaluatorService.evaluateOperability(
            vehiculoId,
            userId,
        );
    }

    static async toggleManualBlock(
        vehiculoId: string,
        userId: string,
        bloquear: boolean,
        razon: string,
    ): Promise<ActionResult> {
        return VehicleOperabilityControlService.toggleManualBlock(
            vehiculoId,
            userId,
            bloquear,
            razon,
        );
    }

    static async toggleOwnerBlock(
        ownerId: string,
        userId: string,
        bloquear: boolean,
        razon: string,
    ): Promise<ActionResult> {
        return VehicleOperabilityControlService.toggleOwnerBlock(
            ownerId,
            userId,
            bloquear,
            razon,
        );
    }

    static async toggleSuperOverride(
        vehiculoId: string,
        userId: string,
        activar: boolean,
        justificacion: string,
    ): Promise<ActionResult> {
        return VehicleOperabilityControlService.toggleSuperOverride(
            vehiculoId,
            userId,
            activar,
            justificacion,
        );
    }
}
