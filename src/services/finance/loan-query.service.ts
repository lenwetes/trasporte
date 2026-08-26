

import { prisma } from "@/lib/prisma";
import { 
  ActionResult, 
  PrestamoWithRelations 
} from "@/types";
import { 
  EstadoPrestamo, 
  EstadoCuota,
  Rol
} from "@prisma/client";
import logger from "@/lib/logger";
import { LoanAmortizationCalculator } from "./loan-amortization.calculator";

export class LoanQueryService {
  /**
   * Dashboard de préstamos con fondo configurable
   */
  static async getLoanDashboard(): Promise<unknown> {
    const cuentaFondo = await prisma.cuentaContable.findUnique({
        where: { codigo: "110510" }
    });

    const [stats, list] = await Promise.all([
      prisma.prestamo.aggregate({
        _sum: { saldoActual: true, montoCapital: true },
        _count: { id: true },
        where: { estado: EstadoPrestamo.DESEMBOLSADO }
      }),
      prisma.prestamo.findMany({
        take: 10,
        orderBy: { creadoEn: 'desc' },
        include: { usuario: true }
      })
    ]);

    let fondoDisponible = 0;
    let nombreFondo = "FONDO PRÉSTAMOS";

    if (cuentaFondo) {
        const balance = await prisma.asientoContable.aggregate({
            _sum: { debito: true, credito: true },
            where: { cuentaId: cuentaFondo.id }
        });
        fondoDisponible = Number(balance._sum.debito || 0) - Number(balance._sum.credito || 0);
        nombreFondo = cuentaFondo.nombre.toUpperCase();
    }

    const cuentaCaja = await prisma.cuentaContable.findUnique({
        where: { codigo: "110505" }
    });

    let cajaGeneral = 0;
    if (cuentaCaja) {
        const balance = await prisma.asientoContable.aggregate({
            _sum: { debito: true, credito: true },
            where: { cuentaId: cuentaCaja.id }
        });
        cajaGeneral = Number(balance._sum.debito || 0) - Number(balance._sum.credito || 0);
    }

    return {
      totalPrestado: Number(stats._sum.montoCapital || 0),
      carteraVigente: Number(stats._sum.saldoActual || 0),
      prestamosActivos: stats._count.id,
      fondoDisponible,
      cajaGeneral,
      nombreFondo,
      recientes: list
    };
  }

  static async getLoanById(id: string): Promise<ActionResult<unknown>> {
    try {
      let p = await prisma.prestamo.findUnique({
        where: { id },
        include: { 
          usuario: true, 
          cuotas: { orderBy: { numCuota: 'asc' } } 
        }
      });

      // Si es PENDIENTE y no tiene cuotas, las generamos para el contrato (Backfill automático)
      if (p && p.estado === EstadoPrestamo.PENDIENTE && p.cuotas.length === 0) {
          const isDiario = p.tipo === "FLEXIBLE_DIARIO";
          const plan = LoanAmortizationCalculator.calculate(
            Number(p.montoCapital),
            Number(p.tasaMensual),
            p.numCuotas,
            isDiario,
            new Date()
          );

          await prisma.cuotaPrestamo.createMany({
            data: plan.map(c => ({
              prestamoId: p!.id,
              numCuota: c.numCuota,
              fechaVencimiento: c.fechaVencimiento,
              valorCapital: c.valorCapital,
              valorInteres: c.valorInteres,
              totalCuota: c.totalCuota,
              estado: EstadoCuota.PENDIENTE
            }))
          });

          // Recargar
          p = await prisma.prestamo.findUnique({
            where: { id },
            include: { 
              usuario: true, 
              cuotas: { orderBy: { numCuota: 'asc' } } 
            }
          });
      }

      return { success: true, data: p };
    } catch (error) {
       logger.error({ error }, "Error al obtener detalle de préstamo");
       return { success: false, error: "Error de consulta" };
    }
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
      try {
          const u = await prisma.usuario.create({
              data: {
                  nombres: data.nombres,
                  apellidos: data.apellidos,
                  numeroDocumento: data.documento,
                  email: data.email,
                  telefono: data.telefono,
                  direccion: data.direccion,
                  rol: Rol.COLABORADOR,
                  passwordHash: "EXTERNO_NO_LOGIN",
                  activo: true
              }
          });
          return { success: true, data: u };
      } catch (error) {
          logger.error({ error }, "Error al crear tercero especializado");
          return { success: false, error: "Error al crear tercero. Verifique duplicidad de documento o email." };
      }
  }
}
