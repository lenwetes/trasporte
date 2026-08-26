/*
  Warnings:

  - A unique constraint covering the columns `[transaccion_id]` on the table `entregas_dotacion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[obligacion_id]` on the table `planillas_fuec` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ModoPagoPlanilla" AS ENUM ('EFECTIVO', 'CREDITO');

-- CreateEnum
CREATE TYPE "EstadoCobro" AS ENUM ('COBRADO', 'PENDIENTE', 'EN_MORA');

-- CreateEnum
CREATE TYPE "EstadoPrestamo" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO', 'DESEMBOLSADO', 'EN_MORA', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoCredito" AS ENUM ('LIBRE_INVERSION', 'VIVIENDA', 'SALUD', 'EDUCACION', 'MOTO_VEHICULO', 'OTRO', 'FLEXIBLE_DIARIO');

-- CreateEnum
CREATE TYPE "EstadoCuota" AS ENUM ('PENDIENTE', 'PAGADA', 'VENCIDA', 'PARCIAL');

-- AlterEnum
ALTER TYPE "Rol" ADD VALUE 'COLABORADOR';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TipoObligacion" ADD VALUE 'PLANILLA_FUEC';
ALTER TYPE "TipoObligacion" ADD VALUE 'DOTACION';

-- AlterTable
ALTER TABLE "configuracion_global" ADD COLUMN     "cuenta_prestamos_id" TEXT;

-- AlterTable
ALTER TABLE "entregas_dotacion" ADD COLUMN     "transaccion_id" TEXT,
ADD COLUMN     "valor_total" DECIMAL(12,2);

-- AlterTable
ALTER TABLE "experiencia_laboral" ADD COLUMN     "archivo_id" TEXT;

-- AlterTable
ALTER TABLE "planillas_fuec" ADD COLUMN     "estado_cobro" "EstadoCobro" NOT NULL DEFAULT 'COBRADO',
ADD COLUMN     "modo_pago" "ModoPagoPlanilla" NOT NULL DEFAULT 'EFECTIVO',
ADD COLUMN     "obligacion_id" TEXT;

-- CreateTable
CREATE TABLE "prestamos" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "tipo" "TipoCredito" NOT NULL DEFAULT 'LIBRE_INVERSION',
    "monto_capital" DECIMAL(15,2) NOT NULL,
    "tasa_mensual" DECIMAL(5,4) NOT NULL,
    "num_cuotas" INTEGER NOT NULL,
    "dia_pago" INTEGER NOT NULL DEFAULT 5,
    "saldo_actual" DECIMAL(15,2) NOT NULL,
    "estado" "EstadoPrestamo" NOT NULL DEFAULT 'PENDIENTE',
    "fecha_solicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_aprobacion" TIMESTAMP(3),
    "fecha_desembolso" TIMESTAMP(3),
    "documento_firmado_url" TEXT,
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prestamos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuotas_prestamo" (
    "id" TEXT NOT NULL,
    "prestamo_id" TEXT NOT NULL,
    "num_cuota" INTEGER NOT NULL,
    "fecha_vencimiento" TIMESTAMP(3) NOT NULL,
    "valor_capital" DECIMAL(15,2) NOT NULL,
    "valor_interes" DECIMAL(15,2) NOT NULL,
    "total_cuota" DECIMAL(15,2) NOT NULL,
    "monto_pagado" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "fecha_pago" TIMESTAMP(3),
    "estado" "EstadoCuota" NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "cuotas_prestamo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prestamos_usuario_id_idx" ON "prestamos"("usuario_id");

-- CreateIndex
CREATE INDEX "prestamos_estado_idx" ON "prestamos"("estado");

-- CreateIndex
CREATE INDEX "cuotas_prestamo_prestamo_id_idx" ON "cuotas_prestamo"("prestamo_id");

-- CreateIndex
CREATE INDEX "cuotas_prestamo_estado_fecha_vencimiento_idx" ON "cuotas_prestamo"("estado", "fecha_vencimiento");

-- CreateIndex
CREATE UNIQUE INDEX "entregas_dotacion_transaccion_id_key" ON "entregas_dotacion"("transaccion_id");

-- CreateIndex
CREATE INDEX "experiencia_laboral_usuario_id_idx" ON "experiencia_laboral"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "planillas_fuec_obligacion_id_key" ON "planillas_fuec"("obligacion_id");

-- AddForeignKey
ALTER TABLE "experiencia_laboral" ADD CONSTRAINT "experiencia_laboral_archivo_id_fkey" FOREIGN KEY ("archivo_id") REFERENCES "repositorio_archivos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuracion_global" ADD CONSTRAINT "configuracion_global_cuenta_prestamos_id_fkey" FOREIGN KEY ("cuenta_prestamos_id") REFERENCES "cuentas_contables"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas_dotacion" ADD CONSTRAINT "entregas_dotacion_transaccion_id_fkey" FOREIGN KEY ("transaccion_id") REFERENCES "transacciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planillas_fuec" ADD CONSTRAINT "planillas_fuec_obligacion_id_fkey" FOREIGN KEY ("obligacion_id") REFERENCES "obligaciones_financieras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prestamos" ADD CONSTRAINT "prestamos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuotas_prestamo" ADD CONSTRAINT "cuotas_prestamo_prestamo_id_fkey" FOREIGN KEY ("prestamo_id") REFERENCES "prestamos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
