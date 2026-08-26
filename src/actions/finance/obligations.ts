"use server";

import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/actions/audit";
import { ActionResult } from "@/types";
import { FinanceService } from "@/services/finance.service";
import { withAuth } from "@/lib/safe-action";
import { serializeDecimal } from "@/lib/utils";
import logger from "@/lib/logger";

/**
 * Crea una obligación financiera manual y su respectiva transacción contable de causación.
 */
export const createManualObligation = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (dataInput: unknown): Promise<ActionResult> => {
        const { auth } = await import("@/auth");
        const session = await auth();
        const creadoPorId = session?.user?.id;
        const { prisma } = await import("@/lib/prisma");

        if (!creadoPorId) return { success: false, error: "Sesión no válida" };

        try {
            const payload = dataInput as {
                usuarioId: string;
                vehiculoId?: string;
                tipo: import("@prisma/client").TipoObligacion;
                monto: number | string;
                periodo: string | Date;
                fechaVence: string | Date;
                descripcion?: string;
            };
            const {
                usuarioId,
                vehiculoId,
                tipo,
                monto,
                periodo,
                fechaVence,
                descripcion,
            } = payload;

            // 1. Obtener Cuentas Necesarias (Cartera vs Ingresos/Otros)
            // Por defecto: 130505 (Cartera) vs 415505 (Ingresos)
            const [cuentaCartera, cuentaIngreso] = await Promise.all([
                prisma.cuentaContable.findUnique({
                    where: { codigo: "130505" },
                }),
                prisma.cuentaContable.findUnique({
                    where: { codigo: "415505" },
                }),
            ]);

            if (!cuentaCartera || !cuentaIngreso) {
                return {
                    success: false,
                    error: "Configuración contable (130505/415505) no encontrada",
                };
            }

            // 2. Crear Transacción Contable de Causación
            const txResult = await FinanceService.createTransaction({
                descripcion:
                    descripcion ||
                    `Causación ${tipo} - ${new Date(periodo).getMonth() + 1}/${new Date(periodo).getFullYear()}`,
                tipo: "NOTA_CONTABLE",
                terceroId: usuarioId,
                metaVehiculoId: vehiculoId,
                creadoPorId,
                asientos: [
                    {
                        cuentaId: cuentaCartera.id,
                        debito: Number(monto),
                        credito: 0,
                    },
                    {
                        cuentaId: cuentaIngreso.id,
                        debito: 0,
                        credito: Number(monto),
                    },
                ],
            });

            if (!txResult.success || !txResult.data) {
                return txResult;
            }

            // 3. Crear Obligación Financiera vinculada
            const obligacion = await prisma.obligacionFinanciera.create({
                data: {
                    usuarioId,
                    vehiculoId: vehiculoId || undefined,
                    tipo,
                    montoInicial: Number(monto),
                    saldoPendiente: Number(monto),
                    periodo: new Date(periodo),
                    fechaVence: new Date(fechaVence),
                    estado: "PENDIENTE",
                    transaccionOrigenId: (txResult.data as { id: string }).id,
                },
            });

            await createAuditLog(
                creadoPorId,
                "CREAR",
                "ObligacionFinanciera",
                obligacion.id,
                `Obligación manual creada por ${monto}`,
            );

            revalidatePath("/dashboard/finance/payments");
            revalidatePath("/dashboard/finance");

            return serializeDecimal({
                success: true,
                data: obligacion,
                message: "Obligación generada con éxito",
            });
        } catch (error) {
            logger.error(
                { error },
                "[obligations] Error en createManualObligation",
            );
            return {
                success: false,
                error: "Error interno al crear la obligación",
            };
        }
    },
    "createManualObligation",
);
