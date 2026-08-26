import type { OrdenServicio, RepositorioArchivo } from "@prisma/client";

export interface MaintenanceAlert {
    vehiculoId: string;
    placa: string;
    planId: string;
    planNombre: string;
    planDescripcion?: string;
    razon: string;
    ultimoKilometraje: number;
    ultimaFecha: string | Date | null;
    kilometrajeActual: number;
    diasRetraso: number;
    marca?: string;
    modelo?: string;
    anho?: number;
    ordenPendiente?: { codigo: string; id: string; estado: string } | null;
}

export interface GlobalHistoryItem {
    id: string;
    vehiculo: { placa: string };
    plan: { nombre: string };
    fecha: Date;
    kilometraje: number;
    costo: number | null;
    observaciones: string | null;
    factura?: { nombreUnico: string } | null;
    ordenServicio?: {
        transaccion?: {
            id: string;
            consecutivo: number;
        } | null;
    } | null;
}

export interface MaintenancePrediction {
    vehiculoId: string;
    placa: string;
    planNombre: string;
    predictedDate: Date;
    daysRemaining: number;
    dailyKmAvg: number;
    reason: string;
}

export type OrdenRevision = OrdenServicio & {
    vehiculo: { placa: string; kilometrajeActual: number | null };
    plan: { nombre: string };
    comprobante?: RepositorioArchivo | null;
    placa: string;
    planNombre: string;
    conductorNombre?: string;
    kilometraje?: number;
    costo?: number;
    kilometrajeReportado?: number | null;
    costoReportado?: number | null;
    observacionesConductor?: string | null;
};
