import {
    FinanceAccountsService,
    CuentaConHijos,
    MovementValidation,
    AccountBalance,
} from "@/services/finance/finance-accounts.service";
import { CuentaContable, TipoCuenta, Prisma } from "@prisma/client";

/**
 * @deprecated Use FinanceAccountsService in src/services/finance/ instead.
 */
export class AccountService {
    static async getAccountTree(): Promise<CuentaConHijos[]> {
        return FinanceAccountsService.getAccountTree();
    }

    static async getAccountsByType(
        tipo: TipoCuenta,
    ): Promise<CuentaContable[]> {
        return FinanceAccountsService.getAccountsByType(tipo);
    }

    static async searchAccounts(
        query: string,
        limit = 20,
    ): Promise<CuentaContable[]> {
        return FinanceAccountsService.searchAccounts(query, limit);
    }

    static async getAccountBalance(accountId: string): Promise<AccountBalance> {
        return FinanceAccountsService.getAccountBalance(accountId);
    }

    static async validateAccountMovement(
        accountId: string,
        amount: Prisma.Decimal,
        isDebit: boolean,
    ): Promise<MovementValidation> {
        return FinanceAccountsService.validateAccountMovement(
            accountId,
            amount,
            isDebit,
        );
    }

    static async getAccountByCode(
        codigo: string,
    ): Promise<CuentaContable | null> {
        return FinanceAccountsService.getAccountByCode(codigo);
    }

    static async getAuxiliaryAccounts(): Promise<CuentaContable[]> {
        return FinanceAccountsService.getAuxiliaryAccounts();
    }
}
