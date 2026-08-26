import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import { FinanceService } from "../finance.service";
import { Prisma, NaturalezaCuenta, TipoCuenta } from "@prisma/client";

export class BillingGeneratorService {
    /**
     * Genera la facturación masiva de cuotas de administración para un periodo determinado.
     * ✅ LÓGICA CORRECTA: Se cobra UNA VEZ por PROPIETARIO, sin importar cuántos vehículos tenga.
     */
    static async generateMonthlyFees(
        periodo: Date,
        adminId: string,
    ): Promise<ActionResult> {
        try {
            // 1. Obtener Configuración Global
            let config = await prisma.configuracionGlobal.findUnique({
                where: { id: "default"  },
            });
            if (!config) {
                config = await prisma.configuracionGlobal.create({
                    data: {
                        id: "default",
                        nombreEmpresa: "COOPETRAES",
                        montoCuotaAdministracion: new Prisma.Decimal(80000),
                        diaCorteMensual: 5,
                    },
                });
            }

            // 2. Resolver Cuentas Contables (PUC Colombia)
            const fetchCuenta = async (
                codigo: string,
                nombre: string,
                naturaleza: NaturalezaCuenta,
                tipo: TipoCuenta,
            ) => {
                let cuenta = await prisma.cuentaContable.findUnique({
                    where: { codigo },
                });
                if (!cuenta) {
                    cuenta = await prisma.cuentaContable.create({
                        data: {
                            codigo,
                            nombre,
                            naturaleza,
                            tipo,
                            activa: true,
                        },
                    });
                }
                return cuenta;
            };

            const cuentaCartera = await fetchCuenta(
                "130505",
                "Cuentas por Cobrar Clientes",
                NaturalezaCuenta.DEBITO,
                TipoCuenta.ACTIVO,
            );
            const cuentaIngreso = await fetchCuenta(
                "415505",
                "Ingresos Actividades Transporte",
                NaturalezaCuenta.CREDITO,
                TipoCuenta.INGRESO,
            );

            // 3. Obtener PROPIETARIOS pendientes
            const startOfMonth = new Date(
                periodo.getFullYear(),
                periodo.getMonth(),
                1,
            );
            const endOfMonth = new Date(
                periodo.getFullYear(),
                periodo.getMonth() + 1,
                0,
            );

            const propietarios = await prisma.usuario.findMany({
                where: {
                    rol: "PROPIETARIO",
                    activo: true,
                    eliminadoEn: null,
                    obligaciones: {
                        none: {
                            tipo: "CUOTA_ADMINISTRACION",
                            periodo: { gte: startOfMonth, lte: endOfMonth },
                        },
                    },
                },
                include: {
                    vehiculosPropiedad: {
                        where: { activo: true, eliminadoEn: null },
                        select: { placa: true, id: true },
                    },
                },
            });

            if (propietarios.length === 0) {
                return {
                    success: true,
                    message:
                        "No hay propietarios pendientes de facturar para este periodo",
                };
            }

            let procesados = 0;
            const errors: string[] = [];

            // 4. Procesar cada propietario
            for (const propietario of propietarios) {
                try {
                    const monto = Number(config.montoCuotaAdministracion);
                    const fechaVence = new Date(startOfMonth);
                    fechaVence.setDate(config.diaCorteMensual);

                    const numVehiculos = propietario.vehiculosPropiedad.length;

                    const txResult = await FinanceService.createTransaction({
                        descripcion: `Causación Cuota Administración - ${propietario.nombres} ${propietario.apellidos} - ${periodo.getMonth() + 1}/${periodo.getFullYear()} (${numVehiculos} vehículo${numVehiculos !== 1 ? "s" : ""})`,
                        tipo: "NOTA_CONTABLE",
                        terceroId: propietario.id,
                        metaVehiculoId: undefined,
                        creadoPorId: adminId,
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

                    if (txResult.success && txResult.data) {
                        await prisma.obligacionFinanciera.create({
                            data: {
                                usuarioId: propietario.id,
                                vehiculoId: null,
                                tipo: "CUOTA_ADMINISTRACION",
                                periodo: startOfMonth,
                                fechaVence: fechaVence,
                                montoInicial: monto,
                                saldoPendiente: monto,
                                estado: "PENDIENTE",
                                transaccionOrigenId: txResult.data.id,
                            },
                        });
                        procesados++;
                    } else {
                        errors.push(
                            `Propietario ${propietario.nombres}: ${txResult.error}`,
                        );
                    }
                } catch (e: unknown) {
                    errors.push(
                        `Propietario ${propietario.nombres}: ${e instanceof Error ? e.message : String(e)}`,
                    );
                }
            }

            return {
                success: true,
                message: `Proceso finalizado. Facturados: ${procesados}, Errores: ${errors.length}`,
                data: { procesados, errores: errors },
            };
        } catch (error) {
            logger.error(
                { error },
                "BillingGeneratorService.generateMonthlyFees error",
            );
            return {
                success: false,
                error: "Error interno al procesar facturación masiva",
            };
        }
    }
}
