import { DetalleLicencia } from "@prisma/client";
import { DetalleLicenciaWithActivo } from "@/actions/licencias";

export interface LicenseManagerProps {
    usuarioId: string;
    licenciasActivas: DetalleLicencia[];
    variant?: "light" | "dark";
}

export interface NewCategoryState {
    categoria: string;
    servicio: string;
    fechaVencimiento: string;
}
