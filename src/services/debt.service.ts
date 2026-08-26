import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import { CacheService } from "@/lib/cache";

export class DebtService {
    /**
     * Verifica si un conductor o asociado tiene permitido operar vehículos.
     * Criterio: Saldo Pendiente Total <= Umbral de Bloqueo Mora (Configuración Global).
     * Retorna el estado y los detalles de la deuda.
     */
    static async canOperate(usuarioId: string): Promise<
        ActionResult<{
            canOperate: boolean;
            saldoPendiente: number;
            umbral: number;
            cuotasPendientes: number;
        }>
    > {
        try {
            // 1. Obtener Umbral desde Configuración Global con Cache
            const config = await CacheService.getConfig();
            const umbral = Number(config?.umbralBloqueoMora || 200000);

            // 2. Obtener Usuario y su Margen de Confianza
            const usuario = await prisma.usuario.findUnique({
                where: { id: usuarioId },
                select: {
                    id: true,
                    margenConfianza: true,
                } as unknown as Record<string, boolean>,
            });

            const margen = Number(
                (usuario as { margenConfianza?: string | number })
                    ?.margenConfianza || 0,
            );

            // 3. Sumar saldo pendiente y contar cuotas activas
            const [agregados, count] = await Promise.all([
                prisma.obligacionFinanciera.aggregate({
                    where: {
                        usuarioId: usuarioId,
                        estado: { in: ["PENDIENTE", "VENCIDO"] },
                    },
                    _sum: {
                        saldoPendiente: true,
                    },
                }),
                prisma.obligacionFinanciera.count({
                    where: {
                        usuarioId: usuarioId,
                        estado: { in: ["PENDIENTE", "VENCIDO"] },
                    },
                }),
            ]);

            const saldoTotal = Number(agregados._sum.saldoPendiente || 0);

            // 4. Evaluar reglas de bloqueo (Kill Switch) con Margen de Confianza
            // El usuario puede operar si su (Saldo - Margen) <= Umbral
            const canOperate = saldoTotal - margen <= umbral;

            if (!canOperate) {
                logger.warn(
                    {
                        usuarioId,
                        saldoTotal,
                        umbral,
                    },
                    "Usuario bloqueado por mora excesiva",
                );
            }

            return {
                success: true,
                data: {
                    canOperate,
                    saldoPendiente: saldoTotal,
                    umbral: umbral,
                    cuotasPendientes: count,
                },
            };
        } catch (error) {
            logger.error(
                { error, usuarioId },
                "Error al verificar operatividad por deuda",
            );
            // Fail-safe: En caso de error crítico, bloqueamos por precaución
            return {
                success: false,
                error: "Error al verificar estado financiero. Acceso denegado preventivamente.",
                data: {
                    canOperate: false,
                    saldoPendiente: 0,
                    umbral: 0,
                    cuotasPendientes: 0,
                },
            };
        }
    }

    /**
     * Obtiene el saldo total pendiente de un usuario.
     */
    static async getTotalDebt(
        usuarioId: string,
    ): Promise<ActionResult<unknown>> {try {
            const result = await prisma.obligacionFinanciera.aggregate({
                _sum: {
                    saldoPendiente: true,
                },
                where: {
                    usuarioId,
                    estado: { in: ["PENDIENTE", "VENCIDO"] },
                },
            });

            const total = Number(result._sum.saldoPendiente) || 0;
            return { success: true, data: total };
        } catch (error) {
            logger.error({ error, usuarioId }, "Error al calcular deuda total");
            return {
                success: false,
                error: "Error al obtener deuda total",
                data: 0,
            };
        }
    }

    /**
     * Obtiene el historial de obligaciones de un usuario.
     */
    static async getDebtSummary(usuarioId: string): Promise<ActionResult> {
        try {
            const obligaciones = await prisma.obligacionFinanciera.findMany({
                where: { usuarioId },
                orderBy: { periodo: "desc"  },
                include: {
                    vehiculo: true,
                    transaccionOrigen: true,
                },
            });
            return { success: true, data: obligaciones };
        } catch (error) {
            logger.error(
                { error, usuarioId },
                "Error al cargar resumen de deuda",
            );
            return {
                success: false,
                error: "Error al cargar historial financiero",
            };
        }
    }
}
