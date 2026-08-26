/**
 * Script temporal: list-users.ts
 * Lista todos los usuarios existentes en la base de datos.
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const prisma = new PrismaClient({
    adapter: new PrismaPg(
        new pg.Pool({ connectionString: process.env.DATABASE_URL }),
    ),
});

async function main(): Promise<void> {
    const users = await prisma.usuario.findMany({
        select: {
            id: true,
            email: true,
            rol: true,
            activo: true,
            nombres: true,
        },
    });
    console.log("\n📋 Usuarios en la base de datos:");
    console.table(users);
}

main().finally(() => prisma.$disconnect());
