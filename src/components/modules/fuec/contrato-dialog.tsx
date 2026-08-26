/**
 * @module ContratoDialog
 * @refactored 2026-03-31
 * @description Barrel de compatibilidad para la gestión de contratos FUEC. 
 * El monolito de 403 líneas fue desfragmentado en:
 *   - ./contrato-dialog-root.tsx                    → Orquestador principal
 *   - ./contrato-dialog/use-contrato-form.ts        → Lógica de estado y side-effects
 *   - ./contrato-dialog/contrato-dialog-header.tsx  → Cabecera visual
 *   - ./contrato-dialog/contrato-identification-panel.tsx → Nro Contrato / IsInterno
 *   - ./contrato-dialog/contrato-client-panel.tsx   → Datos del contratante + ClientDialog
 *   - ./contrato-dialog/contrato-object-panel.tsx   → Objeto del contrato
 *   - ./contrato-dialog/contrato-auth-panel.tsx     → Responsable y Cédula
 *   - ./contrato-dialog/contrato-dialog-footer.tsx  → Botonera de acción
 * @see c:\web\agent\memory\plan-mejoras.md → [M5] ✅ COMPLETADO
 */
export { ContratoDialogRoot as ContratoDialog } from "./contrato-dialog-root";
