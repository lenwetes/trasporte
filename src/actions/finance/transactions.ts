"use server";

import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/actions/audit";
import { ActionResult } from "@/types";
import { FinanceService } from "@/services/finance.service";
import { withAuth } from "@/lib/safe-action";
import { serializeDecimal } from "@/lib/utils";
import { auth } from "@/auth";
import { z } from "zod";
import { TipoTransaccion } from "@prisma/client";

// Esquemas de validación Zod
const AsientoSchema = z.object({
    cuentaId: z.string().uuid("ID de cuenta inválido"),
    debito: z.number().min(0, "El débito no puede ser negativo"),
    credito: z.number().min(0, "El crédito no puede ser negativo"),
});

const TransaccionSchema = z.object({
    descripcion: z
        .string()
        .min(5, "La descripción debe tener al menos 5 caracteres"),
    tipo: z.nativeEnum(TipoTransaccion),
    asientos: z
        .array(AsientoSchema)
        .min(2, "Se requieren al menos 2 asientos para partida doble"),
    terceroId: z.string().uuid().optional().nullable(),
    proveedorId: z.string().uuid().optional().nullable(),
    metaVehiculoId: z.string().uuid().optional().nullable(),
    documentoNumero: z.string().optional().nullable(),
    soporteUrl: z.string().url().optional().nullable(),
    archivoIds: z.array(z.string()).optional(),
});

/**
 * Registra una transacción contable manual.
 */
export const createManualTransaction = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (dataInput: unknown): Promise<ActionResult> => {
        // 1. Validar entrada
        const validation = TransaccionSchema.safeParse(dataInput);
        if (!validation.success) {
            return {
                success: false,
                error:
                    validation.error.issues[0]?.message ||
                    "Datos de transacción inválidos",
            };
        }

        const data = validation.data;

        // 2. Obtener sesión
        const session = await auth();
        const creadoPorId = session?.user?.id;
        if (!creadoPorId) return { success: false, error: "Sesión no válida"  };
        const {
            terceroId,
            proveedorId,
            metaVehiculoId,
            documentoNumero,
            soporteUrl,
            ...rest
        } = data;

        // 3. Ejecutar servicio
        const result = await FinanceService.createTransaction({
            ...rest,
            terceroId: terceroId ?? undefined,
            proveedorId: proveedorId ?? undefined,
            metaVehiculoId: metaVehiculoId ?? undefined,
            documentoNumero: documentoNumero ?? undefined,
            soporteUrl: soporteUrl ?? undefined,
            creadoPorId,
        });

        // 4. Auditoría y Revalidación
        if (result.success && result.data) {
            const transaccion = result.data as { id: string };
            await createAuditLog(
                creadoPorId,
                "CREAR",
                "Transaccion",
                transaccion.id,
                `Transacción manual ${data.tipo}: ${data.descripcion}`,
            );

            revalidatePath("/dashboard/finance");
            revalidatePath("/dashboard/finance/transactions");
        }

        return serializeDecimal(result);
    },
    "createManualTransaction",
);

// Alias para compatibilidad con componentes que usen el nombre genérico
export const createFinanceTransaction = createManualTransaction;

/**
 * Obtiene metadatos para formularios financieros.
 */
export const getFinanceMetadata = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (): Promise<ActionResult> => {
        const { prisma } = await import("@/lib/prisma");

        const [cuentas, usuarios, vehiculos, proveedores, conceptos] =
            await Promise.all([
                prisma.cuentaContable.findMany({
                    where: { activa: true },
                    orderBy: { codigo: "asc"  },
                }),
                prisma.usuario.findMany({
                    where: { activo: true },
                    select: {
                        id: true,
                        nombres: true,
                        apellidos: true,
                        numeroDocumento: true,
                    },
                    orderBy: { nombres: "asc"  },
                }),
                prisma.vehiculo.findMany({
                    where: { activo: true },
                    select: { id: true, placa: true },
                    orderBy: { placa: "asc"  },
                }),
                prisma.proveedor.findMany({
                    where: { activo: true },
                    orderBy: { nombres: "asc"  },
                }),
                prisma.conceptoFinanciero.findMany({
                    where: { activo: true },
                    include: { cuenta: true },
                    orderBy: { nombre: "asc"  },
                }),
            ]);

        return serializeDecimal({
            success: true,
            data: {
                cuentas,
                usuarios,
                vehiculos,
                proveedores,
                conceptos,
            },
        });
    },
    "getFinanceMetadata",
);

/**
 * Obtiene el listado de transacciones con paginación.
 */
export const getTransactionsAction = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (...args: unknown[]): Promise<ActionResult> => {
        const options =
            (args[0] as {
                page?: number;
                limit?: number;
                type?: TipoTransaccion;
                search?: string;
            }) || {};
        const result = await FinanceService.getTransactions(options);
        return serializeDecimal(result);
    },
    "getTransactionsAction",
);

/**
 * Balance de cuenta.
 */
export const getAccountBalance = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (...args: unknown[]): Promise<ActionResult<unknown>> => {
        const cuentaId = args[0] as string;
        if (!cuentaId)
            return { success: false, error: "ID de cuenta requerido" };
        const result = await FinanceService.getAccountBalance(cuentaId);
        return result;
    },
    "getAccountBalance",
);
