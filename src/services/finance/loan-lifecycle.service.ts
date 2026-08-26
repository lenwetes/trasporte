

import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { 
  EstadoPrestamo, 
  EstadoCuota, 
  TipoCredito, 
  TipoTransaccion,
  MetodoPago,
  Rol,
  NaturalezaCuenta
} from "@prisma/client";
import { FinanceTransactionService } from "./finance-transaction.service";
import { Decimal } from "decimal.js";
import logger from "@/lib/logger";
import { differenceInDays } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { LoanAmortizationCalculator } from "./loan-amortization.calculator";
import { AmortizationEngineService } from "./amortization-engine.service";

export class LoanLifecycleService {
  /**
   * Traslado de fondos entre Cajas (Caja Menor -> Fondo Préstamos)
   */
  static async transferFunds(monto: number, actorId: string): Promise<ActionResult<unknown>> {
      return await prisma.$transaction(async (tx) => {
          const cuentaCaja = await tx.cuentaContable.findUnique({ where: { codigo: "110505" } });
          const cuentaFondo = await tx.cuentaContable.findUnique({ where: { codigo: "110510" } });

          if (!cuentaCaja?.id || !cuentaFondo?.id) {
              return { success: false, error: "CRÍTICO: Cuentas PUC (110505, 110510) no configuradas en el sistema" };
          }

          const agregadosCaja = await tx.asientoContable.aggregate({
              where: { cuentaId: cuentaCaja.id },
              _sum: { debito: true, credito: true }
          });
          const saldoCaja = Number(agregadosCaja._sum.debito || 0) - Number(agregadosCaja._sum.credito || 0);

          if (saldoCaja < monto) {
              return { success: false, error: `RECHAZADO: Saldo insuficiente en Caja General. Disponible: $${saldoCaja.toLocaleString()}` };
          }

          const createRes = await FinanceTransactionService.createTransaction({
              tipo: TipoTransaccion.NOTA_CONTABLE,
              creadoPorId: actorId,
              descripcion: `TRASLADO INTERNO PARA CAPITAL DE PRÉSTAMOS (REPOSICIÓN)`,
              asientos: [
                  { cuentaId: cuentaFondo.id, debito: monto, credito: 0 },
                  { cuentaId: cuentaCaja.id, debito: 0, credito: monto }
              ],
              documentoNumero: `TR-${Date.now().toString().slice(-6)}`
          }, tx);

          if (!createRes.success) {
              throw new Error(createRes.error);
          }

          return { success: true, message: "Fondo de préstamos recargado con éxito" };
      });
  }

  /**
   * Solicita un crédito (Genera cuotas de forma preventiva para el contrato)
   */
  static async requestLoan(data: {
    usuarioId: string;
    monto: number;
    tasa: number;
    cuotas: number;
    tipo: TipoCredito;
    observaciones?: string;
  }): Promise<ActionResult<unknown>> {
    try {
      return await prisma.$transaction(async (tx) => {
        const cuentaFondo = await tx.cuentaContable.findUnique({ where: { codigo: "110510" } });
        if (!cuentaFondo) return { success: false, error: "Falta configurar cuenta (110510) Fondo de Préstamos." };

        const agregados = await tx.asientoContable.aggregate({
            where: { cuentaId: cuentaFondo.id },
            _sum: { debito: true, credito: true }
        });
        const saldoFondo = Number(agregados._sum.debito || 0) - Number(agregados._sum.credito || 0);

        if (saldoFondo < data.monto) {
             return { success: false, error: `RECHAZADO: El fondo de préstamos no tiene liquidez suficiente. Disponible: $${saldoFondo.toLocaleString()}` };
        }

        const p = await tx.prestamo.create({
          data: {
            usuarioId: data.usuarioId,
            montoCapital: data.monto,
            saldoActual: data.monto,
            tasaMensual: data.tasa,
            numCuotas: data.cuotas,
            tipo: data.tipo,
            observaciones: data.observaciones,
            estado: EstadoPrestamo.PENDIENTE
          }
        });

      // 1. Calcular nuevo plan
      const isDiario = p.tipo === "FLEXIBLE_DIARIO";
      const plan = LoanAmortizationCalculator.calculate(
        Number(p.montoCapital),
        Number(p.tasaMensual),
        p.numCuotas,
        isDiario,
        new Date()
      );

      // 2. Limpiar cuotas existentes si las hay (solo pendientes)
      await tx.cuotaPrestamo.deleteMany({
        where: { 
            prestamoId: p.id,
            estado: EstadoCuota.PENDIENTE
        }
      });

      // 3. Insertar nuevas cuotas
      await tx.cuotaPrestamo.createMany({
        data: plan.map((c) => ({
          prestamoId: p.id,
          numCuota: c.numCuota,
          fechaVencimiento: c.fechaVencimiento,
          valorCapital: c.valorCapital,
          valorInteres: c.valorInteres,
          totalCuota: c.totalCuota,
          estado: EstadoCuota.PENDIENTE,
          montoPagado: 0
        }))
      });
   return { success: true, data: p };
      });
    } catch (error) {
       logger.error({ error }, "Error en solicitud de crédito");
       return { success: false, error: "Error de registro de crédito" };
    }
  }

