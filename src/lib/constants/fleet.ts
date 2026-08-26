/**
 * Base de datos de referencia para flota vehicular en Colombia
 * Enfocada en transporte público, especial y de carga.
 * Formato: MAYÚSCULAS para estandarización documental.
 */

export interface ModelData {
    name: string;
    defaultClass: "MICROBUS" | "BUSETA" | "BUS" | "CAMIONETA" | "OTRO";
    defaultCC?: string;
    defaultWeight?: string;
    defaultSeats?: number;
}

export const COLOMBIA_FLEET_DATA: Record<string, ModelData[]> = {
    "TOYOTA": [
        { name: "HILUX", defaultClass: "CAMIONETA", defaultCC: "2400", defaultWeight: "2750", defaultSeats: 5 },
        { name: "PRADO", defaultClass: "CAMIONETA", defaultCC: "3000", defaultWeight: "2850", defaultSeats: 7 },
        { name: "FORTUNER", defaultClass: "CAMIONETA", defaultCC: "2700", defaultWeight: "2735", defaultSeats: 7 },
        { name: "HIACE", defaultClass: "MICROBUS", defaultCC: "2500", defaultWeight: "3200", defaultSeats: 16 },
        { name: "LAND CRUISER", defaultClass: "CAMIONETA", defaultCC: "4500", defaultWeight: "3000", defaultSeats: 5 },
        { name: "COASTER", defaultClass: "BUS", defaultCC: "4000", defaultWeight: "5400", defaultSeats: 24 }
    ],
    "CHEVROLET": [
        { name: "NKR", defaultClass: "BUSETA", defaultCC: "2999", defaultWeight: "3500", defaultSeats: 19 },
        { name: "NQR", defaultClass: "BUS", defaultCC: "5193", defaultWeight: "8500", defaultSeats: 32 },
        { name: "NHR", defaultClass: "CAMIONETA", defaultCC: "2999", defaultWeight: "3500", defaultSeats: 3 },
        { name: "FRR", defaultClass: "BUS", defaultCC: "5193", defaultWeight: "10400", defaultSeats: 40 },
        { name: "D-MAX", defaultClass: "CAMIONETA", defaultCC: "2500", defaultWeight: "2800", defaultSeats: 5 },
        { name: "N300", defaultClass: "MICROBUS", defaultCC: "1200", defaultWeight: "1800", defaultSeats: 8 },
        { name: "N400", defaultClass: "MICROBUS", defaultCC: "1500", defaultWeight: "1900", defaultSeats: 8 }
    ],
    "HINO": [
        { name: "DUTRO", defaultClass: "CAMIONETA", defaultCC: "4009", defaultWeight: "5500", defaultSeats: 3 },
        { name: "FC9J", defaultClass: "BUS", defaultCC: "5123", defaultWeight: "10400", defaultSeats: 35 },
        { name: "XZU", defaultClass: "BUSETA", defaultCC: "4009", defaultWeight: "4500", defaultSeats: 19 }
    ],
    "NISSAN": [
        { name: "FRONTIER", defaultClass: "CAMIONETA", defaultCC: "2500", defaultWeight: "2800", defaultSeats: 5 },
        { name: "NP300", defaultClass: "CAMIONETA", defaultCC: "2500", defaultWeight: "2850", defaultSeats: 5 },
        { name: "URVAN", defaultClass: "MICROBUS", defaultCC: "2500", defaultWeight: "3200", defaultSeats: 16 },
        { name: "NV350", defaultClass: "MICROBUS", defaultCC: "2500", defaultWeight: "3300", defaultSeats: 16 }
    ],
    "MERCEDES-BENZ": [
        { name: "SPRINTER", defaultClass: "MICROBUS", defaultCC: "2143", defaultWeight: "3500", defaultSeats: 19 },
        { name: "ATEGO", defaultClass: "BUS", defaultCC: "4801", defaultWeight: "14000", defaultSeats: 40 },
        { name: "VITO", defaultClass: "MICROBUS", defaultCC: "2143", defaultWeight: "3050", defaultSeats: 9 }
    ],
    "RENAULT": [
        { name: "MASTER", defaultClass: "MICROBUS", defaultCC: "2300", defaultWeight: "3500", defaultSeats: 16 },
        { name: "KANGOO", defaultClass: "CAMIONETA", defaultCC: "1600", defaultWeight: "2100", defaultSeats: 2 },
        { name: "TRAFIC", defaultClass: "MICROBUS", defaultCC: "2000", defaultWeight: "3000", defaultSeats: 9 },
        { name: "DUSTER", defaultClass: "CAMIONETA", defaultCC: "2000", defaultWeight: "1800", defaultSeats: 5 }
    ],
    "FOTON": [
        { name: "VIEW", defaultClass: "MICROBUS", defaultCC: "2800", defaultWeight: "3400", defaultSeats: 16 },
        { name: "TUNLAND", defaultClass: "CAMIONETA", defaultCC: "2800", defaultWeight: "2900", defaultSeats: 5 },
        { name: "AUMARK", defaultClass: "CAMIONETA", defaultCC: "2800", defaultWeight: "5500", defaultSeats: 3 }
    ],
    "JAC": [
        { name: "REFINE", defaultClass: "MICROBUS", defaultCC: "1900", defaultWeight: "2800", defaultSeats: 11 },
        { name: "SUNRAY", defaultClass: "MICROBUS", defaultCC: "2800", defaultWeight: "3800", defaultSeats: 16 }
    ],
    "KIA": [
        { name: "PICANTO", defaultClass: "OTRO", defaultCC: "1250", defaultWeight: "1350", defaultSeats: 5 },
        { name: "SPORTAGE", defaultClass: "CAMIONETA", defaultCC: "2000", defaultWeight: "2100", defaultSeats: 5 },
        { name: "PREGIO", defaultClass: "MICROBUS", defaultCC: "2700", defaultWeight: "3000", defaultSeats: 16 }
    ],
    "HYUNDAI": [
        { name: "H1", defaultClass: "MICROBUS", defaultCC: "2500", defaultWeight: "3030", defaultSeats: 12 },
        { name: "HD65", defaultClass: "BUSETA", defaultCC: "3907", defaultWeight: "6500", defaultSeats: 24 },
        { name: "HD78", defaultClass: "BUS", defaultCC: "3907", defaultWeight: "7800", defaultSeats: 32 },
        { name: "COUNTY", defaultClass: "BUS", defaultCC: "3907", defaultWeight: "6710", defaultSeats: 28 }
    ],
    "DFSK": [
        { name: "K07S", defaultClass: "MICROBUS", defaultCC: "1200", defaultWeight: "1850", defaultSeats: 7 },
        { name: "C37", defaultClass: "MICROBUS", defaultCC: "1500", defaultWeight: "1950", defaultSeats: 9 }
    ],
};

