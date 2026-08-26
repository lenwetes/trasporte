import { prisma } from "@/lib/prisma";
import { ActionResult, TransaccionWithRelations } from "@/types";
import logger from "@/lib/logger";
import { FinanceTransactionService } from "./finance/finance-transaction.service";
import { TipoTransaccion, NaturalezaCuenta, TipoCuenta, Prisma, MetodoPago } from "@prisma/client";

export class ExpenseService {
    /**
     * Registra un gasto (Egreso).
     * Delegamos la lógica de selección de cuenta (Caja/Bancos) a createVoucher.
     */
    static async registerExpense(data: {
        descripcion: string;
        monto: number;
        categoria: "PERSONAL" | "SERVICIOS" | "MANTENIMIENTO" | "DIVERSOS";
        metodoPago: MetodoPago;
        creadoPorId: string;
        terceroId?: string;
        soporteUrl?: string;
        fecha?: Date;
    }): Promise<ActionResult<TransaccionWithRelations>> {
        try {
            // 1. Determinar cuenta de Gasto según categoría
            let codigoGasto = "";
            let nombreGasto = "";

            switch (data.categoria) {
                case "PERSONAL":
                    codigoGasto = "5105";
                    nombreGasto = "Gastos de Personal";
                    break;
                case "SERVICIOS":
                    codigoGasto = "5135";
                    nombreGasto = "Servicios";
                    break;
                case "MANTENIMIENTO":
                    codigoGasto = "5145";
                    nombreGasto = "Mantenimiento y Reparaciones";
                    break;
                case "DIVERSOS":
                default:
                    codigoGasto = "5195";
                    nombreGasto = "Gastos Diversos";
                    break;
            }

            let cuentaGasto = await prisma.cuentaContable.findUnique({
                where: { codigo: codigoGasto },
            });

            if (!cuentaGasto) {
                cuentaGasto = await prisma.cuentaContable.create({
                    data: {
                        codigo: codigoGasto,
                        nombre: nombreGasto,
                        naturaleza: NaturalezaCuenta.DEBITO,
                        tipo: TipoCuenta.GASTO,
                        permiteMovimiento: true,
                    },
                });
            }

            // 2. Usar el nuevo motor unificado de comprobantes
            const result = await FinanceTransactionService.createVoucher({
                monto: data.monto,
                concepto: data.descripcion,
                tipo: "EGRESO",
                metodoPago: data.metodoPago, 
                creadoPorId: data.creadoPorId,
                terceroId: data.terceroId,
                fecha: data.fecha,
                cuentaContrapartidaId: cuentaGasto.id
            });

            return result;

        } catch (error) {
            logger.error({ error, data }, "Error al registrar gasto v3");
            return {
                success: false,
                error: "Error interno al procesar el egreso financiero",
            };
        }
    }

    /**
     * Obtiene el total de gastos del mes actual por categoría
     */
    static async getMonthlyExpensesBreakdown(): Promise<ActionResult<{
        breakdown: Record<string, number>;
        total: number;
        period: { start: Date; end: Date };
    }>> {
        try {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                0,
            );

            // Buscar transacciones de tipo EGRESO en el rango
            const egresos = await prisma.transaccion.findMany({
                where: {
                    tipo: TipoTransaccion.EGRESO,
                    fecha: {
                        gte: startOfMonth,
                        lte: endOfMonth,
                    },
                }, 
                include: {
                    asientos: {
                        include: {
                            cuenta: true,
                        },
                    },
                },
            });

            // Agrupar por cuenta de gasto (las que tienen débito > 0 en transacciones de egreso)
            const breakdown: Record<string, number> = {};
            let totalGeneral = 0;

            type TransaccionWithAsientos = Prisma.TransaccionGetPayload<{
                include: { asientos: { include: { cuenta: true } } }
            }>;

            (egresos as unknown as TransaccionWithAsientos[]).forEach((tx) => {
                tx.asientos.forEach((asiento) => {
                    // Si es cuenta de gasto (empezando por 5) y tiene débito
                    if (
                        asiento.cuenta.codigo.startsWith("5") &&
                        Number(asiento.debito) > 0
                    ) {
                        const categoria = asiento.cuenta.nombre;
                        const monto = Number(asiento.debito);

                        breakdown[categoria] =
                            (breakdown[categoria] || 0) + monto;
                        totalGeneral += monto;
                    }
                });
            });

            return {
                success: true,
                data: {
                    breakdown,
                    total: totalGeneral,
                    period: { start: startOfMonth, end: endOfMonth },
                },
            };
        } catch (error) {
            logger.error({ error }, "Error al obtener desglose de gastos");
            return {
                success: false,
                error: "Error al calcular gastos mensuales",
            };
        }
    }
}
