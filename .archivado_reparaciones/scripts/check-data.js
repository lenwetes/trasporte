const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const docs = await prisma.documentoVehiculo.findMany();
    docs.forEach((d) => {
        console.log(`${d.tipo}: ${d.fechaVencimiento.toISOString()}`);
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
