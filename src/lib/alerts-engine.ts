import {
    calculateDocumentAlert,
    AlertRule,
    DocumentData,
    DocumentAlert,
    MaintenanceItem,
    MaintenancePlan,
} from "./alerts";
import { calculateMaintenanceAlerts } from "./maintenance-logic";

export class AlertsEngine {
    /**
     * Evaluates a full vehicle state and returns a unified health report.
     */
    static evaluateVehicle(
        vehicle: {
            id: string;
            placa: string;
            kilometrajeActual?: number | null;
            documentos: DocumentData[];
            mantenimientos: MaintenanceItem[];
        },
        rules: AlertRule[],
        maintenancePlans: MaintenancePlan[],
    ) {
        // 1. Evaluate documents
        const documents = vehicle.documentos
            .map((doc) => {
                const rule = rules.find((r) => r.tipoDocumento === doc.tipo);
                return calculateDocumentAlert(doc, rule);
            })
            .filter((a): a is DocumentAlert => a !== null);

        // 2. Evaluate maintenance
        const maintenance = calculateMaintenanceAlerts(
            vehicle,
            maintenancePlans,
        );

        // 3. Determine overall status
        const hasRedDoc = documents.some((d) => d.status === "red");
        const hasYellowDoc = documents.some((d) => d.status === "yellow");
        const hasMaintenanceDue = maintenance.length > 0;

        let status: "red" | "yellow" | "green" = "green";
        if (hasRedDoc || hasMaintenanceDue) {
            status = "red";
        } else if (hasYellowDoc) {
            status = "yellow";
        }

        return {
            vehicleId: vehicle.id,
            placa: vehicle.placa,
            status,
            summary: {
                expiredDocuments: documents.filter((d) => d.status === "red")
                    .length,
                nearExpiryDocuments: documents.filter(
                    (d) => d.status === "yellow",
                ).length,
                dueMaintenance: maintenance.length,
            },
            details: {
                documents,
                maintenance,
            },
        };
    }
}
