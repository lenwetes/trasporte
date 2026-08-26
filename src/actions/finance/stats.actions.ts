"use server";

import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { withAuth } from "@/lib/safe-action";
import { Rol } from "@prisma/client";
import { FinanceService } from "@/services/finance.service";

/**
 * Obtiene estadísticas financieras para el dashboard
 * @requires ADMIN, SECRETARIA
 */
export const getFinancialStatsAction = withAuth(
    [Rol.ADMIN, Rol.SECRETARIA],
    async (): Promise<ActionResult> => {
        try {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            // Ejecutar queries en paralelo para mejor performance
            const [
                carteraTotal,
                carteraVencida,
                recaudosMes,
                transaccionesMes,
                cajaBalanceResult,
            ] = await Promise.all([
                // 1. Cartera Total (Pendiente + Vencida)
                prisma.obligacionFinanciera.aggregate({
                    _sum: { saldoPendiente: true },
                    where: { estado: { not: "PAGADO" } },
                }),
                // 2. Cartera Vencida
                prisma.obligacionFinanciera.aggregate({
                    _sum: { saldoPendiente: true },
                    where: { estado: "VENCIDO" },
                }),
                // 3. Recaudo del Mes (Ingresos a Caja/Bancos)
                prisma.asientoContable.aggregate({
                    _sum: { debito: true },
                    where: {
                        cuenta: { codigo: { in: ["1105", "1110"] } },
                        transaccion: {
                            fecha: { gte: startOfMonth },
                            tipo: "INGRESO",
                        },
                    },
                }),
                // 4. Conteo Transacciones Mes
                prisma.transaccion.count({
                    where: {
                        fecha: { gte: startOfMonth },
                        tipo: "INGRESO",
                    },
                }),
                // 5. Balance en Caja
                FinanceService.getAccountBalance("110505"),
            ]);

            const cajaBalance = cajaBalanceResult.success
                ? cajaBalanceResult.data
                : 0;

            return {
                success: true,
                data: {
                    carteraTotal: Number(carteraTotal._sum.saldoPendiente || 0),
                    carteraVencida: Number(
                        carteraVencida._sum.saldoPendiente || 0,
                    ),
                    recaudoMes: Number(recaudosMes._sum.debito || 0),
                    cajaBalance: Number(cajaBalance),
                    transaccionesMes,
                },
            };
        } catch {
            return {
                success: false,
                error: "Error al calcular estadísticas financieras",
            };
        }
    },
    "getFinancialStats",
);

/**
 * Obtiene resumen de cartera por estado
 * @requires ADMIN, SECRETARIA
 */
export const getCarteraResumenAction = withAuth(
    [Rol.ADMIN, Rol.SECRETARIA],
    async (): Promise<ActionResult> => {
        try {
            const resumen = await prisma.obligacionFinanciera.groupBy({
                by: ["estado"],
                _sum: {
                    saldoPendiente: true,
                    montoInicial: true,
                },
                _count: true,
            });

            return {
                success: true,
                data: resumen.map((r) => ({
                    estado: r.estado,
                    cantidad: r._count,
                    saldoPendiente: Number(r._sum.saldoPendiente || 0),
                    montoInicial: Number(r._sum.montoInicial || 0),
                })),
            };
        } catch (_error) {
            return {
                success: false,
                error: "Error al obtener resumen de cartera",
            };
        }
    },
    "getCarteraResumen",
);

/**
 * Obtiene flujo de caja mensual (últimos 6 meses)
 * @requires ADMIN, SECRETARIA
 */
export const getFlujoCajaAction = withAuth(
    [Rol.ADMIN, Rol.SECRETARIA],
    async (): Promise<ActionResult> => {
        try {
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            sixMonthsAgo.setDate(1);
            sixMonthsAgo.setHours(0, 0, 0, 0);

            const transacciones = await prisma.transaccion.findMany({
                where: {
                    fecha: { gte: sixMonthsAgo },
                },
                select: {
                    fecha: true,
                    tipo: true,
                    asientos: {
                        select: {
                            debito: true,
                            credito: true,
                        },
                    },
                },
            });

            // Agrupar por mes
            const flujoMensual = new Map<
                string,
                { ingresos: number; egresos: number }
            >();

            transacciones.forEach((t) => {
                const mes = t.fecha.toISOString().slice(0, 7); // YYYY-MM
                if (!flujoMensual.has(mes)) {
                    flujoMensual.set(mes, { ingresos: 0, egresos: 0 });
                }

                const total = t.asientos.reduce(
                    (sum, a) => sum + Number(a.debito) - Number(a.credito),
                    0,
                );

                const flujo = flujoMensual.get(mes)!;
                if (t.tipo === "INGRESO") {
                    flujo.ingresos += total;
                } else if (t.tipo === "EGRESO") {
                    flujo.egresos += Math.abs(total);
                }
            });

            return {
                success: true,
                data: Array.from(flujoMensual.entries()).map(
                    ([mes, flujo]) => ({
                        mes,
                        ingresos: flujo.ingresos,
                        egresos: flujo.egresos,
                        neto: flujo.ingresos - flujo.egresos,
                    }),
                ),
            };
        } catch (_error) {
            return {
                success: false,
                error: "Error al calcular flujo de caja",
            };
        }
    },
    "getFlujoCaja",
);

/**
 * Obtiene métricas simplificadas para el mini dashboard de inicio
 * @requires ADMIN
 */
export const getFinancialMiniDashboardAction = withAuth(
    [Rol.ADMIN],
    async (): Promise<ActionResult> => {
        try {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            const mañana = new Date(hoy);
            mañana.setDate(mañana.getDate() + 1);

            const proximaSemana = new Date(hoy);
            proximaSemana.setDate(proximaSemana.getDate() + 7);

            // Execute queries
            const [
                recaudoHoy,
                moraTotal,
                proyeccionSemana,
                cajaBancos
            ] = await Promise.all([
                // Recaudo de hoy
                prisma.asientoContable.aggregate({
                    _sum: { debito: true },
                    where: {
                        cuenta: { codigo: { startsWith: "11" } }, // Caja y Bancos
                        transaccion: {
                            fecha: { gte: hoy, lt: mañana },
                            tipo: "INGRESO"
                        }
                    }
                }),
                // Cartera en mora (Obligaciones en mora)
                prisma.obligacionFinanciera.aggregate({
                    _sum: { saldoPendiente: true },
                    where: { estado: "VENCIDO" }
                }),
                // Proyección de cobro (Cuotas + Obligaciones vence pronto)
                prisma.cuotaPrestamo.aggregate({
                    _sum: { totalCuota: true },
                    where: { 
                        estado: "PENDIENTE",
                        fechaVencimiento: { gte: hoy, lte: proximaSemana }
                    }
                }),
                // Balance consolidado (Simplificado)
                prisma.asientoContable.aggregate({
                    _sum: { debito: true, credito: true },
                    where: { cuenta: { codigo: { startsWith: "11" } } }
                })
            ]);

            const balance = Number(cajaBancos._sum.debito || 0) - Number(cajaBancos._sum.credito || 0);

            return {
                success: true,
                data: {
                    recaudoHoy: Number(recaudoHoy._sum.debito || 0),
                    carteraMora: Number(moraTotal._sum.saldoPendiente || 0),
                    proyeccionProxSemana: Number(proyeccionSemana._sum.totalCuota || 0),
                    balanceDisponible: balance
                }
            };
        } catch (error) {
            console.error("Error en mini dashboard:", error);
            return { success: false, error: "Error al cargar resumen ejecutivo" };
        }
    },
    "getFinancialMiniDashboard"
);
