"use server";

import { withAuth } from "@/lib/safe-action";
import { FinanceService } from "@/services/finance.service";
import { ActionResult, ReporteCartera, ReporteFinanciero, AuditLogWithActor } from "@/types";
import { serializeDecimal } from "@/lib/utils";

/**
 * Obtiene el reporte P&G para un rango de fechas.
 */
export const getFinancialStatement = withAuth<ReporteFinanciero>(
    ["ADMIN"],
    async (dataInput: unknown): Promise<ActionResult<ReporteFinanciero>> => {
        const { startDate, endDate } = dataInput as {
            startDate: string;
            endDate: string;
        };
        const start = new Date(startDate);
        const end = new Date(endDate);

        return serializeDecimal(
            await FinanceService.getFinancialStatement(start, end),
        ) as ActionResult<ReporteFinanciero>;
    },
    "getFinancialStatement",
);

/**
 * Obtiene el reporte de Cartera (Morosidad)
 */
export const getPortfolioReport = withAuth<ReporteCartera>(
    ["ADMIN"],
    async (): Promise<ActionResult<ReporteCartera>> => {
        return serializeDecimal(await FinanceService.getPortfolioReport()) as ActionResult<ReporteCartera>;
    },
    "getPortfolioReport",
);

/**
 * Obtiene la proyección de flujo de caja.
 */
export const getCashFlowProjection = withAuth<unknown>(
    ["ADMIN"],
    async (): Promise<ActionResult<unknown>> => {
        return serializeDecimal(await FinanceService.getCashFlowProjection());
    },
    "getCashFlowProjection",
);

/**
 * Obtiene los logs de auditoría contable.
 */
export const getAuditLogs = withAuth<AuditLogWithActor[]>(
    ["ADMIN"],
    async (): Promise<ActionResult<AuditLogWithActor[]>> => {
        return serializeDecimal(await FinanceService.getAuditLogs()) as ActionResult<AuditLogWithActor[]>;
    },
    "getAuditLogs",
);
