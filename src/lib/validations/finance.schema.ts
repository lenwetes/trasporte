import { z } from "zod";
import { TipoTransaccion } from "@prisma/client";

// Validación de Asiento Contable Individual
export const asientoSchema = z.object({
    cuentaId: z.string().uuid("ID de cuenta inválido"),
    debito: z.number().min(0, "El débito no puede ser negativo"),
    credito: z.number().min(0, "El crédito no puede ser negativo"),
});

// Validación para Crear Transacción (Completa)
export const createTransactionSchema = z.object({
    descripcion: z
        .string()
        .min(5, "La descripción debe tener al menos 5 caracteres"),
    tipo: z.nativeEnum(TipoTransaccion),
    asientos: z
        .array(asientoSchema)
        .min(
            2,
            "La transacción debe tener al menos 2 asientos para partida doble",
        )
        .refine(
            (data) => {
                const totalDebito = data.reduce((sum, a) => sum + a.debito, 0);
                const totalCredito = data.reduce(
                    (sum, a) => sum + a.credito,
                    0,
                );
                return Math.abs(totalDebito - totalCredito) < 0.01;
            },
            {
                message:
                    "La partida doble no está balanceada (Débito != Crédito)",
                path: ["asientos"],
            },
        ),
    terceroId: z.string().uuid().optional(),
    metaVehiculoId: z.string().uuid().optional(),
    soporteUrl: z.string().url().optional(),
});

// Validación para Registro de Pago
export const registerPaymentSchema = z.object({
    usuarioId: z.string().uuid("ID de usuario inválido"),
    obligacionId: z.string().uuid("ID de obligación inválido"),
    monto: z.number().positive("El monto debe ser positivo"),
    metodoPago: z.enum([
        "CAJA",
        "BANCO",
        "EFECTIVO",
        "TRANSFERENCIA",
        "DATAFONO",
    ]),
    comprobanteUrl: z.string().url().optional(),
    referencia: z.string().optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type RegisterPaymentInput = z.infer<typeof registerPaymentSchema>;
