import { ReportConfig } from "../../pdf-generator";

export type { ReportConfig };

export interface PreoperacionalPDFData {
    readonly id: string;
    readonly fecha: Date;
    readonly kilometraje: number;
    readonly resultado: string;
    readonly observaciones: string | null;
    readonly firmaDigital: string | null;
    readonly vehiculo: {
        readonly placa: string;
        readonly marca: string;
        readonly modelo: string | null;
        readonly tipoVehiculo?: string;
    };
    readonly conductor: {
        readonly nombres: string;
        readonly apellidos: string;
        readonly numeroDocumento: string;
        readonly licencia?: string;
    };
    readonly detalles: ReadonlyArray<{
        readonly item: string;
        readonly estado: boolean;
        readonly criticidad: string;
        readonly observacion: string | null;
    }>;
    readonly config?: ReportConfig | null;
}

export interface EntregaDotacionPDFData {
    readonly id: string;
    readonly fechaEntrega: Date;
    readonly items: ReadonlyArray<{
        readonly item: string;
        readonly cantidad: number;
        readonly estado: string;
    }>;
    readonly observaciones: string | null;
    readonly firmaDigital: string | null;
    readonly conductor: {
        readonly nombres: string;
        readonly apellidos: string;
        readonly numeroDocumento: string;
    };
    readonly tallaCamisa: string | null;
    readonly tallaPantalon: string | null;
    readonly tallaCalzado: string | null;
    readonly config?: ReportConfig | null;
}

export interface SafetyIndicatorsReportData {
    readonly periodo: number;
    readonly totalSiniestros: number;
    readonly totalDiasPerdidos: number;
    readonly frecuencia: number;
    readonly severidad: number;
    readonly porGravedad: {
        readonly soloDanos: number;
        readonly conHeridos: number;
        readonly mortal: number;
    };
    readonly config?: ReportConfig | null;
}

export interface InvestigacionSiniestroPDFData {
    readonly id: string;
    readonly fecha: Date;
    readonly siniestro: {
        readonly fecha: Date;
        readonly lugar: string;
        readonly gravedad: string;
        readonly reporteHechos: string;
    };
    readonly vehiculo: {
        readonly placa: string;
        readonly marca: string;
        readonly modelo: string | null;
    };
    readonly conductor: {
        readonly nombres: string;
        readonly apellidos: string;
        readonly numeroDocumento: string;
    };
    readonly investigacion: {
        readonly participantes: string | null;
        readonly analisisCausas: string;
        readonly planAccion: string;
        readonly conclusiones: string;
        readonly diasPerdidos: number;
        readonly costoEstimado: number | null;
    };
    readonly config?: ReportConfig | null;
}
