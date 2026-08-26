import { z } from "zod";

export const TransaccionCreateSchema = z.object({
    descripcion: z
        .string()
        .min(5, "La descripción debe tener al menos 5 caracteres"),
    tipo: z.enum(["INGRESO", "EGRESO", "NOTA_CONTABLE"]),
    terceroId: z.string().uuid().optional(),
    metaVehiculoId: z.string().uuid().optional(),
    asientos: z
        .array(
            z.object({
                cuentaId: z.string().uuid(),
                debito: z.number().min(0),
                credito: z.number().min(0),
            }),
        )
        .min(2, "Se requieren al menos 2 asientos (Partida Doble)"),
});

export const PagoRegisterSchema = z.object({
    usuarioId: z.string().uuid(),
    obligacionId: z.string().uuid(),
    monto: z.number().positive("El monto debe ser positivo"),
    metodoPago: z.enum(["CAJA", "BANCO"]),
    referencia: z.string().optional(),
});

export type TransaccionCreate = z.infer<typeof TransaccionCreateSchema>;
export type PagoRegister = z.infer<typeof PagoRegisterSchema>;
