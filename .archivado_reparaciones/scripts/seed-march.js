const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const vehiculo = await prisma.vehiculo.findFirst();
    if (!vehiculo) return console.log("No vehiculo found");

    const marchDate = new Date("2026-03-28T12:00:00Z");

    await prisma.documentoVehiculo.create({
        data: {
            tipo: "SOAT_TEST_MARZO",
            fechaVencimiento: marchDate,
            vehiculoId: vehiculo.id,
            estadoAlerta: "POR_VENCER",
        },
    });

    console.log("Created dummy document for March 2026");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
