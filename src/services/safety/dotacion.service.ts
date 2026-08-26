import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import { EntregaDotacionCreate } from "@/lib/validations/safety";
import { TipoTransaccion, Prisma } from "@prisma/client";
import { FinanceTransactionService } from "../finance/finance-transaction.service";

export class DotacionService {
    static async create(data: EntregaDotacionCreate): Promise<ActionResult> {
        try {
            return await prisma.$transaction(async (tx) => {
                let transaccionId: string | undefined = undefined;

                if (data.valorTotal && data.valorTotal > 0) {
                    const cuentaGasto = await tx.cuentaContable.findFirst({
                        where: { OR: [{ codigo: "5105" }, { codigo: { startsWith: "51" } }] }
                    });
                    const cuentaCaja = await tx.cuentaContable.findUnique({
                        where: { codigo: "110505" }
                    });

                    if (cuentaGasto?.id && cuentaCaja?.id) {
                        const tr = await tx.transaccion.create({
                            data: {
                                descripcion: `EGRESO POR DOTACIÓN CONDUCTOR`,
                                tipo: TipoTransaccion.EGRESO,
                                creadoPorId: data.conductorId,
                                terceroId: data.conductorId,
                                asientos: {
                                    create: [
                                        { cuentaId: cuentaGasto.id, debito: new Prisma.Decimal(data.valorTotal), credito: 0 },
                                        { cuentaId: cuentaCaja.id, debito: 0, credito: new Prisma.Decimal(data.valorTotal) }
                                    ]
                                }
                            }
                        });
                        transaccionId = tr.id;
                    } else {
                        throw new Error("Cuentas contables para egreso (5105, 110505) no configuradas.");
                    }
                }

                const entrega = await tx.entregaDotacion.create({
                    data: {
                        conductorId: data.conductorId,
                        fechaEntrega: data.fechaEntrega,
                        items: JSON.parse(JSON.stringify(data.items)),
                        observaciones: data.observaciones,
                        firmaDigital: data.firmaDigital,
                        valorTotal: data.valorTotal,
                        transaccionId: transaccionId,
                    },
                });

                logger.info({ entregaId: entrega.id, conductorId: data.conductorId }, "PPE delivery registered");
                return { success: true, data: entrega };
            });
        } catch (error) {
            logger.error({ data, error }, "DotacionService.create error");
            return {
                success: false,
                error: "Error al registrar entrega de dotación",
            };
        }
    }

    static async getByConductor(conductorId: string): Promise<ActionResult> {
        try {
            const entregas = await prisma.entregaDotacion.findMany({
                where: { conductorId },
                orderBy: { fechaEntrega: "desc"  },
            });
            return { success: true, data: entregas };
        } catch (error) {
            logger.error(
                { conductorId, error },
                "DotacionService.getByConductor error",
            );
            return {
                success: false,
                error: "Error al obtener entregas de dotación",
            };
        }
    }

    static async getById(id: string): Promise<ActionResult> {
        try {
            const entrega = await prisma.entregaDotacion.findUnique({
                where: { id },
                include: { conductor: true },
            });
            return { success: true, data: entrega };
        } catch (error) {
            logger.error({ id, error }, "DotacionService.getById error");
            return {
                success: false,
                error: "Error al obtener entrega de dotación",
            };
        }
    }
}
