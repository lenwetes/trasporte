import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { 
  EstadoCuota, 
  EstadoPrestamo,
  Prisma,
  PrismaClient
} from "@prisma/client";
import { LoanAmortizationCalculator } from "./loan-amortization.calculator";
import logger from "@/lib/logger";

type PrestamoWithCuotas = Prisma.PrestamoGetPayload<{
  include: { cuotas: true }
}>;

export class AmortizationEngineService {
  /**
   * Genera o regenera el plan de cuotas para un préstamo.
   * Se usa durante la solicitud inicial y el desembolso.
   */
  static async processAmortization(
    prestamoId: string, 
    fechaBase: Date,
    tx?: Prisma.TransactionClient
  ): Promise<ActionResult<void>> {
    const client = tx || prisma;
    
    try {
      const p = await client.prestamo.findUnique({
        where: { id: prestamoId },
        include: { cuotas: true }
      }) as PrestamoWithCuotas | null;

      if (!p) return { success: false, error: "Préstamo no encontrado" };

      // Si ya tiene cuotas pagadas o parciales, no regeneramos masivamente por seguridad
      const hasPaid = p.cuotas.some(c => c.estado !== EstadoCuota.PENDIENTE);
      if (hasPaid && p.estado === EstadoPrestamo.DESEMBOLSADO) {
        return { success: false, error: "No se puede regenerar plan con cuotas pagadas/parciales" };
      }

      // 1. Calcular nuevo plan
      const isDiario = p.tipo === "FLEXIBLE_DIARIO";
      const plan = LoanAmortizationCalculator.calculate(
        Number(p.montoCapital),
        Number(p.tasaMensual),
        p.numCuotas,
        isDiario,
        fechaBase
      );

      // 2. Limpiar cuotas existentes si las hay (solo pendientes)
      await client.cuotaPrestamo.deleteMany({
        where: { 
            prestamoId,
            estado: EstadoCuota.PENDIENTE
        }
      });

      // 3. Insertar nuevas cuotas
      await client.cuotaPrestamo.createMany({
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

      logger.info({ prestamoId, totalCuotas: plan.length }, "Plan de amortización automatizado generado");
      return { success: true };
    } catch (error) {
      logger.error({ error, prestamoId }, "Error en motor de amortización");
      return { success: false, error: "Fallo al procesar motor de amortización" };
    }
  }

  /**
   * Ajusta el plan de cuotas al momento exacto del desembolso.
   * Esto asegura que las fechas de vencimiento inicien desde el desembolso real.
   */
  static async syncWithDisbursement(prestamoId: string, tx?: Prisma.TransactionClient): Promise<ActionResult<void>> {
      return await this.processAmortization(prestamoId, new Date(), tx);
  }
}
