import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Rol } from "@prisma/client";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 },
            );
        }

        // Solo admin y secretaria pueden buscar usuarios
        if (session.user.rol !== "ADMIN" && session.user.rol !== "SECRETARIA") {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 403 },
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get("q") || "";
        const rolParam = searchParams.get("rol");

        if (query.length < 2) {
            return NextResponse.json([]);
        }

        const usuarios = await prisma.usuario.findMany({
            where: {
                AND: [
                    rolParam ? { rol: rolParam as Rol } : {},
                    {
                        OR: [
                            {
                                nombres: {
                                    contains: query,
                                    mode: "insensitive",
                                },
                            },
                            {
                                numeroDocumento: {
                                    contains: query,
                                    mode: "insensitive",
                                },
                            },
                        ],
                    },
                ],
            },
            select: {
                id: true,
                nombres: true,
                numeroDocumento: true,
                rol: true,
            },
            take: 10,
        });

        // Mapear a formato esperado por el frontend
        const mapped = usuarios.map((u) => ({
            id: u.id,
            nombre: u.nombres,
            identificacion: u.numeroDocumento,
            rol: u.rol,
        }));

        return NextResponse.json(mapped);
    } catch (error) {
        console.error("Error searching users:", error);
        return NextResponse.json(
            { error: "Error en la búsqueda" },
            { status: 500 },
        );
    }
}
