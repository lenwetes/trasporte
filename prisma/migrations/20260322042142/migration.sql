/*
  Warnings:

  - You are about to drop the column `conductor_id` on the `planillas_fuec` table. All the data in the column will be lost.
  - You are about to drop the column `numero_tarjeta_operacion` on the `vehiculos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_documento_identidad]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `conductor1_id` to the `planillas_fuec` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ClaseVehiculo" ADD VALUE 'BUSETA';
ALTER TYPE "ClaseVehiculo" ADD VALUE 'BUS';

-- AlterEnum
ALTER TYPE "EstadoOperativo" ADD VALUE 'OPERATIVO_OVERRIDE';

-- DropForeignKey
ALTER TABLE "planillas_fuec" DROP CONSTRAINT "planillas_fuec_conductor_id_fkey";

-- DropIndex
DROP INDEX "certificados_usuarios_archivo_id_key";

-- DropIndex
DROP INDEX "contratos_empresa_consecutivo_numerico_idx";

-- DropIndex
DROP INDEX "contratos_empresa_numero_contrato_key";

-- DropIndex
DROP INDEX "detalles_licencias_usuarios_archivo_id_key";

-- DropIndex
DROP INDEX "planillas_fuec_conductor_id_idx";

-- AlterTable
ALTER TABLE "contratos_empresa" ADD COLUMN     "es_interno" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nit_cliente" TEXT,
ADD COLUMN     "responsable_cedula" TEXT,
ADD COLUMN     "responsable_direccion" TEXT,
ADD COLUMN     "responsable_nombre" TEXT,
ADD COLUMN     "responsable_telefono" TEXT;

-- AlterTable
ALTER TABLE "novedades" ADD COLUMN     "consulta_simit_id" TEXT;

-- AlterTable
ALTER TABLE "planillas_fuec" DROP COLUMN "conductor_id",
ADD COLUMN     "conductor1_id" TEXT NOT NULL,
ADD COLUMN     "conductor2_id" TEXT,
ADD COLUMN     "conductor3_id" TEXT,
ADD COLUMN     "numero_extracto" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "objeto_viaje" TEXT;

-- AlterTable
ALTER TABLE "resoluciones_fuec" ADD COLUMN     "anio_habilitacion" TEXT NOT NULL DEFAULT '18',
ADD COLUMN     "codigo_territorial" TEXT NOT NULL DEFAULT '223',
ADD COLUMN     "resolucion_empresa" TEXT NOT NULL DEFAULT '0041';

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "id_documento_identidad" TEXT,
ADD COLUMN     "margen_confianza" DECIMAL(12,2) NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "vehiculos" DROP COLUMN "numero_tarjeta_operacion",
ADD COLUMN     "justificacion_override" TEXT,
ADD COLUMN     "override_activo" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "clientes_frecuentes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "nit" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_frecuentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsables_frecuentes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cedula" TEXT,
    "telefono" TEXT,
    "direccion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "responsables_frecuentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos_calendario" (
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
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eventos_calendario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultas_simit" (
    "id" TEXT NOT NULL,
    "conductor_id" TEXT,
    "vehiculo_id" TEXT,
    "criterio" TEXT NOT NULL,
    "fecha_consulta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estadoCuenta" TEXT NOT NULL DEFAULT 'SIN_NOVEDADES',
    "valorTotal" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "numeroComparendos" INTEGER NOT NULL DEFAULT 0,
    "detalles" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultas_simit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comparendos_simit" (
    "id" TEXT NOT NULL,
    "consulta_id" TEXT NOT NULL,
    "numero_comparendo" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "infraccion" TEXT NOT NULL,
    "valor" DECIMAL(15,2) NOT NULL,
    "estado" TEXT NOT NULL,
    "secretaria" TEXT,

    CONSTRAINT "comparendos_simit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "eventos_calendario_usuario_id_idx" ON "eventos_calendario"("usuario_id");

-- CreateIndex
CREATE INDEX "eventos_calendario_fecha_idx" ON "eventos_calendario"("fecha");

-- CreateIndex
CREATE INDEX "consultas_simit_conductor_id_idx" ON "consultas_simit"("conductor_id");

-- CreateIndex
CREATE INDEX "consultas_simit_vehiculo_id_idx" ON "consultas_simit"("vehiculo_id");

-- CreateIndex
CREATE INDEX "consultas_simit_fecha_consulta_idx" ON "consultas_simit"("fecha_consulta");

-- CreateIndex
CREATE INDEX "comparendos_simit_consulta_id_idx" ON "comparendos_simit"("consulta_id");

-- CreateIndex
CREATE INDEX "planillas_fuec_conductor1_id_idx" ON "planillas_fuec"("conductor1_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_id_documento_identidad_key" ON "usuarios"("id_documento_identidad");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_documento_identidad_fkey" FOREIGN KEY ("id_documento_identidad") REFERENCES "repositorio_archivos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "novedades" ADD CONSTRAINT "novedades_consulta_simit_id_fkey" FOREIGN KEY ("consulta_simit_id") REFERENCES "consultas_simit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planillas_fuec" ADD CONSTRAINT "planillas_fuec_conductor1_id_fkey" FOREIGN KEY ("conductor1_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planillas_fuec" ADD CONSTRAINT "planillas_fuec_conductor2_id_fkey" FOREIGN KEY ("conductor2_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planillas_fuec" ADD CONSTRAINT "planillas_fuec_conductor3_id_fkey" FOREIGN KEY ("conductor3_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_calendario" ADD CONSTRAINT "eventos_calendario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas_simit" ADD CONSTRAINT "consultas_simit_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas_simit" ADD CONSTRAINT "consultas_simit_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comparendos_simit" ADD CONSTRAINT "comparendos_simit_consulta_id_fkey" FOREIGN KEY ("consulta_id") REFERENCES "consultas_simit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
