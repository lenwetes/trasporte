# Reporte de Auditoría: UI/UX y Código (IA-Ready)

Este documento contiene los hallazgos tras procesar las *Llaves AI* y ejecutar un escaneo profundo en el sistema para detectar debilidades estructurales tanto a nivel visual como lógico.

---

## 1. Verificación de "Llaves AI"
Se ha leído y comprendido a la perfección el documento maestro de **Llaves AI**. El sistema IA está listo para operar utilizando `continuar` (Retomador), `login` (Jornada diaria), `lee` (Brain Reset) y `problemas` (Linter Fixers) según lo requieran las operaciones para ahorrar tokens e incrementar la eficiencia del desarrollo.

---

## 2. Puntos Débiles en UI/UX (Incumplimiento de Master Plan)

### A. Deuda Técnica con Fluent UI (Fases 3 y 4 de MASTERDEV)
El archivo [MASTERDEV.md](file:///c:/web/web/agent/MASTERDEV.md) estipula explícitamente una migración obligatoria hacia **Microsoft Fluent UI Web Components v3**.
- **Problema:** En la revisión del [package.json](file:///c:/web/web/package.json) y la inspección de directorios, predominan y se utilizan activamente las primitivas de `@radix-ui/react-*` (Shadcn/UI).
- **Impacto:** Componentes base como Dialogs, Popovers, Lists y Dropdown menus no están usando `<fluent-dialog>` ni `<fluent-button>` aún. Se está sosteniendo la Interfaz Dinámica con la librería antigua, lo cual rompe el flujo estético del *Elegant Light*.

### B. Residuos Masivos de "Dark Mode" (Zenith Dark)
- **Problema:** Aunque la Fase 1 asume "completada" la limpieza del Zenith Dark, un escaneo interno profundo reveló más de **190 instancias activas** de utilidades `dark:` en los archivos del proyecto (ej: `dark:bg-slate-900`, `dark:border-slate-800`).
- **Impacto:** Si un navegador fuerza un media-query oscuro, la interfaz no va a retener su estética de lujo *Elegant Light* al mezclarse clases obsoletas, causando una severa inconsistencia visual.

---

## 3. Puntos Débiles en Código y Tipado (TS Strict Rules)

### A. Fortaleza Detectada (Compilación Saludable)
- Tras ejecutar el command de entorno global (`npx tsc --noEmit`), el compilador no arrojó **ningún error estructural** en el enrutamiento y arquitectura base. El empaquetado del app se encuentra estable a nivel macro.

### B. Violación Severa a la Regla "Zero ANY" (Castings Inseguros)
La instrucción principal del usuario impone **"Evitar ANY a toda costa"**. Sin embargo, la revisión arrojó el uso indiscriminado del casting `as any` en múltiples flujos vitales de la aplicación:
- Respuestas de API del framework: `app/dashboard/mantenimiento/hooks/use-maintenance.ts` mapeando variables directamente como `as any`.
- Páginas de finanzas: `egresos/page.tsx` y `receivables/page.tsx` donde se escapa del tipado seguro `(expensesResult.data.data as any[])`.
- Actions base: [fuec.ts](file:///c:/web/web/src/actions/fuec.ts), [settings.ts](file:///c:/web/web/src/actions/finance/settings.ts).
- **Impacto:** El uso del casting `any` vulnera la predictibilidad, inhabilitando autocompletado para futuros bugs y abriendo falsos positivos al procesar peticiones JSON o mutaciones de datos de base de datos (`Prisma/Postgres`). Se sugiere crear `interfaces` específicas para las cargas de las APIs.

### C. Restos de Directivas de Evasión (@ts-ignore)
- **Problema:** Se encontró el uso de `// @ts-ignore` en el core generador de PDFs ([src/lib/pdf/fuec-generator.ts](file:///c:/web/web/src/lib/pdf/fuec-generator.ts)).
- **Impacto:** Evade correcciones del compilador TypeScript y puede ocasionar un error de build de en la nube (Vercel) al compilar la producción si ocurre un cambio en las utilidades de renderizado.

### D. Reglas del Linter Sucias
- **Problema:** La instrucción `npm run lint` falló con código de salida 1 advirtiendo la existencia de importaciones fantasma y warnings en el motor de renderizado y cálculos de fecha (ej. variables `Card`, `addMonths`).

---

## 💡 Recomendaciones (Pasos a Seguir)

1. **Purga Visual:** Ejecutar una limpieza de regex sobre todos los componentes en `src/` para eliminar definitivamente los rastros de `dark:*`.
2. **Refactorización de Tipos:** Generar Interfaces exactas para el hook [use-maintenance.ts](file:///c:/web/web/src/app/dashboard/mantenimiento/hooks/use-maintenance.ts) y paginados transaccionales en Finanzas para eliminar con estrictez la keyword `any`.
3. **Migración Nativa UI:** Designar una sesión específica que use la llave `login` para aislar `src/components/ui`, borrar Radix UI y conectar puramente Fluent Web Components.
