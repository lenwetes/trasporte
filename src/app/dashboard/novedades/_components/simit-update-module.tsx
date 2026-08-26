/**
 * @module SimitUpdateModule
 * @refactored 2026-04-01
 * @description Barrel de compatibilidad. La lógica fue dividida en:
 *   - ./simit/simit-update-module-root.tsx → Componente orquestador principal
 *   - ./simit/simit-selection-panel.tsx    → Panel de selección (Criterios)
 *   - ./simit/simit-results-panel.tsx      → Visor de diagnósticos SIMIT
 *   - ./simit/simit-history-panel.tsx      → Historial de trazabilidad
 *   - ./use-simit-update.ts                → Hook de estado y acciones
 * @see plan-mejoras.md → [ID del Monolito: M9]
 */

export { SimitUpdateModuleRoot as SimitUpdateModule } from "./simit/simit-update-module-root";
export type { SimitUpdateModuleProps } from "./simit-update-module.types";
