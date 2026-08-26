import { prisma } from "@/lib/prisma";
import { Prisma, Vehiculo } from "@prisma/client";
import { ActionResult } from "@/types";
import { VehiculoCreate, VehiculoUpdate } from "@/lib/validations";
import logger from "@/lib/logger";
import { CacheService } from "@/lib/cache";

export class VehicleMutationService {
    /**
     * Create vehicle logic
     */
    static async create(data: VehiculoCreate): Promise<ActionResult<unknown>> {
        try {
            const cleanedData = {
                ...data,
                marca: data.marca || null,
                modelo: data.modelo || null,
                color: data.color || null,
                cilindraje: data.cilindraje || null,
                peso: data.peso || null,
                numeroMotor: data.numeroMotor || null,
                numeroChasis: data.numeroChasis || null,
                lugarExpedicion: data.lugarExpedicion || null,
            };

            const vehiculo = await prisma.vehiculo.create({
                data: cleanedData,
            });

            await CacheService.invalidate("vehicle");

            logger.info(
                { vehicleId: vehiculo.id, placa: vehiculo.placa },
                "Vehicle created successfully",
            );
            return { success: true, data: vehiculo };
        } catch (error) {
            logger.error(
                { data, error },
                "VehicleMutationService.create error",
            );
            if (
                error &&
                typeof error === "object" &&
                "code" in error &&
                error.code === "P2002"
            ) {
                return {
                    success: false,
                    error: "Ya existe un vehículo con esta placa",
                };
            }
            return { success: false, error: "Error al crear el vehículo"  };
        }
    }

    /**
     * Update vehicle logic
     */
    static async update(
        id: string,
        data: VehiculoUpdate,
    ): Promise<ActionResult<unknown>> {
        try {
            const { version, ...cleanUpdateData } = data;
            
            const updateInput: Prisma.VehiculoUncheckedUpdateInput = {
                placa: cleanUpdateData.placa,
                marca: cleanUpdateData.marca === "" ? null : cleanUpdateData.marca,
                modelo: cleanUpdateData.modelo === "" ? null : cleanUpdateData.modelo,
                color: cleanUpdateData.color === "" ? null : cleanUpdateData.color,
                cilindraje: cleanUpdateData.cilindraje === "" ? null : cleanUpdateData.cilindraje,
                peso: cleanUpdateData.peso === "" ? null : cleanUpdateData.peso,
                numeroMotor: cleanUpdateData.numeroMotor === "" ? null : cleanUpdateData.numeroMotor,
                numeroChasis:
                    cleanUpdateData.numeroChasis === "" ? null : cleanUpdateData.numeroChasis,
                lugarExpedicion:
                    cleanUpdateData.lugarExpedicion === "" ? null : cleanUpdateData.lugarExpedicion,
                propietario: cleanUpdateData.propietario === "" ? null : cleanUpdateData.propietario,
                anho: cleanUpdateData.anho,
                capacidadPuestos: cleanUpdateData.capacidadPuestos,
                clase: cleanUpdateData.clase,
                modalidad: cleanUpdateData.modalidad,
                propietarioId: cleanUpdateData.propietarioId,
                kilometrajeActual: cleanUpdateData.kilometrajeActual,
                version: { increment: 1 }
            };

            // Optimistic Concurrency Control: verify version before updating
            const updateResult = await prisma.vehiculo.updateMany({
                where: { 
                    id, 
                    ...(version !== undefined && version !== null ? { version } : {})
                },
                data: updateInput,
            });

            if (updateResult.count === 0) {
                // Check if it's a version mismatch or non-existent record
                const exists = await prisma.vehiculo.findUnique({ where: { id } });
                if (!exists) {
                    return { success: false, error: "Vehículo no encontrado" };
                }
                return { 
                    success: false, 
                    error: "Conflicto de concurrencia: Los datos fueron modificados por otro usuario. Por favor recargue la página." 
                };
            }

            const vehiculo = await prisma.vehiculo.findUnique({ where: { id } });

            await CacheService.invalidate("vehicle");
            await CacheService.invalidate(`vehicle:id:${id}`);

            logger.info({ id }, "Vehicle updated successfully");
            return { success: true, data: vehiculo };
        } catch (error) {
            logger.error(
                { id, data, error },
                "VehicleMutationService.update error",
            );
            return { success: false, error: "Error al actualizar el vehículo"  };
        }
    }

    /**
     * Soft delete vehicle
     */
    static async delete(id: string): Promise<ActionResult> {
        try {
            const vehiculo = await prisma.vehiculo.findUnique({
                where: { id },
            });

            if (!vehiculo)
                return { success: false, error: "Vehículo no encontrado"  };

            await prisma.vehiculo.update({
                where: { id },
                data: {
                    activo: false,
                    eliminadoEn: new Date(),
                },
            });

            await CacheService.invalidate("vehicle");
            await CacheService.invalidate(`vehicle:id:${id}`);

            logger.info(
                { id, plate: vehiculo.placa },
                "Vehicle deactivated (Soft Delete)",
            );
            return { success: true };
        } catch (error) {
            logger.error({ id, error }, "VehicleMutationService.delete error");
            return { success: false, error: "Error al desactivar el vehículo"  };
        }
    }
}
