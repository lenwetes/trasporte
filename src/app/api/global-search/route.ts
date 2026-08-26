import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { SearchService } from "@/services/search.service";
import { Rol } from "@prisma/client";

export async function GET(req: NextRequest) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
        return NextResponse.json([]);
    }

    try {
        const results = await SearchService.searchGlobal(
            query,
            session.user.rol as Rol,
        );
        return NextResponse.json(results);
    } catch (error) {
        console.error("Error global search:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
