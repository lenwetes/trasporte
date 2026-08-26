import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { EstadoOperativo } from "@prisma/client";
import logger from "@/lib/logger";
import { createAuditLog } from "@/actions/audit";
import { VehicleOperabilityEvaluatorService } from "./vehicle-operability-evaluator.service";

export class VehicleOperabilityControlService {
    /**
     * Alterna el bloqueo manual de un vehículo.
     */
    static async toggleManualBlock(
        vehiculoId: string,
        userId: string,
        bloquear: boolean,
        razon: string,
    ): Promise<ActionResult> {
        try {
            const vehiculo = await prisma.vehiculo.findUnique({
                where: { id: vehiculoId },
            });

            if (!vehiculo)
                return { success: false, error: "Vehículo no encontrado"  };

            const estadoAnterior = vehiculo.estadoOperativo;

            await prisma.$transaction(async (tx) => {
                await tx.vehiculo.update({
                    where: { id: vehiculoId },
                    data: {
                        bloqueadoManualmente: bloquear,
                        razonBloqueo: bloquear ? razon : null,
                        estadoOperativo: bloquear
                            ? EstadoOperativo.BLOQUEADO_ADMIN
                            : EstadoOperativo.EVALUANDO,
                    },
                });

                await tx.historialEstadoVehiculo.create({
                    data: {
                        vehiculoId,
                        estadoAnterior,
                        estadoNuevo: bloquear
                            ? EstadoOperativo.BLOQUEADO_ADMIN
                            : EstadoOperativo.EVALUANDO,
                        razon: razon,
                        userId,
                    },
                });
            });

            // Si se desbloquea, re-evaluar inmediatamente
            if (!bloquear) {
                await VehicleOperabilityEvaluatorService.evaluateOperability(
                    vehiculoId,
                );
            }

            return { success: true };
        } catch (error) {
            logger.error({ error, vehiculoId }, "Error en toggleManualBlock");
            return {
                success: false,
                error: "Error al cambiar estado de bloqueo",
            };
        }
    }

    /**
     * Bloquea o desbloquea todos los vehículos de un propietario.
     */
    static async toggleOwnerBlock(
        ownerId: string,
        userId: string,
        bloquear: boolean,
        razon: string,
    ): Promise<ActionResult> {
        try {
            const vehiculos = await prisma.vehiculo.findMany({
                where: { propietarioId: ownerId, activo: true },
            });

            if (vehiculos.length === 0) {
                return {
                    success: false,
                    error: "El propietario no tiene vehículos afiliados",
                };
            }

            const results = await Promise.all(
                vehiculos.map((v) =>
                    this.toggleManualBlock(v.id, userId, bloquear, razon),
                ),
            );

            const errors = results.filter((r) => !r.success);
            if (errors.length > 0) {
                return {
                    success: false,
                    error: `Error en ${errors.length} de ${vehiculos.length} vehículos`,
                };
            }

            return { success: true, data: { count: vehiculos.length } };
        } catch (error) {
            logger.error({ error, ownerId }, "Error en toggleOwnerBlock");
            return {
                success: false,
                error: "Error al bloquear vehículos del propietario",
            };
        }
    }

    /**
     * Aplica o remueve un override de super usuario.
     */
    static async toggleSuperOverride(
        vehiculoId: string,
        userId: string,
        activar: boolean,
        justificacion: string,
    ): Promise<ActionResult> {
        try {
            const vehiculo = await prisma.vehiculo.findUnique({
                where: { id: vehiculoId },
            });

            if (!vehiculo)
                return { success: false, error: "Vehículo no encontrado"  };

            const estadoAnterior = vehiculo.estadoOperativo;

            await prisma.$transaction(async (tx) => {
                await tx.vehiculo.update({
                    where: { id: vehiculoId },
                    data: {
                        overrideActivo: activar,
                        justificacionOverride: activar ? justificacion : null,
                        estadoOperativo: activar
                            ? EstadoOperativo.OPERATIVO_OVERRIDE
                            : EstadoOperativo.EVALUANDO,
                    },
                });

                await tx.historialEstadoVehiculo.create({
                    data: {
                        vehiculoId,
                        estadoAnterior,
                        estadoNuevo: activar
                            ? EstadoOperativo.OPERATIVO_OVERRIDE
                            : EstadoOperativo.EVALUANDO,
                        razon: activar
                            ? `OVERRIDE SUPER-USER: ${justificacion}`
                            : "Override de super-usuario desactivado",
                        userId,
                    },
                });

                await createAuditLog(
                    userId,
                    "ACTUALIZAR",
                    "Vehiculo",
                    vehiculoId,
                    {
                        accion: activar
                            ? "SUPER_OVERRIDE_ON"
                            : "SUPER_OVERRIDE_OFF",
                        justificacion,
                        estadoAnterior,
                        estadoNuevo: activar
                            ? "OPERATIVO_OVERRIDE"
                            : "EVALUANDO",
                    },
                );
            });

            // Re-evaluar inmediatamente
            await VehicleOperabilityEvaluatorService.evaluateOperability(
                vehiculoId,
                userId,
            );

            return { success: true };
        } catch (error) {
            logger.error({ error, vehiculoId }, "Error en toggleSuperOverride");
            return {
                success: false,
                error: "Error al cambiar override de super-usuario",
            };
        }
    }
}
