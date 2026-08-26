import { PrismaClient, EstadoPrestamo } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Iniciando saneamiento de saldos de préstamos...");

    // Corregir créditos CANCELADOS que tengan saldo diferente de 0
    const cancelados = await prisma.prestamo.updateMany({
        where: {
            OR: [
                { estado: EstadoPrestamo.CANCELADO, saldoActual: { not: 0 } },
                { saldoActual: { lt: 0 } }
            ]
        },
        data: {
            saldoActual: 0
        }
    });

    console.log(`Corregidos ${cancelados.count} préstamos con saldo inconsistente/negativo.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
