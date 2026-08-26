import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

export async function seedPucCustom(prisma: PrismaClient) {
    console.log("🌱 Restaurando PUC completo y personalizado desde Backup...");
    
    const backupPath = path.join(__dirname, "puc-backup.json");
    if (!fs.existsSync(backupPath)) {
        console.log("No se encontró backup personalizado (puc-backup.json), omitiendo...");
        return;
    }

    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

    // Cuentas (Por orden de jerarquía para evitar errores de llave foránea - primero Nivel 1)
    const cuentasOrdenadas = [...backupData.cuentas].sort((a, b) => a.nivel - b.nivel);
    for (const c of cuentasOrdenadas) {
        await prisma.cuentaContable.upsert({
            where: { codigo: c.codigo },
            update: { 
                nombre: c.nombre, 
                padreId: c.padreId,
                permiteMovimiento: c.permiteMovimiento,
                activa: c.activa
            },
            create: {
                id: c.id,
                codigo: c.codigo,
                nombre: c.nombre,
                naturaleza: c.naturaleza,
                tipo: c.tipo,
                activa: c.activa,
                permiteMovimiento: c.permiteMovimiento,
                nivel: c.nivel,
                padreId: c.padreId
            }
        });
    }

    // Conceptos
    for (const cp of backupData.conceptos) {
        await prisma.conceptoFinanciero.upsert({
            where: { id: cp.id },
            update: { 
                nombre: cp.nombre, 
                tipo: cp.tipo, 
                cuentaId: cp.cuentaId, 
                requiereTercero: cp.requiereTercero, 
                valorPorDefecto: cp.valorPorDefecto,
                activo: cp.activo
            },
            create: {
                id: cp.id,
                nombre: cp.nombre,
                tipo: cp.tipo,
                cuentaId: cp.cuentaId,
                requiereTercero: cp.requiereTercero,
                valorPorDefecto: cp.valorPorDefecto,
                activo: cp.activo
            }
        });
    }

    // Reglas
    for (const r of backupData.reglas) {
        await prisma.reglaContable.upsert({
            where: { evento: r.evento },
            update: { 
                descripcion: r.descripcion, 
                cuentaDebitoId: r.cuentaDebitoId, 
                cuentaCreditoId: r.cuentaCreditoId,
                activo: r.activo 
            },
            create: {
                id: r.id,
                evento: r.evento,
                descripcion: r.descripcion,
                cuentaDebitoId: r.cuentaDebitoId,
                cuentaCreditoId: r.cuentaCreditoId,
                activo: r.activo
            }
        });
    }

    console.log("✅ Backup de Esquema PUC Personalizado Restaurado.");
}
