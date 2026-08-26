import { PrismaClient } from "@prisma/client";

async function test() {
    const prisma = new PrismaClient();
    try {
        console.log("Deleting AuditLog...");
        const res = await prisma.auditLog.deleteMany();
        console.log("AuditLog deleted:", res);

        console.log("Deleting HistorialEstadoVehiculo...");
        const res2 = await prisma.historialEstadoVehiculo.deleteMany();
        console.log("HistorialEstadoVehiculo deleted:", res2);
    } catch (e) {
        console.error("Error during deletion:", e);
    } finally {
        await prisma.$disconnect();
    }
}

test();
