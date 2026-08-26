import { prisma } from "./src/lib/prisma";

async function main() {
    try {
        console.log("Testing Prisma with Adapter...");
        const userCount = await prisma.usuario.count();
        console.log(`Total users: ${userCount}`);

        const firstUser = await prisma.usuario.findFirst({
            include: { fotoPerfil: true },
        });
        console.log("User retrieved:", firstUser?.email);
    } catch (error) {
        console.error("Prisma query failed!");
        console.error(error);
    } finally {
        // We can't easily disconnect a global singleton that uses a pool
        // without affecting other things, but here it's fine.
    }
}

main();
