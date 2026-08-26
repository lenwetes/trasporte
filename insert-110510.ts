import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const padre = await prisma.cuentaContable.findUnique({ where: { codigo: "1105" } });
    
    await prisma.cuentaContable.createMany({
        data: [
            {
               codigo: "110510",
               nombre: "Cajas Menores / Fondo Préstamos",
               naturaleza: "DEBITO",
               tipo: "ACTIVO",
               nivel: 4,
               padreId: padre?.id || null,
            }
        ],
        skipDuplicates: true
    });
    console.log("Cuenta 110510 creada exitosamente.");
}
main();
