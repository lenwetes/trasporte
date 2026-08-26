import { z } from "zod";

const dateSchema = z.coerce.date();

export const fuecSchema = z
    .object({
        contratoId: z.string().uuid("Debe seleccionar un contrato vigente").or(z.literal("")),
        vehiculoId: z.string().uuid("Seleccione un vehículo de la flota").optional().nullable().or(z.literal("")),
        conductor1Id: z.string().uuid("Es obligatorio asignar al menos un conductor").optional().nullable().or(z.literal("")),
        conductor2Id: z.string().uuid("El segundo conductor no es válido").optional().nullable().or(z.literal("")),
        conductor3Id: z.string().uuid("El tercer conductor no es válido").optional().nullable().or(z.literal("")),

        // Trayectos múltiples (Mínimo 1)
        rutas: z
            .array(
                z.object({
                    origen: z.string().min(1, "Origen obligatorio").or(z.literal("")).or(z.null()),
                    destino: z.string().min(1, "Destino obligatorio").or(z.literal("")).or(z.null()),
                    perimetroUrbano: z.boolean().default(false),
                }),
            )
            .min(1, "Debe agregar al menos un origen y un destino para el viaje"),

        objetoViaje: z.string().optional(), // Permite sobrescribir el objeto del contrato

        fechaInicio: dateSchema,
        fechaFin: dateSchema,
        force: z.boolean().optional(),
        justificacion: z.string().optional(),
        creadoPorId: z.string().uuid().optional(),
        consecutivoContrato: z.coerce.number().int().optional(),
        consecutivoExtracto: z.coerce.number().int().optional(),

        // Contabilidad / Cobro de Planilla
        modoPago: z.enum(["EFECTIVO", "CREDITO"]).default("EFECTIVO").optional(),
        valorIngreso: z.coerce.number().min(0, "El valor no puede ser negativo").optional().default(0),
    })
    .refine(
        (data) => {
            // 1. Validar fechas
            if (
                data.fechaInicio &&
                data.fechaFin &&
                data.fechaFin < data.fechaInicio
            ) {
                return false;
            }
            return true;
        },
        {
            message: "La fecha de fin no puede ser anterior a la de inicio",
            path: ["fechaFin"],
        },
    )
    .refine(
        (data) => {
            // 2. Validar justificación si force es true
            if (data.force === true) {
                return (
                    !!data.justificacion && data.justificacion.trim().length > 0
                );
            }
            return true;
        },
        {
            message: "La justificación es obligatoria para emisiones forzadas",
            path: ["justificacion"],
        },
    )
    .refine(
        (data) => {
            // 3. Validar Vehículo y Conductor si NO es forzado
            if (!data.force) {
                const hasVehiculo = !!data.vehiculoId && data.vehiculoId.length > 0;
                const hasConductor = !!data.conductor1Id && data.conductor1Id.length > 0;
                return hasVehiculo && hasConductor;
            }
            return true;
        },
        {
            message: "El vehículo y el conductor principal son obligatorios",
            path: ["vehiculoId"],
        },
    );

export type FuecInput = z.infer<typeof fuecSchema>;

export const resolucionFuecSchema = z.object({
    numeroResolucion: z
        .string()
        .min(1, "El número de resolución es obligatorio"),
    rangoDesde: z.number().int().positive(),
    rangoHasta: z.number().int().positive(),
    fechaExpedicion: z.coerce.date(),
    fechaVencimiento: z.coerce.date().optional(),
});

export const contratoEmpresaSchema = z.object({
    numeroContrato: z.string().min(1, "El número de contrato es obligatorio"),
    consecutivoNumerico: z.coerce.number().int().optional(),
    cliente: z.string().min(3, "El nombre del cliente es obligatorio"),
    nitCliente: z.string().optional(),
    objeto: z.string().optional(),
    fechaInicio: z.coerce.date().optional().default(() => new Date()),
    fechaFin: z.coerce.date().optional().default(() => new Date(new Date().setFullYear(new Date().getFullYear() + 20))),
    valorTotal: z.number().optional(),
    esInterno: z.boolean().optional().default(false),

    // Datos del responsable
    responsableNombre: z.string().optional(),
    responsableCedula: z.string().optional(),
    responsableTelefono: z.string().optional(),
    responsableDireccion: z.string().optional(),
});

export const ClientCreateSchema = z.object({
    nombres: z.string().min(1, "Nombres obligatorios"),
    apellidos: z.string().min(1, "Apellidos obligatorios"),
    tipoDocumento: z.enum(["CC", "NIT", "CE", "PASAPORTE"]).default("CC"),
    numeroDocumento: z.string().min(1, "El número de documento es obligatorio"),
    email: z.string().email("El correo electrónico no es válido").optional().or(z.literal("")),
    telefono: z.string().optional().or(z.literal("")),
    direccion: z.string().optional().or(z.literal("")),
    departamento: z.string().optional().or(z.literal("")),
    municipio: z.string().optional().or(z.literal("")),
});

export type ClientCreate = z.infer<typeof ClientCreateSchema>;
