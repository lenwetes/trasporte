import { NovedadCreate } from "@/lib/validations";

export interface NovedadFormProps {
    conductores: { id: string; nombres: string; apellidos: string }[];
    vehiculos: { id: string; placa: string }[];
    defaultConductorId?: string;
}

export interface MappedVehicle {
    id: string;
    placa: string;
    marca: string;
    modelo: string;
}

export interface MappedDriver {
    id: string;
    nombre: string;
    documento: string;
}
