import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { FuecGenerator } from "@/lib/pdf/fuec-generator-v2";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const protocol = req.headers.get("x-forwarded-proto") || "http";
        const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
        const baseUrl = host ? `${protocol}://${host}` : undefined;

        const buffer = await FuecGenerator.generateBuffer(id, baseUrl);

        // Obtener consecutivo para el nombre del archivo
        const fuec = await prisma.planillaFUEC.findUnique({
            where: { id },
            select: { consecutivo: true },
        });

        const filename = `FUEC_${fuec?.consecutivo ?? id}.pdf`;

        return new NextResponse(buffer as any, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Cache-Control": "private, no-cache",
            },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error generando PDF";
        return new NextResponse(message, { status: 500 });
    }
}
