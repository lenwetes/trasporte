import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import { FinanceService } from "./finance.service";
import { EstadoObligacion, EstadoCuota } from "@prisma/client";
import { CacheService } from "@/lib/cache";
import Decimal from "decimal.js";
import {
    PaginationParams,
    PaginatedResponse,
    parsePaginationParams,
    calculatePagination,
    calculateSkip,
} from "@/types/pagination";
import { UnifiedReceivable } from "@/types";

export class PaymentService {
    /**
     * Registra un pago y lo aplica a una obligación financiera.
     * Genera automáticamente el asiento contable de INGRESO.
     * Garantiza atomicidad mediante prisma.$transaction.
     */
    static async registerPayment(data: {
        usuarioId: string;
        obligacionId: string;
        monto: number;
        metodoPago: "CAJA" | "BANCO" | string;
        referencia?: string;
        registradoPorId: string;
        comprobanteUrl?: string;
    }): Promise<ActionResult> {
        try {
            return await prisma.$transaction(async (tx) => {
                // 1. Verificar obligación
                const obligacion = await tx.obligacionFinanciera.findUnique({
                    where: { id: data.obligacionId },
                    include: { usuario: true },
                });

                if (!obligacion) {
                    throw new Error("Obligación financiera no encontrada");
                }

                if (obligacion.estado === "PAGADO") {
                    throw new Error("La obligación ya se encuentra pagada");
                }

                if (data.monto <= 0) {
                    throw new Error("El monto del pago debe ser mayor a cero");
                }

                const saldoActual = Number(obligacion.saldoPendiente);
                if (data.monto > saldoActual + 0.01) {
                    // Pequeña tolerancia para redondeo
                    throw new Error(
                        `El monto ($${data.monto}) excede el saldo pendiente ($${saldoActual})`,
                    );
                }

                // 2. Determinar cuentas contables (PUC Colombia)
                const codigoCaja =
                    data.metodoPago === "CAJA" || data.metodoPago === "EFECTIVO"
                        ? "110505"
                        : "111005";
                const cuentaDinero = await tx.cuentaContable.findUnique({
                    where: { codigo: codigoCaja },
                });
                const cuentaCartera = await tx.cuentaContable.findUnique({
                    where: { codigo: "130505"  },
                });

                if (!cuentaDinero || !cuentaCartera) {
                    throw new Error(
                        "Configuración contable (PUC) incompleta para recaudos (110505/130505)",
                    );
                }

                // 3. Crear Transacción Contable (Ingreso)
                // Nota: FinanceService ya tiene su propia transaccion, pero si pasamos el 'tx' (prisma client de la transaccion) funcionaría.
                // Sin embargo, FinanceService.createTransaction usa 'prisma' global.
                // Para simplificar y mantener compatibilidad, llamamos al servicio normalmente.
                const resContable = await FinanceService.createTransaction({
                    creadoPorId: data.registradoPorId,
                    descripcion: `Pago ${obligacion.tipo} - ${obligacion.usuario.nombres} ${obligacion.usuario.apellidos} - Ref: ${obligacion.id.slice(0, 8)}`,
                    tipo: "INGRESO",
                    terceroId: data.usuarioId,
                    metaVehiculoId: obligacion.vehiculoId || undefined,
                    asientos: [
                        {
                            cuentaId: cuentaDinero.id,
                            debito: data.monto,
                            credito: 0,
                        }, // Entra dinero (Débito)
                        {
                            cuentaId: cuentaCartera.id,
                            debito: 0,
                            credito: data.monto,
                        }, // Disminuye Cartera (Crédito)
                    ],
                });

                if (!resContable.success || !resContable.data) {
                    throw new Error(
                        resContable.error ||
                            "Error al registrar transacción contable",
                    );
                }

                const transaccionContable = resContable.data;

                // 4. Actualizar Estado de la Obligación
                const nuevoSaldo = Math.max(0, saldoActual - data.monto);
                const nuevoEstado = nuevoSaldo <= 0.01 ? "PAGADO" : "PENDIENTE";

                const obligacionActualizada =
                    await tx.obligacionFinanciera.update({
                        where: { id: data.obligacionId },
                        data: {
                            saldoPendiente: nuevoSaldo,
                            estado: nuevoEstado as EstadoObligacion,
                            transaccionOrigenId: transaccionContable.id, // Opcional: Linkar el último pago
                        },
                    });

                logger.info(
                    {
                        obligacionId: obligacion.id,
                        monto: data.monto,
                        nuevoSaldo,
                    },
                    "Recaudo registrado y aplicado exitosamente",
                );

                await CacheService.invalidate("payment");
                if (data.usuarioId)
                    await CacheService.invalidate(
                        `payment:user:${data.usuarioId}`,
                    );

                return {
                    success: true,
                    data: {
                        obligacion: obligacionActualizada,
                        transaccion: transaccionContable,
                    },
                    message: "Pago registrado y aplicado con éxito",
                };
            });
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : String(error);
            logger.error(
                { error, data },
                "Error en PaymentService.registerPayment",
            );
            return {
                success: false,
                error: message || "Error interno al procesar el pago",
            };
        }
    }

