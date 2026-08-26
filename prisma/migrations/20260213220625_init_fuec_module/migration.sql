-- CreateEnum
CREATE TYPE "EstadoOperativo" AS ENUM ('EVALUANDO', 'OPERATIVO', 'OPERATIVO_CON_ALERTAS', 'NO_OPERATIVO', 'BLOQUEADO_ADMIN');

-- CreateEnum
CREATE TYPE "EstadoFUEC" AS ENUM ('ACTIVO', 'ANULADO', 'VENCIDO');

-- AlterTable
ALTER TABLE "configuracion_global" ADD COLUMN     "nit" TEXT,
ADD COLUMN     "nombre_presidente" TEXT;

-- AlterTable
ALTER TABLE "vehiculos" ADD COLUMN     "bloqueado_manualmente" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "estado_operativo" "EstadoOperativo" NOT NULL DEFAULT 'EVALUANDO',
ADD COLUMN     "razon_bloqueo" TEXT;

-- CreateTable
CREATE TABLE "historial_estados_vehiculo" (
    "id" TEXT NOT NULL,
    "vehiculo_id" TEXT NOT NULL,
    "estado_anterior" "EstadoOperativo" NOT NULL,
    "estado_nuevo" "EstadoOperativo" NOT NULL,
    "razon" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_estados_vehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contratos_empresa" (
    "id" TEXT NOT NULL,
    "numero_contrato" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "objeto" TEXT,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "valor_total" DECIMAL(15,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contratos_empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resoluciones_fuec" (
    "id" TEXT NOT NULL,
    "numero_resolucion" TEXT NOT NULL,
    "rango_desde" INTEGER NOT NULL,
    "rango_hasta" INTEGER NOT NULL,
    "actual" INTEGER NOT NULL,
    "habilitada" BOOLEAN NOT NULL DEFAULT true,
    "fecha_expedicion" TIMESTAMP(3) NOT NULL,
    "fecha_vencimiento" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resoluciones_fuec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planillas_fuec" (
    "id" TEXT NOT NULL,
    "consecutivo" TEXT NOT NULL,
    "numero_fuec" INTEGER NOT NULL,
    "contrato_id" TEXT NOT NULL,
    "vehiculo_id" TEXT NOT NULL,
    "conductor_id" TEXT NOT NULL,
    "resolucion_id" TEXT NOT NULL,
    "transaccion_id" TEXT,
    "ruta" JSONB NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "pago_valor" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "token_qr" TEXT NOT NULL,
    "estado" "EstadoFUEC" NOT NULL DEFAULT 'ACTIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planillas_fuec_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "historial_estados_vehiculo_vehiculo_id_idx" ON "historial_estados_vehiculo"("vehiculo_id");

-- CreateIndex
CREATE UNIQUE INDEX "contratos_empresa_numero_contrato_key" ON "contratos_empresa"("numero_contrato");

-- CreateIndex
CREATE UNIQUE INDEX "resoluciones_fuec_numero_resolucion_key" ON "resoluciones_fuec"("numero_resolucion");

-- CreateIndex
CREATE UNIQUE INDEX "planillas_fuec_consecutivo_key" ON "planillas_fuec"("consecutivo");

-- CreateIndex
CREATE UNIQUE INDEX "planillas_fuec_transaccion_id_key" ON "planillas_fuec"("transaccion_id");

-- CreateIndex
CREATE UNIQUE INDEX "planillas_fuec_token_qr_key" ON "planillas_fuec"("token_qr");

-- CreateIndex
CREATE INDEX "planillas_fuec_consecutivo_idx" ON "planillas_fuec"("consecutivo");

-- CreateIndex
CREATE INDEX "planillas_fuec_conductor_id_idx" ON "planillas_fuec"("conductor_id");

-- CreateIndex
CREATE INDEX "planillas_fuec_vehiculo_id_idx" ON "planillas_fuec"("vehiculo_id");

-- CreateIndex
CREATE INDEX "planillas_fuec_contrato_id_idx" ON "planillas_fuec"("contrato_id");

-- AddForeignKey
ALTER TABLE "historial_estados_vehiculo" ADD CONSTRAINT "historial_estados_vehiculo_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_estados_vehiculo" ADD CONSTRAINT "historial_estados_vehiculo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planillas_fuec" ADD CONSTRAINT "planillas_fuec_contrato_id_fkey" FOREIGN KEY ("contrato_id") REFERENCES "contratos_empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planillas_fuec" ADD CONSTRAINT "planillas_fuec_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planillas_fuec" ADD CONSTRAINT "planillas_fuec_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planillas_fuec" ADD CONSTRAINT "planillas_fuec_resolucion_id_fkey" FOREIGN KEY ("resolucion_id") REFERENCES "resoluciones_fuec"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planillas_fuec" ADD CONSTRAINT "planillas_fuec_transaccion_id_fkey" FOREIGN KEY ("transaccion_id") REFERENCES "transacciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;
