/**
 * Script: reset-admin-password.ts
 * Propósito: Resetea la contraseña del usuario admin@admin.com a "admin1234"
 * sin tocar ningún otro dato de la base de datos.
 * Uso: npx tsx scripts/reset-admin-password.ts
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as argon2 from "argon2";
import "dotenv/config";

const createPrismaClient = () => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL is not set");
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
};

const prisma = createPrismaClient();

async function main(): Promise<void> {
    const NEW_PASSWORD = "admin1234";
    const ADMIN_EMAIL = "admin@admin.com";

    console.log(`\n🔑 Reseteando contraseña del usuario: ${ADMIN_EMAIL}`);

    const user = await prisma.usuario.findUnique({
        where: { email: ADMIN_EMAIL },
    });

    if (!user) {
        console.error(`❌ No se encontró el usuario con email: ${ADMIN_EMAIL}`);
        process.exit(1);
    }

    const newHash = await argon2.hash(NEW_PASSWORD);

    await prisma.usuario.update({
        where: { email: ADMIN_EMAIL },
        data: { passwordHash: newHash, activo: true },
    });

    console.log("✅ Contraseña actualizada correctamente.");
    console.log("------------------------------------------");
    console.log(`  Usuario : ${ADMIN_EMAIL}`);
    console.log(`  Password: ${NEW_PASSWORD}`);
    console.log("------------------------------------------\n");
}

main()
    .catch((e) => {
        console.error("❌ Error:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
