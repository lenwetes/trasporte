import fs from 'fs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const cuentas = await prisma.cuentaContable.findMany();
    const conceptos = await prisma.conceptoFinanciero.findMany();
    const reglas = await prisma.reglaContable.findMany();

    const backup = {
        cuentas,
        conceptos,
        reglas
    };

    fs.writeFileSync('c:/web/prisma/seed/puc-backup.json', JSON.stringify(backup, null, 2));

    let tsContent = `// Archivo autogenerado para preservar el esquema PUC exacto actual
import { PrismaClient, NaturalezaCuenta, TipoCuenta, TipoTransaccion } from "@prisma/client";

export async function seedPucCustom(prisma: PrismaClient) {
    const backupData = require('./puc-backup.json');
    console.log("🌱 Restaurando PUC completo desde Backup...");

    // Cuentas
    for (const c of backupData.cuentas) {
        await prisma.cuentaContable.upsert({
            where: { codigo: c.codigo },
            update: { nombre: c.nombre, padreId: c.padreId },
            create: c
        });
    }

    // Conceptos
    for (const cp of backupData.conceptos) {
        await prisma.conceptoFinanciero.upsert({
            where: { id: cp.id },
            update: { nombre: cp.nombre, tipo: cp.tipo, cuentaId: cp.cuentaId, requiereTercero: cp.requiereTercero, valorPorDefecto: cp.valorPorDefecto },
            // eslint-disable-next-line
            create: cp
            // Note: will recreate ids as is.
        });
    }

    console.log("✅ PUC Backup Completado.");
}
`;
    // We can also just log it.
    console.log("Exported backup to puc-backup.json");
}
main().finally(() => prisma.$disconnect());
