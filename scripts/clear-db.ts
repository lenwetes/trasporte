import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Limpiando base de datos (usuarios, hojas vida, licencias, exp, certificados, etc)...");
    const tables = [
        "usuarios", 
        "hojas_vida_usuarios", 
        "detalles_licencias_usuarios", 
        "experiencia_laboral", 
        "referencias_personales", 
        "certificados_usuarios", 
        "audit_logs", 
        "notificaciones"
    ];
    
    for (const table of tables) {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
    }
    
    console.log("Base de datos limpia ✓");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
