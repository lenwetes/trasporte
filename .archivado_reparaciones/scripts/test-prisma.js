const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    try {
        const v = await prisma.vehiculo.findFirst({
            include: {
                documentos: { include: { archivo: true } },
                vinculaciones: { include: { conductor: true } },
                mantenimientos: { include: { plan: true, factura: true } },
                siniestros: {
                    include: {
                        conductor: true,
                        vehiculo: true,
                        fotos: true,
                        investigacion: true,
                    },
                },
                obligaciones: true,
                _count: true,
            },
        });
        console.log("Vehicle found:", v ? v.placa : "None");

        // Test obligacionFinanciera
        const o = await prisma.obligacionFinanciera.findMany();
        console.log("Obligaciones count:", o.length);
    } catch (e) {
        console.error("Error in Prisma test:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
