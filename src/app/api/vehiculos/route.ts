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

        const vehiculos = await prisma.vehiculo.findMany({
            select: {
                id: true,
                placa: true,
            },
            orderBy: {
                placa: "asc",
            },
        });

        return NextResponse.json(vehiculos);
    } catch (error) {
        console.error("Error fetching vehiculos:", error);
        return NextResponse.json(
            { error: "Error al obtener vehículos" },
            { status: 500 },
        );
    }
}
