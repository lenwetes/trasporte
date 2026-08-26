import {
    PlanillaFUEC,
    Vehiculo,
    Usuario,
    ContratoEmpresa,
    ConfiguracionGlobal,
    ResolucionFUEC,
} from "@prisma/client";

export interface FuecAssets {
    logoEmpresa?: string | null;
    logoSuper?: string | null;
    logoMinisterio?: string | null;
    firmaGerente?: string | null;
    selloGerente?: string | null;
    selloEmpresa?: string | null;
}

export type PlanillaWithIncludes = PlanillaFUEC & {
    vehiculo: Vehiculo;
    conductor1: Usuario;
    conductor2?: Usuario | null;
    conductor3?: Usuario | null;
    contrato: ContratoEmpresa;
    resolucion?: ResolucionFUEC | null;
};

export interface FuecPDFProps {
    data: PlanillaWithIncludes;
    qrDataUrl?: string;
    config: ConfiguracionGlobal | null;
    assets?: FuecAssets;
}
