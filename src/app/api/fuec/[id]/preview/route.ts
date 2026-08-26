import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { FuecGenerator } from "@/lib/pdf/fuec-generator-v2";

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

        return new NextResponse(buffer as any, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="FUEC_${id}.pdf"`,
                "Cache-Control": "private, no-cache",
            },
        });
    } catch (error) {
        console.error("Error generating PDF:", error);
        const message = error instanceof Error 
            ? `${error.message}\n${error.stack}` 
            : "Error generando PDF";
        return new NextResponse(message, { status: 500 });
    }
}
