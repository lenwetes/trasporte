import type { MaintenanceAlert, OrdenRevision } from "../types";

export type VehicleOperation = {
    id: string;
    placa: string;
    tipo: "alerta" | "revision";
    criticidad: "critico" | "urgente" | "normal";
    data: MaintenanceAlert | OrdenRevision;
};
