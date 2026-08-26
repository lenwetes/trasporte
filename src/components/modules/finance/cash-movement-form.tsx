/**
 * @module CashMovementForm
 * @refactored 2026-03-31
 * @description Barrel de compatibilidad. El monolito fue dividido en:
 *   - ./cash-movement-form-root.tsx            → Orquestador principal (~100 líneas)
 *   - ./cash-movement/cash-movement-status-bar.tsx       → Barra de estado multicanal
 *   - ./cash-movement/cash-movement-type-toggle.tsx      → Selector Ingreso/Egreso
 *   - ./cash-movement/cash-movement-identification-panel.tsx → Metadatos y terceros
 *   - ./cash-movement/cash-movement-payment-panel.tsx    → Ingreso de cuantía y multicanal
 *   - ./cash-movement/cash-movement-action-buttons.tsx   → Acciones de guardado
 *   - ./cash-movement/cash-movement-preview-modal.tsx    → Modal visor PDF de auditoría
 * @see c:\web\agent\memory\plan-mejoras.md → [M3] ✅ COMPLETADO
 */
export { CashMovementFormRoot as CashMovementForm } from "./cash-movement-form-root";
