"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult, TransaccionWithRelations } from "@/types";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/actions/audit";
import { FinanceService } from "@/services/finance.service";
import { serializeDecimal } from "@/lib/utils";
import { MetodoPago } from "@prisma/client";
import logger from "@/lib/logger";

export interface DetallePago {
    metodo: MetodoPago;
    monto: number;
}

interface CreateCashMovementInput {
    tipo: "INGRESO" | "EGRESO" | "SALDO_INICIAL";
    conceptoId: string;
    monto: number;
    detallesPago: DetallePago[];
    descripcion?: string;
    fechaOperacion?: Date;
    terceroId?: string;
    proveedorId?: string;
    archivoId?: string;
}

/**
 * Registra un movimiento de caja con soporte para pagos mixtos (Split Payments)
 */
export async function createCashMovement(
    input: CreateCashMovementInput,
): Promise<ActionResult<TransaccionWithRelations>> {
    try {
        // 1. Autenticación
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "No autenticado"  };
        }

        // 2. Autorización (Solo ADMIN y SECRETARIA)
        if (session.user.rol !== "ADMIN" && session.user.rol !== "SECRETARIA") {
            return { success: false, error: "No autorizado"  };
        }

        // 3. Validar concepto (Opcional para SALDO_INICIAL)
        let finalCuentaId = "";
        let conceptoNombre = "SALDO INICIAL";

        if (input.tipo !== "SALDO_INICIAL") {
            const concepto = await prisma.conceptoFinanciero.findUnique({
                where: { id: input.conceptoId },
                include: { cuenta: true },
            });

            if (!concepto) {
                return { success: false, error: "Concepto no encontrado"  };
            }
            finalCuentaId = concepto.cuentaId;
            conceptoNombre = concepto.nombre;

            // --- PUC GUARD: Corrección de Otros Ingresos para evitar Multas y Sanciones ---
            const isMiscellaneous = concepto.nombre.toLowerCase().includes("otros ingresos");
            
            if (isMiscellaneous && concepto.cuenta.codigo === "429505") {
                // Buscamos la cuenta genérica 429595 o similar
                const correctAccount = await prisma.cuentaContable.findFirst({
                    where: { codigo: { in: ["429595", "429501", "420501"] } }
                });
                if (correctAccount) {
                    finalCuentaId = correctAccount.id;
                }
            }
        } else {
            // Para SALDO_INICIAL, la contrapartida es Aportes Sociales (311505) o similar
            const contrapartida = await prisma.cuentaContable.findFirst({
                where: { codigo: { startsWith: "3115" } } 
            });
            if (!contrapartida) {
                return { success: false, error: "Cuenta de Aportes Sociales no configurada para apertura" };
            }
            finalCuentaId = contrapartida.id;
        }

        // 4. Validar suma de montos sea igual al total
        const sumaDetalles = input.detallesPago.reduce((sum, p) => sum + p.monto, 0);
        if (Math.abs(sumaDetalles - input.monto) > 0.01) {
            return { 
                success: false, 
                error: `La suma de los pagos (${sumaDetalles}) no coincide con el monto total (${input.monto})` 
            };
        }

        // 5. Obtener configuración global
        const config = await prisma.configuracionGlobal.findFirst();
        if (!config) {
            return { success: false, error: "Configuración global no encontrada" };
        }

        // 6. Generación de Numero de Comprobante (Serialización)
        const prefix = input.tipo === "INGRESO" ? "RC" : "CE";
        let numeroComprobante = `${prefix}-${Date.now().toString().slice(-6)}`;
        let resolucionId: string | undefined = undefined;

        try {
            const resolucion = await prisma.resolucionContable.findFirst({
                where: { prefijo: prefix, activa: true }
            });
            if (resolucion) {
                const nextVal = resolucion.actual + 1;
                numeroComprobante = `${resolucion.prefijo}-${nextVal}`;
                resolucionId = resolucion.id;
                
                // Reservar el número actualizando la resolución
                await prisma.resolucionContable.update({
                    where: { id: resolucion.id },
                    data: { actual: nextVal }
                });
            }
        } catch (e) {
            logger.warn({ error: e, prefix }, "Sin resolución contable activa. Usando fallback temporal.");
        }

        // 6. Preparar asientos contables
        const asientos: { cuentaId: string; debito: number; credito: number; }[] = [];

        // Asiento de Contrapartida (Concepto / Ingreso / Gasto / Saldo Inicial)
        const isEgreso = input.tipo === "EGRESO";
        const isSaldoInicial = input.tipo === "SALDO_INICIAL";

        asientos.push({
            cuentaId: finalCuentaId,
            debito: isEgreso ? input.monto : 0,
            credito: (!isEgreso || isSaldoInicial) ? input.monto : 0,
        });

        // Asientos para cada canal de pago (Caja o Bancos)
        for (const detalle of input.detallesPago) {
            let cuentaId: string | null = null;
            if (detalle.metodo === MetodoPago.EFECTIVO) {
                cuentaId = config.cuentaCajaId;
            } else {
                cuentaId = config.cuentaBancosId;
            }

            if (!cuentaId) {
                return { 
                    success: false, 
                    error: `La cuenta de fondos para ${detalle.metodo} no está configurada.` 
                };
            }

            asientos.push({
                cuentaId,
                debito: (input.tipo === "INGRESO" || input.tipo === "SALDO_INICIAL") ? detalle.monto : 0,
                credito: input.tipo === "EGRESO" ? detalle.monto : 0,
            });
        }

        // 7. Crear transacción
        const descripcion = input.descripcion
            ? `${conceptoNombre} - ${input.descripcion}`
            : conceptoNombre;

        const result = await FinanceService.createTransaction({
            descripcion,
            tipo: input.tipo === "SALDO_INICIAL" ? "INGRESO" : input.tipo,
            metodoPago: input.detallesPago[0]?.metodo || MetodoPago.OTRO, // Principal
            asientos,
            fechaOperacion: input.fechaOperacion || new Date(),
            numeroComprobante,
            resolucionId,
            creadoPorId: session.user.id,
            terceroId: input.terceroId,
            proveedorId: input.proveedorId,
            archivoIds: input.archivoId ? [input.archivoId] : undefined,
        });

        if (!result.success || !result.data) {
            return { success: false, error: result.error || "Fallo en registro contable" };
        }

        // 8. Auditoría
        await createAuditLog(
            session.user.id,
            "CREAR",
            "Transaccion",
            result.data.id,
            `Movimiento de caja mixto: ${input.tipo} - ${conceptoNombre} - ${input.monto}`,
        );

        revalidatePath("/dashboard/finance");

        return serializeDecimal({
            success: true,
            message: "Registro consolidado exitosamente",
            data: result.data as TransaccionWithRelations,
        });
    } catch (error) {
        logger.error({ error }, "Error en createCashMovement (pagos mixtos)");
        return {
            success: false,
            error: "Error interno al procesar el pago mixto",
        };
    }
}

