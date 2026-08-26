-- AlterTable
ALTER TABLE "configuracion_global" ADD COLUMN     "cuenta_bancos_id" TEXT,
ADD COLUMN     "cuenta_caja_id" TEXT,
ADD COLUMN     "cuenta_cobrar_id" TEXT,
ADD COLUMN     "cuenta_gastos_id" TEXT,
ADD COLUMN     "cuenta_ingresos_id" TEXT;

-- AddForeignKey
ALTER TABLE "configuracion_global" ADD CONSTRAINT "configuracion_global_cuenta_caja_id_fkey" FOREIGN KEY ("cuenta_caja_id") REFERENCES "cuentas_contables"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuracion_global" ADD CONSTRAINT "configuracion_global_cuenta_bancos_id_fkey" FOREIGN KEY ("cuenta_bancos_id") REFERENCES "cuentas_contables"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuracion_global" ADD CONSTRAINT "configuracion_global_cuenta_cobrar_id_fkey" FOREIGN KEY ("cuenta_cobrar_id") REFERENCES "cuentas_contables"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuracion_global" ADD CONSTRAINT "configuracion_global_cuenta_ingresos_id_fkey" FOREIGN KEY ("cuenta_ingresos_id") REFERENCES "cuentas_contables"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuracion_global" ADD CONSTRAINT "configuracion_global_cuenta_gastos_id_fkey" FOREIGN KEY ("cuenta_gastos_id") REFERENCES "cuentas_contables"("id") ON DELETE SET NULL ON UPDATE CASCADE;
