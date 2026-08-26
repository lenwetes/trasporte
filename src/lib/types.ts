import { DocumentAlert } from "./alerts";

export interface DashboardVehicle {
    id: string;
    placa: string;
    marca: string;
    modelo?: string | null;
    vin?: string | null;
    anho?: number | null;
    propietario: string;
    modalidad: string;
    alertLevel: string;
    alerts: DocumentAlert[];
    [key: string]: unknown; // Allow for other prisma fields
}

export interface ExpiryProjection {
    label: string;
    count: number;
}

export interface FUECActivo {
    consecutivo: string;
    fechaFin: Date | string;
    ruta: { origen: string; destino: string };
    contrato?: { cliente?: string | null } | null;
}

export interface ConductorData {
    id: string;
    nombres: string;
    apellidos: string;
    numeroDocumento: string;
    numeroLicencia?: string | null;
    licencias?: {
        categoria: string;
        servicio: string;
        fechaVencimiento: Date | string;
    }[];
    fotoPerfil?: { nombreUnico: string } | null;
    ultimoLogin?: Date | string | null;
    vinculaciones: {
        vehiculo: DashboardVehicle;
        [key: string]: unknown;
    }[];
    fuecActivo?: FUECActivo | null;
    [key: string]: unknown;
}

export interface AdminDashboardStats {
    totalVehiculos: number;
    totalConductores: number;
    totalContratos: number;
    totalSiniestros: number;
    totalNovedades: number;
}