  /**
   * Desembolso de crédito
   */
  static async disburseLoan(prestamoId: string, creadoPorId: string): Promise<ActionResult<unknown>> {
    try {
      return await prisma.$transaction(async (tx) => {
        const p = await tx.prestamo.findUnique({
          where: { id: prestamoId },
          include: { usuario: true }
        });

        if (!p || p.estado !== EstadoPrestamo.PENDIENTE) {
          return { success: false, error: "Préstamo no válido para desembolso" };
        }

        // @ts-ignore: Prisma field confirmation
        if (!p.documentoFirmadoUrl) {
            return { success: false, error: "BLOQUEO: No se puede desembolsar sin el Contrato de Mutuo radicado y firmado." };
        }

        const cuentaCartera = await tx.cuentaContable.findUnique({ where: { codigo: "136530" } });
        const cuentaFondo = await tx.cuentaContable.findUnique({ where: { codigo: "110510" } });

        if (!cuentaCartera?.id || !cuentaFondo?.id) {
            return { success: false, error: "CRÍTICO: Cuentas PUC (136530 Cartera, 110510 Fondo) no configuradas" };
        }

        const agregados = await tx.asientoContable.aggregate({
            where: { cuentaId: cuentaFondo.id },
            _sum: { debito: true, credito: true }
        });
        const saldoFondo = Number(agregados._sum.debito || 0) - Number(agregados._sum.credito || 0);

        if (saldoFondo < Number(p.montoCapital)) {
               return { success: false, error: `BLOQUEO: El fondo de préstamos se quedó sin liquidez tras la solicitud. Disponible: $${saldoFondo.toLocaleString()}` };
        }
        
        const txResult = await FinanceTransactionService.createTransaction({
          tipo: TipoTransaccion.EGRESO,
          creadoPorId: creadoPorId,
          terceroId: p.usuarioId,
          descripcion: `DESEMBOLSO PRÉSTAMO [${p.tipo}] #${p.id.slice(-6)}`,
          asientos: [
            { cuentaId: cuentaCartera.id, debito: Number(p.montoCapital), credito: 0 },
            { cuentaId: cuentaFondo.id, debito: 0, credito: Number(p.montoCapital) }
          ],
          documentoNumero: `CE-PR-${p.id.slice(-4)}`
        }, tx);

        if (!txResult.success) {
            throw new Error(txResult.error);
        }

        // DINÁMICO: Sincronizar plan de amortización con fecha real de desembolso
        const syncRes = await AmortizationEngineService.syncWithDisbursement(prestamoId, tx);
        if (!syncRes.success) {
            throw new Error(`Sincronización Fallida: ${syncRes.error}`);
        }

        const updated = await tx.prestamo.update({
          where: { id: prestamoId },
          data: {
            estado: EstadoPrestamo.DESEMBOLSADO,
            fechaDesembolso: new Date(),
            fechaAprobacion: new Date()
          }
        });

        return { success: true, data: updated };
      });
    } catch (error) {
       logger.error({ error, prestamoId }, "Error en desembolso de préstamo");
       return { success: false, error: error instanceof Error ? error.message : "Error durante el desembolso" };
    }
  }

