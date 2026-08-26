import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const archives = await prisma.repositorioArchivo.findMany({
        take: 10,
        select: {
            nombreUnico: true,
            rutaAbsoluta: true,
            tipoMime: true,
        },
    });
    console.log(JSON.stringify(archives, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
