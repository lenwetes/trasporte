-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('EFECTIVO', 'TRANSFERENCIA', 'CHEQUE', 'OTRO');

-- AlterTable
ALTER TABLE "configuracion_global" ADD COLUMN     "costo_base_fuec" DECIMAL(12,2) NOT NULL DEFAULT 30000,
ADD COLUMN     "dashboard_theme" TEXT NOT NULL DEFAULT 'command-classic';

-- AlterTable
ALTER TABLE "transacciones" ADD COLUMN     "fecha_operacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "metodo_pago" "MetodoPago" NOT NULL DEFAULT 'EFECTIVO';
