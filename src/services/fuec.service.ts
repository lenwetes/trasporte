import {
    FuecGeneratorService,
    FuecGenerationData,
} from "./fuec/fuec-generator.service";
import { FuecQueryService } from "./fuec/fuec-query.service";
import { FuecResourceService } from "./fuec/fuec-resource.service";
import { ActionResult } from "@/types";
import { PlanillaFUEC, EstadoFUEC, Prisma } from "@prisma/client";
import { PaginationParams, PaginatedResponse } from "@/types/pagination";
import { z } from "zod";
import { ClientCreateSchema } from "@/lib/validations/fuec";

/**
 * @deprecated Use specific services in src/services/fuec/ instead.
 */
export class FuecService {
    static async generate(
        data: FuecGenerationData,
    ): Promise<ActionResult<Prisma.PlanillaFUECGetPayload<{ include: { vehiculo: true, conductor1: true, conductor2: true, conductor3: true, contrato: true, resolucion: true } }>>> {return FuecGeneratorService.generate(data);
    }

    static async list(
        filters: {
            vehiculoId?: string;
            conductor1Id?: string;
            contratoId?: string;
            estado?: EstadoFUEC;
        } & PaginationParams = {},
    ): Promise<
        ActionResult<
            PaginatedResponse<
                Prisma.PlanillaFUECGetPayload<{
                    include: {
                        vehiculo: true;
                        conductor1: true;
                        conductor2: true;
                        conductor3: true;
                        contrato: true;
                        resolucion: true;
                    };
                }>
            >
        >
    > {
        return FuecQueryService.list(filters);
    }

    static async invalidate(id: string, motivo: string, currentVersion?: number): Promise<ActionResult> {
        return FuecGeneratorService.invalidate(id, motivo, currentVersion);
    }

    static async getVehiculoConductor(
        vehiculoId: string,
    ): Promise<ActionResult> {
        return FuecQueryService.getVehiculoConductor(vehiculoId);
    }

    static async searchConductores(
        query: string,
        limit = 5,
    ): Promise<ActionResult> {
        return FuecQueryService.searchConductores(query, limit);
    }

    static async getResoluciones(): Promise<ActionResult> {
        return FuecResourceService.getResoluciones();
    }

    static async updateResolucionConsecutivo(
        id: string,
        actual: number,
    ): Promise<ActionResult> {
        return FuecResourceService.updateResolucionConsecutivo(id, actual);
    }

    static async createResolucion(
        data: Prisma.ResolucionFUECCreateInput,
    ): Promise<ActionResult> {
        return FuecResourceService.createResolucion(data);
    }

    static async createContrato(
        data: Prisma.ContratoEmpresaCreateInput,
    ): Promise<ActionResult> {
        return FuecResourceService.createContrato(data);
    }

    static async updateContrato(
        id: string,
        data: Prisma.ContratoEmpresaUpdateInput,
    ): Promise<ActionResult> {
        return FuecResourceService.updateContrato(id, data);
    }

    static async deleteContrato(id: string): Promise<ActionResult> {
        return FuecResourceService.deleteContrato(id);
    }

    static async createClient(
        data: z.infer<typeof ClientCreateSchema>,
    ): Promise<ActionResult> {
        return FuecResourceService.createClient(data);
    }

    static async getValidationDetails(fuecId: string): Promise<ActionResult> {
        return FuecQueryService.getValidationDetails(fuecId);
    }

    static async getClientesFrecuentes(): Promise<ActionResult> {
        return FuecResourceService.getClientesFrecuentes();
    }

    static async createClienteFrecuente(data: { nombre: string; nit?: string }): Promise<ActionResult> {
        return FuecResourceService.createClienteFrecuente(data);
    }

    static async getResponsablesFrecuentes(): Promise<ActionResult> {
        return FuecResourceService.getResponsablesFrecuentes();
    }

    static async createResponsableFrecuente(data: { nombre: string; cedula?: string; telefono?: string; direccion?: string; }): Promise<ActionResult> {
        return FuecResourceService.createResponsableFrecuente(data);
    }
}
