"use server";

import { withAuth } from "@/lib/safe-action";
import { NotificationService } from "@/services/notification.service";
import { formatCurrency } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";

export const notifyDeudoresMorosos = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (obligacionesIds: string[]) => {
        try {
            const obligaciones = await prisma.obligacionFinanciera.findMany({
                where: {
                    id: { in: obligacionesIds },
                    estado: { not: "PAGADO" },
                    fechaVence: { lt: new Date() }
                },
                include: {
                    usuario: true
                }
            });

            if (obligaciones.length === 0) {
                return { success: false, error: "No se encontraron obligaciones en mora válidas para notificar" };
            }

            let notificadosCount = 0;

            for (const ob of obligaciones) {
                const result = await NotificationService.crear({
                    usuarioId: ob.usuarioId,
                    titulo: "Recordatorio de Pago en Mora",
                    mensaje: `Le recordamos que su obligación de ${ob.tipo} por valor de ${formatCurrency(Number(ob.saldoPendiente))} se encuentra vencida. Por favor, regularice su pago.`,
                    tipo: "WARNING",
                    vinculo: `/dashboard`
                });
                
                if (result.success) {
                    notificadosCount++;
                }
            }

            return {
                success: true,
                data: { notificadosCount },
                message: `Se enviaron notificaciones a ${notificadosCount} deudores.`
            };
        } catch (error) {
            logger.error({ error }, "Error enviando notificaciones a morosos");
            return { success: false, error: "Error interno al enviar notificaciones" };
        }
    },
    "notifyDeudoresMorosos"
);
