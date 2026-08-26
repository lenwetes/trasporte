import {
    FinanceTransactionService,
    TransactionCreateData,
} from "./finance/finance-transaction.service";
import { FinanceReportingService } from "./finance/finance-reporting.service";
import { FinanceAccountsService } from "./finance/finance-accounts.service";
import { FinanceObligationsService } from "./finance/finance-obligations.service";
import {
    FinanceConceptQueryService,
    ConceptoConCuenta,
} from "./finance/finance-concept-query.service";
import {
    FinanceConceptMutationService,
    CreateConceptInput,
    UpdateConceptInput,
} from "./finance/finance-concept-mutation.service";
import {
    ActionResult,
    TransaccionWithRelations,
    ReporteFinanciero,
    ReporteCartera,
} from "@/types";
import { PaginatedResponse, PaginationParams } from "@/types/pagination";
import { TipoTransaccion, CuentaContable } from "@prisma/client";

/**
 * @deprecated Use specific services in src/services/finance/ instead.
 */
export class FinanceService {
    // Transactions
    static createTransaction(
        data: TransactionCreateData,
    ): Promise<ActionResult<TransaccionWithRelations>> {
        return FinanceTransactionService.createTransaction(data);
    }

    static getTransactions(
        params: {
            type?: TipoTransaccion;
            search?: string;
        } & PaginationParams,
    ): Promise<ActionResult<PaginatedResponse<TransaccionWithRelations>>> {
        return FinanceTransactionService.getTransactions(params);
    }

    // Reporting
    static getAccountBalance(cuentaId: string): Promise<ActionResult<unknown>> {
        return FinanceReportingService.getAccountBalance(cuentaId);
    }

    static getAccountBalanceByCode(codigo: string): Promise<ActionResult<unknown>> {
        return FinanceReportingService.getAccountBalanceByCode(codigo);
    }

    static getFinancialStatement(
        startDate: Date,
        endDate: Date,
    ): Promise<ActionResult<unknown>> {
        return FinanceReportingService.getFinancialStatement(
            startDate,
            endDate,
        );
    }

    static getPortfolioReport(): Promise<ActionResult<unknown>> {
        return FinanceReportingService.getPortfolioReport();
    }

    static getCashFlowProjection(): Promise<ActionResult<unknown>> {
        return FinanceReportingService.getCashFlowProjection();
    }

    static getAuditLogs(): Promise<ActionResult<unknown>> {
        return FinanceReportingService.getAuditLogs();
    }

    // Accounts
    static getPlanCuentas(): Promise<ActionResult<unknown>> {
        return FinanceAccountsService.getPlanCuentas();
    }

    static getPlanDeCuentas(): Promise<ActionResult<unknown>> {
        return FinanceAccountsService.getPlanDeCuentas();
    }

    static getAccountTree(fecha?: Date): Promise<import("./finance/finance-accounts.service").CuentaConHijos[]> {
        return FinanceAccountsService.getAccountTree(fecha) as Promise<import("./finance/finance-accounts.service").CuentaConHijos[]>;
    }

    // Obligations
    static generateMonthlyObligations(
        periodo: Date,
    ): Promise<ActionResult<{ generados: number; errores: string[] }>> {
        return FinanceObligationsService.generateMonthlyObligations(periodo);
    }

    // Concepts
    static getConcepts(): Promise<ConceptoConCuenta[]> {
        return FinanceConceptQueryService.getAllConcepts();
    }

    static getConceptsByType(
        tipo: TipoTransaccion,
    ): Promise<ConceptoConCuenta[]> {
        return FinanceConceptQueryService.getConceptsByType(tipo);
    }

    static createConcept(
        input: CreateConceptInput,
    ): Promise<import("@prisma/client").ConceptoFinanciero> {
        return FinanceConceptMutationService.createConcept(input);
    }

    static updateConcept(
        id: string,
        input: UpdateConceptInput,
    ): Promise<import("@prisma/client").ConceptoFinanciero> {
        return FinanceConceptMutationService.updateConcept(id, input);
    }
}
