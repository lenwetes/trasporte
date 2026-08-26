import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import { CacheService } from "@/lib/cache";
import {
    CuentaContable,
    NaturalezaCuenta,
    TipoCuenta,
    Prisma,
} from "@prisma/client";

type Decimal = Prisma.Decimal;

export interface CuentaConHijos extends CuentaContable {
    hijos: CuentaConHijos[];
    balance?: AccountBalance;
}

export interface AccountBalance {
    accountId: string;
    codigo: string;
    nombre: string;
    debitos: Decimal;
    creditos: Decimal;
    saldo: Decimal;
    naturaleza: NaturalezaCuenta;
}

export interface MovementValidation {
    isValid: boolean;
    reason?: string;
    currentBalance: Decimal;
    newBalance: Decimal;
}

export class FinanceAccountsService {
    /**
     * Obtiene el listado del Plan de Cuentas (PUC).
     */
    static async getPlanCuentas(): Promise<ActionResult<unknown>> {
        return await CacheService.remember("finance:puc", 3600, async () => {
            try {
                const cuentas = await prisma.cuentaContable.findMany({
                    where: { activa: true },
                    orderBy: { codigo: "asc" },
                });
                return { success: true, data: cuentas };
            } catch (error) {
                logger.error(
                    { error },
                    "FinanceAccountsService.getPlanCuentas error",
                );
                return {
                    success: false,
                    error: "Error al cargar plan de cuentas",
                };
            }
        });
    }

    /**
     * Calcula el balance de una cuenta a una fecha específica.
     */
    static async getAccountBalanceAtDate(accountId: string, fecha: Date): Promise<AccountBalance> {
        type CuentaWithAsientos = Prisma.CuentaContableGetPayload<{
            include: { 
                asientos: { 
                    select: { debito: true, credito: true } 
                } 
            }
        }>;

        const whereInput = {
            transaccion: {
                fechaOperacion: { lte: fecha }
            }
        } as unknown as Prisma.AsientoContableWhereInput;

        const cuentaRaw = await prisma.cuentaContable.findUnique({
            where: { id: accountId },
            include: { 
                asientos: { 
                    where: whereInput,
                    select: { debito: true, credito: true } 
                } 
            },
        });

        if (!cuentaRaw) throw new Error(`Cuenta ${accountId} no encontrada`);

        // Forzamos el tipo con unknown -> CuentaWithAsientos para evitar el error del IDE
        const cuenta = cuentaRaw as unknown as CuentaWithAsientos;

        const debitos = cuenta.asientos.reduce(
            (sum: Prisma.Decimal, a) => sum.add(a.debito),
            new Prisma.Decimal(0),
        );
        const creditos = cuenta.asientos.reduce(
            (sum: Prisma.Decimal, a) => sum.add(a.credito),
            new Prisma.Decimal(0),
        );

        let saldo: Decimal;
        if (cuenta.naturaleza === NaturalezaCuenta.DEBITO) {
            saldo = debitos.sub(creditos);
        } else {
            saldo = creditos.sub(debitos);
        }

        return {
            accountId: cuenta.id,
            codigo: cuenta.codigo,
            nombre: cuenta.nombre,
            debitos,
            creditos,
            saldo,
            naturaleza: cuenta.naturaleza,
        };
    }

    /**
     * Obtiene el árbol completo de cuentas contables con sus balances.
     */
    static async getAccountTree(fecha: Date = new Date()): Promise<CuentaConHijos[]> {
        // Cache the default "now" tree
        const isCurrent = Math.abs(fecha.getTime() - new Date().getTime()) < 60000;
        
        if (isCurrent) {
            return await CacheService.remember("finance:puc:tree", 1800, async () => {
                const cuentasRaiz = await prisma.cuentaContable.findMany({
                    where: { padreId: null, activa: true },
                    orderBy: { codigo: "asc" },
                });

                return (await Promise.all(
                    cuentasRaiz.map((cuenta) => this.loadChildren(cuenta, fecha)),
                )) as CuentaConHijos[];
            });
        }

        const cuentasRaiz = await prisma.cuentaContable.findMany({
            where: { padreId: null, activa: true },
            orderBy: { codigo: "asc" },
        });

        return (await Promise.all(
            cuentasRaiz.map((cuenta) => this.loadChildren(cuenta, fecha)),
        )) as CuentaConHijos[];
    }

