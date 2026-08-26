import { prisma } from "@/lib/prisma";
import {
    ActionResult,
    ReporteFinanciero,
    ReporteCartera,
    ItemCartera,
} from "@/types";
import logger from "@/lib/logger";
import { NaturalezaCuenta } from "@prisma/client";
import { CacheService } from "@/lib/cache";

export class FinanceReportingService {
    /**
     * Obtiene el balance actual de una cuenta contable.
     * Saldo = Sum(Débitos) - Sum(Créditos) para Débito
     * Saldo = Sum(Créditos) - Sum(Débitos) para Crédito
     */
    static async getAccountBalance(
        cuentaId: string,
    ): Promise<ActionResult<unknown>> {
        return await CacheService.remember(
            `finance:balance:${cuentaId}`,
            5,
            async () => {
                try {
                    const cuenta = await prisma.cuentaContable.findUnique({
                        where: { id: cuentaId },
                        select: { naturaleza: true },
                    });

                    if (!cuenta) {
                        return {
                            success: false,
                            error: "Cuenta contable no encontrada",
                        };
                    }

                    const agregados = await prisma.asientoContable.aggregate({
                        where: { cuentaId },
                        _sum: {
                            debito: true,
                            credito: true,
                        },
                    });

                    const totalDebito = Number(agregados._sum.debito || 0);
                    const totalCredito = Number(agregados._sum.credito || 0);

                    const balance =
                        cuenta.naturaleza === NaturalezaCuenta.DEBITO
                            ? totalDebito - totalCredito
                            : totalCredito - totalDebito;

                    return { success: true, data: balance };
                } catch (error) {
                    logger.error(
                        { error, cuentaId },
                        "Error al calcular balance de cuenta",
                    );
                    return {
                        success: false,
                        error: "Error al obtener balance contable",
                    };
                }
            },
        );
    }

    /**
     * Obtiene el balance actual de una cuenta contable usando su código PUC.
     */
    static async getAccountBalanceByCode(
        codigo: string,
    ): Promise<ActionResult<unknown>> {
        return await CacheService.remember(
            `finance:balance:codigo:${codigo}`,
            5,
            async () => {
                try {
                    const cuenta = await prisma.cuentaContable.findUnique({
                        where: { codigo },
                        select: { id: true, naturaleza: true },
                    });

                    if (!cuenta) {
                        return {
                            success: false,
                            error: "Cuenta contable no encontrada",
                        };
                    }

                    const agregados = await prisma.asientoContable.aggregate({
                        where: { cuentaId: cuenta.id },
                        _sum: {
                            debito: true,
                            credito: true,
                        },
                    });

                    const totalDebito = Number(agregados._sum.debito || 0);
                    const totalCredito = Number(agregados._sum.credito || 0);

                    const balance =
                        cuenta.naturaleza === NaturalezaCuenta.DEBITO
                            ? totalDebito - totalCredito
                            : totalCredito - totalDebito;

                    return { success: true, data: balance };
                } catch (error) {
                    logger.error(
                        { error, codigo },
                        "Error al calcular balance de cuenta por codigo",
                    );
                    return {
                        success: false,
                        error: "Error al obtener balance contable",
                    };
                }
            },
        );
    }

    static async getFinancialStatement(
        startDate: Date,
        endDate: Date,
    ): Promise<ActionResult<unknown>> {
        const cacheKey = `finance:statement:${startDate.toISOString()}:${endDate.toISOString()}`;
        return await CacheService.remember(cacheKey, 600, async () => {
            try {
                const movimientos = await prisma.asientoContable.findMany({
                    where: {
                        transaccion: {
                            fecha: { gte: startDate, lte: endDate },
                        },
                        cuenta: {
                            OR: [
                                { codigo: { startsWith: "4" } },
                                { codigo: { startsWith: "5" } },
                                { codigo: { startsWith: "6" } },
                            ],
                        },
                    },
                    include: { cuenta: true },
                });

                const reporte: ReporteFinanciero = {
                    ingresos: { total: 0, cuentas: {} },
                    gastos: { total: 0, cuentas: {} },
                    costos: { total: 0, cuentas: {} },
                    utilidadBruta: 0,
                    utilidadOperacional: 0,
                    utilidadNeta: 0,
                };

                for (const m of movimientos) {
                    const codigo = m.cuenta.codigo;
                    const clase = codigo.charAt(0);

                    let group = null;
                    let monto = 0;

                    if (clase === "4") {
                        group = reporte.ingresos;
                        monto = Number(m.credito || 0) - Number(m.debito || 0);
                    } else if (clase === "5") {
                        group = reporte.gastos;
                        monto = Number(m.debito || 0) - Number(m.credito || 0);
                    } else if (clase === "6") {
                        group = reporte.costos;
                        monto = Number(m.debito || 0) - Number(m.credito || 0);
                    }

                    if (group) {
                        group.total += monto;
                        if (!group.cuentas[codigo]) {
                            group.cuentas[codigo] = {
                                nombre: m.cuenta.nombre,
                                valor: 0,
                            };
                        }
                        group.cuentas[codigo].valor += monto;
                    }
                }

                reporte.utilidadBruta =
                    reporte.ingresos.total - reporte.costos.total;
                reporte.utilidadOperacional =
                    reporte.utilidadBruta - reporte.gastos.total;
                reporte.utilidadNeta = reporte.utilidadOperacional;

                return { success: true, data: reporte };
            } catch (error) {
                logger.error({ error }, "Error generando Estado de Resultados");
                return { success: false, error: "Error al calcular P&G" };
            }
        });
    }

