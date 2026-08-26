import { VehicleQueryService } from "./vehicle/vehicle-query.service";
import { VehicleMutationService } from "./vehicle/vehicle-mutation.service";
import { Prisma, Vehiculo } from "@prisma/client";
import { ActionResult, VehiculoWithRelations } from "@/types";
import { VehiculoCreate, VehiculoUpdate } from "@/lib/validations";
import { PaginationParams, PaginatedResponse } from "@/types/pagination";

/**
 * @deprecated Use specific services in src/services/vehicle/ instead.
 */
export class VehicleService {
    static async getById(
        id: string,
    ): Promise<ActionResult<unknown>> {
        return VehicleQueryService.getById(id);
    }

    static async getAll(
        params: PaginationParams & { where?: Prisma.VehiculoWhereInput } = {},
    ): Promise<ActionResult<unknown>> {
        return VehicleQueryService.getAll(params);
    }

    static async search(
        query: string,
        limit = 20,
    ): Promise<ActionResult<unknown>> {
        return VehicleQueryService.search(query, limit);
    }

    static async create(data: VehiculoCreate): Promise<ActionResult<unknown>> {
        return VehicleMutationService.create(data);
    }

    static async update(
        id: string,
        data: VehiculoUpdate,
    ): Promise<ActionResult<unknown>> {
        return VehicleMutationService.update(id, data);
    }

    static async delete(id: string): Promise<ActionResult> {
        return VehicleMutationService.delete(id);
    }
}
