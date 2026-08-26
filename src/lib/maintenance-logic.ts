import { MaintenancePlan, MaintenanceItem } from "./alerts";

export function calculateMaintenanceAlerts(
    vehiculo: {
        kilometrajeActual?: number | null;
        mantenimientos: MaintenanceItem[];
    },
    planes: MaintenancePlan[],
) {
    const alertas = [];

    for (const plan of planes) {
        const ultimo = vehiculo.mantenimientos.find(
            (m) => m.planId === plan.id,
        );
        let due = false;
        let razon = "";

        if (!ultimo) {
            due = true;
            razon = "Nunca realizado";
        } else {
            if (
                plan.frecuencia === "KILOMETROS" ||
                plan.frecuencia === "AMBOS"
            ) {
                const kmDesdeUltimo =
                    (vehiculo.kilometrajeActual || 0) - ultimo.kilometraje;
                if (plan.kmIntervalo && kmDesdeUltimo >= plan.kmIntervalo) {
                    due = true;
                    razon = `Próximo cambio: +${kmDesdeUltimo}km`;
                }
            }

            if (
                !due &&
                (plan.frecuencia === "TIEMPO" || plan.frecuencia === "AMBOS")
            ) {
                const mesesDesdeUltimo =
                    (new Date().getTime() - new Date(ultimo.fecha).getTime()) /
                    (1000 * 60 * 60 * 24 * 30.44);
                if (
                    plan.mesesIntervalo &&
                    mesesDesdeUltimo >= plan.mesesIntervalo
                ) {
                    due = true;
                    razon = `Vencido hace ${Math.floor(mesesDesdeUltimo)} meses`;
                }
            }
        }

        if (due) {
            alertas.push({
                planId: plan.id,
                planNombre: plan.nombre,
                razon,
            });
        }
    }

    return alertas;
}
