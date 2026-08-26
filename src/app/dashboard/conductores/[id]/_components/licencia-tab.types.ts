import { UsuarioWithRelations } from "@/types";

export interface LicenciaTabProps {
    conductor: UsuarioWithRelations;
}

export type TabLicencia = {
    activo: boolean;
    categoria: string;
    servicio: string;
    fechaVencimiento?: Date | string | null;
    archivo?: { 
        nombreUnico?: string | null;
        creadoEn?: string | Date | null;
    } | null;
    [key: string]: unknown;
};

export interface TempCategory {
    id: string;
    categoria: string;
    servicio: string;
    fechaVencimiento: string;
}
