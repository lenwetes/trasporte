import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Testing Prisma connection...");
        const userCount = await prisma.usuario.count();
        console.log(`Total users: ${userCount}`);

        const firstUser = await prisma.usuario.findFirst({
            include: { fotoPerfil: true },
        });
        console.log("First user retrieved successfully:", firstUser?.email);
    } catch (error) {
        console.error("Prisma query failed!");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
