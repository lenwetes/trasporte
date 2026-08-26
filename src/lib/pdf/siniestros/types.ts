import { SiniestroWithRelations } from "@/types";

export interface SiniestroPDFData extends SiniestroWithRelations {
    config?: {
        nombreEmpresa?: string | null;
        colorPrimario?: string | null;
        telefono?: string | null;
        email?: string | null;
        direccion?: string | null;
        nit?: string | null;
        logoLocalPath?: string | null;
        logoUrl?: string | null;
    } | null;
}
