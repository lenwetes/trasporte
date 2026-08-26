import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import {
    DetallePreoperacional,
    PreoperacionalCreate,
} from "@/lib/validations/safety";
import { EstadoPreoperacional } from "@prisma/client";
import { NotificationService } from "@/services/notification.service";
import { CacheService } from "@/lib/cache";

export class PreoperacionalService {
    static async create(data: PreoperacionalCreate): Promise<ActionResult> {
        try {
            // Determinar resultado (RECHAZADO si hay alguna falla con criticidad ALTA)
            const tieneFallaCritica = data.detalles.some(
                (d: DetallePreoperacional) =>
                    !d.estado && d.criticidad === "ALTA",
            );
            const resultado: EstadoPreoperacional = tieneFallaCritica
                ? EstadoPreoperacional.RECHAZADO
                : EstadoPreoperacional.APROBADO;

            const preoperacional = await prisma.$transaction(async (tx) => {
                const doc = await tx.preoperacional.create({
                    data: {
                        vehiculoId: data.vehiculoId,
                        conductorId: data.conductorId,
                        fecha: data.fecha,
                        kilometraje: data.kilometraje,
                        resultado,
                        observaciones: data.observaciones,
                        firmaDigital: data.firmaDigital || null,
                        detalles: {
                            create: data.detalles.map((d) => ({
                                item: d.item,
                                estado: d.estado,
                                criticidad: d.criticidad,
                                observacion: d.observacion,
                            })),
                        },
                    },
                    include: { detalles: true },
                });

                // Si hay falla crítica, bloqueamos el vehículo
                if (tieneFallaCritica) {
                    await tx.vehiculo.update({
                        where: { id: data.vehiculoId },
                        data: { activo: false },
                    });
                    logger.warn(
                        {
                            vehiculoId: data.vehiculoId,
                            preoperacionalId: doc.id,
                        },
                        "Vehicle BLOCKED due to critical preoperational failure",
                    );
                } else {
                    await tx.vehiculo.update({
                        where: { id: data.vehiculoId },
                        data: {
                            activo: true,
                            kilometrajeActual: data.kilometraje,
                        },
                    });
                }

                return doc;
            });

            // Invalida cache de preoperacional para el vehículo
            await CacheService.del(`preop:latest:${data.vehiculoId}`);

            // Notificaciones post-transacción (Event-Driven style)
            if (tieneFallaCritica) {
                try {
                    const vehiculo = await prisma.vehiculo.findUnique({
                        where: { id: data.vehiculoId },
                        select: { placa: true, propietarioId: true },
                    });

                    if (vehiculo?.propietarioId) {
                        await NotificationService.crear({
                            usuarioId: vehiculo.propietarioId,
                            titulo: `🚨 Vehículo Bloqueado: ${vehiculo.placa}`,
                            mensaje: `Se detectaron fallas críticas en la inspección preoperacional. El vehículo ha sido inhabilitado preventivamente.`,
                            tipo: "ERROR",
                            vinculo: `/dashboard/vehiculos/${data.vehiculoId}`,
                        });
                    }
                } catch (notifError) {
                    logger.error(
                        { error: notifError },
                        "Error enviando notificación de bloqueo",
                    );
                }
            }

            return { success: true, data: preoperacional };
        } catch (error) {
            logger.error({ data, error }, "PreoperacionalService.create error");
            return {
                success: false,
                error: "Error al registrar inspección preoperacional",
            };
        }
    }

    static async getByVehiculo(vehiculoId: string): Promise<ActionResult> {
        try {
            const list = await prisma.preoperacional.findMany({
                where: { vehiculoId },
                orderBy: { fecha: "desc"  },
                include: {
                    conductor: { select: { nombres: true, apellidos: true } },
                },
            });
            return { success: true, data: list };
        } catch (error) {
            logger.error(
                { vehiculoId, error },
                "PreoperacionalService.getByVehiculo error",
            );
            return {
                success: false,
                error: "Error al obtener historial preoperacional",
            };
        }
    }

    static async getLatest(vehiculoId: string): Promise<ActionResult> {
        return await CacheService.remember(`preop:latest:${vehiculoId}`, 900, async () => {
            try {
                const latest = await prisma.preoperacional.findFirst({
                    where: { vehiculoId },
                    orderBy: { fecha: "desc"  },
                    include: { detalles: true },
                });
                return { success: true, data: latest };
            } catch (error) {
                logger.error(
                    { vehiculoId, error },
                    "PreoperacionalService.getLatest error",
                );
                return {
                    success: false,
                    error: "Error al obtener última inspección",
                };
            }
        });
    }

    static async getById(id: string): Promise<ActionResult> {
        try {
            const preop = await prisma.preoperacional.findUnique({
                where: { id },
                include: {
                    detalles: true,
                    vehiculo: true,
                    conductor: true,
                },
            });
            return { success: true, data: preop };
        } catch (error) {
            logger.error({ id, error }, "PreoperacionalService.getById error");
            return { success: false, error: "Error al obtener inspección"  };
        }
    }
}
