import {
    FinanceConceptQueryService,
    ConceptoConCuenta,
} from "./finance/finance-concept-query.service";
import {
    FinanceConceptMutationService,
    CreateConceptInput,
    UpdateConceptInput,
} from "./finance/finance-concept-mutation.service";
import { ConceptoFinanciero, TipoTransaccion } from "@prisma/client";

/**
 * @deprecated Use specific services in src/services/finance/ instead.
 */
export class ConceptService {
    static async getAllConcepts(): Promise<ConceptoConCuenta[]> {
        return FinanceConceptQueryService.getAllConcepts();
    }

    static async getConceptsByType(
        tipo: TipoTransaccion,
    ): Promise<ConceptoConCuenta[]> {
        return FinanceConceptQueryService.getConceptsByType(tipo);
    }

    static async searchConcepts(
        query: string,
        tipo?: TipoTransaccion,
        limit = 20,
    ): Promise<ConceptoConCuenta[]> {
        return FinanceConceptQueryService.searchConcepts(query, tipo, limit);
    }

    static async getConceptById(id: string): Promise<ConceptoConCuenta | null> {
        return FinanceConceptQueryService.getConceptById(id);
    }

    static async createConcept(
        input: CreateConceptInput,
    ): Promise<ConceptoFinanciero> {
        return FinanceConceptMutationService.createConcept(input);
    }

    static async updateConcept(
        id: string,
        input: UpdateConceptInput,
    ): Promise<ConceptoFinanciero> {
        return FinanceConceptMutationService.updateConcept(id, input);
    }

    static async deactivateConcept(id: string): Promise<ConceptoFinanciero> {
        return FinanceConceptMutationService.deactivateConcept(id);
    }

    static async activateConcept(id: string): Promise<ConceptoFinanciero> {
        return FinanceConceptMutationService.activateConcept(id);
    }
}
