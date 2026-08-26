"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NovedadCreate } from "@/lib/validations";
import { TipoNovedad, EstadoNovedad } from "@prisma/client";
import { ActionResult, NovedadWithRelations } from "@/types";
import { withAuth } from "@/lib/safe-action";

export const getNovedades = withAuth(
    "ALL",
    async (
        ...args: unknown[]
    ): Promise<ActionResult<unknown>> => {
        const page = (args[0] as number) || 1;
        const pageSize = (args[1] as number) || 12;
        const filters = args[2] as
            | {
                  tipo?: TipoNovedad | "TODOS";
                  query?: string;
              }
            | undefined;

        const skip = (page - 1) * pageSize;
        const where: import("@prisma/client").Prisma.NovedadWhereInput = {};
        if (filters?.tipo && filters.tipo !== "TODOS") {
            where.tipo = filters.tipo;
        }
        if (filters?.query) {
            where.OR = [
                {
                    descripcion: {
                        contains: filters.query,
                        mode: "insensitive",
                    },
                },
                {
                    conductor: {
                        OR: [
                            {
                                nombres: {
                                    contains: filters.query,
                                    mode: "insensitive",
                                },
                            },
                            {
                                apellidos: {
                                    contains: filters.query,
                                    mode: "insensitive",
                                },
                            },
                        ],
                    },
                },
                {
                    vehiculo: {
                        placa: { contains: filters.query, mode: "insensitive" },
                    },
                },
            ];
        }

        const [novedades, total] = await Promise.all([
            prisma.novedad.findMany({
                where,
                skip,
                take: pageSize,
                include: {
                    conductor: true,
                    vehiculo: true,
                },
                orderBy: { fecha: "desc" },
            }),
            prisma.novedad.count({ where }),
        ]);

        return {
            success: true,
            data: novedades as NovedadWithRelations[],
            metadata: {
                total,
                page,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    },
    "getNovedades",
);

export const createNovedad = withAuth(
    "ALL",
    async (dataInput: unknown) => {
        const data = dataInput as NovedadCreate;
        
        // Limpiar campos null/undefined para que sean compatibles con Prisma
        const cleanData = {
            tipo: data.tipo,
            fecha: data.fecha,
            descripcion: data.descripcion || "",
            monto: data.monto || null,
            estado: data.estado || "PENDIENTE",
            conductorId: data.conductorId || null,
            vehiculoId: data.vehiculoId || null,
        };

        const novedad = await prisma.novedad.create({
            data: cleanData,
        });
        revalidatePath("/dashboard/novedades");
        return { success: true, data: novedad };
    },
    "createNovedad",
);

export const updateNovedadStatus = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (args: { id: string; estado: EstadoNovedad }) => {
        const { id, estado } = args;
        const n = await prisma.novedad.update({
            where: { id },
            data: { estado },
        });
        revalidatePath("/dashboard/novedades");
        return { success: true, data: n };
    },
    "updateNovedadStatus"
);

export const getNovedadesStats = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (): Promise<ActionResult> => {
        const novedades = await prisma.novedad.findMany({
            select: {
                tipo: true,
                fecha: true,
            },
        });

        const months = [
            "Ene",
            "Feb",
            "Mar",
            "Abr",
            "May",
            "Jun",
            "Jul",
            "Ago",
            "Sep",
            "Oct",
            "Nov",
            "Dic",
        ];
        const types = ["MULTA", "FALLA_MECANICA", "CONDUCTA", "OTRO"];

        const stats = types.map((type) => ({
            name: type,
            data: months.map((month, index) => {
                const count = novedades.filter((n) => {
                    const d = new Date(n.fecha);
                    return n.tipo === type && d.getMonth() === index;
                }).length;
                return { x: month, y: count };
            }),
        }));

        return { success: true, data: stats };
    },
    "getNovedadesStats",
);
