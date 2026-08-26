"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { SiniestroCreate } from "@/lib/validations";
import { Prisma } from "@prisma/client";
import { ActionResult, SiniestroWithRelations } from "@/types";
import { withAuth } from "@/lib/safe-action";

// Siniestros
export const getSiniestros = withAuth(
    "ALL",
    async (...args: unknown[]): Promise<ActionResult<unknown>> => {
        const page = (args[0] as number) || 1;
        const pageSize = (args[1] as number) || 12;
        const filters = args[2] as
            | {
                  year?: number;
                  gravedad?: "SOLO_DANOS" | "CON_HERIDOS" | "MORTAL";
                  query?: string;
                  estado?: "PENDIENTE" | "EN_PROCESO" | "CERRADO";
              }
            | undefined;

        const skip = (page - 1) * pageSize;
        const where: Prisma.SiniestroWhereInput = {};

        if (filters?.estado) {
            where.estado = filters.estado;
        }

        if (filters?.year) {
            where.fecha = {
                gte: new Date(`${filters.year}-01-01`),
                lte: new Date(`${filters.year}-12-31`),
            };
        }

        if (filters?.gravedad) {
            where.gravedad = filters.gravedad;
        }

        if (filters?.query) {
            where.OR = [
                {
                    vehiculo: {
                        placa: { contains: filters.query, mode: "insensitive" },
                    },
                },
                {
                    conductor: {
                        nombres: {
                            contains: filters.query,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    conductor: {
                        apellidos: {
                            contains: filters.query,
                            mode: "insensitive",
                        },
                    },
                },
                { lugar: { contains: filters.query, mode: "insensitive" } },
            ];
        }

        const [siniestros, total] = await Promise.all([
            prisma.siniestro.findMany({
                where,
                skip,
                take: pageSize,
                include: {
                    conductor: true,
                    vehiculo: true,
                    fotos: true,
                    investigacion: true,
                },
                orderBy: { fecha: "desc" },
            }),
            prisma.siniestro.count({ where }),
        ]);

        return {
            success: true,
            data: siniestros as SiniestroWithRelations[],
            metadata: {
                total,
                page,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    },
    "getSiniestros",
);

export const createSiniestro = withAuth(
    "ALL",
    async (dataInput: unknown) => {
        const data = dataInput as SiniestroCreate;
        const { fotoIds, ...rest } = data;
        const siniestro = await prisma.siniestro.create({
            data: {
                ...rest,
                fotos: {
                    connect: fotoIds.map((id: string) => ({ id })),
                },
            },
        });
        revalidatePath("/dashboard/siniestros");
        return { success: true, data: siniestro };
    },
    "createSiniestro",
);

export const getSiniestroById = withAuth(
    "ALL",
    async (idInput: unknown): Promise<ActionResult<unknown>> => {
        const id = idInput as string;
        const siniestro = await prisma.siniestro.findUnique({
            where: { id },
            include: {
                conductor: true,
                vehiculo: true,
                fotos: true,
                investigacion: true,
            },
        });
        if (!siniestro)
            return { success: false, error: "Siniestro no encontrado" };
        return { success: true, data: siniestro as SiniestroWithRelations };
    },
    "getSiniestroById",
);
