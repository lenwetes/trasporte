-- Migration: add_fuec_vehicle_fields
-- Date: 2026-03-03
-- Purpose: Add reglamentary FUEC fields to vehiculos table as required by Resolución 6652 MinTransporte

ALTER TABLE "vehiculos" 
  ADD COLUMN IF NOT EXISTS "numero_interno" TEXT,
  ADD COLUMN IF NOT EXISTS "numero_tarjeta_operacion" TEXT;

COMMENT ON COLUMN "vehiculos"."numero_interno" IS 'Número interno asignado por la cooperativa al vehículo';
COMMENT ON COLUMN "vehiculos"."numero_tarjeta_operacion" IS 'Número de tarjeta de operación habilitada por MinTransporte';
