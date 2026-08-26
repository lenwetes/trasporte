/*
  Warnings:

  - A unique constraint covering the columns `[numero_comprobante]` on the table `transacciones` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "configuracion_global" ADD COLUMN     "umbral_bloqueo_mora" DECIMAL(12,2) NOT NULL DEFAULT 200000;

-- AlterTable
ALTER TABLE "repositorio_archivos" ADD COLUMN     "transaccion_id" TEXT;

-- AlterTable
ALTER TABLE "transacciones" ADD COLUMN     "cufe" TEXT,
ADD COLUMN     "documento_numero" TEXT,
ADD COLUMN     "es_electronica" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "numero_comprobante" TEXT,
ADD COLUMN     "proveedor_id" TEXT,
ADD COLUMN     "resolucion_id" TEXT;

-- CreateTable
CREATE TABLE "proveedores" (
    "id" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "razon_social" TEXT,
    "tipo_documento" "TipoDocumento" NOT NULL DEFAULT 'NIT',
    "numero_documento" TEXT,
    "celular" TEXT,
    "email" TEXT,
    "direccion" TEXT,
    "ciudad" TEXT DEFAULT 'Sincelejo',
    "contacto" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resoluciones_contables" (
    "id" TEXT NOT NULL,
    "tipo" "TipoTransaccion" NOT NULL,
    "prefijo" TEXT,
    "numero" TEXT NOT NULL,
    "consecutivoDesde" INTEGER NOT NULL DEFAULT 1,
    "consecutivoHasta" INTEGER NOT NULL,
    "actual" INTEGER NOT NULL DEFAULT 0,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resoluciones_contables_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "proveedores_numero_documento_key" ON "proveedores"("numero_documento");

-- CreateIndex
CREATE UNIQUE INDEX "transacciones_numero_comprobante_key" ON "transacciones"("numero_comprobante");

-- CreateIndex
CREATE INDEX "transacciones_numero_comprobante_idx" ON "transacciones"("numero_comprobante");

-- AddForeignKey
ALTER TABLE "repositorio_archivos" ADD CONSTRAINT "repositorio_archivos_transaccion_id_fkey" FOREIGN KEY ("transaccion_id") REFERENCES "transacciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "proveedores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
