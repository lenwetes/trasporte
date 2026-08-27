/**
 * Script: ensure-admin.ts
 * Propósito: Crear o asegurar de manera 100% automática e idempotente
 * la existencia del usuario Administrador, sin tocar ninguna otra tabla ni datos.
 */
import { PrismaClient, Rol, TipoDocumento } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as argon2 from "argon2";
import "dotenv/config";
import fs from "fs";
import path from "path";

const createPrismaClient = () => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL no está configurada.");
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

    console.log(`\n🔍 Verificando usuario Administrador (${adminEmail})...`);

    // Asegurar estructura de carpetas de almacenamiento local
    const storageDir = process.env.STORAGE_PATH || path.join(process.cwd(), "storage");
    const subDirs = [
        "fotos_perfil",
        "documentos/licencias",
        "documentos/vehiculos",
        "documentos/examenes",
        "documentos/siniestros",
        "documentos/mantenimientos",
    ];

    try {
        if (!fs.existsSync(storageDir)) {
            fs.mkdirSync(storageDir, { recursive: true });
        }
        for (const dir of subDirs) {
            const fullPath = path.join(storageDir, dir);
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true });
            }
        }
    } catch (err) {
        console.warn("⚠️ No se pudieron crear algunas carpetas de storage:", err);
    }

    // Buscar si ya existe el usuario por email
    const existingUser = await prisma.usuario.findUnique({
        where: { email: adminEmail },
    });

    if (existingUser) {
        console.log(`ℹ️ El usuario administrador (${adminEmail}) ya existe. Verificando rol...`);
        if (existingUser.rol !== Rol.ADMIN || !existingUser.activo) {
            await prisma.usuario.update({
                where: { email: adminEmail },
                data: {
                    rol: Rol.ADMIN,
                    activo: true,
                },
            });
            console.log("✅ Rol de Administrador y estado activo asegurados.");
        } else {
            console.log("✅ El usuario Administrador ya se encuentra activo y configurado.");
        }
        return;
    }

    // Si no existe, crearlo
    console.log(`👤 Creando usuario Administrador inicial (${adminEmail})...`);
    const passwordHash = await argon2.hash(adminPassword);

    await prisma.usuario.create({
        data: {
            email: adminEmail,
            passwordHash,
            nombres: adminNombres,
            apellidos: adminApellidos,
            rol: Rol.ADMIN,
            tipoDocumento: TipoDocumento.CC,
            numeroDocumento: adminDocumento,
            activo: true,
        },
    });

    console.log("\n==========================================");
    console.log("✨ USUARIO ADMINISTRADOR CREADO CON ÉXITO");
    console.log("==========================================");
    console.log(`  Email   : ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
    console.log(`  Rol     : ADMIN`);
    console.log("==========================================\n");
}

main()
    .catch((e) => {
        console.error("❌ Error al asegurar usuario administrador:", e);
        // No interrumpir el arranque si falla por transitoriedad
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