export const TRANSIT_OFFICES = [
    "SECRETARIA DE TRANSITO Y TRANSPORTE DE SINCELEJO",
    "SECRETARIA DE MOVILIDAD DE BOGOTA",
    "SECRETARIA DE MOVILIDAD DE MEDELLIN",
    "SECRETARIA DE TRANSITO Y TRANSPORTE DE BARRANQUILLA",
    "SECRETARIA DE MOVILIDAD DE CALI",
    "SECRETARIA DE TRÁNSITO Y TRANSPORTE DE CARTAGENA",
    "SECRETARIA DE MOVILIDAD DE SANTA MARTA",
    "SECRETARIA DE TRANSITO DE MONTERIA",
    "SECRETARIA DE TRANSITO DE COROZAL",
    "SECRETARIA DE TRANSITO DE SAMPUES",
    "SECRETARIA DE TRANSITO DE TOLU",
    "SECRETARIA DE TRANSITO DE MORROA",
    "SECRETARIA DE TRANSITO DE LOS PALMITOS",
    "SECRETARIA DE MOVILIDAD DE SOLEDA",
    "MINISTERIO DE TRANSPORTE (RUNT)"
];

export const VEHICLE_CLASSES = [
    "MICROBUS",
    "BUSETA",
    "BUS",
    "CAMIONETA",
    "OTRO"
];

export const OPERATIONAL_MODALITIES = [
    "FLOTA_PROPIA",
    "CONVENIO_EXTERNO",
    "VINCULADO"
];
