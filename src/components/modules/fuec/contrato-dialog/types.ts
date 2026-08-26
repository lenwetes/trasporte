import { FuecContrato } from "../fuec-form/types";

export interface FastClient {
    nombre: string;
    nit?: string;
}

export interface FastResponsable {
    nombre: string;
    cedula?: string;
    telefono?: string;
    direccion?: string;
}

export interface ContratoDialogProps {
    onCreated?: (contrato: FuecContrato) => void;
    onUpdated?: (contrato: FuecContrato) => void;
    trigger?: React.ReactNode;
    initialData?: FuecContrato;
}
