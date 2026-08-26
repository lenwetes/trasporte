import { prisma } from "@/lib/prisma";
import { ReglaContable } from "@prisma/client";

export class IntegrationRuleService {
    /**
     * Obtiene todas las reglas contables activas
     */
    static async getAllRules(): Promise<ReglaContable[]> {
        return prisma.reglaContable.findMany({
            where: {
                activo: true,
            },
            include: {
                cuentaDebito: {
                    select: {
                        codigo: true,
                        nombre: true,
                    },
                },
                cuentaCredito: {
                    select: {
                        codigo: true,
                        nombre: true,
                    },
                },
            },
            orderBy: {
                evento: "asc",
            },
        });
    }

    /**
     * Crea una nueva regla contable
     */
    static async createRule(input: {
        evento: string;
        descripcion?: string;
        cuentaDebitoId: string;
        cuentaCreditoId: string;
    }): Promise<ReglaContable> {
        // Verificar que no exista una regla para este evento
        const existente = await prisma.reglaContable.findUnique({
            where: { evento: input.evento },
        });

        if (existente) {
            throw new Error(
                `Ya existe una regla para el evento: ${input.evento}`,
            );
        }

        // Verificar que las cuentas existen
        const [cuentaDebito, cuentaCredito] = await Promise.all([
            prisma.cuentaContable.findUnique({
                where: { id: input.cuentaDebitoId },
            }),
            prisma.cuentaContable.findUnique({
                where: { id: input.cuentaCreditoId },
            }),
        ]);

        if (!cuentaDebito || !cuentaCredito) {
            throw new Error("Una o ambas cuentas no existen");
        }

        return prisma.reglaContable.create({
            data: {
                evento: input.evento,
                descripcion: input.descripcion,
                cuentaDebitoId: input.cuentaDebitoId,
                cuentaCreditoId: input.cuentaCreditoId,
            },
        });
    }

    /**
     * Actualiza una regla contable
     */
    static async updateRule(
        evento: string,
        input: {
            descripcion?: string;
            cuentaDebitoId?: string;
            cuentaCreditoId?: string;
            activo?: boolean;
        },
    ): Promise<ReglaContable> {
        // Verificar cuentas si se actualizan
        if (input.cuentaDebitoId || input.cuentaCreditoId) {
            const cuentasAVerificar = [];
            if (input.cuentaDebitoId)
                cuentasAVerificar.push(input.cuentaDebitoId);
            if (input.cuentaCreditoId)
                cuentasAVerificar.push(input.cuentaCreditoId);

            const cuentas = await prisma.cuentaContable.findMany({
                where: {
                    id: {
                        in: cuentasAVerificar,
                    },
                },
            });

            if (cuentas.length !== cuentasAVerificar.length) {
                throw new Error("Una o más cuentas no existen");
            }
        }

        return prisma.reglaContable.update({
            where: { evento },
            data: {
                ...(input.descripcion !== undefined && {
                    descripcion: input.descripcion,
                }),
                ...(input.cuentaDebitoId && {
                    cuentaDebitoId: input.cuentaDebitoId,
                }),
                ...(input.cuentaCreditoId && {
                    cuentaCreditoId: input.cuentaCreditoId,
                }),
                ...(input.activo !== undefined && { activo: input.activo }),
            },
        });
    }

    /**
     * Desactiva una regla contable
     */
    static async deactivateRule(evento: string): Promise<ReglaContable> {
        return prisma.reglaContable.update({
            where: { evento },
            data: {
                activo: false,
            },
        });
    }

    /**
     * Reactiva una regla contable
     */
    static async activateRule(evento: string): Promise<ReglaContable> {
        return prisma.reglaContable.update({
            where: { evento },
            data: {
                activo: true,
            },
        });
    }
}
