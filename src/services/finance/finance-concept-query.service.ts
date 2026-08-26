import { prisma } from "@/lib/prisma";
import { ConceptoFinanciero, TipoTransaccion } from "@prisma/client";

export interface ConceptoConCuenta extends ConceptoFinanciero {
    cuenta: {
        id: string;
        codigo: string;
        nombre: string;
        naturaleza: string;
        tipo: string;
    };
}

export class FinanceConceptQueryService {
    /**
     * Obtiene todos los conceptos activos
     */
    static async getAllConcepts(): Promise<ConceptoConCuenta[]> {
        return prisma.conceptoFinanciero.findMany({
            where: { activo: true },
            include: {
                cuenta: {
                    select: {
                        id: true,
                        codigo: true,
                        nombre: true,
                        naturaleza: true,
                        tipo: true,
                    },
                },
            },
            orderBy: { nombre: "asc" },
        });
    }

    /**
     * Obtiene conceptos por tipo (INGRESO o EGRESO)
     */
    static async getConceptsByType(
        tipo: TipoTransaccion,
    ): Promise<ConceptoConCuenta[]> {
        return prisma.conceptoFinanciero.findMany({
            where: { tipo, activo: true },
            include: {
                cuenta: {
                    select: {
                        id: true,
                        codigo: true,
                        nombre: true,
                        naturaleza: true,
                        tipo: true,
                    },
                },
            },
            orderBy: { nombre: "asc" },
        });
    }

    /**
     * Busca conceptos por nombre.
     */
    static async searchConcepts(
        query: string,
        tipo?: TipoTransaccion,
        limit = 20,
    ): Promise<ConceptoConCuenta[]> {
        return prisma.conceptoFinanciero.findMany({
            where: {
                activo: true,
                nombre: { contains: query, mode: "insensitive" },
                ...(tipo && { tipo }),
            },
            include: {
                cuenta: {
                    select: {
                        id: true,
                        codigo: true,
                        nombre: true,
                        naturaleza: true,
                        tipo: true,
                    },
                },
            },
            take: limit,
            orderBy: { nombre: "asc" },
        });
    }

    /**
     * Obtiene un concepto por ID
     */
    static async getConceptById(id: string): Promise<ConceptoConCuenta | null> {
        return prisma.conceptoFinanciero.findUnique({
            where: { id },
            include: {
                cuenta: {
                    select: {
                        id: true,
                        codigo: true,
                        nombre: true,
                        naturaleza: true,
                        tipo: true,
                    },
                },
            },
        });
    }
}