  /**
   * Recaudo de Cuota (Soporta pagos parciales y amortización dinámica)
   */
  static async payInstallment(params: {
      cuotaId: string; 
      montoRecibido: number; 
      actorId: string;
      metodoPago?: MetodoPago;
      soporteUrl?: string;
      soporteId?: string;
  }): Promise<ActionResult<unknown>> {
    const { cuotaId, montoRecibido, actorId, metodoPago = MetodoPago.EFECTIVO, soporteUrl, soporteId } = params;
    try {
      return await prisma.$transaction(async (tx) => {
        const cuota = await tx.cuotaPrestamo.findUnique({
          where: { id: cuotaId },
          include: { prestamo: { include: { usuario: true } } }
        });

        if (!cuota || cuota.estado === EstadoCuota.PAGADA) {
          return { success: false, error: "Cuota no pagable o ya cancelada" };
        }

        const montoTotalYaPagado = new Decimal(cuota.montoPagado.toString()).plus(montoRecibido);
        const totalCuota = new Decimal(cuota.totalCuota.toString());
        
        let nuevoEstado: EstadoCuota = EstadoCuota.PAGADA;
        if (montoTotalYaPagado.lt(totalCuota.minus(1))) { 
            nuevoEstado = EstadoCuota.PARCIAL;
        }

        const interesDeLaCuota = new Decimal(cuota.valorInteres.toString());
        const pagadoAnteriormente = new Decimal(cuota.montoPagado.toString());
        
        let baseParaInteres = interesDeLaCuota.minus(pagadoAnteriormente);
        if (baseParaInteres.lt(0)) baseParaInteres = new Decimal(0);
        
        let abonoAInteres = new Decimal(0);
        let abonoACapital = new Decimal(0);
        
        if (montoRecibido >= baseParaInteres.toNumber()) {
            abonoAInteres = baseParaInteres;
            abonoACapital = new Decimal(montoRecibido).minus(baseParaInteres).toNearest(1, Decimal.ROUND_HALF_UP);
        } else {
            abonoAInteres = new Decimal(montoRecibido).toNearest(1, Decimal.ROUND_HALF_UP);
            abonoACapital = new Decimal(0);
        }

        await tx.cuotaPrestamo.update({
          where: { id: cuotaId },
          data: {
            montoPagado: { increment: montoRecibido },
            estado: nuevoEstado,
            fechaPago: new Date()
          }
        });

        const prestamoActualizado = await tx.prestamo.update({
          where: { id: cuota.prestamoId },
          data: {
            saldoActual: { decrement: abonoACapital.toNumber() }
          }
        });

        // DINÁMICO: Si el pago afectó el capital, recalculamos el plan futuro
        if (abonoACapital.gt(0)) {
            const cuotasSiguientes = await tx.cuotaPrestamo.findMany({
                where: { 
                    prestamoId: cuota.prestamoId, 
                    estado: { not: EstadoCuota.PAGADA },
                    numCuota: { gt: cuota.numCuota }
                },
                orderBy: { numCuota: 'asc' }
            });

            if (cuotasSiguientes.length > 0) {
                const nuevoPlan = LoanAmortizationCalculator.calculate(
                    Number(prestamoActualizado.saldoActual),
                    Number(prestamoActualizado.tasaMensual),
                    cuotasSiguientes.length,
                    prestamoActualizado.tipo === "FLEXIBLE_DIARIO",
                    new Date(cuota.fechaVencimiento)
                );

                for (let i = 0; i < cuotasSiguientes.length; i++) {
                    await tx.cuotaPrestamo.update({
                        where: { id: cuotasSiguientes[i].id },
                        data: {
                            valorCapital: nuevoPlan[i].valorCapital,
                            valorInteres: nuevoPlan[i].valorInteres,
                            totalCuota: nuevoPlan[i].totalCuota,
                            montoPagado: 0
                        }
                    });
                }
            }
        }

        if (new Decimal(prestamoActualizado.saldoActual.toString()).lte(0.1)) {
            await tx.prestamo.update({
                where: { id: cuota.prestamoId },
                data: { estado: EstadoPrestamo.CANCELADO, saldoActual: 0 }
            });
        }

        // Contabilidad
        const cuentaCaja = await tx.cuentaContable.findUnique({ where: { codigo: "110505" } });
        const cuentaCartera = await tx.cuentaContable.findUnique({ where: { codigo: "136530" } });
        const cuentaIntereses = await tx.cuentaContable.findUnique({ where: { codigo: "421005" } });
        
        if (!cuentaCaja?.id || !cuentaCartera?.id || !cuentaIntereses?.id) {
            return { success: false, error: "CRÍTICO: Cuentas PUC (110505, 136530, 421005) no configuradas" };
        }

        const txResult = await FinanceTransactionService.createTransaction({
            tipo: TipoTransaccion.INGRESO,
            creadoPorId: actorId,
            terceroId: cuota.prestamo.usuarioId,
            descripcion: `RECAUDO ${nuevoEstado === EstadoCuota.PARCIAL ? 'PARCIAL' : 'TOTAL'} CUOTA ${cuota.numCuota}/${cuota.prestamo.numCuotas} PRÉSTAMO #${cuota.prestamoId.slice(-6)}`,
            metodoPago,
            soporteUrl,
            archivoIds: soporteId ? [soporteId] : undefined,
            asientos: [
                { cuentaId: cuentaCaja.id, debito: montoRecibido, credito: 0 },
                { cuentaId: cuentaCartera.id, debito: 0, credito: abonoACapital.toNumber() },
                { cuentaId: cuentaIntereses.id, debito: 0, credito: abonoAInteres.toNumber() }
            ],
            documentoNumero: `RC-${nuevoEstado === EstadoCuota.PARCIAL ? 'P' : 'T'}-${Date.now().toString().slice(-6)}`
        }, tx);

        if (!txResult.success) {
            throw new Error(txResult.error);
        }

        return { success: true, message: `Recaudo ${nuevoEstado === EstadoCuota.PARCIAL ? 'parcial' : 'total'} registrado con éxito` };
      });
    } catch (error) {
       logger.error({ error, cuotaId }, "Error en recaudo de cuota");
       return { success: false, error: error instanceof Error ? error.message : "Error durante el registro del pago" };
    }
  }

