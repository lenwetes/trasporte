import { Usuario } from "@prisma/client";

export interface ConductorWithRelations extends Usuario {
    vehiculo?: {
        id: string;
        placa: string;
        marca: string;
        modelo: string;
    } | null;
}
