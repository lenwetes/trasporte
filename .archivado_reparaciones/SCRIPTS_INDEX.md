# 🗄️ Índice de Scripts Archivados

Este directorio contiene herramientas de reparación, diagnóstico y refactorización masiva utilizadas durante las fases críticas de estabilización del proyecto. Se han organizado por funcionalidad para facilitar su consulta o reutilización.

---

## 🛠️ 1. Reparación de Sintaxis y JSX

Scripts diseñados para corregir errores comunes de tipografía, etiquetas mal cerradas o importaciones dañadas.

- **`anti-regex-fixer.js`**: Corrige patrones de Regex mal formados en el código.
- **`attribute-closer-fixer.js`**: Cierra automáticamente atributos de React/JSX que quedaron abiertos.
- **`fix-broken-jsx.js` / `v2`**: Repara estructuras JSX corruptas tras fallos en la edición del editor.
- **`fix-double-braces.js`**: Elimina llaves dobles redundantes en props de componentes.
- **`fix-truncated-imports.js`**: Reconstruye importaciones que fueron cortadas durante guardados parciales.
- **`fix-syntax-mass.js`**: Corrección masiva de errores sintácticos comunes en el App Router.
- **`ultimate-syntactic-fixer.js`**: La herramienta más potente para la reparación estructural de archivos JS/TS.

## 🗄️ 2. Base de Datos y Gestión de Usuarios

Scripts para interactuar directamente con la base de datos PostgreSQL mediante Prisma.

- **`check-admin.ts` / `reset-admin.ts`**: Verifica y resetea las credenciales del administrador principal.
- **`seed-all-users.js` / `seed-march.js`**: Población masiva de la base de datos con datos de prueba o producción.
- **`create_table.ts`**: Script manual para inyectar tablas específicas si fallan las migraciones.
- **`list-users.ts`**: Utilidad rápida para listar usuarios y sus roles en consola.
- **`test-prisma.js` / `test-app-db.ts`**: Pruebas de conexión y latencia con la capa ORM.

## 🧹 3. Refactorización Masiva y Limpieza

Herramientas para cambios a gran escala en el diseño o dependencias.

- **`strip-motion.js` / `v2`**: Elimina dependencias de Framer Motion de todos los componentes para simplificar el bundle.
- **`strip-tailwind.js`**: Limpieza de utilidades de Tailwind obsoletas o conflictivas.
- **`reset-ui-components.js`**: Resetea componentes de Shadcn/UI a su estado base si el estilo se corrompe.
- **`clean-ui.js`**: Elimina clases CSS redundantes o no utilizadas en componentes `src/components/ui`.
- **`tabs-purger.js`**: Limpia y unifica el sistema de pestañas en los paneles administrativos.

## 🔍 4. Diagnóstico y Auditoría

Scripts para evaluar la salud del proyecto y encontrar errores de lógica.

- **`audit-project.ts` / `audit_results.md`**: Genera un reporte completo de la salud técnica del sistema.
- **`diagnose_fuec.ts`**: Diagnóstico específico para el motor de generación de planillas FUEC.
- **`check-notifs.js` / `seed-notifications.js`**: Pruebas del sistema de notificaciones automáticas.
- **`verify-actions.js`**: Asegura que las Server Actions sigan el protocolo de seguridad `withAuth()`.
- **`verificar-build.sh`**: Script de bash para simular un `npm run build` en entornos controlados.

## 📘 5. TypeScript y Tipado

Utilidades para el cumplimiento de la política "Zero Any".

- **`fix-ts.js`**: Automatiza la resolución de errores comunes reportados por `tsc`.
- **`upgrade-types.js`**: Actualiza definiciones de interfaces en `src/types/index.ts` basándose en el esquema de Prisma.
- **`fix-local-any.js`**: Busca y reemplaza usos no autorizados de `any` por tipos específicos o `unknown`.

---

> [!NOTE]  
> Muchos de estos scripts usan el módulo `fs` de Node de forma directa. Se recomienda ejecutarlos siempre desde la raíz del proyecto para que las rutas relativas funcionen correctamente.
