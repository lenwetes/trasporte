-- AlterEnum
ALTER TYPE "TipoObligacion" ADD VALUE 'PRESTAMO';

-- AlterTable
ALTER TABLE "cuentas_contables" ADD COLUMN     "nivel" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "padre_id" TEXT,
ADD COLUMN     "saldo" DECIMAL(15,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "conceptos_financieros" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoTransaccion" NOT NULL,
    "cuenta_id" TEXT NOT NULL,
    "requiereTercero" BOOLEAN NOT NULL DEFAULT false,
    "valor_por_defecto" DECIMAL(12,2),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conceptos_financieros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reglas_contables" (
    "id" TEXT NOT NULL,
    "evento" TEXT NOT NULL,
    "descripcion" TEXT,
    "cuenta_debito_id" TEXT NOT NULL,
    "cuenta_credito_id" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "reglas_contables_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reglas_contables_evento_key" ON "reglas_contables"("evento");

-- AddForeignKey
ALTER TABLE "cuentas_contables" ADD CONSTRAINT "cuentas_contables_padre_id_fkey" FOREIGN KEY ("padre_id") REFERENCES "cuentas_contables"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conceptos_financieros" ADD CONSTRAINT "conceptos_financieros_cuenta_id_fkey" FOREIGN KEY ("cuenta_id") REFERENCES "cuentas_contables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reglas_contables" ADD CONSTRAINT "reglas_contables_cuenta_debito_id_fkey" FOREIGN KEY ("cuenta_debito_id") REFERENCES "cuentas_contables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reglas_contables" ADD CONSTRAINT "reglas_contables_cuenta_credito_id_fkey" FOREIGN KEY ("cuenta_credito_id") REFERENCES "cuentas_contables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