    /**
     * Lista obligaciones pendientes con paginación
     */
    static async getPending(
        params: PaginationParams = {},
    ): Promise<ActionResult<{ data: UnifiedReceivable[]; pagination: any }>> {
        const options = parsePaginationParams(params);
        const cacheKey = `receivables:pending:unified:${options.page}:${options.pageSize}`;

        return await CacheService.remember(cacheKey, 300, async () => {
            try {
                // 1. Consultar Obligaciones Pendientes
                const obligaciones = await prisma.obligacionFinanciera.findMany({
                    where: { estado: { not: "PAGADO" } },
                    orderBy: { fechaVence: "asc" },
                    include: {
                        usuario: {
                            select: { nombres: true, apellidos: true, numeroDocumento: true, id: true }
                        },
                        vehiculo: { select: { placa: true, id: true } }
                    }
                });

                const cuotas = await prisma.cuotaPrestamo.findMany({
                    where: { estado: { not: "PAGADA" } },
                    orderBy: { fechaVencimiento: "asc" },
                    include: {
                        prestamo: {
                            include: {
                                usuario: {
                                    select: { nombres: true, apellidos: true, numeroDocumento: true, id: true }
                                }
                            }
                        }
                    }
                });

                // 2. Unificar estructuras
                const unified: UnifiedReceivable[] = [
                    ...obligaciones.map(ob => ({
                        id: ob.id,
                        tipoPrincipal: "OBLIGACION" as const,
                        tipo: ob.tipo,
                        usuario: ob.usuario,
                        vehiculo: ob.vehiculo,
                        fechaVence: ob.fechaVence,
                        periodo: ob.periodo,
                        montoInicial: Number(ob.montoInicial),
                        saldoPendiente: Number(ob.saldoPendiente),
                        estado: ob.estado,
                        consecutivo: ob.id.slice(-6).toUpperCase()
                    })),
                    ...(cuotas as any[]).map(c => ({
                        id: c.id,
                        tipoPrincipal: "PRESTAMO" as const,
                        tipo: `CUOTA ${c.numCuota} - ${c.prestamo.tipo}`,
                        usuario: c.prestamo.usuario,
                        vehiculo: null,
                        fechaVence: c.fechaVencimiento,
                        periodo: c.fechaVencimiento,
                        montoInicial: Number(c.totalCuota),
                        saldoPendiente: Number(c.totalCuota) - Number(c.montoPagado),
                        estado: c.estado,
                        consecutivo: `LP-${c.prestamoId.slice(-4)}-${c.numCuota}`
                    }))
                ];

                // 3. Ordenar por fecha de vencimiento (Mora más antigua primero)
                unified.sort((a, b) => new Date(a.fechaVence).getTime() - new Date(b.fechaVence).getTime());

                return {
                    success: true,
                    data: {
                        data: unified,
                        pagination: calculatePagination(unified.length, options)
                    }
                };
            } catch (error) {
                logger.error({ error }, "Error en unified getPending");
                return { success: false, error: "Error al consolidar cartera" };
            }
        });
    }

    /**
     * Obtiene obligaciones pendientes de un usuario específico
     */
    static async getByUser(userId: string): Promise<ActionResult> {
        return await CacheService.remember(
            `payment:user:${userId}`,
            600,
            async () => {
                try {
                    const obligaciones =
                        await prisma.obligacionFinanciera.findMany({
                            where: {
                                usuarioId: userId,
                                estado: { not: "PAGADO" as EstadoObligacion },
                            },
                            orderBy: { fechaVence: "asc"  },
                            include: {
                                usuario: {
                                    select: { nombres: true, apellidos: true },
                                },
                            },
                        });
                    return { success: true, data: obligaciones };
                } catch (error) {
                    logger.error(
                        { userId, error },
                        "PaymentService.getByUser error",
                    );
                    return {
                        success: false,
                        error: "Error al obtener obligaciones del usuario",
                    };
                }
            },
        );
    }
}
