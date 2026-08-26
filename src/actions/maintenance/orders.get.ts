"use server";

import { MaintenanceService } from "@/services/maintenance.service";
import { withAuth } from "@/lib/safe-action";
import { hasPermission, unauthorizedResponse } from "@/lib/permissions";
import { ActionResult } from "@/types";
import { PaginationParams } from "@/types/pagination";
import { EstadoOrdenServicio } from "@prisma/client";

interface OrdenesFilters extends PaginationParams {
    vehiculoId?: string;
    estado?: EstadoOrdenServicio | EstadoOrdenServicio[];
    conductorId?: string;
}

/**
 * Patrón 5.1: Listar Órdenes de Servicio
 */
export const getOrdenesServicio = withAuth(
    async (session, filtersInput: unknown): Promise<ActionResult> => {
        // 1. RBAC
        if (!hasPermission(session.user.rol, "MANTENIMIENTO", "READ")) {
            return unauthorizedResponse();
        }

        const filters = (filtersInput as OrdenesFilters) || {};

        const conductorId =
            session.user.rol === "CONDUCTOR" ? session.user.id : undefined;

        // 2. Logic (Delegar a Service)
        return await MaintenanceService.getOrders({
            ...filters,
            conductorId,
        });
    },
);

/**
 * Patrón 5.1: Obtener Detalle de Orden
 */
export const getOrdenServicioDetalle = withAuth(
    async (session, id: unknown): Promise<ActionResult> => {
        if (typeof id !== "string")
            return { success: false, error: "ID inválido"  };
        if (!hasPermission(session.user.rol, "MANTENIMIENTO", "READ")) {
            return unauthorizedResponse();
        }

        return await MaintenanceService.getOrderById(id);
    },
);

/**
 * Patrón 5.1: Obtener Orden de Servicio para Impresión
 * Alias de getOrdenServicioDetalle para compatibilidad con el frontend
 */
export const getOrdenServicioParaImpresion = getOrdenServicioDetalle;

/**
 * Patrón 5.1: Obtener Órdenes en Revisión
 */
export const getOrdenesEnRevision = withAuth(
    async (session): Promise<ActionResult> => {
        if (!hasPermission(session.user.rol, "MANTENIMIENTO", "READ")) {
            return unauthorizedResponse();
        }

        const res = await MaintenanceService.getOrders({
            estado: ["PENDIENTE", "EN_REVISION"],
            pageSize: 100,
        });

        if (res.success && res.data && typeof res.data === 'object' && 'data' in (res.data as any)) {
            const castedRes = res.data as { data: any[] };
            castedRes.data = castedRes.data.map((o: any) => ({
                ...o,
                placa: o.vehiculo?.placa || "N/A",
                planNombre: o.plan?.nombre || "Sin Plan"
            }));
        }

        return res;
    },
);

/**
 * Patrón 5.1: Obtener Órdenes Pendientes para el Conductor Autenticado
 */
export const getOrdenesPendientesConductor = withAuth(
    async (session): Promise<ActionResult> => {
        // El servicio de órdenes ya aplica el filtro de conductor si el rol es CONDUCTOR
        return await MaintenanceService.getOrders({
            estado: "PENDIENTE",
            conductorId:
                session.user.rol === "CONDUCTOR" ? session.user.id : undefined,
        });
    },
);
