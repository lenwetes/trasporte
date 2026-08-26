import {
    Vehiculo,
    Usuario,
    ContratoEmpresa,
    PlanillaFUEC,
} from "@prisma/client";

export interface FuecVehiculo {
    id: string;
    placa: string;
    marca: string;
    modelo: string;
}

export interface FuecConductor {
    id: string;
    nombre: string;
    documento: string;
}

export interface FuecContrato {
    id: string;
    numeroContrato: string;
    cliente: string;
    nitCliente: string | null;
    objeto: string | null;
    responsableNombre: string | null;
    responsableCedula: string | null;
    fechaInicio: Date | string;
    [key: string]: unknown;
}

export interface FuecFormProps {
    vehiculos: FuecVehiculo[];
    conductores: FuecConductor[];
    contratos: FuecContrato[];
    isAdmin?: boolean;
}
