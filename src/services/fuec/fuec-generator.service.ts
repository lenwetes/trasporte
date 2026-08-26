import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import {
    Prisma,
    EstadoPreoperacional,
    PlanillaFUEC,
    EstadoFUEC,
} from "@prisma/client";
import { VehicleOperabilityService } from "../vehicle-operability.service";
import { PreoperacionalService } from "../safety/preoperacional.service";
import { DebtService } from "../debt.service";
import { CacheService } from "@/lib/cache";

export interface FuecGenerationData {
    contratoId: string;
    vehiculoId?: string | null;
    conductor1Id?: string | null;
    conductor2Id?: string | null;
    conductor3Id?: string | null;
    rutas: {
        origen: string;
        destino: string;
        perimetroUrbano?: boolean;
    }[];
    objetoViaje?: string;
    fechaInicio: Date;
    fechaFin: Date;
    creadoPorId: string;
    force?: boolean;
    justificacion?: string;
    consecutivoContrato?: number;
    consecutivoExtracto?: number;
    modoPago?: import("@prisma/client").ModoPagoPlanilla;
    valorIngreso?: number;
}

export class FuecGeneratorService {
    /**
     * Genera una nueva planilla FUEC validando los 3 pilares.
     */
    static async generate(
        data: FuecGenerationData,
    ): Promise<ActionResult<Prisma.PlanillaFUECGetPayload<{ 
        include: { 
            vehiculo: true, 
            conductor1: true, 
            conductor2: true, 
            conductor3: true, 
            contrato: true, 
            resolucion: true 
        } 
    }>>> {try {
            const isAdmin = await this.checkIfAdmin(data.creadoPorId);

            if (!data.force) {
                if (!data.vehiculoId || !data.conductor1Id) {
                    return {
                        success: false,
                        error: "Se requiere vehículo y conductor para emisiones normales.",
                    };
                }

                // 1. Legalidad
                const operability =
                    await VehicleOperabilityService.evaluateOperability(
                        data.vehiculoId as string,
                        data.creadoPorId,
                    );

                if (
                    !operability.success ||
                    operability.data === "NO_OPERATIVO"
                ) {
                    return {
                        success: false,
                        error: `RECHAZO LEGAL: El vehículo no cumple con los documentos obligatorios vigentes.`,
                    };
                }

                /* 
                // 2. Seguridad - @REMOVED: Quitado por solicitud (no restrictivo día de hoy)
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                const latestPreopResult = await PreoperacionalService.getLatest(
                    data.vehiculoId as string,
                );
                const latestPreop =
                    latestPreopResult.data as Prisma.PreoperacionalGetPayload<{
                        include: { detalles: true };
                    }> | null;

                if (
                    !latestPreop ||
                    new Date(latestPreop.fecha).setHours(0, 0, 0, 0) !==
                        hoy.getTime()
                ) {
                    return {
                        success: false,
                        error: "RECHAZO SEGURIDAD: Se requiere un preoperacional físico realizado el día de hoy.",
                    };
                }

                if (latestPreop.resultado === EstadoPreoperacional.RECHAZADO) {
                    return {
                        success: false,
                        error: "RECHAZO SEGURIDAD: El vehículo fue RECHAZADO en la inspección de seguridad.",
                    };
                } */

                // 3. Financiero
                const walletStatus = await this.checkWalletBalance(
                    data.conductor1Id as string,
                );
                if (!walletStatus.canEmit) {
                    return {
                        success: false,
                        error: `RECHAZO FINANCIERO: Conductor principal con saldo insuficiente o mora ($${walletStatus.balance}).`,
                    };
                }

                // 4. Conductores Activos
                const conductoresIds = [
                    data.conductor1Id,
                    data.conductor2Id,
                    data.conductor3Id,
                ].filter(Boolean) as string[];
                const dbConductoresCount = await prisma.usuario.count({
                    where: {
                        id: { in: conductoresIds },
                        activo: true,
                        rol: "CONDUCTOR",
                    },
                });

                if (dbConductoresCount !== conductoresIds.length) {
                    return {
                        success: false,
                        error: "Unos de los conductores seleccionados no existe o no está activo.",
                    };
                }
            } else {
                if (!isAdmin)
                    return {
                        success: false,
                        error: "Solo administradores pueden forzar la emisión.",
                    };
                if (!data.justificacion)
                    return {
                        success: false,
                        error: "La justificación es obligatoria.",
                    };
            }

            // Contrato
            const contrato = await prisma.contratoEmpresa.findUnique({
                where: { id: data.contratoId, activo: true },
            });

            if (!contrato) {
                return {
                    success: false,
                    error: "El contrato seleccionado no existe o no está activo.",
                };
            }

            return await prisma.$transaction(async (tx) => {
                const resolucion = await tx.resolucionFUEC.findFirst({
                    where: { habilitada: true },
                    orderBy: { creadoEn: "desc"  },
                });

                if (!resolucion || resolucion.actual >= resolucion.rangoHasta) {
                    throw new Error(
                        "ALERTA: Resoluciones FUEC agotadas o inhabilitadas.",
                    );
                }

                const nuevoConsecutivoGlobal = resolucion.actual + 1;
                await tx.resolucionFUEC.update({
                    where: { id: resolucion.id },
                    data: { actual: nuevoConsecutivoGlobal },
                });

                const anioExpedicion = new Date().getFullYear();
                const s1 = resolucion.codigoTerritorial.padStart(3, "0");
                const s2 = resolucion.resolucionEmpresa.padStart(4, "0");
                const s3 = resolucion.anioHabilitacion.padStart(2, "0");
                const s4 = anioExpedicion.toString();
                const contractConsecutive =
                    data.consecutivoContrato ??
                    contrato.consecutivoNumerico ??
                    1;
                const s5 = contractConsecutive.toString().padStart(4, "0");

                const countFUECsContrato = await tx.planillaFUEC.count({
                    where: { contratoId: contrato.id },
                });
                const nuevoNumeroExtracto =
                    data.consecutivoExtracto ?? countFUECsContrato + 1;
                const s6 = nuevoNumeroExtracto.toString().padStart(4, "0");

                let consecutivo21Digitos = `${s1}${s2}${s3}${s4}${s5}${s6}`;
                if (contrato.esInterno) {
                    consecutivo21Digitos = `INT-${consecutivo21Digitos}`;
                }

                // Validar colisión: si el consecutivo ya existe, rechazar
                const colision = await tx.planillaFUEC.findFirst({
                    where: { consecutivo: consecutivo21Digitos },
                    select: { id: true },
                });
                if (colision) {
                    throw new Error(
                        `COLISIÓN NUMÉRICA: El consecutivo ${consecutivo21Digitos} ya existe. Ajuste los valores de S5 y S6.`
                    );
                }


                // Financiero (FUEC) con Cache
                const modoPago = data.modoPago || "EFECTIVO";
                let monto = data.valorIngreso;
                
                if (monto === undefined || monto === null || Number(monto) === 0) {
                    const config = await CacheService.getConfig();
                    monto = Number(config?.costoBaseFuec || 30000);
                }
                monto = Number(monto);

                // Cuentas con Cache (Shorthand para códigos fijos)
                const [cuentaCaja, cuentaIngresosFUEC, cuentaCobrarPlanilla] = await Promise.all([
                    CacheService.getAccountByCode("110505"),
                    CacheService.getAccountByCode("415510"),
                    CacheService.getAccountByCode("130510")
                ]);

                if (!cuentaCaja?.id || !cuentaIngresosFUEC?.id) {
                    throw new Error("Error de configuración contable: Cuentas Caja (110505) o Ingresos (415510) faltantes.");
                }
                if (modoPago === "CREDITO" && !cuentaCobrarPlanilla?.id) {
                    throw new Error("Error contable: Falta cuenta por cobrar (130510) para emitir FUEC a crédito.");
                }

                const cuentaDebitoId = modoPago === "EFECTIVO" ? cuentaCaja.id : cuentaCobrarPlanilla!.id;

                const transaccion = await tx.transaccion.create({
                    data: {
                        descripcion: `EMISIÓN FUEC #${consecutivo21Digitos} - Contrato ${contrato.numeroContrato} (${modoPago})`,
                        tipo: "INGRESO",
                        creadoPorId: data.creadoPorId,
                        terceroId: data.conductor1Id || data.creadoPorId, 
                        metaVehiculoId: data.vehiculoId,
                        asientos: {
                            create: [
                                {
                                    cuentaId: cuentaDebitoId,
                                    debito: new Prisma.Decimal(monto),
                                    credito: 0,
                                },
                                {
                                    cuentaId: cuentaIngresosFUEC.id,
                                    debito: 0,
                                    credito: new Prisma.Decimal(monto),
                                },
                            ],
                        },
                    },
                });
                
                let obligacionId = null;
                if (modoPago === "CREDITO" && data.conductor1Id) {
                    const hoyDate = new Date();
                    hoyDate.setHours(0,0,0,0);
                    const vencesDate = new Date(hoyDate);
                    vencesDate.setMonth(vencesDate.getMonth() + 1);
                    
                    const obligacion = await tx.obligacionFinanciera.create({
                        data: {
                            usuarioId: data.conductor1Id,
                            vehiculoId: data.vehiculoId,
                            tipo: "PLANILLA_FUEC",
                            periodo: hoyDate,
                            fechaVence: vencesDate,
                            montoInicial: monto,
                            saldoPendiente: monto,
                            estado: "PENDIENTE",
                            transaccionOrigenId: transaccion.id
                        }
                    });
                    obligacionId = obligacion.id;
                }

                const fuec = await tx.planillaFUEC.create({
                    data: {
                        consecutivo: consecutivo21Digitos,
                        numeroFUEC: nuevoConsecutivoGlobal,
                        numeroExtracto: nuevoNumeroExtracto,
                        contratoId: data.contratoId,
                        vehiculoId: data.vehiculoId as string,
                        conductor1Id: data.conductor1Id as string,
                        conductor2Id: data.conductor2Id || null,
                        conductor3Id: data.conductor3Id || null,
                        resolucionId: resolucion.id,
                        transaccionId: transaccion.id,
                        obligacionId: obligacionId,
                        ruta: data.rutas as unknown as Prisma.JsonArray,
                        objetoViaje: data.objetoViaje || contrato.objeto,
                        fechaInicio: data.fechaInicio,
                        fechaFin: data.fechaFin,
                        pagoValor: new Prisma.Decimal(monto),
                        modoPago: modoPago,
                        estadoCobro: modoPago === "CREDITO" ? "PENDIENTE" : "COBRADO",
                        tokenQR: `${Math.random().toString(36).substring(2, 9)}-${nuevoConsecutivoGlobal}`,
                        estado: EstadoFUEC.ACTIVO,
                    },
                    include: {
                        vehiculo: true,
                        conductor1: true,
                        conductor2: true,
                        conductor3: true,
                        contrato: true,
                        resolucion: true,
                    },
                });

                await tx.auditLog.create({
                    data: {
                        actorId: data.creadoPorId,
                        accion: "CREAR",
                        entidadTipo: "PlanillaFUEC",
                        entidadId: fuec.id,
                        detalles: JSON.stringify({
                            consecutivo: consecutivo21Digitos,
                            forzado: data.force,
                            justificacion: data.justificacion || null,
                        }),
                    },
                });

                await CacheService.invalidate("fuec");
                return { success: true, data: fuec };
            });
        } catch (error) {
            logger.error(
                { error, data },
                "FuecGeneratorService.generate error",
            );
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Fallo crítico en el motor FUEC",
            };
        }
    }

    /**
     * Anula una planilla FUEC
     */
    static async invalidate(id: string, motivo: string, currentVersion?: number): Promise<ActionResult> {
        try {
            const updateResult = await prisma.planillaFUEC.update({
                where: { 
                    id,
                    ...(currentVersion !== undefined ? { version: currentVersion } : {})
                },
                data: { 
                    estado: EstadoFUEC.ANULADO,
                    version: { increment: 1 }
                },
            });

            if (!updateResult) {
                return { success: false, error: "Planilla no encontrada o conflicto de versión" };
            }

            await CacheService.invalidate("fuec");
            return { success: true, message: "Planilla anulada exitosamente." };
        } catch (error) {
            logger.error(
                { error, id },
                "FuecGeneratorService.invalidate error",
            );
            return { success: false, error: "Error al anular la planilla" };
        }
    }

    private static async checkIfAdmin(userId: string): Promise<boolean> {
        return await CacheService.remember(`user:role:${userId}`, 300, async () => {
            const user = await prisma.usuario.findUnique({
                where: { id: userId },
                select: { rol: true },
            });
            return user?.rol === "ADMIN";
        });
    }

    private static async checkWalletBalance(
        userId: string,
    ): Promise<{ canEmit: boolean; balance: number }> {
        const debtResult = await DebtService.canOperate(userId);
        if (!debtResult.success) return { canEmit: false, balance: 0 };
        return {
            canEmit: debtResult.data?.canOperate || false,
            balance: debtResult.data?.saldoPendiente || 0,
        };
    }
}
