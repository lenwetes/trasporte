/**
 * @module NovedadForm
 * @refactored 2026-04-01
 * @description Barrel de compatibilidad. La lógica fue dividida en:
 *   - ./_components/novedad/novedad-form-root.tsx  → Componente orquestador principal
 *   - ./_components/novedad/novedad-header.tsx    → Cabecera visual PESV
 *   - ./_components/novedad/novedad-responsibility-section.tsx → Gestión de conductor/vehículo
 *   - ./_components/novedad/novedad-details-section.tsx → Detalles de la incidencia
 *   - ./_components/novedad/novedad-narrative-section.tsx → Descripción y gestión
 *   - ./_components/novedad/novedad-action-footer.tsx → Acciones finales
 *   - ./use-novedad-form.ts                       → Hook de estado y validación
 * @see plan-mejoras.md → [ID del Monolito: M_NOVEDAD]
 */

export { NovedadFormRoot as NovedadForm } from "./_components/novedad/novedad-form-root";
export type { NovedadFormProps } from "./novedad-form.types";
