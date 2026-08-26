import { prisma } from "./src/lib/prisma";

async function test() {
    try {
        console.log("Checking COLABORADOR role in DB...");
        const roles = await prisma.$queryRaw`SELECT enum_range(NULL::"Rol")`;
        console.log("Roles in DB:", roles);

        console.log("Searching for COLABORADOR users...");
        const users = await prisma.usuario.findMany({
            where: { rol: "COLABORADOR" as any }
        });
        console.log("Users found:", users.length);
        users.forEach(u => console.log(`- ${u.nombres} ${u.apellidos} (${u.numeroDocumento})`));

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

test();