/**
 * Cierre técnico de caja
 */
export async function closeCash(data: {
    fecha: Date;
    saldoTeorico: number;
    saldoFisico: number;
    observaciones?: string;
}): Promise<ActionResult<unknown>> {
    try {
        const session = await auth();
        if (!session?.user?.id)
            return { success: false, error: "No autenticado"  };
        if (session.user.rol !== "ADMIN" && session.user.rol !== "SECRETARIA") {
            return { success: false, error: "No autorizado"  };
        }

        const diferencia = data.saldoFisico - data.saldoTeorico;

        // Lógica de validación contable para el Ajuste de Caja
        const config = await prisma.configuracionGlobal.findFirst();
        const cuentaCajaId = config?.cuentaCajaId;
        
        const cuentaIngresoAjuste = await prisma.cuentaContable.findFirst({ where: { codigo: { startsWith: "42" } } }); // Buscando Ingreso Diverso
        const cuentaGastoAjuste = await prisma.cuentaContable.findFirst({ where: { codigo: { startsWith: "51" } } }); // Buscando Gasto Operacional
        
        let asientos: any[] = [];
        let tipoTransaccion: "INGRESO" | "EGRESO" | "NOTA_CONTABLE" = "NOTA_CONTABLE";

        if (Math.abs(diferencia) >= 0.01 && cuentaCajaId) {
            if (diferencia > 0 && cuentaIngresoAjuste) {
                tipoTransaccion = "INGRESO";
                asientos = [
                    { cuentaId: cuentaCajaId, debito: diferencia, credito: 0 },
                    { cuentaId: cuentaIngresoAjuste.id, debito: 0, credito: diferencia }
                ];
            } else if (diferencia < 0 && cuentaGastoAjuste) {
                tipoTransaccion = "EGRESO";
                const faltante = Math.abs(diferencia);
                asientos = [
                    { cuentaId: cuentaGastoAjuste.id, debito: faltante, credito: 0 },
                    { cuentaId: cuentaCajaId, debito: 0, credito: faltante }
                ];
            }

            if (asientos.length > 0) {
                await FinanceService.createTransaction({
                    descripcion: `AJUSTE AUTOMÁTICO DE CIERRE DE CAJA | Diff: ${diferencia} | Obs: ${data.observaciones || "S/O"}`,
                    tipo: tipoTransaccion,
                    creadoPorId: session.user.id,
                    asientos: asientos
                });
            }
        }

        const auditDetails = {
            fechaCierre: data.fecha,
            saldoTeorico: data.saldoTeorico,
            saldoFisico: data.saldoFisico,
            diferencia,
            observaciones: data.observaciones,
        };

        await createAuditLog(
            session.user.id,
            "CREAR",
            "CierreCaja",
            null,
            JSON.stringify(auditDetails),
        );

        revalidatePath("/dashboard/finance");

        return {
            success: true,
            message: "Cierre técnico registrado en bitácora de auditoría",
        };
    } catch (error) {
        logger.error({ error }, "Error en closeCash");
        return { success: false, error: "Error al procesar el cierre de caja"  };
    }
}
