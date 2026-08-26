export interface SimitUpdateModuleProps {
    conductores: { id: string; nombre: string; documento: string }[];
    vehiculos: { id: string; placa: string }[];
}

export interface SimitResult {
    estadoCuenta: string;
    valorTotal: string | number;
    numeroComparendos: number;
    mensaje?: string;
    estado?: string;
}

export interface SimitHistory {
    id: string;
    fechaConsulta: string | Date;
    estadoCuenta: string;
    numeroComparendos: number;
    valorTotal: string | number;
}
