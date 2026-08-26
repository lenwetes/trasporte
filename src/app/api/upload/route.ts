import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/actions";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const result = await uploadFile(formData);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json(result.data);
    } catch (error) {
        console.error("Upload API error:", error);
        return NextResponse.json(
            { error: "Error al procesar la solicitud" },
            { status: 500 },
        );
    }
}
