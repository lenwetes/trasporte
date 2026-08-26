import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const cuentas = await prisma.cuentaContable.findMany({
        where: {
            OR: [
                { nombre: { contains: "Sobrante" } },
                { nombre: { contains: "Ajuste" } },
                { nombre: { contains: "Faltante" } },
                { nombre: { contains: "Caja" } }
            ]
        }
    });
    console.log(JSON.stringify(cuentas, null, 2));
}
main();
