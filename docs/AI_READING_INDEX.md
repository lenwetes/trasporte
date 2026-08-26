# Índice de Conocimiento Validado para la IA (AI Reading Index)

Este documento mapea los archivos **útiles y validados** dentro del proyecto para que cualquier Agente IA no pierda contexto ni consuma tokens innecesariamente buscando lógicas de negocio o diagramas anticuados.

Cualquier archivo de documentación (`.md`) que no esté en esta lista, asume que está desactualizado o en proceso de eliminación.

## 🏛️ Contexto y Directrices de Sistema (Core)
- 👉 **`agent/instruction/DEVELOPMENT_RULES.md`**
  **ESTADO:** **Crítico / Lectura Obligatoria**.
  **Uso:** Contiene la fuente de absoluta verdad para el estado actual de la plataforma: Fase de **Limpieza Total a HTML Nativo**. Prohíbe temporalmente todos los frameworks visuales previos enfocándose exclusivamente en estabilización de compilación de Typecript y Next.js.

- 👉 **`agent/instruction/project-context.md`**
  **ESTADO:** **Crítico**.
  **Uso:** Da un resumen del stack técnico base y arquitectura (Next.js 16, Prisma, Server Actions) y clarifica que el diseño visual será proveído próximamente a través de un concepto de Figma.

- 👉 **`agent/PROGRESS_CHECKPOINT.md`**
  **ESTADO:** **Activo**.
  **Uso:** Archivo ligero que detalla las tareas actuales en el plan de migración. Modifícalo cada que completes una tarea pesada para evitar pérdida de progreso ante bloqueos.

## 💼 Lógica de Negocio y Estructura Organizacional (Docs)
Estos archivos contienen las reglas de la empresa logística, _no_ reglas visuales. Son muy útiles para entender cómo funciona la corporación colombiana por debajo:

- 👉 **`docs/guides/instructions/fuec_generation.md`**
  **Uso:** Lógica oficial de generación de los 21 dígitos para Formatos Únicos de Extracto del Contrato (Transporte Colombia). PDF Design base y dependencias lógicas.
  
- 👉 **`docs/guides/instructions/fuec_numbering.md`**
  **Uso:** Complemento al anterior para algoritmos contadores.

- 👉 **`docs/guides/instructions/CENTRO_DOCUMENTAL_CONDUCTOR.md`**
  **Uso:** Instrucciones sobre cómo debe subirse/validarse la documentación de choferes (Licencia, EPS, ARL, etc.).

- 👉 **`docs/guides/puc_architecture.md`**
  **Uso:** Estructura pura sobre la base de datos de Préstamos, Gastos Financieros y Plan Único de Cuentas. (Agnóstico del UI actual). 

## 🛠️ Setup Técnico (Despliegues)
- 👉 **`docs/setup/QUICKSTART.md`** / **`DEPLOYMENT.md`**
  **Uso:** Si necesitas reinstalar comandos de base de datos (`npx prisma db seed`, etc) o verificar variables de entorno `.env`.

---
*Si eres una Inteligencia Artificial operando bajo mandato, **limítate a consultar SÓLO estos archivos** para tomar decisiones arquitectónicas.*
