import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "argon2";
import { Rol, TipoDocumento } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        console.log("🛠️ Inicializando/Verificando cuenta Admin...");
        const adminPasswordHash = await hash("admin");

        const adminUser = await prisma.usuario.upsert({
            where: { email: "admin@admin.com" },
            update: {
                passwordHash: adminPasswordHash,
                activo: true,
                rol: Rol.ADMIN,
            },
            create: {
                email: "admin@admin.com",
                nombres: "Administrador",
                apellidos: "Sistema",
                passwordHash: adminPasswordHash,
                rol: Rol.ADMIN,
                tipoDocumento: TipoDocumento.CC,
                numeroDocumento: "1111111111",
                activo: true,
            },
        });

        // Asegurar configuración global
        await prisma.configuracionGlobal.upsert({
            where: { id: "default" },
            update: {},
            create: {
                id: "default",
                nombreEmpresa: "COOPETRAES S.A.",
                direccion: "Calle Principal #45-20, Sincelejo",
                telefono: "6052820000",
                email: "gerencia@coopetraes.com",
                colorPrimario: "#00704f",
            },
        });

        const count = await prisma.usuario.count();

        return NextResponse.json({
            success: true,
            message: "Usuario administrador configurado correctamente.",
            credentials: {
                email: "admin@admin.com",
                password: "admin",
                role: adminUser.rol,
                activo: adminUser.activo,
            },
            totalUsers: count,
            loginUrl: "/login",
        });
    } catch (error: any) {
        console.error("Error en /api/init:", error);
        return NextResponse.json(
            {
                success: false,
                error: error?.message || "Error al inicializar",
                stack: error?.stack,
            },
            { status: 500 },
        );
    }
}
