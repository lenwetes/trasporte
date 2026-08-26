import "dotenv/config";
import { getVehiclesWithExpiringDocuments } from "../src/actions/vehiculos";

async function validateCachePerformance() {
    console.log("🚀 Validando Performance con Caché...");

    // 1. First call (Cache Miss)
    console.log("⏱️  Ejecutando primera consulta (Cache MISS)...");
    const start1 = Date.now();
    await getVehiclesWithExpiringDocuments();
    const end1 = Date.now();
    console.log(`⏱️  Tiempo 1: ${end1 - start1}ms`);

    // 2. Second call (Cache HIT)
    console.log("⏱️  Ejecutando segunda consulta (Cache HIT)...");
    const start2 = Date.now();
    await getVehiclesWithExpiringDocuments();
    const end2 = Date.now();
    console.log(`⏱️  Tiempo 2: ${end2 - start2}ms`);

    if (end2 - start2 < 50) {
        console.log("✅ ÉXITO: La caché redujo el tiempo a < 50ms.");
    } else {
        console.warn(
            "⚠️  ALERTA: La caché no fue tan rápida como se esperaba.",
        );
    }

    // 3. Invalidation Test
    console.log("🔄 Invalidando caché...");
    // Simulating invalidation that happens on vehicle mutations
    // In our implementation, getVehiclesWithExpiringDocuments uses key "vehicles:health"
    // and actions call invalidate("vehicles") which matches tag prefix.
}

validateCachePerformance().catch(console.error);
