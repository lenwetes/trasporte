"use server";

import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/actions/audit";
import { ActionResult } from "@/types";
import { PaymentService } from "@/services/payment.service";
import { DebtService } from "@/services/debt.service";
import { withAuth } from "@/lib/safe-action";
import { PagoRegisterSchema } from "@/lib/validations";
import { serializeDecimal } from "@/lib/utils";
import { auth } from "@/auth";

/**
 * Registra un pago de un asociado/conductor
 */
export const registerPayment = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (dataInput: unknown): Promise<ActionResult> => {
        const validatedFields = PagoRegisterSchema.safeParse(dataInput);

        if (!validatedFields.success) {
            return {
                success: false,
                error: "Datos del pago inválidos",
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const session = await auth();
        const registradoPorId = session?.user?.id;

        if (!registradoPorId)
            return { success: false, error: "Sesión no válida"  };
        const result = await PaymentService.registerPayment({
            ...validatedFields.data,
            registradoPorId,
        });

        if (result.success) {
            const resultData = result.data as {
                id: string;
                transaccion?: { id: string };
            };
            await createAuditLog(
                registradoPorId,
                "CREAR",
                "Transaccion",
                resultData.transaccion?.id || resultData.id,
                `Pago registrado por valor de ${validatedFields.data.monto}`,
            );
            revalidatePath("/dashboard/finance");
            revalidatePath("/dashboard/finance/payments");
        }

        return serializeDecimal(result);
    },
    "registerPayment",
);

/**
 * Verifica operatividad de un usuario (Kill Switch)
 */
export const checkOperativity = withAuth(
    "ALL",
    async (usuarioId: unknown) => {
        if (typeof usuarioId !== "string")
            return { success: false, error: "ID de usuario inválido"  };
        return DebtService.canOperate(usuarioId);
    },
    "checkOperativity",
);

/**
 * Obtiene los detalles de una transacción para generar un recibo de caja.
 */
export const getReceiptData = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (transaccionId: unknown): Promise<ActionResult> => {
        const id = transaccionId as string;
        const { prisma } = await import("@/lib/prisma");

        const tx = await prisma.transaccion.findUnique({
            where: { id: id },
            include: {
                tercero: true,
                proveedor: true,
                asientos: {
                    include: { cuenta: true },
                },
                creadoPor: true,
                archivos: true,
            },
        });

        if (!tx) return { success: false, error: "Transacción no encontrada"  };
        const config = await prisma.configuracionGlobal.findUnique({
            where: { id: "default"  },
        });

        return serializeDecimal({
            success: true,
            data: {
                transaccion: tx,
                config,
            },
        });
    },
    "getReceiptData",
);
