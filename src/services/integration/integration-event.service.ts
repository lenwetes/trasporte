import { prisma } from "@/lib/prisma";
import {
    TipoTransaccion,
    Prisma,
    Transaccion,
    ReglaContable,
} from "@prisma/client";

export interface EventPayload {
    monto: number;
    descripcion: string;
    creadoPorId: string;
    terceroId?: string;
    vehiculoId?: string;
    metadata?: Record<string, unknown>;
}

export interface EventProcessingResult {
    success: boolean;
    transaccion?: Transaccion;
    error?: string;
}

export class IntegrationEventService {
    /**
     * Procesa un evento del sistema y genera asientos contables automáticos
     */
    static async processEvent(
        eventType: string,
        payload: EventPayload,
        tx?: Prisma.TransactionClient,
    ): Promise<EventProcessingResult> {
        try {
            const client = tx || prisma;

            const regla = await client.reglaContable.findUnique({
                where: {
                    evento: eventType,
                    activo: true,
                },
                include: {
                    cuentaDebito: true,
                    cuentaCredito: true,
                },
            });

            if (!regla) {
                return {
                    success: false,
                    error: `No existe regla contable para el evento: ${eventType}`,
                };
            }

            const transaccion = await this.createAutomaticTransaction(
                regla,
                payload,
                client,
            );

            return {
                success: true,
                transaccion: transaccion as Transaccion,
            };
        } catch (error) {
            console.error("Error processing integration event:", error);
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Error desconocido",
            };
        }
    }

    /**
     * Crea una transacción automática basada en una regla contable
     */
    private static async createAutomaticTransaction(
        regla: ReglaContable & {
            cuentaDebito: { id: string; codigo: string; nombre: string };
            cuentaCredito: { id: string; codigo: string; nombre: string };
        },
        payload: EventPayload,
        txOrClient: Prisma.TransactionClient | typeof prisma,
    ): Promise<Transaccion> {
        const monto = new Prisma.Decimal(payload.monto);

        const createData = async (tx: Prisma.TransactionClient) => {
            return tx.transaccion.create({
                data: {
                    descripcion: payload.descripcion,
                    tipo: TipoTransaccion.NOTA_CONTABLE,
                    creadoPorId: payload.creadoPorId,
                    terceroId: payload.terceroId,
                    metaVehiculoId: payload.vehiculoId,
                    asientos: {
                        create: [
                            {
                                cuentaId: regla.cuentaDebitoId,
                                debito: monto,
                                credito: new Prisma.Decimal(0),
                            },
                            {
                                cuentaId: regla.cuentaCreditoId,
                                debito: new Prisma.Decimal(0),
                                credito: monto,
                            },
                        ],
                    },
                },
                include: {
                    asientos: true,
                },
            });
        };

        if ("$transaction" in txOrClient) {
            return (txOrClient as typeof prisma).$transaction(
                async (tx: Prisma.TransactionClient) => {
                    return createData(tx);
                },
            );
        } else {
            return createData(txOrClient as Prisma.TransactionClient);
        }
    }
}
