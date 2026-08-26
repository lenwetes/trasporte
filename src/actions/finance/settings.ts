"use server";

import { revalidatePath } from "next/cache";
import { ActionResult } from "@/types";
import { withAuth } from "@/lib/safe-action";
import { serializeDecimal } from "@/lib/utils";
import { Prisma, ResolucionContable, ConceptoFinanciero, ConfiguracionGlobal } from "@prisma/client";
import logger from "@/lib/logger";

export interface FinanceSettings {
    resoluciones: ResolucionContable[];
    conceptos: (ConceptoFinanciero & { cuenta: any })[];
    configuracionGlobal: ConfiguracionGlobal | null;
}

/**
 * Obtiene la configuración financiera completa
 */
export const getFinanceSettings = withAuth<FinanceSettings>(
    ["ADMIN"],
    async (): Promise<ActionResult<FinanceSettings>> => {
        const { prisma } = await import("@/lib/prisma");

        const [resoluciones, conceptos, configuracionGlobal] =
            await Promise.all([
                prisma.resolucionContable.findMany({
                    orderBy: { creadoEn: "desc"  },
                }),
                prisma.conceptoFinanciero.findMany({
                    include: { cuenta: true },
                    orderBy: { nombre: "asc"  },
                }),
                prisma.configuracionGlobal.findFirst(),
            ]);

        return serializeDecimal({
            success: true,
            data: {
                resoluciones,
                conceptos,
                configuracionGlobal,
            },
        }) as ActionResult<FinanceSettings>;
    },
    "getFinanceSettings",
);

/**
 * Crea o actualiza una resolución contable
 */
export const upsertResolucion = withAuth(
    ["ADMIN"],
    async (data: unknown): Promise<ActionResult> => {
        const { prisma } = await import("@/lib/prisma");
        const { id, ...payload } =
            data as Prisma.ResolucionContableUncheckedCreateInput & {
                id?: string;
            };

        try {
            const res = id
                ? await prisma.resolucionContable.update({
                      where: { id },
                      data: payload,
                  })
                : await prisma.resolucionContable.create({ data: payload });

            revalidatePath("/dashboard/finance/settings");
            return serializeDecimal({ success: true, data: res });
        } catch (error) {
            logger.error({ error }, "[settings] Error en upsertResolucion");
            return { success: false, error: "Error al guardar resolución"  };
        }
    },
    "upsertResolucion",
);

/**
 * Crea o actualiza un mapeo de concepto a cuenta
 */
export const upsertConceptoFinanciero = withAuth(
    ["ADMIN"],
    async (data: unknown): Promise<ActionResult> => {
        const { prisma } = await import("@/lib/prisma");
        const { id, ...payload } =
            data as Prisma.ConceptoFinancieroUncheckedCreateInput & {
                id?: string;
            };

        try {
            const res = id
                ? await prisma.conceptoFinanciero.update({
                      where: { id },
                      data: payload,
                  })
                : await prisma.conceptoFinanciero.create({ data: payload });

            revalidatePath("/dashboard/finance/settings");
            return serializeDecimal({ success: true, data: res });
        } catch (error) {
            logger.error(
                { error },
                "[settings] Error en upsertConceptoFinanciero",
            );
            return {
                success: false,
                error: "Error al guardar el concepto contable",
            };
        }
    },
    "upsertConceptoFinanciero",
);

/**
 * Actualiza los parámetros globales financieros
 */
export const updateFinanceConfig = withAuth(
    ["ADMIN"],
    async (data: unknown): Promise<ActionResult> => {
        const { prisma } = await import("@/lib/prisma");
        
        // Using any since types vary between Create and Update in Prisma 6
        // for scalar fields with @relation mappings.
        const input = data as any;

        try {
            // Find existing config or create default
            const existingConfig = await prisma.configuracionGlobal.findFirst();
            const configId = existingConfig?.id || "default";

            const updateData: any = {
                montoCuotaAdministracion: Number(input.montoCuotaAdministracion || 0),
                umbralBloqueoMora: Number(input.umbralBloqueoMora || 0),
                porcentajeMoraDiaria: Number(input.porcentajeMoraDiaria || 0),
                nombreEmpresa: input.nombreEmpresa || "COOPETRAES",
                cuentaCajaId: input.cuentaCajaId && input.cuentaCajaId !== "" ? input.cuentaCajaId : null,
                cuentaBancosId: input.cuentaBancosId && input.cuentaBancosId !== "" ? input.cuentaBancosId : null,
                cuentaPrestamosId: input.cuentaPrestamosId && input.cuentaPrestamosId !== "" ? input.cuentaPrestamosId : null,
            };

            const res = await prisma.configuracionGlobal.upsert({
                where: { id: configId },
                create: {
                    id: "default",
                    ...updateData
                },
                update: updateData,
            });

            revalidatePath("/dashboard/finance/settings");
            return serializeDecimal({ success: true, data: res });
        } catch (error) {
            logger.error({ error }, "[settings] Error en updateFinanceConfig");
            return {
                success: false,
                error: "Error al actualizar la configuración global",
            };
        }
    },
    "updateFinanceConfig",
);

/**
 * Ejecuta manualmente la generación de obligaciones del mes actual
 */
export const triggerMonthlyObligations = withAuth(
    ["ADMIN"],
    async (): Promise<ActionResult> => {
        const { FinanceService } = await import("@/services/finance.service");
        return serializeDecimal(
            await FinanceService.generateMonthlyObligations(new Date()),
        );
    },
    "triggerMonthlyObligations",
);
