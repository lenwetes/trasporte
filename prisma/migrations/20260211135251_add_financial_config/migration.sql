-- AlterTable
ALTER TABLE "configuracion_global" ADD COLUMN     "dia_corte_mensual" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "monto_cuota_administracion" DECIMAL(12,2) NOT NULL DEFAULT 80000,
ADD COLUMN     "porcentaje_mora_diaria" DECIMAL(5,2) NOT NULL DEFAULT 0;