    private static async loadChildren(
        cuenta: CuentaContable,
        fecha: Date
    ): Promise<CuentaConHijos> {
        const [hijos, balance] = await Promise.all([
            prisma.cuentaContable.findMany({
                where: { padreId: cuenta.id, activa: true },
                orderBy: { codigo: "asc" },
            }),
            this.getAccountBalanceAtDate(cuenta.id, fecha)
        ]);

        const hijosConDescendientes = await Promise.all(
            hijos.map((hijo) => this.loadChildren(hijo, fecha)),
        );

        return { 
            ...cuenta, 
            balance,
            hijos: hijosConDescendientes as CuentaConHijos[]
        };
    }

    /**
     * Obtiene cuentas por tipo.
     */
    static async getAccountsByType(
        tipo: TipoCuenta,
    ): Promise<CuentaContable[]> {
        return prisma.cuentaContable.findMany({
            where: { tipo, activa: true, permiteMovimiento: true },
            orderBy: { codigo: "asc" },
        });
    }

    /**
     * Busca cuentas por código o nombre.
     */
    static async searchAccounts(
        query: string,
        limit = 20,
    ): Promise<CuentaContable[]> {
        return prisma.cuentaContable.findMany({
            where: {
                activa: true,
                permiteMovimiento: true,
                OR: [
                    { codigo: { contains: query, mode: "insensitive" } },
                    { nombre: { contains: query, mode: "insensitive" } },
                ],
            },
            take: limit,
            orderBy: { codigo: "asc" },
        });
    }

    /**
     * Obtiene una cuenta por código.
     */
    static async getAccountByCode(
        codigo: string,
    ): Promise<CuentaContable | null> {
        return prisma.cuentaContable.findUnique({ where: { codigo } });
    }

    /**
     * Obtiene cuentas auxiliares (nivel 6) para movimientos.
     */
    static async getAuxiliaryAccounts(): Promise<CuentaContable[]> {
        return prisma.cuentaContable.findMany({
            where: { nivel: 6, activa: true, permiteMovimiento: true },
            orderBy: { codigo: "asc" },
        });
    }

    /**
     * Valida si un movimiento es permitido en una cuenta (ej. no dejar saldo negativo en Activo si la política lo exige).
     */
    static async validateAccountMovement(
        accountId: string,
        amount: Prisma.Decimal,
        isDebit: boolean,
    ): Promise<MovementValidation> {
        const balance = await this.getAccountBalanceAtDate(accountId, new Date());
        
        let newBalanceValue: Decimal;
        if (balance.naturaleza === NaturalezaCuenta.DEBITO) {
            newBalanceValue = isDebit ? balance.saldo.add(amount) : balance.saldo.sub(amount);
        } else {
            newBalanceValue = isDebit ? balance.saldo.sub(amount) : balance.saldo.add(amount);
        }

        // Por ahora permitimos todo, pero dejamos la infraestructura lista
        return {
            isValid: true,
            currentBalance: balance.saldo,
            newBalance: newBalanceValue
        };
    }

    /**
     * Shorthand para obtener el balance actual.
     */
    static async getAccountBalance(accountId: string): Promise<AccountBalance> {
        return this.getAccountBalanceAtDate(accountId, new Date());
    }

    // Alias para compatibilidad
    static async getPlanDeCuentas(): Promise<ActionResult> {
        return this.getPlanCuentas();
    }
}
