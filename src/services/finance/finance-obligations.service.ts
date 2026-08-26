import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import { FinanceTransactionService } from "./finance-transaction.service";

export class FinanceObligationsService {
    /**
     * Genera masivamente las cuentas de cobro (Obligaciones) para el periodo dado.
     * Se basa en los vehículos activos y la tarifa configurada.
     */
    static async generateMonthlyObligations(
        periodo: Date,
    ): Promise<ActionResult<{ generados: number; errores: string[] }>> {
        try {
            const config = await prisma.configuracionGlobal.findFirst();
            if (!config || !config.montoCuotaAdministracion) {
                return {
                    success: false,
                    error: "No hay configuración de cuota de administración definida.",
                };
            }

            const monto = Number(config.montoCuotaAdministracion);

            // Buscar cuentas contables estándar (según PUC Colombia)
            const [cuentaCartera, cuentaIngreso] = await Promise.all([
                prisma.cuentaContable.findFirst({
                    where: { codigo: "130505" },
                }),
                prisma.cuentaContable.findFirst({
                    where: { codigo: "415550" },
                }),
            ]);

            if (!cuentaCartera || !cuentaIngreso) {
                return {
                    success: false,
                    error: "Cuentas contables 130505 (Cartera) o 415550 (Ingresos) no encontradas.",
                };
            }

            const vehiculos = await prisma.vehiculo.findMany({
                where: { activo: true, propietarioId: { not: null } },
                include: { propietarioUser: true },
            });

            if (vehiculos.length === 0) {
                return {
                    success: true,
                    message: "No hay vehículos activos para generar cobro.",
                };
            }

            const admin = await prisma.usuario.findFirst({
                where: { rol: "ADMIN", activo: true },
            });
            const adminId = admin?.id;
            if (!adminId) {
                return {
                    success: false,
                    error: "Se requiere un administrador activo para esta operación.",
                };
            }

            let generados = 0;
            const errors: string[] = [];

            const startOfMonth = new Date(
                periodo.getFullYear(),
                periodo.getMonth(),
                1,
            );

            for (const v of vehiculos) {
                if (!v.propietarioId) continue;

                const existe = await prisma.obligacionFinanciera.findFirst({
                    where: {
                        vehiculoId: v.id,
                        tipo: "CUOTA_ADMINISTRACION",
                        periodo: startOfMonth,
                    },
                });

                if (existe) continue;

                try {
                    const txResult =
                        await FinanceTransactionService.createTransaction({
                            descripcion: `Causación Administración ${periodo.getMonth() + 1}/${periodo.getFullYear()} - Placa ${v.placa}`,
                            tipo: "NOTA_CONTABLE",
                            creadoPorId: adminId,
                            terceroId: v.propietarioId,
                            metaVehiculoId: v.id,
                            asientos: [
                                {
                                    cuentaId: cuentaCartera.id,
                                    debito: monto,
                                    credito: 0,
                                },
                                {
                                    cuentaId: cuentaIngreso.id,
                                    debito: 0,
                                    credito: monto,
                                },
                            ],
                        });

                    if (!txResult.success) throw new Error(txResult.error);

                    await prisma.obligacionFinanciera.create({
                        data: {
                            usuarioId: v.propietarioId!,
                            vehiculoId: v.id,
                            tipo: "CUOTA_ADMINISTRACION",
                            periodo: startOfMonth,
                            fechaVence: new Date(
                                periodo.getFullYear(),
                                periodo.getMonth(),
                                config.diaCorteMensual || 5,
                            ),
                            montoInicial: monto,
                            saldoPendiente: monto,
                            estado: "PENDIENTE",
                            transaccionOrigenId: (
                                txResult.data as { id: string }
                            ).id,
                        },
                    });

                    generados++;
                } catch (e: unknown) {
                    const message = e instanceof Error ? e.message : String(e);
                    errors.push(`Error placas ${v.placa}: ${message}`);
                }
            }

            return {
                success: true,
                message: `Generada facturación para ${generados} vehículos.`,
                data: { generados, errores: errors },
            };
        } catch (error) {
            logger.error({ error }, "Error generando obligaciones");
            return {
                success: false,
                error: "Error interno al generar obligaciones.",
            };
        }
    }
}
