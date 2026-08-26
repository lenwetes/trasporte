/*
  Warnings:

  - A unique constraint covering the columns `[archivo_id]` on the table `detalles_licencias_usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EstadoSiniestro" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'CERRADO');

-- CreateEnum
CREATE TYPE "NaturalezaCuenta" AS ENUM ('DEBITO', 'CREDITO');

-- CreateEnum
CREATE TYPE "TipoCuenta" AS ENUM ('ACTIVO', 'PASIVO', 'PATRIMONIO', 'INGRESO', 'GASTO');

-- CreateEnum
CREATE TYPE "TipoTransaccion" AS ENUM ('INGRESO', 'EGRESO', 'NOTA_CONTABLE');

-- CreateEnum
CREATE TYPE "TipoObligacion" AS ENUM ('CUOTA_ADMINISTRACION', 'MULTA', 'APORTE', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoObligacion" AS ENUM ('PENDIENTE', 'PAGADO', 'ANULADO', 'VENCIDO');

-- DropIndex
DROP INDEX "audit_logs_entidad_tipo_idx";

-- DropIndex
DROP INDEX "documentos_vehiculo_tipo_idx";

-- DropIndex
DROP INDEX "documentos_vehiculo_vehiculo_id_idx";

-- DropIndex
DROP INDEX "mantenimientos_realizados_vehiculo_id_idx";

-- DropIndex
DROP INDEX "novedades_fecha_idx";

-- DropIndex
DROP INDEX "novedades_vehiculo_id_idx";

-- DropIndex
DROP INDEX "siniestros_fecha_idx";

-- DropIndex
DROP INDEX "siniestros_vehiculo_id_idx";

-- DropIndex
DROP INDEX "vinculaciones_activo_idx";

-- DropIndex
DROP INDEX "vinculaciones_conductor_id_idx";

-- DropIndex
DROP INDEX "vinculaciones_vehiculo_id_idx";

-- AlterTable
ALTER TABLE "detalles_licencias_usuarios" ADD COLUMN     "archivo_id" TEXT;

-- AlterTable
ALTER TABLE "mantenimientos_realizados" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "novedades" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ordenes_servicio" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "siniestros" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "estado" "EstadoSiniestro" NOT NULL DEFAULT 'PENDIENTE';

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "numero_documento" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "vehiculos" ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "marca" DROP NOT NULL,
ALTER COLUMN "modalidad" DROP NOT NULL,
ALTER COLUMN "propietario" DROP NOT NULL;

-- CreateTable
CREATE TABLE "cuentas_contables" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "naturaleza" "NaturalezaCuenta" NOT NULL,
    "tipo" "TipoCuenta" NOT NULL,
    "permiteMovimiento" BOOLEAN NOT NULL DEFAULT true,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cuentas_contables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transacciones" (
    "id" TEXT NOT NULL,
    "consecutivo" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descripcion" TEXT NOT NULL,
    "tipo" "TipoTransaccion" NOT NULL,
    "soporteUrl" TEXT,
    "creado_por_id" TEXT NOT NULL,
    "tercero_id" TEXT,
    "meta_vehiculo_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transacciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asientos_contables" (
    "id" TEXT NOT NULL,
    "transaccion_id" TEXT NOT NULL,
    "cuenta_id" TEXT NOT NULL,
    "debito" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "credito" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asientos_contables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "obligaciones_financieras" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "vehiculo_id" TEXT,
    "tipo" "TipoObligacion" NOT NULL,
    "periodo" TIMESTAMP(3) NOT NULL,
    "fecha_vence" TIMESTAMP(3) NOT NULL,
    "monto_inicial" DECIMAL(12,2) NOT NULL,
    "saldo_pendiente" DECIMAL(12,2) NOT NULL,
    "estado" "EstadoObligacion" NOT NULL,
    "transaccion_origen_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "obligaciones_financieras_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cuentas_contables_codigo_key" ON "cuentas_contables"("codigo");

-- CreateIndex
CREATE INDEX "transacciones_fecha_idx" ON "transacciones"("fecha");

-- CreateIndex
CREATE INDEX "transacciones_tipo_idx" ON "transacciones"("tipo");

-- CreateIndex
CREATE INDEX "transacciones_creado_por_id_idx" ON "transacciones"("creado_por_id");

-- CreateIndex
CREATE INDEX "asientos_contables_transaccion_id_idx" ON "asientos_contables"("transaccion_id");

-- CreateIndex
CREATE INDEX "asientos_contables_cuenta_id_idx" ON "asientos_contables"("cuenta_id");

-- CreateIndex
CREATE INDEX "obligaciones_financieras_usuario_id_estado_idx" ON "obligaciones_financieras"("usuario_id", "estado");

-- CreateIndex
CREATE INDEX "obligaciones_financieras_periodo_idx" ON "obligaciones_financieras"("periodo");

-- CreateIndex
CREATE INDEX "obligaciones_financieras_fecha_vence_idx" ON "obligaciones_financieras"("fecha_vence");

-- CreateIndex
CREATE INDEX "audit_logs_entidad_tipo_entidad_id_idx" ON "audit_logs"("entidad_tipo", "entidad_id");

-- CreateIndex
CREATE INDEX "certificados_usuarios_usuario_id_idx" ON "certificados_usuarios"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "detalles_licencias_usuarios_archivo_id_key" ON "detalles_licencias_usuarios"("archivo_id");

-- CreateIndex
CREATE INDEX "detalles_licencias_usuarios_usuario_id_activo_idx" ON "detalles_licencias_usuarios"("usuario_id", "activo");

-- CreateIndex
CREATE INDEX "detalles_licencias_usuarios_fecha_vencimiento_idx" ON "detalles_licencias_usuarios"("fecha_vencimiento");

-- CreateIndex
CREATE INDEX "detalles_preoperacional_preoperacional_id_idx" ON "detalles_preoperacional"("preoperacional_id");

-- CreateIndex
CREATE INDEX "documentos_vehiculo_vehiculo_id_tipo_idx" ON "documentos_vehiculo"("vehiculo_id", "tipo");

-- CreateIndex
CREATE INDEX "documentos_vehiculo_estado_alerta_idx" ON "documentos_vehiculo"("estado_alerta");

-- CreateIndex
CREATE INDEX "entregas_dotacion_conductor_id_idx" ON "entregas_dotacion"("conductor_id");

-- CreateIndex
CREATE INDEX "examenes_medicos_conductor_id_idx" ON "examenes_medicos"("conductor_id");

-- CreateIndex
CREATE INDEX "examenes_medicos_fecha_realizacion_idx" ON "examenes_medicos"("fecha_realizacion");

-- CreateIndex
CREATE INDEX "mantenimientos_realizados_vehiculo_id_fecha_idx" ON "mantenimientos_realizados"("vehiculo_id", "fecha");

-- CreateIndex
CREATE INDEX "notificaciones_created_at_idx" ON "notificaciones"("created_at");

-- CreateIndex
CREATE INDEX "novedades_vehiculo_id_fecha_idx" ON "novedades"("vehiculo_id", "fecha");

-- CreateIndex
CREATE INDEX "ordenes_servicio_vehiculo_id_estado_idx" ON "ordenes_servicio"("vehiculo_id", "estado");

-- CreateIndex
CREATE INDEX "ordenes_servicio_plan_id_idx" ON "ordenes_servicio"("plan_id");

-- CreateIndex
CREATE INDEX "ordenes_servicio_created_at_idx" ON "ordenes_servicio"("created_at");

-- CreateIndex
CREATE INDEX "preoperacionales_vehiculo_id_fecha_idx" ON "preoperacionales"("vehiculo_id", "fecha");

-- CreateIndex
CREATE INDEX "preoperacionales_conductor_id_idx" ON "preoperacionales"("conductor_id");

-- CreateIndex
CREATE INDEX "repositorio_archivos_nombre_original_idx" ON "repositorio_archivos"("nombre_original");

-- CreateIndex
CREATE INDEX "siniestros_vehiculo_id_fecha_idx" ON "siniestros"("vehiculo_id", "fecha");

-- CreateIndex
CREATE INDEX "siniestros_estado_idx" ON "siniestros"("estado");

-- CreateIndex
CREATE INDEX "vinculaciones_vehiculo_id_activo_idx" ON "vinculaciones"("vehiculo_id", "activo");

-- CreateIndex
CREATE INDEX "vinculaciones_conductor_id_activo_idx" ON "vinculaciones"("conductor_id", "activo");

-- AddForeignKey
ALTER TABLE "detalles_licencias_usuarios" ADD CONSTRAINT "detalles_licencias_usuarios_archivo_id_fkey" FOREIGN KEY ("archivo_id") REFERENCES "repositorio_archivos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_creado_por_id_fkey" FOREIGN KEY ("creado_por_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_tercero_id_fkey" FOREIGN KEY ("tercero_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asientos_contables" ADD CONSTRAINT "asientos_contables_transaccion_id_fkey" FOREIGN KEY ("transaccion_id") REFERENCES "transacciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asientos_contables" ADD CONSTRAINT "asientos_contables_cuenta_id_fkey" FOREIGN KEY ("cuenta_id") REFERENCES "cuentas_contables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obligaciones_financieras" ADD CONSTRAINT "obligaciones_financieras_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obligaciones_financieras" ADD CONSTRAINT "obligaciones_financieras_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obligaciones_financieras" ADD CONSTRAINT "obligaciones_financieras_transaccion_origen_id_fkey" FOREIGN KEY ("transaccion_origen_id") REFERENCES "transacciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;
