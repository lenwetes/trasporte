import { ActionResult } from "@/types";
import { TipoCredito, MetodoPago } from "@prisma/client";
import { LoanAmortizationCalculator } from "./loan-amortization.calculator";
import { LoanQueryService } from "./loan-query.service";
import { LoanLifecycleService } from "./loan-lifecycle.service";

/**
 * @module FinanceLoansService
 * @refactored 2026-03-31
 * @description Orquestador de servicios de préstamos. 
 * El monolito de 643 líneas ha sido desfragmentado en:
 *   - ./loan-amortization.calculator.ts  → Lógica matemática pura
 *   - ./loan-query.service.ts             → Consultas (Dashboard, ID, reporting)
 *   - ./loan-lifecycle.service.ts        → Mutaciones y ciclo de vida (Transaccional)
 */
export class FinanceLoansService {
  /**
   * Calcula la tabla de amortización (Francés o Diario)
   */
  static async calculateAmortization(
    monto: number,
    tasa: number,
    plazo: number,
    isDiario: boolean = false,
    fechaInicio: Date = new Date()
  ) {
    return LoanAmortizationCalculator.calculate(monto, tasa, plazo, isDiario, fechaInicio);
  }

  /**
   * Crea un tercero detallado (Colaborador)
   */
  static async createColaborador(data: { 
      nombres: string; 
      apellidos: string; 
      documento: string;
      email: string;
      telefono: string;
      direccion: string;
  }): Promise<ActionResult<unknown>> {
      return LoanQueryService.createColaborador(data);
  }

  /**
   * Dashboard de préstamos con fondo configurable
   */
  static async getLoanDashboard(): Promise<unknown> {
    return LoanQueryService.getLoanDashboard();
  }

  /**
   * Traslado de fondos entre Cajas (Caja Menor -> Fondo Préstamos)
   */
  static async transferFunds(monto: number, actorId: string): Promise<ActionResult<unknown>> {
      return LoanLifecycleService.transferFunds(monto, actorId);
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
    return LoanLifecycleService.requestLoan(data);
  }

  /**
   * Desembolso de crédito
   */
  static async disburseLoan(prestamoId: string, creadoPorId: string): Promise<ActionResult<unknown>> {
    return LoanLifecycleService.disburseLoan(prestamoId, creadoPorId);
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
    return LoanLifecycleService.payInstallment(params);
  }

  static async getLoanById(id: string): Promise<ActionResult<unknown>> {
    return LoanQueryService.getLoanById(id);
  }

  /**
   * Radica el documento firmado en la base de datos
   */
  static async radicateDocument(loanId: string, url: string): Promise<ActionResult<unknown>> {
      return LoanLifecycleService.radicateDocument(loanId, url);
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
      return LoanLifecycleService.liquidateLoan(params);
  }
}