  /**
   * Radica el documento firmado en la base de datos
   */
  static async radicateDocument(loanId: string, url: string): Promise<ActionResult<unknown>> {
      try {
          const updated = await prisma.prestamo.update({
              where: { id: loanId },
              data: { documentoFirmadoUrl: url }
          });
          return { success: true, data: updated };
      } catch (error) {
          return { success: false, error: "Error al radicar documento" };
      }
  }

  /**
   * Liquidación total de un préstamo (Interés a prorrata dinámica)
   */
  static async liquidateLoan(params: {
      prestamoId: string; 
      actorId: string;
      metodoPago?: MetodoPago;
      soporteUrl?: string;
      soporteId?: string;
  }): Promise<ActionResult<unknown>> {
      const { prestamoId, actorId, metodoPago = MetodoPago.EFECTIVO, soporteUrl, soporteId } = params;
      try {
          return await prisma.$transaction(async (tx) => {
              const p = await tx.prestamo.findUnique({
                  where: { id: prestamoId },
                  include: { cuotas: { orderBy: { numCuota: 'asc' } } }
              });

              if (!p || p.estado !== EstadoPrestamo.DESEMBOLSADO) {
                  return { success: false, error: "Solo se pueden liquidar préstamos activos" };
              }

              const ultimaCuotaPagada = p.cuotas.filter(c => c.estado === EstadoCuota.PAGADA).sort((a, b) => b.numCuota - a.numCuota)[0];
              const fechaBase = ultimaCuotaPagada ? new Date(ultimaCuotaPagada.fechaVencimiento) : new Date(p.fechaDesembolso!);
              const hoy = new Date();
              
              const diasTranscurridos = Math.max(0, differenceInDays(hoy, fechaBase));
              const tasaMensual = new Decimal(p.tasaMensual.toString());
              
              const interesCausado = new Decimal(p.saldoActual.toString())
                .times(tasaMensual.div(30))
                .times(diasTranscurridos)
                .toNearest(1, Decimal.ROUND_HALF_UP);
              
              const totalCapital = new Decimal(p.saldoActual.toString());
              const totalLiquidacion = totalCapital.plus(interesCausado);

              await tx.cuotaPrestamo.updateMany({
                  where: { prestamoId, estado: { not: EstadoCuota.PAGADA } },
                  data: { 
                      estado: EstadoCuota.PAGADA,
                      fechaPago: hoy,
                      montoPagado: 0
                  }
              });

              const updated = await tx.prestamo.update({
                  where: { id: prestamoId },
                  data: {
                      saldoActual: 0,
                      estado: EstadoPrestamo.CANCELADO
                  }
              });

              const cuentaCaja = await tx.cuentaContable.findUnique({ where: { codigo: "110505" } });
              const cuentaCartera = await tx.cuentaContable.findUnique({ where: { codigo: "136530" } });
              const cuentaIntereses = await tx.cuentaContable.findUnique({ where: { codigo: "421005" } });

              if (!cuentaCaja?.id || !cuentaCartera?.id || !cuentaIntereses?.id) {
                  return { success: false, error: "CRÍTICO: Cuentas PUC (110505, 136530, 421005) no configuradas" };
              }

              const txResult = await FinanceTransactionService.createTransaction({
                  tipo: TipoTransaccion.INGRESO,
                  creadoPorId: actorId,
                  terceroId: p.usuarioId,
                  descripcion: `LIQUIDACIÓN TOTAL DINÁMICA PRÉSTAMO #${p.id.slice(-6)} (${diasTranscurridos} días causados)`,
                  metodoPago,
                  soporteUrl,
                  archivoIds: soporteId ? [soporteId] : undefined,
                  asientos: [
                      { cuentaId: cuentaCaja.id, debito: totalLiquidacion.toNumber(), credito: 0 },
                      { cuentaId: cuentaCartera.id, debito: 0, credito: totalCapital.toNumber() },
                      { cuentaId: cuentaIntereses.id, debito: 0, credito: interesCausado.toNumber() }
                  ],
                  documentoNumero: `LQ-${Date.now().toString().slice(-6)}`
              }, tx);

              if (!txResult.success) {
                  throw new Error(txResult.error);
              }

              return { success: true, message: `Préstamo liquidado totalmente (Capital: ${formatCurrency(totalCapital.toNumber())}, Interés causado: ${formatCurrency(interesCausado.toNumber())})`, data: updated };
          });
      } catch (error) {
          logger.error({ error, prestamoId }, "Error en liquidación de préstamo");
          return { success: false, error: error instanceof Error ? error.message : "Error durante la liquidación" };
      }
  }
}
