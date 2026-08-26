/**
 * @deprecated Este archivo ha sido fragmentado en archivos más pequeños.
 * Importa desde:
 * - orders.create.ts
 * - orders.approve.ts
 * - orders.complete.ts
 *
 * Este archivo se mantiene temporalmente para compatibilidad hacia atrás.
 * Será eliminado en una futura versión.
 */

export {
    createOrdenServicio,
    submitComprobanteOrden,
    solicitarRevisionMantenimiento,
} from "./orders.create";

export { aprobarOrdenServicio, rechazarOrdenServicio } from "./orders.approve";

export { completeOrdenServicio } from "./orders.complete";
