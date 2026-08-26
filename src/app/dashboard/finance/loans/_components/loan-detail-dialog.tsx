/**
 * @module LoanDetailDialog
 * @refactored 2026-03-31
 * @description Barrel de compatibilidad. El monolito de 739 líneas fue dividido en:
 *   - ./loan-detail-dialog-root.tsx       → Componente orquestador principal (~150 líneas)
 *   - ./loan-detail-header.tsx            → Cabecera del diálogo
 *   - ./loan-amortization-table.tsx       → Tabla de cuotas de amortización
 *   - ./loan-radication-footer.tsx        → Footer de radicación y desembolso
 *   - ./payment-capture-modal.tsx         → Modal de captura de pago
 *   - ./use-loan-detail.ts                → Hook de estado y todos los handlers
 * @see c:\web\agent\memory\plan-mejoras.md → [M1] ✅ COMPLETADO
 */
export { LoanDetailDialogRoot as LoanDetailDialog } from "./loan-detail-dialog-root";
export type { LoanDetailDialogRootProps as LoanDetailDialogProps } from "./loan-detail-dialog-root";
