import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";

export class BillingQueryService {
    /**
     * Previsualiza cuántos propietarios serán facturados.
     */
    static async previewMonthlyFees(periodo: Date): Promise<ActionResult> {
        try {
            const config = await prisma.configuracionGlobal.findUnique({
                where: { id: "default"  },
            });
            if (!config)
                return {
                    success: false,
                    error: "Configuración global no encontrada",
                };

            const startOfMonth = new Date(
                periodo.getFullYear(),
                periodo.getMonth(),
                1,
            );
            const endOfMonth = new Date(
                periodo.getFullYear(),
                periodo.getMonth() + 1,
                0,
            );

            const count = await prisma.usuario.count({
                where: {
                    rol: "PROPIETARIO",
                    activo: true,
                    eliminadoEn: null,
                    obligaciones: {
                        none: {
                            tipo: "CUOTA_ADMINISTRACION",
                            periodo: { gte: startOfMonth, lte: endOfMonth },
                        },
                    },
                },
            });

            return {
                success: true,
                data: {
                    count,
                    amount: Number(config.montoCuotaAdministracion),
                    total: count * Number(config.montoCuotaAdministracion),
                },
            };
        } catch (error) {
            logger.error(
                { error },
                "BillingQueryService.previewMonthlyFees error",
            );
            return {
                success: false,
                error: "Error al previsualizar la facturación",
            };
        }
    }
}
