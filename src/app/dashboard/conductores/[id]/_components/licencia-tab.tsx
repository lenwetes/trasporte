/**
 * @module LicenciaTab
 * @refactored 2026-04-01
 * @description Barrel de compatibilidad. La lógica fue dividida en:
 *   - ./licencia/licencia-tab-root.tsx        → Componente orquestador principal
 *   - ./licencia/licencia-action-bar.tsx     → Barra de acciones (Digitalización)
 *   - ./licencia/licencia-identity-card.tsx   → Resumen RUNT y categorías
 *   - ./licencia/licencia-support-view.tsx    → Visor de documentos S3
 *   - ./licencia/licencia-digitize-wizard.tsx → Asistente de sincronización
 *   - ./use-licencia-tab.ts                   → Hook de estado y acciones
 * @see plan-mejoras.md → [ID del Monolito: M8]
 */

export { LicenciaTabRoot as LicenciaTab } from "./licencia/licencia-tab-root";
export type { LicenciaTabProps } from "./licencia-tab.types";
