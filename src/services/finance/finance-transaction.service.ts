import { prisma } from "@/lib/prisma";
import { ActionResult, TransaccionWithRelations } from "@/types";
import logger from "@/lib/logger";
import { Prisma, TipoTransaccion, MetodoPago } from "@prisma/client";
import {
    PaginationParams,
    PaginatedResponse,
    parsePaginationParams,
    calculatePagination,
    calculateSkip,
} from "@/types/pagination";

export interface TransactionCreateData {
    descripcion: string;
    tipo: TipoTransaccion;
    metodoPago?: MetodoPago;
    fechaOperacion?: Date;
    terceroId?: string;
    proveedorId?: string;
    metaVehiculoId?: string;
    documentoNumero?: string;
    numeroComprobante?: string;
    archivoIds?: string[];
    soporteUrl?: string;
    asientos: {
        cuentaId: string;
        debito: number | Prisma.Decimal;
        credito: number | Prisma.Decimal;
    }[];
    resolucionId?: string;
    cufe?: string;
    esElectronica?: boolean;
    creadoPorId: string;
}

export class FinanceTransactionService {
    /**
     * Crea una cabecera de transacción contable con sus asientos.
     */
    static async createTransaction(data: TransactionCreateData, txContext?: Prisma.TransactionClient): Promise<ActionResult<TransaccionWithRelations>> {
        const executor = txContext || prisma;
        
        try {
            const transaccion = await executor.transaccion.create({
                data: {
                    descripcion: data.descripcion,
                    tipo: data.tipo,
                    metodoPago: data.metodoPago || MetodoPago.EFECTIVO,
                    fechaOperacion: data.fechaOperacion || new Date(),
                    creadoPorId: data.creadoPorId,
                    terceroId: data.terceroId,
                    proveedorId: data.proveedorId,
                    metaVehiculoId: data.metaVehiculoId,
                    documentoNumero: data.documentoNumero,
                    numeroComprobante: data.numeroComprobante,
                    soporteUrl: data.soporteUrl,
                    resolucionId: data.resolucionId,
                    cufe: data.cufe,
                    esElectronica: data.esElectronica || false,
                    asientos: {
                        create: data.asientos.map(a => ({
                            cuentaId: a.cuentaId,
                            debito: a.debito,
                            credito: a.credito
                        }))
                    },
                    archivos: data.archivoIds && data.archivoIds.length > 0 ? {
                        connect: data.archivoIds.map(id => ({ id }))
                    } : undefined
                },
                include: {
                    asientos: {
                        include: {
                            cuenta: true
                        }
                    },
                    tercero: true,
                    creadoPor: true,
                    proveedor: true
                }
            });

            return { success: true, data: transaccion as unknown as TransaccionWithRelations };
        } catch (error) {
            logger.error({ error, data }, "Error en createTransaction");
            return { success: false, error: "Error al registrar transacción contable" };
        }
    }

