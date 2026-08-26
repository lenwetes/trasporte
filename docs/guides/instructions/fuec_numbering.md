# Configuración de Numeración FUEC - Resolución 6652

## Estructura del Número de 21 Dígitos

El número FUEC debe tener exactamente 21 dígitos divididos en 6 segmentos:

### Segmentos Actuales (Implementados)

**a) Código Territorial (3 dígitos)**: `223`
- Identifica Sincelejo/Sucre
- Configurado en `ResolucionFUEC.codigoTerritorial`

**b) Resolución de Empresa (4 dígitos)**: `0041`
- Número de resolución de habilitación de la empresa
- Configurado en `ResolucionFUEC.resolucionEmpresa`

**c) Año de Habilitación (2 dígitos)**: `18`
- Año en que se otorgó la habilitación
- Configurado en `ResolucionFUEC.anioHabilitacion`

**d) Año de Expedición (4 dígitos)**: `2026`
- Año actual en que se emite el FUEC
- Se genera automáticamente

### Segmentos Pendientes de Implementación

**e) Número de Contrato (4 dígitos)**: `0001` - `9999`
- **Descripción**: Consecutivo único para cada contrato de prestación de servicio
- **Inicio**: Comienza en 0001 para el primer contrato
- **Incremento**: Se incrementa automáticamente con cada nuevo contrato
- **Alcance**: Numeración consecutiva establecida por la empresa
- **Implementación**:
  - Se agregó el campo `consecutivoNumerico` al modelo `ContratoEmpresa`
  - Es un campo `SERIAL` (autoincremental) en PostgreSQL
  - Se formatea con `padStart(4, '0')` para asegurar 4 dígitos

**f) Consecutivo del Extracto (4 dígitos)**: `0001` - `9999`
- **Descripción**: Número consecutivo del extracto de contrato (FUEC)
- **Inicio**: Comienza en 0001 para el primer FUEC de cada resolución
- **Incremento**: Se incrementa con cada nuevo FUEC emitido
- **Renovación**: Se debe expedir un nuevo extracto por:
  - Vencimiento del plazo inicial
  - Cambio de vehículo
- **Implementación**:
  - Usa el campo `ResolucionFUEC.actual` que ya existe
  - Se incrementa en cada generación de FUEC
  - Se formatea con `padStart(4, '0')` para asegurar 4 dígitos

## Ejemplo de Numeración Completa

```
Segmento a): 223      (Código Territorial - Sincelejo)
Segmento b): 0041     (Resolución Empresa)
Segmento c): 18       (Año Habilitación)
Segmento d): 2026     (Año Expedición)
Segmento e): 0015     (Contrato #15)
Segmento f): 0234     (Extracto #234)

Número FUEC Completo: 223 0041 18 2026 0015 0234
Sin espacios: 22300411820260015023 4

Total: 21 dígitos
```

## Cambios Requeridos en el Código

### 1. Migración de Base de Datos

```sql
-- Agregar campo consecutivoNumerico a contratos_empresa
ALTER TABLE "contratos_empresa" 
ADD COLUMN "consecutivo_numerico" SERIAL NOT NULL DEFAULT 1;

-- Crear índice para mejorar rendimiento
CREATE INDEX "contratos_empresa_consecutivo_numerico_idx" 
ON "contratos_empresa"("consecutivo_numerico");
```

### 2. Actualización del Servicio FUEC

En `src/services/fuec.service.ts`, línea 131-132:

**Antes:**
```typescript
const s5_contrato = contrato.numeroContrato.replace(/\\D/g, '').slice(-4).padStart(4, '0');
```

**Después:**
```typescript
// Segmento 5 (e): Número de contrato (4 dígitos consecutivos)
const s5_contrato = contrato.consecutivoNumerico.toString().padStart(4, '0');
```

### 3. Validación de Tipos

Actualizar el tipo de `ContratoEmpresa` para incluir el nuevo campo:

```typescript
interface ContratoEmpresa {
  id: string;
  numeroContrato: string;
  consecutivoNumerico: number; // NUEVO
  cliente: string;
  // ... otros campos
}
```

## Verificación de Cumplimiento

- [x] Segmento a) - Código Territorial (3 dígitos)
- [x] Segmento b) - Resolución Empresa (4 dígitos)
- [x] Segmento c) - Año Habilitación (2 dígitos)
- [x] Segmento d) - Año Expedición (4 dígitos)
- [ ] Segmento e) - Número Contrato (4 dígitos) - **PENDIENTE MIGRACIÓN**
- [x] Segmento f) - Consecutivo Extracto (4 dígitos)

## Próximos Pasos

1. **Aplicar migración de base de datos** para agregar `consecutivo_numerico`
2. **Actualizar el servicio FUEC** para usar el nuevo campo
3. **Regenerar tipos de Prisma** con `npx prisma generate`
4. **Probar la generación** de un FUEC para verificar el formato correcto
5. **Documentar** el proceso de numeración para futuros administradores
