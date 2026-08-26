"use server";

import { withAuth } from "@/lib/safe-action";
import { FinanceLoansService } from "@/services/finance/finance-loans.service";
import { ActionResult } from "@/types";
import { serializeDecimal } from "@/lib/utils";
// @ts-ignore
import { TipoCredito, MetodoPago } from "@prisma/client";
import { auth } from "@/auth";

/**
 * Solicita un nuevo préstamo (ADMIN/SECRETARIA/CONDUCTOR)
 */
export const requestLoan = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (input: {
        usuarioId: string;
        monto: number;
        tasa: number;
        cuotas: number;
        tipo: string;
        observaciones?: string;
    }): Promise<ActionResult> => {
        return serializeDecimal(
            await FinanceLoansService.requestLoan({
                usuarioId: input.usuarioId,
                monto: input.monto,
                tasa: input.tasa,
                cuotas: input.cuotas,
                tipo: input.tipo as TipoCredito,
                observaciones: input.observaciones
            })
        );
    },
    "requestLoan"
);

/**
 * Aprueba y desembolsa un préstamo (Solo ADMIN)
 */
export const disburseLoan = withAuth(
    ["ADMIN"],
    async (loanId: string): Promise<ActionResult> => {
        const session = await auth();
        return serializeDecimal(
            await FinanceLoansService.disburseLoan(loanId, session?.user?.id!)
        );
    },
    "disburseLoan"
);

/**
 * Obtiene el dashboard consolidado de préstamos
 */
export const getLoanDashboard = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (): Promise<ActionResult> => {
        try {
            const data = await FinanceLoansService.getLoanDashboard();
            // Serialización nativa a prueba de fallos para evitar que Server Actions bloquee objetos complejos o Decimales de Prisma
            const stringified = JSON.stringify(data, (key, value) => {
                if (typeof value === 'bigint') return value.toString();
                if (value !== null && typeof value === 'object' && value.constructor?.name === 'Decimal') return Number(value);
                 // Si Decimal.js tiene propiedades internas, las convertimos a número
                if (value !== null && typeof value === 'object' && 'd' in value && 'e' in value && 's' in value) return Number(value);
                return value;
            });
            const safeData = JSON.parse(stringified);
            return { success: true, data: safeData };
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            const errorStack = e instanceof Error ? e.stack : undefined;
            console.error("====== DEBUG FATAL: getLoanDashboard ======\n", errorMessage, errorStack, "\n=============================================");
            throw e; 
        }
    },
    "getLoanDashboard"
);

/**
 * Simula una tabla de amortización para un crédito hipotético
 */
export const simulateAmortization = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (input: { monto: number; tasa: number; cuotas: number; isDiario?: boolean }): Promise<ActionResult> => {
        const plan = await FinanceLoansService.calculateAmortization(
            input.monto,
            input.tasa,
            input.cuotas,
            input.isDiario
        );
        return { success: true, data: plan };
    },
    "simulateAmortization"
);

/**
 * Traslada fondos de Caja Menor a Fondo Préstamos
 */
export const reloadLoanFund = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (monto: number): Promise<ActionResult> => {
        const session = await auth();
        return serializeDecimal(await FinanceLoansService.transferFunds(monto, session?.user?.id || "SISTEMA"));
    },
    "reloadLoanFund"
);

/**
 * Crea un colaborador detallado (Tercero Externo para Cartera)
 */
export const createQuickColaborador = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (input: { 
        nombres: string; 
        apellidos: string; 
        documento: string;
        email: string;
        telefono: string;
        direccion: string;
    }): Promise<ActionResult> => {
        return serializeDecimal(await FinanceLoansService.createColaborador(input));
    },
    "createQuickColaborador"
);

/**
 * Obtiene el detalle de un préstamo específico
 */
export const getLoanDetail = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (loanId: string): Promise<ActionResult> => {
        return serializeDecimal(await FinanceLoansService.getLoanById(loanId));
    },
    "getLoanDetail"
);

/**
 * Registra el recaudo de una cuota con amortización dinámica
 */
export const payLoanInstallment = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (input: { 
        cuotaId: string; 
        monto: number; 
        metodoPago?: string; 
        soporteUrl?: string; 
        soporteId?: string;
    }): Promise<ActionResult> => {
        const session = await auth();
        return serializeDecimal(
            await FinanceLoansService.payInstallment({
                cuotaId: input.cuotaId, 
                montoRecibido: input.monto, 
                actorId: session?.user?.id || "SISTEMA",
                metodoPago: input.metodoPago as MetodoPago | undefined,
                soporteUrl: input.soporteUrl,
                soporteId: input.soporteId
            })
        );
    },
    "payLoanInstallment"
);

/**
 * Radica el contrato firmado para habilitar desembolso
 */
export const radicateLoanDocument = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (input: { loanId: string; url: string }): Promise<ActionResult> => {
        return serializeDecimal(
            await FinanceLoansService.radicateDocument(input.loanId, input.url)
        );
    },
    "radicateLoanDocument"
);

/**
 * Liquida totalmente un préstamo con interés a prorrata
 */
export const liquidateFullLoan = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (input: { 
        loanId: string;
        metodoPago?: string;
        soporteUrl?: string;
        soporteId?: string;
    }): Promise<ActionResult> => {
        const session = await auth();
        return serializeDecimal(
            await FinanceLoansService.liquidateLoan({
                prestamoId: input.loanId, 
                actorId: session?.user?.id || "SISTEMA",
                metodoPago: input.metodoPago as MetodoPago | undefined,
                soporteUrl: input.soporteUrl,
                soporteId: input.soporteId
            })
        );
    },
    "liquidateFullLoan"
);
