export const DEFAULT_ITEMS: {
    item: string;
    criticidad: "ALTA" | "MEDIA" | "BAJA";
    group: string;
}[] = [
    // GRUPO A: MOTOR Y FLUIDOS
    {
        item: "Nivel de Aceite Motor",
        criticidad: "MEDIA",
        group: "Motor y Fluidos",
    },
    {
        item: "Nivel de Refrigerante",
        criticidad: "MEDIA",
        group: "Motor y Fluidos",
    },
    { item: "Líquido de Frenos", criticidad: "ALTA", group: "Motor y Fluidos"  },
    {
        item: "Fugas de Fluidos (Aceite, Agua, Combustible)",
        criticidad: "ALTA",
        group: "Motor y Fluidos",
    },
    {
        item: "Tensión de Correas",
        criticidad: "MEDIA",
        group: "Motor y Fluidos",
    },

    // GRUPO B: SEGURIDAD ACTIVA
    {
        item: "Frenos (Pedal y Estacionamiento)",
        criticidad: "ALTA",
        group: "Seguridad Activa",
    },
    {
        item: "Dirección (Movilidad y Ajuste)",
        criticidad: "ALTA",
        group: "Seguridad Activa",
    },
    {
        item: "Suspensión (Amortiguadores y Ruidos)",
        criticidad: "ALTA",
        group: "Seguridad Activa",
    },
    {
        item: "Llantas (Estado de Labrado y Cortes)",
        criticidad: "ALTA",
        group: "Seguridad Activa",
    },
    {
        item: "Llantas (Presión de Aire)",
        criticidad: "MEDIA",
        group: "Seguridad Activa",
    },

    // GRUPO C: EQUIPO LEGAL Y SEGURIDAD
    {
        item: "Luces Exterior (Frontales, Stop, Cruce)",
        criticidad: "ALTA",
        group: "Equipo Legal",
    },
    { item: "Limpiabrisas", criticidad: "ALTA", group: "Equipo Legal"  },
    {
        item: "Extintor (Carga y Vigencia)",
        criticidad: "ALTA",
        group: "Equipo Legal",
    },
    {
        item: "Botiquín de Primeros Auxilios",
        criticidad: "MEDIA",
        group: "Equipo Legal",
    },
    {
        item: "Equipo de Carretera (Gato, Tacos, Señales)",
        criticidad: "MEDIA",
        group: "Equipo Legal",
    },

    // GRUPO D: ELÉCTRICO Y CONFORT
    { item: "Batería y Bornes", criticidad: "MEDIA", group: "Eléctrico"  },
    { item: "Pito o Bocina", criticidad: "MEDIA", group: "Eléctrico"  },
    {
        item: "Tablero de Instrumentos (Testigos)",
        criticidad: "ALTA",
        group: "Eléctrico",
    },
];
