"use server";

import { withAuth } from "@/lib/safe-action";
import { ActionResult } from "@/types";
import { prisma } from "@/lib/prisma";
import { FinanceTransactionService } from "@/services/finance/finance-transaction.service";
import { TipoTransaccion, MetodoPago, Rol } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const initialBalanceSchema = z.object({
    cuentaId: z.string().uuid("Seleccione una cuenta válida"),
    monto: z.number().min(0.01, "El monto debe ser positivo"),
    naturaleza: z.enum(["DEBITO", "CREDITO"]),
    fecha: z.date(),
    descripcion: z.string().min(5, "Describa el origen del saldo inicial").default("CARGA DE SALDO INICIAL HISTÓRICO"),
});

export const registerInitialBalanceAction = withAuth(
    [Rol.ADMIN],
    async (...args: unknown[]): Promise<ActionResult> => {
        const input = args[0] as z.infer<typeof initialBalanceSchema>;
        const result = initialBalanceSchema.safeParse(input);

        if (!result.success) {
            return {
                success: false,
                error: "Datos de balance inválidos",
                errors: result.error.flatten().fieldErrors,
            };
        }

        const { auth } = await import("@/auth");
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "No autorizado" };

        const { cuentaId, monto, naturaleza, fecha, descripcion } = result.data;

        // Para un saldo inicial, hacemos una partida contra la cuenta de Patrimonio (3xxx) 
        // o una cuenta de ajuste de saldos iniciales (9999).
        // Por simplicidad técnica contable, usaremos una cuenta puente de "Saldos Iniciales".
        
        let cuentaPuente = await prisma.cuentaContable.findUnique({
            where: { codigo: "999999" }
        });

        if (!cuentaPuente) {
            cuentaPuente = await prisma.cuentaContable.create({
                data: {
                    codigo: "999999",
                    nombre: "CUENTA PUENTE - SALDOS INICIALES",
                    naturaleza: "CREDITO",
                    tipo: "PATRIMONIO",
                    permiteMovimiento: true
                }
            });
        }

        const asientos = [
            {
                cuentaId,
                debito: naturaleza === "DEBITO" ? monto : 0,
                credito: naturaleza === "CREDITO" ? monto : 0,
            },
            {
                cuentaId: cuentaPuente.id,
                debito: naturaleza === "CREDITO" ? monto : 0,
                credito: naturaleza === "DEBITO" ? monto : 0,
            }
        ];

        const txResult = await FinanceTransactionService.createTransaction({
            descripcion,
            tipo: TipoTransaccion.NOTA_CONTABLE,
            metodoPago: MetodoPago.OTRO,
            fechaOperacion: fecha,
            creadoPorId: session.user.id,
            asientos
        });

        if (txResult.success) {
            revalidatePath("/dashboard/finance");
            revalidatePath("/dashboard/finance/puc");
        }

        return txResult;
    },
    "registerInitialBalance"
);
