"use server";

import { withAuth } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ActionResult } from "@/types";
import { createAuditLog } from "@/actions/audit";
import { revalidatePath } from "next/cache";
import { DebtService } from "@/services/debt.service";
import { TipoTransaccion, TipoObligacion, Prisma } from "@prisma/client";
import { serializeDecimal } from "@/lib/utils";

// Esquema de validación
const CreateLoanSchema = z.object({
    usuarioId: z.string().uuid(),
    monto: z.number().min(1000, "El monto mínimo es 1.000"),
    cuentaOrigenId: z
        .string()
        .uuid("Debe seleccionar la cuenta de origen (Caja/Banco)"),
    cuentaCobrarId: z.string().uuid("Debe seleccionar la cuenta por cobrar"),
    fechaDesembolso: z.coerce.date().default(() => new Date()),
    observaciones: z.string().optional(),
    plazoMeses: z.number().int().min(1).default(1),
});

export const createPrestamo = withAuth(
    ["ADMIN"],
    async (dataInput: unknown) => {
        const validation = CreateLoanSchema.safeParse(dataInput);
        if (!validation.success) {
            return {
                success: false,
                error: validation.error.issues[0]?.message || "Datos inválidos",
            };
        }

        const data = validation.data;

        // 1. Validar capacidad de endeudamiento (Opcional: Advertencia o Bloqueo)
        // Por ahora solo logueamos si excede, pero permitimos al Admin decidir.
        await DebtService.canOperate(data.usuarioId);

        const { auth } = await import("@/auth");
        const session = await auth();
        if (!session?.user?.id) throw new Error("Usuario no autenticado");

        // 2. Ejecutar Transacción Atómica
        const result = await prisma.$transaction(async (tx) => {
            // A. Crear Transacción Contable (Egreso)
            const transaccion = await tx.transaccion.create({
                data: {
                    descripcion: `Préstamo a empleado/afiliado: ${data.observaciones || ""}`,
                    tipo: TipoTransaccion.EGRESO,
                    creadoPorId: session.user.id!,
                    terceroId: data.usuarioId,
                    fecha: data.fechaDesembolso,
                    asientos: {
                        create: [
                            // DEBITO: Cuenta por Cobrar (Aumenta Activo)
                            {
                                cuentaId: data.cuentaCobrarId,
                                debito: new Prisma.Decimal(data.monto),
                                credito: new Prisma.Decimal(0),
                            },
                            // CREDITO: Caja/Bancos (Disminuye Activo)
                            {
                                cuentaId: data.cuentaOrigenId,
                                debito: new Prisma.Decimal(0),
                                credito: new Prisma.Decimal(data.monto),
                            },
                        ],
                    },
                },
            });

            // B. Crear Obligación Financiera
            // Calculamos fecha de vencimiento inicial (1 mes después)
            const fechaVence = new Date(data.fechaDesembolso);
            fechaVence.setMonth(fechaVence.getMonth() + 1);

            const obligacion = await tx.obligacionFinanciera.create({
                data: {
                    usuarioId: data.usuarioId,
                    tipo: TipoObligacion.PRESTAMO,
                    periodo: new Date(
                        data.fechaDesembolso.getFullYear(),
                        data.fechaDesembolso.getMonth(),
                        1,
                    ),
                    fechaVence: fechaVence,
                    montoInicial: new Prisma.Decimal(data.monto),
                    saldoPendiente: new Prisma.Decimal(data.monto),
                    estado: "PENDIENTE",
                    transaccionOrigenId: transaccion.id,
                },
            });

            return { transaccion, obligacion };
        });

        // 3. Auditoría
        await createAuditLog(
            session.user.id,
            "CREAR",
            "ObligacionFinanciera",
            result.obligacion.id,
            `Préstamo creado por $${data.monto} a usuario ${data.usuarioId}`,
        );

        revalidatePath("/dashboard/finance");
        revalidatePath("/dashboard/usuarios");

        return serializeDecimal({ success: true, data: result });
    },
    "createPrestamo",
);

/**
 * Obtiene el listado de préstamos registrados
 */
export const getLoansAction = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (params: unknown): Promise<ActionResult> => {
        const { page = 1, limit = 20 } =
            (params as { page?: number; limit?: number }) || {};
        const skip = (page - 1) * limit;

        try {
            const [total, prestamos] = await prisma.$transaction([
                prisma.obligacionFinanciera.count({
                    where: { tipo: TipoObligacion.PRESTAMO },
                }),
                prisma.obligacionFinanciera.findMany({
                    where: { tipo: TipoObligacion.PRESTAMO },
                    skip,
                    take: limit,
                    orderBy: { creadoEn: "desc" },
                    include: {
                        usuario: {
                            select: {
                                nombres: true,
                                apellidos: true,
                                numeroDocumento: true,
                            },
                        },
                        transaccionOrigen: {
                            select: {
                                consecutivo: true,
                                fecha: true,
                            },
                        },
                    },
                }),
            ]);

            return serializeDecimal({
                success: true,
                data: prestamos,
                metadata: {
                    total,
                    page,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } catch (error) {
            return {
                success: false,
                error: "Error al cargar los préstamos",
            };
        }
    },
    "getLoans",
);
