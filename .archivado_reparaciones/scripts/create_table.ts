
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Creating table eventos_calendario...");
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "eventos_calendario" (
        "id" TEXT NOT NULL,
        "titulo" TEXT NOT NULL,
        "descripcion" TEXT,
        "fecha" TIMESTAMP(3) NOT NULL,
        "tipo" TEXT NOT NULL DEFAULT 'NOTA',
        "prioridad" TEXT NOT NULL DEFAULT 'MEDIA',
        "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
        "ejecutado" BOOLEAN NOT NULL DEFAULT false,
        "fechaEjecucion" TIMESTAMP(3),
        "usuario_id" TEXT NOT NULL,
        "metadata" JSONB DEFAULT '{}',
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "eventos_calendario_pkey" PRIMARY KEY ("id")
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "eventos_calendario_usuario_id_idx" ON "eventos_calendario"("usuario_id");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "eventos_calendario_fecha_idx" ON "eventos_calendario"("fecha");
    `);

    console.log("Table created successfully!");
  } catch (error) {
    console.error("Error creating table:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