    /**
     * Genera reporte de Cartera por Edades.
     */
    static async getPortfolioReport(): Promise<ActionResult<unknown>> {
        return await CacheService.remember(
            "finance:portfolio",
            600,
            async () => {
                try {
                    const obligaciones =
                        await prisma.obligacionFinanciera.findMany({
                            where: {
                                saldoPendiente: { gt: 0 },
                                estado: { not: "ANULADO" },
                            },
                            include: {
                                usuario: true,
                                vehiculo: true,
                            },
                        });

                    const cartera: ItemCartera[] = [];
                    const resumen = {
                        total: 0,
                        corriente: 0,
                        vencido30: 0,
                        vencido60: 0,
                        vencido90: 0,
                    };

                    const now = new Date();

                    for (const ob of obligaciones) {
                        const diffTime =
                            now.getTime() - new Date(ob.fechaVence).getTime();
                        const daysOverdue =
                            diffTime > 0
                                ? Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                                : 0;
                        const saldo = Number(ob.saldoPendiente);

                        let rango = "CORRIENTE";
                        if (daysOverdue > 90) rango = ">90 DÍAS";
                        else if (daysOverdue > 60) rango = "61-90 DÍAS";
                        else if (daysOverdue > 30) rango = "31-60 DÍAS";

                        resumen.total += saldo;
                        if (rango === "CORRIENTE") resumen.corriente += saldo;
                        else if (rango === "31-60 DÍAS")
                            resumen.vencido30 += saldo;
                        else if (rango === "61-90 DÍAS")
                            resumen.vencido60 += saldo;
                        else if (rango === ">90 DÍAS")
                            resumen.vencido90 += saldo;

                        cartera.push({
                            id: ob.id,
                            tercero: `${ob.usuario.nombres} ${ob.usuario.apellidos}`,
                            documento: ob.usuario.numeroDocumento || "N/A",
                            placa: ob.vehiculo?.placa || "N/A",
                            concepto: ob.tipo,
                            vence: ob.fechaVence,
                            diasMora: daysOverdue,
                            rango,
                            saldo,
                        });
                    }

                    cartera.sort((a, b) => b.diasMora - a.diasMora);
                    return { success: true, data: { resumen, cartera } };
                } catch (error) {
                    logger.error(
                        { error },
                        "Error generando Reporte de Cartera",
                    );
                    return {
                        success: false,
                        error: "Error al calcular Cartera",
                    };
                }
            },
        );
    }

    /**
     * Genera proyección de Flujo de Caja (Próximos 90 días).
     */
    static async getCashFlowProjection(): Promise<ActionResult<unknown>> {
        const cacheKey = "finance:cashflow:projection";
        return await CacheService.remember(cacheKey, 300, async () => {
            try {
                const now = new Date();
                const future90 = new Date();
                future90.setDate(now.getDate() + 90);

                const obligaciones = await prisma.obligacionFinanciera.findMany({
                    where: {
                        fechaVence: { gte: now, lte: future90 },
                        saldoPendiente: { gt: 0 },
                        estado: { not: "ANULADO" }
                    },
                    orderBy: { fechaVence: 'asc' }
                });

                const proyeccion = {
                    totalProyectado: 0,
                    periodos: [
                        { label: "30 DÍAS", monto: 0, count: 0 },
                        { label: "60 DÍAS", monto: 0, count: 0 },
                        { label: "90 DÍAS", monto: 0, count: 0 }
                    ]
                };

                for (const ob of obligaciones) {
                    const diffTime = new Date(ob.fechaVence).getTime() - now.getTime();
                    const daysAhead = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    const saldo = Number(ob.saldoPendiente);
                    
                    proyeccion.totalProyectado += saldo;
                    
                    if (daysAhead <= 30) {
                        proyeccion.periodos[0].monto += saldo;
                        proyeccion.periodos[0].count++;
                    } else if (daysAhead <= 60) {
                        proyeccion.periodos[1].monto += saldo;
                        proyeccion.periodos[1].count++;
                    } else {
                        proyeccion.periodos[2].monto += saldo;
                        proyeccion.periodos[2].count++;
                    }
                }

                return { success: true, data: proyeccion };
            } catch (error) {
                logger.error({ error }, "Error en proyección de flujo");
                return { success: false, error: "Fallo al proyectar flujo de caja" };
            }
        });
    }

    /**
     * Obtiene los últimos asientos contables para auditoría.
     */
    static async getAuditLogs(): Promise<ActionResult<unknown>> {
        try {
            const logs = await prisma.asientoContable.findMany({
                take: 50,
                orderBy: { creadoEn: 'desc' }, // Use creadoEn for latest
                include: {
                    cuenta: true,
                    transaccion: {
                        include: {
                            creadoPor: true,
                            tercero: true
                        }
                    }
                }
            });

            return { 
                success: true, 
                data: logs.map(l => ({
                    id: l.id,
                    fecha: l.transaccion.fecha,
                    cuenta: `[${l.cuenta.codigo}] ${l.cuenta.nombre}`,
                    debito: Number(l.debito),
                    credito: Number(l.credito),
                    referencia: l.transaccion.documentoNumero || "S/R",
                    usuario: l.transaccion.creadoPor?.nombres || "SISTEMA",
                    tercero: l.transaccion.tercero ? `${l.transaccion.tercero.nombres} ${l.transaccion.tercero.apellidos || ""}`.trim() : "N/A"
                }))
            };
        } catch (error) {
            logger.error({ error }, "Error en logs de auditoría");
            return { success: false, error: "Fallo al recuperar logs de auditoría" };
        }
    }
}
