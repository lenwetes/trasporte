import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

async function exportMasterData() {
    const prisma = new PrismaClient();
    console.log("📤 Iniciando exportación de datos maestros para producción...");

    const masterData: any = {
        cuentas: [],
        conceptos: [],
        resoluciones: [],
        configGlobal: null
    };

    try {
        // 1. Obtener todas las cuentas del PUC
        try {
            masterData.cuentas = await prisma.cuentaContable.findMany({
                orderBy: { codigo: "asc" }
            });
            console.log(`✅ ${masterData.cuentas.length} cuentas del PUC encontradas.`);
        } catch (e) { console.error("❌ Error exportando cuentas PUC:", e); }

        // 2. Obtener Conceptos Financieros
        try {
            masterData.conceptos = await prisma.conceptoFinanciero.findMany();
            console.log(`✅ ${masterData.conceptos.length} conceptos financieros encontrados.`);
        } catch (e) { console.error("❌ Error exportando conceptos:", e); }

        // 3. Obtener Resoluciones Contables
        try {
            masterData.resoluciones = await prisma.resolucionContable.findMany();
            console.log(`✅ ${masterData.resoluciones.length} resoluciones encontradas.`);
        } catch (e) { console.error("❌ Error exportando resoluciones:", e); }

        // 4. Obtener Configuración Global
        try {
            masterData.configGlobal = await prisma.configuracionGlobal.findFirst();
            if (masterData.configGlobal) {
                console.log(`✅ Configuración Global encontrada.`);
            } else {
                console.log(`⚠️ No se encontró registro de Configuración Global.`);
            }
        } catch (e) { 
            console.error("❌ Error exportando Configuración Global (posible corrupción de esquema):", e); 
            console.log("💡 Intentando omitir configuración global para continuar exportación...");
        }

        const dir = path.join(process.cwd(), "prisma", "data");
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(
            path.join(dir, "master-data.json"),
            JSON.stringify(masterData, null, 2)
        );

        console.log("🚀 Exportación parcial completada en prisma/data/master-data.json");
    } catch (error) {
        console.error("❌ Error crítico en exportación:", error);
    } finally {
        await prisma.$disconnect();
    }
}

exportMasterData();
