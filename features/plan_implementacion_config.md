# Plan de Implementación: Panel de Control Maestro (Corporate SaaS)

Este documento detalla la hoja de ruta arquitectónica para integrar las cuatro (4) capacidades críticas solicitadas en el módulo de configuración de Coopetraes, convirtiéndolo en un Panel de Control Maestro integral y seguro, sin romper el ecosistema actual y ciñéndose al modelo UI "Corporate Flat".

---

## 🏗️ FASE 1: Identidad Corporativa (White-Labeling) & Campos Fiscales

**Objetivo:** Permitir que la plataforma sea 100% personalizable desde la vista de administrador, controlando logotipos y datos legales que alimentan cabeceras, facturas y FUECs.

### 1.1 Modificaciones en la Base de Datos (Prisma)
Se debe extender el modelo `ConfiguracionGlobal` en `schema.prisma`:
```prisma
model ConfiguracionGlobal {
  // ... campos existentes ...
  
  // Logos y Marca
  logoPrincipalUrl      String?   // Logo Full-Color
  logoMonocromaticoUrl  String?   // Logo para sidebar oscuro
  faviconUrl            String?   // Favicon del sistema
  
  // Campos Fiscales Dinámicos
  nitOficial            String?   @default("800.000.000-1")
  razonSocial           String?   @default("COOPETRAES S.A.")
  direccionMatriz       String?
  correoGeneral         String?
  resolucionMinisterio  String?   // Texto legal a inyectar en reportes
}
```

### 1.2 Componente UI (Frontend)
- Crear `components/forms/configuracion-identidad-form.tsx`.
- Utilizar tres zonas de "Drag & Drop" independientes (Geométricas, radio-0px) para las imágenes.
- Inputs robustos (uppercase, monospace) para el NIT y Razón Social.
- Conectar con `updateConfiguracionGlobal` Server Action.

---

## ✒️ FASE 2: Gestor de Firmas Mecánicas Autorizadas

**Objetivo:** Centralizar el almacenamiento de firmas digitales en formato `.PNG` transparente para estampar automáticamente FUECs, recibos y documentos formales sin carga manual reiterativa.

### 2.1 Modificaciones en la Base de Datos
Se creará un nuevo modelo o se extenderá la configuración para alojar directivos de alto nivel:
```prisma
model FirmaMecanica {
  id              String   @id @default(cuid())
  cargoInstancia  String   @unique // Ej: "GERENCIA", "REP_LEGAL", "MANTENIMIENTO"
  nombresCargo    String   // Ej: "Ing. Carlos Perez"
  firmaUrl        String   // Path al archivo físico/S3
  activa          Boolean  @default(true)
  actualizadoEn   DateTime @updatedAt
}
```

### 2.2 Componente UI (Frontend)
- Crear una nueva pestaña en `/dashboard/configuracion` llamada **Firmas Oficiales**.
- Tarjetas verticales mostrando las instancias operativas requeridas: 
  1. *Representante Legal* 
  2. *Gerencia General* 
  3. *Director Operativo/Mantenimiento*.
- Al subir la imagen, un previsualizador emulará cómo se vería la firma sobre un sello digital.

---

## 📝 FASE 3: Templates Documentales Automáticos

**Objetivo:** Permitir redactar e inyectar variables automáticas (`[NOMBRE]`, `[PLACA]`) dentro del contrato y certificados, de forma que los cambios legales estacionales no impliquen modificar código.

### 3.1 Modificaciones en la Base de Datos
```prisma
model PlantillaDocumental {
  id              String   @id @default(cuid())
  tipoDocumento   String   @unique   // Ej: "CONTRATO_FUEC", "CERTIFICADO_RETENCION"
  contenidoHtml   String   @db.Text  // Cuerpo redactado del template
  version         Int      @default(1)
  actualizadoPor  String
  actualizadoEn   DateTime @updatedAt
}
```

### 3.2 Componente UI y Lógica Back-End
- **Editor en Pantalla:** Implementar un Rich Text Editor (ej. Tiptap o Quill) encajado en un contenedor "Corporate Flat" de bordes rectos.
- **Micro-Motor de Reemplazo:** Crear un utility en `lib/template-engine.ts` que atrape las strings:
  ```typescript
  export function renderTemplate(html: string, payload: any) {
    return html.replace(/\[NOMBRE_CLIENTE\]/g, payload.clienteNombre)
               .replace(/\[FECHA\]/g, payload.fechaActual);
  }
  ```
- Enganchar este motor en el Action de Exportación a PDF para inyectar este HTML final al módulo `puppeteer` o `html2pdf`.

---

## 🛡️ FASE 4: Audit Trail Predictivo (Logs Seguros)

**Objetivo:** Cumplimiento normativo mediante una bitácora infalsificable que registre todo lo que ocurre dentro del cerebro del sistema.

### 4.1 Modificaciones en la Base de Datos
El modelo de auditoría (`AuditLog`) ya existe, pero debe enriquecerse (si no lo tiene) para soportar metadata forense:
```prisma
model AuditLog {
  // ... campos actuales ...
  ipAddress       String?  // Dirección de origen
  userAgent       String?  // Navegador/Dispositivo
  severidad       String   @default("INFO") // INFO, WARNING, CRITICAL
  detallesJson    String?  @db.Text // Dump del payload operado
}
```

### 4.2 Lógica de Servidor (Middleware)
- Configurar el action `createAuditLog` para enrutar según nivel de severidad. Eventos como `resetDatabase` lanzarán un nivel `CRITICAL`. Eventos como Login lanzarán `INFO`.

### 4.3 Componente UI (Frontend)
- Pestaña **"Auditoría Forense"** dentro de Configuración.
- Una tabla ultra-densa (estilo terminal Hacker/Matrix de bajo contraste).
- Filtros por: *Usuario, Rango de Fecha, Módulo Afectado, Severidad*.
- **No Manipulable:** Esta vista *no tendrá ningún botón de eliminar ni editar*. Será un visor inmutable.

---

## 📋 Secuencia de Ejecución Sugerida (Cuando decida proceder)

1. **Backend First:** Actualizar el `schema.prisma`, ejecutar `npx prisma db push` y migrar Tipos TS.
2. **API & Actions:** Construir los métodos de lectura/escritura (Server Actions) seguros con validación `zod` para los nuevos módulos.
3. **Core Builder Frontend:** Crear los subcomponentes Form, Uploaders y DataTables para cada área.
4. **Acople al Panel:** Agregar las 4 nuevas 'Tabs' y Componentes en `configuracion-client.tsx`.
5. **Testing de Rendimiento:** Pruebas de subida segura de firmas (Verificando bloqueo de SVGs inyectados) e inmutabilidad de la bitácora.
