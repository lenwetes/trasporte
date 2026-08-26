import {
    MaintenanceCoreService,
} from "./maintenance/maintenance-core.service";
import { MaintenanceOrderQueryService } from "./maintenance/maintenance-order-query.service";
import { MaintenanceOrderMutationService } from "./maintenance/maintenance-order-mutation.service";
import { MaintenancePlanService } from "./maintenance/maintenance-plan.service";
import { ActionResult } from "@/types";
import { PaginationParams } from "@/types/pagination";
import { EstadoOrdenServicio, Prisma } from "@prisma/client";

/**
 * @deprecated Use specific services in src/services/maintenance/ instead.
 */
export class MaintenanceService {
    // Core (Predictions & Stats)
    static predictNextMaintenance(
        vehiculoId: string,
    ): Promise<ActionResult<unknown>> {
        return MaintenanceCoreService.predictNextMaintenance(vehiculoId);
    }

    static predictFleetMaintenance(
        userId: string,
        userRole: string,
    ): Promise<ActionResult<unknown>> {
        return MaintenanceCoreService.predictFleetMaintenance(userId, userRole);
    }

    static getStats(
        filters: { conductorId?: string } = {},
    ): Promise<ActionResult> {
        return MaintenanceCoreService.getStats(filters);
    }

    static calculateUsageStats(
        vehiculoId: string,
        currentKm: number,
    ): Promise<{ dailyKm: number }> {
        return MaintenanceCoreService.calculateUsageStats(
            vehiculoId,
            currentKm,
        );
    }

    // Orders & History (Queries)
    static getOrders(
        filters: {
            vehiculoId?: string;
            estado?: EstadoOrdenServicio | EstadoOrdenServicio[];
            conductorId?: string;
        } & PaginationParams = {},
    ): Promise<ActionResult<unknown>> {
        return MaintenanceOrderQueryService.getOrders(filters);
    }

    static getHistory(
        filters: {
            vehiculoId?: string;
            conductorId?: string;
        } & PaginationParams = {},
    ): Promise<ActionResult<unknown>> {
        return MaintenanceOrderQueryService.getHistory(filters);
    }

    static getOrderById(id: string): Promise<ActionResult> {
        return MaintenanceOrderQueryService.getOrderById(id);
    }

    // Orders & History (Mutations)
    static createRecord(
        data: Prisma.MantenimientoRealizadoCreateInput,
    ): Promise<ActionResult> {
        return MaintenanceOrderMutationService.createRecord(data);
    }

    static createOrder(data: {
        vehiculoId: string;
        planId: string;
        observaciones?: string;
    }): Promise<ActionResult> {
        return MaintenanceOrderMutationService.createOrder(data);
    }

    static updateOrder(
        id: string,
        data: Prisma.OrdenServicioUpdateInput,
    ): Promise<ActionResult> {
        return MaintenanceOrderMutationService.updateOrder(id, data);
    }

    static completeOrder(data: {
        ordenId: string;
        kilometraje: number;
        costo: number;
        userId: string;
        observaciones?: string;
        archivoId?: string;
    }): Promise<ActionResult> {
        return MaintenanceOrderMutationService.completeOrder(data);
    }

    static approveOrder(id: string, userId?: string): Promise<ActionResult> {
        return MaintenanceOrderMutationService.approveOrder(id, userId);
    }

    static rejectOrder(id: string, motivo: string): Promise<ActionResult> {
        return MaintenanceOrderMutationService.rejectOrder(id, motivo);
    }

    static submitComprobante(data: {
        ordenId: string;
        kilometraje: number;
        costo: number;
        observaciones?: string;
        archivoId: string;
    }): Promise<ActionResult> {
        return MaintenanceOrderMutationService.submitComprobante(data);
    }

    static solicitarRevision(data: {
        vehiculoId: string;
        planId: string;
        kilometraje: number;
        costo: number;
        observaciones?: string;
        archivoId: string;
    }): Promise<ActionResult> {
        return MaintenanceOrderMutationService.solicitarRevision(data);
    }

    // Plans
    static getPlans(): Promise<ActionResult> {
        return MaintenancePlanService.getPlans();
    }

    static createPlan(
        data: Prisma.PlanMantenimientoCreateInput,
    ): Promise<ActionResult> {
        return MaintenancePlanService.createPlan(data);
    }
}
