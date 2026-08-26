import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";

export class RecordService {
    /**
     * Obtiene el expediente digital consolidado de un conductor
     */
    static async getExpedienteDigital(
        conductorId: string,
    ): Promise<ActionResult> {
        try {
            const [examenes, entregas, preoperacionales] = await Promise.all([
                prisma.examenMedico.findMany({
                    where: { conductorId },
                    include: { archivo: true },
                    orderBy: { fechaRealizacion: "desc"  },
                }),
                prisma.entregaDotacion.findMany({
                    where: { conductorId },
                    orderBy: { fechaEntrega: "desc"  },
                }),
                prisma.preoperacional.findMany({
                    where: { conductorId },
                    include: {
                        vehiculo: {
                            select: { placa: true, marca: true, modelo: true },
                        },
                        detalles: true,
                    },
                    orderBy: { fecha: "desc"  },
                }),
            ]);

            return {
                success: true,
                data: {
                    examenes,
                    entregas,
                    preoperacionales,
                },
            };
        } catch (error) {
            logger.error(
                { conductorId, error },
                "RecordService.getExpedienteDigital error",
            );
            return { success: false, error: "Error al consolidar expediente"  };
        }
    }
}
