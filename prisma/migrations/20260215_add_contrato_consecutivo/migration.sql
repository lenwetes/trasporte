-- AlterTable
ALTER TABLE "contratos_empresa" ADD COLUMN "consecutivo_numerico" SERIAL NOT NULL;

-- CreateIndex
CREATE INDEX "contratos_empresa_consecutivo_numerico_idx" ON "contratos_empresa"("consecutivo_numerico");
