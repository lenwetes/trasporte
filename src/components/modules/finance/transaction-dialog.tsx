/**
 * @module TransactionDialog
 * @refactored 2026-03-31
 * @description Barrel de compatibilidad. El monolito fue dividido en:
 *   - ./transaction-dialog-root.tsx                    → Orquestador principal (~140 líneas)
 *   - ./transaction-dialog/transaction-dialog-header.tsx → Cabecera con selector de modo
 *   - ./transaction-dialog/transaction-detail-panel.tsx  → Datos principales (terceros, vehículo, descripción)
 *   - ./transaction-dialog/transaction-ledger-panel.tsx  → Tablas de asientos contables (Simple/Asistido vs Avanzado)
 *   - ./transaction-dialog/transaction-summary-footer.tsx→ Resumen dinámico de ecuación contable
 * @see c:\web\agent\memory\plan-mejoras.md → [M4] ✅ COMPLETADO
 */
export { TransactionDialogRoot as TransactionDialog } from "./transaction-dialog-root";
