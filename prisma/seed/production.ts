import { PrismaClient, Prisma } from "@prisma/client";
import fs from "fs";
import path from "path";

export async function seedProductionData(prisma: PrismaClient) {
    const filePath = path.join(process.cwd(), "prisma", "data", "master-data.json");
    
    if (!fs.existsSync(filePath)) {
        console.log("⚠️ No se encontró prisma/data/master-data.json. Saltando seed de producción.");
        return false;
    }

    console.log("💎 Cargando Datos Maestros desde master-data.json...");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(rawData);

    // 1. Restaurar Cuentas PUC (En orden para respetar jerarquía)
    if (data.cuentas) {
        console.log(`📊 Restaurando ${data.cuentas.length} cuentas del PUC...`);
        const sorted = [...data.cuentas].sort((a,b) => a.codigo.length - b.codigo.length);
        for (const c of sorted) {
            await prisma.cuentaContable.upsert({
                where: { codigo: c.codigo },
                update: { nombre: c.nombre, naturaleza: c.naturaleza, tipo: c.tipo, activa: c.activa, permiteMovimiento: c.permiteMovimiento },
                create: { 
                    codigo: c.codigo, 
                    nombre: c.nombre, 
                    naturaleza: c.naturaleza, 
                    tipo: c.tipo, 
                    activa: c.activa, 
                    permiteMovimiento: c.permiteMovimiento,
                    id: c.id
                }
            });
        }
    }

    // 2. Restaurar Conceptos
    if (data.conceptos) {
        console.log(`🏷️ Restaurando ${data.conceptos.length} conceptos financieros...`);
        for (const c of data.conceptos) {
            await prisma.conceptoFinanciero.upsert({
                where: { id: c.id },
                update: { nombre: c.nombre, tipo: c.tipo, cuentaId: c.cuentaId },
                create: { id: c.id, nombre: c.nombre, tipo: c.tipo, cuentaId: c.cuentaId }
            });
        }
    }

    // 3. Restaurar Resoluciones
    if (data.resoluciones) {
        console.log(`📜 Restaurando ${data.resoluciones.length} resoluciones...`);
        for (const r of data.resoluciones) {
            await prisma.resolucionContable.upsert({
                where: { id: r.id },
                update: { 
                    tipo: r.tipo,
                    prefijo: r.prefijo, 
                    numero: r.numero,
                    consecutivoDesde: r.consecutivoDesde, 
                    consecutivoHasta: r.consecutivoHasta, 
                    actual: r.actual, 
                    fechaInicio: r.fechaInicio ? new Date(r.fechaInicio) : new Date(),
                    fechaFin: r.fechaFin ? new Date(r.fechaFin) : new Date(),
                    activa: r.activa
                },
                create: { 
                    id: r.id, 
                    tipo: r.tipo,
                    prefijo: r.prefijo, 
                    numero: r.numero,
                    consecutivoDesde: r.consecutivoDesde, 
                    consecutivoHasta: r.consecutivoHasta, 
                    actual: r.actual, 
                    fechaInicio: r.fechaInicio ? new Date(r.fechaInicio) : new Date(),
                    fechaFin: r.fechaFin ? new Date(r.fechaFin) : new Date(),
                    activa: r.activa
                }
            });
        }
    }

    // 4. Restaurar Configuración Global
    if (data.configGlobal) {
        console.log(`🌍 Restaurando configuración global...`);
        const { id, ...config } = data.configGlobal;
        await prisma.configuracionGlobal.upsert({
            where: { id: id || "default" },
            update: {
                ...config,
                montoCuotaAdministracion: config.montoCuotaAdministracion ? new Prisma.Decimal(config.montoCuotaAdministracion) : undefined
            },
            create: {
                ...config,
                id: id || "default",
                montoCuotaAdministracion: config.montoCuotaAdministracion ? new Prisma.Decimal(config.montoCuotaAdministracion) : new Prisma.Decimal(0)
            }
        });
    }

    return true;
}
