export type AlertLevel = "red" | "yellow" | "green";

export interface MaintenancePlan {
    id: string;
    nombre: string;
    frecuencia: "KILOMETROS" | "TIEMPO" | "AMBOS";
    kmIntervalo?: number | null;
    mesesIntervalo?: number | null;
}

export interface MaintenanceItem {
    id: string;
    planId: string;
    fecha: Date;
    kilometraje: number;
}

export interface AlertRule {
    tipoDocumento: string;
    diasAnticipacion: number;
    activo: boolean;
}

export interface DocumentData {
    id: string;
    tipo: string;
    fechaVencimiento: Date | null;
}

export interface DocumentAlert {
    documentId: string;
    tipo: string;
    fechaVencimiento: Date;
    daysUntilExpiry: number;
    status: AlertLevel;
}

export interface VehicleAlertSummary {
    vehiculoId: string;
    placa: string;
    status: AlertLevel;
    alerts: DocumentAlert[];
}

export interface AlertNotification {
    documentId: string;
    tipo: string;
    fechaVencimiento: Date;
    daysUntilExpiry: number;
    status: AlertLevel;
    vehiculoPlaca: string;
    vehiculoId: string;
}

/**
 * Pure function to calculate alert status for a single document.
 * Decoupled from any database-specific model.
 */
export function calculateDocumentAlert(
    doc: DocumentData,
    rule: AlertRule | undefined,
): DocumentAlert | null {
    if (!rule || !rule.activo || !doc.fechaVencimiento) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(doc.fechaVencimiento);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - today.getTime();
    const daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status: AlertLevel = "green";

    if (daysUntilExpiry < 0) {
        status = "red"; // Expired
    } else if (daysUntilExpiry <= rule.diasAnticipacion) {
        status = "yellow"; // Near expiration
    }

    return {
        documentId: doc.id,
        tipo: doc.tipo,
        fechaVencimiento: doc.fechaVencimiento,
        daysUntilExpiry,
        status,
    };
}

/**
 * Pure function to calculate all alerts for a vehicle.
 */
export function calculateVehicleAlerts(
    vehiculo: { id: string; placa: string; documentos: DocumentData[] },
    rules: AlertRule[],
): VehicleAlertSummary {
    const alerts = vehiculo.documentos
        .map((doc) => {
            const rule = rules.find((r) => r.tipoDocumento === doc.tipo);
            return calculateDocumentAlert(doc, rule);
        })
        .filter((a): a is DocumentAlert => a !== null);

    let vehicleStatus: AlertLevel = "green";

    if (alerts.some((a) => a.status === "red")) {
        vehicleStatus = "red";
    } else if (alerts.some((a) => a.status === "yellow")) {
        vehicleStatus = "yellow";
    }

    return {
        vehiculoId: vehiculo.id,
        placa: vehiculo.placa,
        status: vehicleStatus,
        alerts,
    };
}