    /**
     * Motor de Comprobantes Automatizado (Caja vs Bancos)
     */
    static async createVoucher(params: {
        monto: number;
        concepto: string;
        tipo: "INGRESO" | "EGRESO";
        metodoPago: MetodoPago;
        creadoPorId: string;
        terceroId?: string;
        proveedorId?: string;
        fecha?: Date;
        cuentaContrapartidaId: string;
    }): Promise<ActionResult<TransaccionWithRelations>> {
        try {
            const config = await prisma.configuracionGlobal.findFirst();
            if (!config) return { success: false, error: "Configuración global no encontrada" };

            let cuentaEfectivoId = "";
            
            if (params.metodoPago === MetodoPago.EFECTIVO) {
                cuentaEfectivoId = config.cuentaCajaId || "";
            } else {
                cuentaEfectivoId = config.cuentaBancosId || "";
            }

            if (!cuentaEfectivoId) {
                return { success: false, error: `Canal de fondos para ${params.metodoPago} no configurado` };
            }

            const prefix = params.tipo === "INGRESO" ? "RC" : "CE";
            let numeroComprobante = `${prefix}-${Date.now().toString().slice(-6)}`;
            let finalResolucionId: string | undefined = undefined;

            try {
                const resolucion = await prisma.resolucionContable.findFirst({
                    where: { prefijo: prefix, activa: true }
                });
                if (resolucion) {
                    const nextVal = resolucion.actual + 1;
                    numeroComprobante = `${resolucion.prefijo}-${nextVal}`;
                    finalResolucionId = resolucion.id;

                    // Actualizar el consecutivo
                    await prisma.resolucionContable.update({
                        where: { id: resolucion.id },
                        data: { actual: nextVal }
                    });
                }
            } catch (e) {
                logger.warn({ error: e }, "Sin consecutivo automático.");
            }

            const transaccion = await prisma.transaccion.create({
                data: {
                    descripcion: params.concepto,
                    tipo: params.tipo === "INGRESO" ? TipoTransaccion.INGRESO : TipoTransaccion.EGRESO,
                    metodoPago: params.metodoPago,
                    fechaOperacion: params.fecha || new Date(),
                    numeroComprobante,
                    resolucionId: finalResolucionId,
                    terceroId: params.terceroId,
                    proveedorId: params.proveedorId,
                    creadoPorId: params.creadoPorId,
                    asientos: {
                        create: [
                            {
                                cuentaId: params.cuentaContrapartidaId,
                                debito: params.tipo === "EGRESO" ? params.monto : 0,
                                credito: params.tipo === "INGRESO" ? params.monto : 0
                            },
                            {
                                cuentaId: cuentaEfectivoId,
                                debito: params.tipo === "INGRESO" ? params.monto : 0,
                                credito: params.tipo === "EGRESO" ? params.monto : 0
                            }
                        ]
                    }
                },
                include: {
                    asientos: {
                        include: {
                            cuenta: true
                        }
                    },
                    tercero: true,
                    creadoPor: true,
                    proveedor: true
                }
            });

            return { success: true, data: transaccion as unknown as TransaccionWithRelations };
        } catch (error) {
            logger.error({ error, params }, "Error en createVoucher");
            return { success: false, error: "Error al crear el comprobante financiero" };
        }
    }

    /**
     * Calcula el saldo de una cuenta contable a una fecha determinada.
     */
    static async getBalanceAtDate(cuentaId: string, fecha: Date): Promise<number> {
        type AsientoWithNature = Prisma.AsientoContableGetPayload<{
            include: { cuenta: { select: { naturaleza: true } } }
        }>;

        const asientos = await prisma.asientoContable.findMany({
            where: {
                cuentaId,
                transaccion: {
                    fechaOperacion: { lte: fecha }
                }
            },
            include: {
                cuenta: { select: { naturaleza: true } }
            }
        }) as AsientoWithNature[];

        if (!asientos || asientos.length === 0) return 0;

        const naturaleza = asientos[0].cuenta.naturaleza;
        let saldo = 0;

        for (const a of asientos) {
            const d = Number(a.debito);
            const c = Number(a.credito);
            if (naturaleza === "DEBITO") {
                saldo += (d - c);
            } else {
                saldo += (c - d);
            }
        }

        return saldo;
    }

    /**
     * Obtiene el listado de transacciones con paginación.
     */
    static async getTransactions(
        params: {
            type?: TipoTransaccion;
            search?: string;
        } & PaginationParams,
    ): Promise<ActionResult<PaginatedResponse<TransaccionWithRelations>>> {
        try {
            const { page, pageSize } = parsePaginationParams(params);
            
            const where: Prisma.TransaccionWhereInput = {
                tipo: params.type,
                descripcion: params.search
                    ? { contains: params.search, mode: "insensitive" }
                    : undefined,
            };

            const [total, items] = await Promise.all([
                prisma.transaccion.count({ where }),
                prisma.transaccion.findMany({
                    where,
                    include: {
                        asientos: {
                            include: {
                                cuenta: true,
                            },
                        },
                        tercero: true,
                        creadoPor: true,
                        proveedor: true,
                    },
                    orderBy: {
                        fechaOperacion: "desc"
                    },
                    skip: calculateSkip({ page, pageSize }),
                    take: pageSize,
                }),
            ]);

            return {
                success: true,
                data: {
                    data: items as unknown as TransaccionWithRelations[],
                    pagination: calculatePagination(total, { page, pageSize }),
                },
            };
        } catch (error) {
            logger.error({ error }, "Error en getTransactions");
            return {
                success: false,
                error: "Error al obtener transacciones",
            };
        }
    }
}
