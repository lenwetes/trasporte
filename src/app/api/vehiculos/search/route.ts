import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 },
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get("q") || "";

        if (query.length < 2) {
            return NextResponse.json([]);
        }

        const vehiculos = await prisma.vehiculo.findMany({
            where: {
                placa: {
                    contains: query,
                    mode: "insensitive",
                },
            },
            select: {
                id: true,
                placa: true,
                marca: true,
                propietario: true,
            },
            take: 10,
        });

        return NextResponse.json(vehiculos);
    } catch (error) {
        console.error("Error searching vehicles:", error);
        return NextResponse.json(
            { error: "Error en la búsqueda" },
            { status: 500 },
        );
    }
}
