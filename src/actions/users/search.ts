"use server";

import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/safe-action";

export const searchUsers = withAuth(
    ["ADMIN", "SECRETARIA"],
    async (query: string) => {
        const users = await prisma.usuario.findMany({
            where: {
                OR: [
                    { id: query },
                    { nombres: { contains: query, mode: "insensitive" } },
                    { apellidos: { contains: query, mode: "insensitive" } },
                    { numeroDocumento: { contains: query, mode: "insensitive" } }
                ],
                activo: true
            },
            take: 10,
            select: {
                id: true,
                nombres: true,
                apellidos: true,
                numeroDocumento: true,
                rol: true
            }
        });
        return { success: true, data: users };
    },
    "searchUsers"
);
