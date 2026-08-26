import { prisma } from "@/lib/prisma";
import { ConceptoFinanciero, TipoTransaccion, Prisma } from "@prisma/client";

export interface CreateConceptInput {
    nombre: string;
    tipo: TipoTransaccion;
    cuentaId: string;
    requiereTercero?: boolean;
    valorPorDefecto?: number;
}

export interface UpdateConceptInput {
    nombre?: string;
    cuentaId?: string;
    requiereTercero?: boolean;
    valorPorDefecto?: number | null;
    activo?: boolean;
}

export class FinanceConceptMutationService {
    /**
     * Crea un nuevo concepto financiero
     */
    static async createConcept(
        input: CreateConceptInput,
    ): Promise<ConceptoFinanciero> {
        const cuenta = await prisma.cuentaContable.findUnique({
            where: { id: input.cuentaId },
        });

        if (!cuenta) throw new Error("Cuenta contable no encontrada");
        if (!cuenta.permiteMovimiento)
            throw new Error("La cuenta no permite movimientos directos");

        const existente = await prisma.conceptoFinanciero.findFirst({
            where: { nombre: { equals: input.nombre, mode: "insensitive" } },
        });

        if (existente)
            throw new Error(
                `Ya existe un concepto con el nombre "${input.nombre}"`,
            );

        return prisma.conceptoFinanciero.create({
            data: {
                nombre: input.nombre,
                tipo: input.tipo,
                cuentaId: input.cuentaId,
                requiereTercero: input.requiereTercero ?? false,
                valorPorDefecto: input.valorPorDefecto
                    ? new Prisma.Decimal(input.valorPorDefecto)
                    : null,
            },
        });
    }

    /**
     * Actualiza un concepto existente
     */
    static async updateConcept(
        id: string,
        input: UpdateConceptInput,
    ): Promise<ConceptoFinanciero> {
        const concepto = await prisma.conceptoFinanciero.findUnique({
            where: { id },
        });
        if (!concepto) throw new Error("Concepto no encontrado");

        if (input.cuentaId) {
            const cuenta = await prisma.cuentaContable.findUnique({
                where: { id: input.cuentaId },
            });
            if (!cuenta) throw new Error("Cuenta contable no encontrada");
            if (!cuenta.permiteMovimiento)
                throw new Error("La cuenta no permite movimientos directos");
        }

        if (input.nombre && input.nombre !== concepto.nombre) {
            const existente = await prisma.conceptoFinanciero.findFirst({
                where: {
                    nombre: { equals: input.nombre, mode: "insensitive" },
                    id: { not: id },
                },
            });
            if (existente)
                throw new Error(
                    `Ya existe un concepto con el nombre "${input.nombre}"`,
                );
        }

        return prisma.conceptoFinanciero.update({
            where: { id },
            data: {
                ...(input.nombre && { nombre: input.nombre }),
                ...(input.cuentaId && { cuentaId: input.cuentaId }),
                ...(input.requiereTercero !== undefined && {
                    requiereTercero: input.requiereTercero,
                }),
                ...(input.valorPorDefecto !== undefined && {
                    valorPorDefecto: input.valorPorDefecto
                        ? new Prisma.Decimal(input.valorPorDefecto)
                        : null,
                }),
                ...(input.activo !== undefined && { activo: input.activo }),
            },
        });
    }

    /**
     * Desactiva un concepto (soft delete)
     */
    static async deactivateConcept(id: string): Promise<ConceptoFinanciero> {
        return prisma.conceptoFinanciero.update({
            where: { id },
            data: { activo: false },
        });
    }

    /**
     * Reactiva un concepto
     */
    static async activateConcept(id: string): Promise<ConceptoFinanciero> {
        return prisma.conceptoFinanciero.update({
            where: { id },
            data: { activo: true },
        });
    }
}
