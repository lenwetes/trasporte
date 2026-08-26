/*
  Warnings:

  - A unique constraint covering the columns `[transaccion_id]` on the table `ordenes_servicio` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ordenes_servicio" ADD COLUMN     "transaccion_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ordenes_servicio_transaccion_id_key" ON "ordenes_servicio"("transaccion_id");

-- AddForeignKey
ALTER TABLE "ordenes_servicio" ADD CONSTRAINT "ordenes_servicio_transaccion_id_fkey" FOREIGN KEY ("transaccion_id") REFERENCES "transacciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;
