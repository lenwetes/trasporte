import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as argon2 from "argon2";
import "dotenv/config";

const createPrismaClient = () => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is not set");
    }
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
};

const prisma = createPrismaClient();

async function resetAdmin() {
    console.log("Resetting admin password...");
    const hashedPassword = await argon2.hash("12345678");

    const admin = await prisma.usuario.upsert({
        where: { email: "admin@coopetraes.com" },
        update: {
            passwordHash: hashedPassword,
            activo: true,
            rol: "ADMIN",
        },
        create: {
            email: "admin@coopetraes.com",
            nombres: "Admin",
            apellidos: "General",
            passwordHash: hashedPassword,
            rol: "ADMIN",
            tipoDocumento: "CC",
            numeroDocumento: "1000000000",
            activo: true,
        },
    });

    console.log("Admin user reset successfully:", admin.email);
}

resetAdmin()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
