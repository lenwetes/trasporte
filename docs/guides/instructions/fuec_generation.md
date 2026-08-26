# Documentación de Generación FUEC (Módulo Legal)

Este documento detalla la implementación del sistema de generación de **Formato Único de Extracto del Contrato (FUEC)** siguiendo la **Resolución 6652 de 2019** del Ministerio de Transporte Colombiano.

## 1. Estructura del Número FUEC (21 Dígitos)
El sistema genera automáticamente el consecutivo inmutable de 21 dígitos basado en los parámetros de la resolución de la empresa:

- **Código Territorial (3):** Identificador de la dirección territorial (Ej: 223 - Sucre).
- **Resolución Empresa (4):** Los 4 dígitos finales de la resolución de habilitación.
- **Año Habilitación (2):** Los últimos 2 dígitos del año en que se habilitó la empresa.
- **Año Emisión (4):** Año actual de generación (YYYY).
- **Número Contrato (4):** Extracción numérica del contrato vinculante.
- **Consecutivo Interno (4):** Contador secuencial gestionado por `ResolucionFUEC.actual`.

## 2. Cambios en el Modelo de Datos (Prisma)
Se refactorizó el esquema para soportar la complejidad ministerial:

- **`PlanillaFUEC`**:
  - `consecutivo`: Almacena el número de 21 dígitos.
  - `conductor1Id`, `conductor2Id`, `conductor3Id`: Permite hasta 3 conductores (Exigido en transporte de turismo y largo recorrido).
  - `ruta`: Almacenado como JSON para soportar múltiples trayectos (`rutas`).
  - `objetoViaje`: Permite especificar el objeto técnico del viaje sin alterar el contrato base.
- **`ContratoEmpresa`**:
  - Incorporación de datos del responsable (Nombre, Cédula, Teléfono, Dirección) necesarios para el bloque de firmas.

## 3. Validación y Emisión
- **Reglas de Negocio**:
  - Solo conductores activos con licencia vigente pueden ser seleccionados.
  - El sistema descuenta automáticamente el costo administrativo ($10.000) de la cartera del conductor principal.
  - Se genera un `tokenQR` único para validación pública por autoridades de tránsito.
- **Modo Supervisor**:
  - Los administradores pueden forzar la emisión mediante una justificación que queda registrada en el log de auditoría (`AuditLog`), saltando bloqueos financieros o mecánicos si es necesario.

## 4. Diseño del Documento (PDF) - v2.1
El diseño actualizado replica exactamente el formato del **Ejemplo FUEC Oficial** (`planilla/ejemplo fuec.pdf`):

### Estructura de una sola página:
- **Encabezado (3 columnas)**:
  - Izquierda: Logo "Colombia Potencia de la Vida + Transporte" (`logo-ministerio.png`) — ancho 125pt
  - Centro: Título oficial + Número FUEC en rojo (#c0392b) — fuente 14pt
  - Derecha: Logo COOPETRAES (`logo-coopetraes.png`) — ancho 110pt
- **Cuerpo**: Grilla de datos (razón social, NIT, contrato, rutas, vigencia, vehículo, conductores, responsable)
- **Bloque de firma** (dentro del cuadro): izquierda contacto, derecha sello+firma del gerente (`gerente-firma.png`)
- **Footer externo** (fuera del cuadro):
  - Izquierda: Código QR de validación digital (60x60pt)
  - Centro: espacio para marca de agua
  - Derecha: Logo "Vigilado SuperTransporte" (`logo-supertransporte.png`) — ancho 110pt
- **Marca de agua**: Logo COOPETRAES centrado en el fondo con opacity 7% (posición absoluta)
- **Segunda página eliminada**: No hay reverso informativo.

### Assets en `/public/images/fuec/`:
| Archivo | Descripción |
|---|---|
| `logo-ministerio.png` | Colombia Potencia de la Vida + Ministerio de Transporte |
| `logo-coopetraes.png` | Logo oficial COOPETRAES (verde) |
| `logo-supertransporte.png` | Vigilado SuperTransporte (naranja) |
| `gerente-firma.png` | Sello + Firma combinados del Gerente |

## 5. Mantenimiento
Para actualizar los parámetros de la resolución (ej: cambio de año o rango), utilice el módulo de administración de `Resoluciones FUEC`.
Para reemplazar logos o firma, sustituir los archivos PNG en `/public/images/fuec/` manteniendo los nombres exactos.

