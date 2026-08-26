import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function check() {
    const userId = "d2b3b925-6430-4e5e-9241-7a425d40788f";
    const licencias = await prisma.detalleLicencia.findMany({
        where: { usuarioId: userId },
    });
    console.log(`USUARIO: ${userId}`);
    console.log(`TOTAL: ${licencias.length}`);
    licencias.forEach(l => {
        console.log(`ID: ${l.id} | CAT: ${l.categoria} | ACT: ${l.activo} | DATA: ${JSON.stringify(l)}`);
    });
}
check().catch(console.error).finally(() => prisma.$disconnect());
