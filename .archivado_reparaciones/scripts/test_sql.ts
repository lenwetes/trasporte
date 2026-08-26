
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Testing raw query for eventos_calendario...");
  try {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const result = await prisma.$queryRawUnsafe<any[]>(
        "SELECT id, titulo, descripcion, fecha, tipo, prioridad, estado, ejecutado, \"fechaEjecucion\", metadata FROM eventos_calendario WHERE fecha >= $1 AND fecha <= $2",
        start, end
    );

    console.log("Found:", result.length, "manual events.");
    process.exit(0);
  } catch (error) {
    console.error("Query failed with:", error);
    process.exit(1);
  }
}

main();
