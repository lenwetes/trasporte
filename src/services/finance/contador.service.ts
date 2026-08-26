import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import { NaturalezaCuenta } from "@prisma/client";
import { Decimal } from "decimal.js";

export interface TrialBalanceItem {
    id: string;
    codigo: string;
    nombre: string;
    nivel: number;
    saldoAnterior: number;
    debito: number;
    credito: number;
    nuevoSaldo: number;
    esAuxiliar: boolean;
    naturaleza: NaturalezaCuenta;
}

interface InternalTrialBalanceItem extends TrialBalanceItem {
    debitoAnt: number;
    creditoAnt: number;
}

export class ContadorService {
    /**
     * Genera un Balance de Prueba detallado con N niveles de profundidad.
     * @param startDate Fecha Inicio (opcional, para movimientos)
     * @param endDate Fecha Fin (opcional, para movimientos)
     * @param maxLevel Nivel máximo de profundidad a mostrar (1-6)
     */
    static async getTrialBalance(
        startDate: Date,
        endDate: Date,
        maxLevel: number = 6
    ): Promise<ActionResult<TrialBalanceItem[]>> {
        try {
            // 1. Obtener todas las cuentas hasta el nivel máximo
            const cuentas = await prisma.cuentaContable.findMany({
                where: {
                    nivel: { lte: maxLevel },
                    activa: true,
                },
                orderBy: { codigo: "asc" },
            });

            // 2. Obtener movimientos en el rango de fechas
            const movimientosRango = await prisma.asientoContable.findMany({
                where: {
                    transaccion: {
                        fecha: { gte: startDate, lte: endDate },
                    },
                },
                select: {
                    cuentaId: true,
                    debito: true,
                    credito: true,
                },
            });

            // 3. Obtener movimientos anteriores al rango (para saldo inicial)
            const movimientosAnteriores = await prisma.asientoContable.findMany({
                where: {
                    transaccion: {
                        fecha: { lt: startDate },
                    },
                },
                select: {
                    cuentaId: true,
                    debito: true,
                    credito: true,
                },
            });

            // 4. Mapear movimientos a las cuentas base
            const balancesMap = new Map<
                string,
                { debito: number; credito: number; debitoAnt: number; creditoAnt: number }
            >();

            // Inicializar mapa
            for (const c of cuentas) {
                balancesMap.set(c.id, { debito: 0, credito: 0, debitoAnt: 0, creditoAnt: 0 });
            }

            // Sumar movimientos en rango
            for (const m of movimientosRango) {
                const row = balancesMap.get(m.cuentaId);
                if (row) {
                    row.debito += Number(m.debito);
                    row.credito += Number(m.credito);
                }
            }

            // Sumar movimientos anteriores
            for (const m of movimientosAnteriores) {
                const row = balancesMap.get(m.cuentaId);
                if (row) {
                    row.debitoAnt += Number(m.debito);
                    row.creditoAnt += Number(m.credito);
                }
            }

            // 5. Propagar totales de hijos a padres (de abajo hacia arriba)
            const resultItems: InternalTrialBalanceItem[] = cuentas.map((c) => {
                const bal = balancesMap.get(c.id)!;
                return {
                    id: c.id,
                    codigo: c.codigo,
                    nombre: c.nombre,
                    nivel: c.nivel,
                    saldoAnterior: 0,
                    debito: bal.debito,
                    credito: bal.credito,
                    nuevoSaldo: 0,
                    esAuxiliar: c.permiteMovimiento,
                    naturaleza: c.naturaleza,
                    debitoAnt: bal.debitoAnt,
                    creditoAnt: bal.creditoAnt,
                };
            });

            // Propagación jerárquica
            const sortedByLevelDesc = [...resultItems].sort((a, b) => b.nivel - a.nivel);

            for (const item of sortedByLevelDesc) {
                if (item.nivel > 1) {
                    const padreCodigo = this.getParentCode(item.codigo);
                    if (padreCodigo) {
                        const padre = resultItems.find((p) => p.codigo === padreCodigo);
                        if (padre) {
                            padre.debito += item.debito;
                            padre.credito += item.credito;
                            padre.debitoAnt += item.debitoAnt;
                            padre.creditoAnt += item.creditoAnt;
                        }
                    }
                }
            }

            // 6. Calcular saldos finales ajustados por naturaleza y remover campos internos
            const finalResult: TrialBalanceItem[] = resultItems.map((item) => {
                const isDebito = item.naturaleza === NaturalezaCuenta.DEBITO;

                // Saldo Anterior
                const saldoAnterior = isDebito
                    ? item.debitoAnt - item.creditoAnt
                    : item.creditoAnt - item.debitoAnt;

                // Nuevo Saldo
                const movNeto = isDebito ? item.debito - item.credito : item.credito - item.debito;
                const nuevoSaldo = saldoAnterior + movNeto;

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { debitoAnt, creditoAnt, ...rest } = item;
                return {
                    ...rest,
                    saldoAnterior,
                    nuevoSaldo,
                };
            });

            return { success: true, data: finalResult };
        } catch (error) {
            logger.error({ error }, "Error en generation de Balance de Prueba");
            return {
                success: false,
                error: (error as Error).message || "Fallo interno al generar balance",
            };
        }
    }

    private static getParentCode(codigo: string): string | null {
        if (codigo.length <= 1) return null;
        if (codigo.length === 2) return codigo.substring(0, 1);
        if (codigo.length === 4) return codigo.substring(0, 2);
        if (codigo.length === 6) return codigo.substring(0, 4);
        if (codigo.length >= 8) return codigo.substring(0, 6);
        return null;
    }
}
