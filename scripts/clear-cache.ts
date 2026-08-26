#!/usr/bin/env tsx
/**
 * Script para limpiar el caché del sistema
 * Uso: npx tsx scripts/clear-cache.ts
 */

import { cacheProvider } from "../src/lib/cache-provider";

async function clearCache() {
    console.log("🧹 Limpiando caché del sistema...");

    try {
        // Limpiar todos los tags conocidos
        const tags = [
            "vehicles",
            "usuarios",
            "conductores",
            "dashboard",
            "alerts",
            "safety",
            "mantenimiento",
        ];

        for (const tag of tags) {
            await cacheProvider.delByTag(tag);
            console.log(`✅ Caché limpiado para tag: ${tag}`);
        }

        console.log("✨ Caché completamente limpiado");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error limpiando caché:", error);
        process.exit(1);
    }
}

clearCache();
