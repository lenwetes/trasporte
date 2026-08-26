"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ActionResult } from "@/types";
import { VehicleService } from "@/services/vehicle.service";
import { VehicleHealthService } from "@/services/vehicle-health.service";
import { CacheService } from "@/lib/cache";
import { withAuth } from "@/lib/safe-action";
import { serializeDecimal } from "@/lib/utils";
import { PaginatedResponse } from "@/types/pagination";

/**
 * Get fleet health status (cached)
 */
export const getVehiclesWithExpiringDocuments = withAuth(
    "ALL",
    async (): Promise<ActionResult> => {
        return CacheService.remember("vehicles:health", 300, async () => {
            return VehicleHealthService.getVehiclesHealth();
        });
    },
    "getVehiclesWithExpiringDocuments",
);

/**
 * Get all vehicles
 */
export const getVehiculos = withAuth(
    "ALL",
    async (
        params?: unknown,
    ): Promise<ActionResult<PaginatedResponse<import("@prisma/client").Vehiculo>>> => {
        const {
            page = 1,
            pageSize = 12,
            search,
        } = (params as {
            page?: number;
            pageSize?: number;
            search?: string;
        }) || {};

        const { auth } = await import("@/auth");
        const session = await auth();
        const userRole = session!.user.rol;
        const userId = session!.user.id;

        const whereClause: Prisma.VehiculoWhereInput = { activo: true };
        if (userRole === "CONDUCTOR" && userId) {
            whereClause.vinculaciones = {
                some: { conductorId: userId, activo: true },
            };
        }

        if (search) {
            whereClause.OR = [
                { placa: { contains: search, mode: "insensitive" } },
                { marca: { contains: search, mode: "insensitive" } },
                { propietario: { contains: search, mode: "insensitive" } },
                {
                    propietarioUser: {
                        OR: [
                            {
                                nombres: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                            {
                                apellidos: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        ],
                    },
                },
            ];
        }

        const result = (await VehicleService.getAll({
            page,
            pageSize,
            where: whereClause,
        })) as ActionResult<PaginatedResponse<import("@prisma/client").Vehiculo>>;

        if (result.success && result.data) {
            result.data = serializeDecimal(result.data);
        }
        return result;
    },
    "getVehiculos",
);

/**
 * Get vehicle by ID
 */
export const getVehiculoById = withAuth(
    "ALL",
    async (id: unknown): Promise<ActionResult> => {
        const vehicleId = id as string;

        const { auth } = await import("@/auth");
        const session = await auth();
        const userRole = session!.user.rol;
        const userId = session!.user.id;

        const result = await VehicleService.getById(vehicleId);
        if (!result.success) return result;

        const vehiculo = result.data as import("@prisma/client").Vehiculo & {
            vinculaciones: import("@prisma/client").Vinculacion[];
        };

        if (userRole === "CONDUCTOR") {
            const isLinked = vehiculo.vinculaciones.some(
                (v) => v.conductorId === userId && v.activo,
            );
            if (!isLinked)
                return {
                    success: false,
                    error: "No tienes permiso para ver este vehículo",
                };
        }

        if (result.success && result.data) {
            result.data = serializeDecimal(result.data);
        }

        return result;
    },
    "getVehiculoById",
);

/**
 * Get simple list of vehicles
 */
export const getVehiculosList = withAuth(
    "ALL",
    async (): Promise<ActionResult> => {
        const { auth } = await import("@/auth");
        const session = await auth();
        const role = session!.user.rol;
        const userId = session!.user.id;

        const where: Prisma.VehiculoWhereInput = {};
        if (role !== "ADMIN" && role !== "SECRETARIA") {
            if (role === "CONDUCTOR")
                where.vinculaciones = {
                    some: { conductorId: userId, activo: true },
                };
            else if (role === "PROPIETARIO") where.propietarioId = userId;
        }

        const vehicles = await prisma.vehiculo.findMany({
            where,
            select: { id: true, placa: true, marca: true },
            orderBy: { placa: "asc" },
        });
        return { success: true, data: serializeDecimal(vehicles) };
    },
    "getVehiculosList",
);

/**
 * Get unique brands and models from registered vehicles
 */
export const getLearnedFleetData = withAuth(
    "ALL",
    async (): Promise<ActionResult<{ 
        marcas: string[]; 
        modelos: Record<string, string[]>;
        organismos: string[];
        colores: string[];
    }>> => {
        try {
            const vehicles = await prisma.vehiculo.findMany({
                where: { activo: true },
                select: { marca: true, modelo: true, lugarExpedicion: true, color: true },
            });

            const marcasSet = new Set<string>();
            const modelosByMarca: Record<string, Set<string>> = {};
            const organismosSet = new Set<string>();
            const coloresSet = new Set<string>();

            vehicles.forEach((v) => {
                if (v.marca) {
                    const m = v.marca.toUpperCase();
                    marcasSet.add(m);
                    if (v.modelo) {
                        if (!modelosByMarca[m]) modelosByMarca[m] = new Set();
                        modelosByMarca[m].add(v.modelo.toUpperCase());
                    }
                }
                if (v.lugarExpedicion) organismosSet.add(v.lugarExpedicion.toUpperCase());
                if (v.color) coloresSet.add(v.color.toUpperCase());
            });

            const modelosRecord: Record<string, string[]> = {};
            Object.entries(modelosByMarca).forEach(([marca, modelos]) => {
                modelosRecord[marca] = Array.from(modelos).sort();
            });

            return {
                success: true,
                data: {
                    marcas: Array.from(marcasSet).sort(),
                    modelos: modelosRecord,
                    organismos: Array.from(organismosSet).sort(),
                    colores: Array.from(coloresSet).sort(),
                },
            };
        } catch (error) {
            console.error("Error fetching learned fleet data:", error);
            return { success: false, error: "Error al sincronizar radar de flota" };
        }
    },
    "getLearnedFleetData",
);
