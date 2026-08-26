/**
 * Módulo Financiero - Actions
 *
 * Este archivo re-exporta todas las acciones financieras desde sus módulos especializados.
 * Organización:
 * - transactions.actions.ts: Transacciones y cuentas contables
 * - payments.actions.ts: Pagos y obligaciones
 * - stats.actions.ts: Estadísticas y reportes
 * - charges.actions.ts: Generación de cuotas
 */

// Transacciones
export {
    createTransactionAction,
    getAccountBalanceAction,
    getPlanCuentasAction,
    getTransactionsAction,
} from "./transactions.actions";

// Pagos y Obligaciones
export {
    registerPaymentAction,
    checkUserFinancialStatusAction,
    getPendingObligationsAction,
    getUserPendingObligationsAction,
} from "./payments.actions";

// Estadísticas y Reportes
export {
    getFinancialStatsAction,
    getCarteraResumenAction,
    getFlujoCajaAction,
} from "./stats.actions";

// Generación de Cuotas
export { generateMonthlyFeesAction } from "./charges.actions";

// Gastos e Egresos
export {
    registerExpenseAction,
    getExpenseSummaryAction,
} from "./expenses.actions";

// Configuración Global
export {
    getFinanceConfigAction,
    updateFinanceConfigAction,
} from "./config.actions";

// Préstamos
export { createPrestamo, getLoansAction } from "./loans.actions";
