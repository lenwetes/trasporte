import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 },
            );
        }

        const conductores = await prisma.usuario.findMany({
            where: {
                rol: "CONDUCTOR",
            },
            select: {
                id: true,
                nombres: true,
                apellidos: true,
            },
            orderBy: {
                nombres: "asc",
            },
        });

        return NextResponse.json(conductores);
    } catch (error) {
        console.error("Error fetching conductores:", error);
        return NextResponse.json(
            { error: "Error al obtener conductores" },
            { status: 500 },
        );
    }
}
