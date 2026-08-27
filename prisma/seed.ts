/**
 * Seed Oficial: Creación automática y segura del usuario Administrador.
 * No borra datos ni inserta registros ficticios.
 */
import { PrismaClient, Rol, TipoDocumento } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as argon2 from "argon2";
import "dotenv/config";

const createPrismaClient = () => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL no está configurada.");
    }
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
};

const prisma = createPrismaClient();

async function main(): Promise<void> {
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@coopetraes.com").trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminNombres = process.env.ADMIN_NOMBRES || "Administrador";
    const adminApellidos = process.env.ADMIN_APELLIDOS || "Sistema";
    const adminDocumento = process.env.ADMIN_DOCUMENTO || "1111111111";

    console.log(`👤 Asegurando cuenta del Administrador (${adminEmail})...`);

    const existingUser = await prisma.usuario.findUnique({
        where: { email: adminEmail },
    });

    if (existingUser) {
        console.log(`ℹ️ El usuario administrador ya existe (${adminEmail}).`);
        if (existingUser.rol !== Rol.ADMIN || !existingUser.activo) {
            await prisma.usuario.update({
                where: { email: adminEmail },
                data: {
                    rol: Rol.ADMIN,
                    activo: true,
                },
            });
            console.log("✅ Rol ADMIN y estado activo actualizados.");
        }
        return;
    }

    const passwordHash = await argon2.hash(adminPassword);

    await prisma.usuario.create({
        data: {
            email: adminEmail,
            nombres: adminNombres,
            apellidos: adminApellidos,
            passwordHash,
            rol: Rol.ADMIN,
            tipoDocumento: TipoDocumento.CC,
            numeroDocumento: adminDocumento,
            activo: true,
        },
    });

    console.log("\n✨ USUARIO ADMINISTRADOR CONFIGURADO CON ÉXITO");
    console.log("------------------------------------------");
    console.log(`Usuario : ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log("------------------------------------------\n");
}

main()
    .catch((e) => {
        console.error("❌ Error en seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
