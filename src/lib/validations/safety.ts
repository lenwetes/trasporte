import { z } from "zod";

export const TipoExamenSchema = z.enum([
    "INGRESO",
    "PERIODICO",
    "EGRESO",
    "POST_INCAPACIDAD",
]);

export const ConceptoMedicoSchema = z.enum([
    "APTO",
    "APTO_CON_RESTRICCION",
    "NO_APTO",
]);

export const ExamenMedicoCreateSchema = z.object({
    conductorId: z.string().uuid("ID de conductor inválido"),
    tipo: TipoExamenSchema,
    fechaRealizacion: z.coerce.date(),
    fechaVencimiento: z.coerce.date().optional().nullable(),
    entidadMedica: z.string().min(3, "La entidad médica es requerida"),
    concepto: ConceptoMedicoSchema,
    restricciones: z.string().optional().nullable(),
    archivoId: z.string().uuid().optional().nullable(),
});

export const ExamenMedicoUpdateSchema = ExamenMedicoCreateSchema.partial();

export const EntregaDotacionCreateSchema = z.object({
    conductorId: z.string().uuid("ID de conductor inválido"),
    fechaEntrega: z.coerce.date().default(() => new Date()),
    items: z
        .array(
            z.object({
                item: z.string().min(1, "Nombre del ítem es requerido"),
                cantidad: z.number().min(1, "Mínimo 1 unidad"),
                estado: z.string().default("Nuevo"),
            }),
        )
        .min(1, "Debe entregar al menos un ítem"),
    observaciones: z.string().optional().nullable(),
    valorTotal: z.coerce.number().min(0, "El valor no puede ser negativo").optional(),
    firmaDigital: z.string().optional().nullable(),
});

export const EntregaDotacionUpdateSchema =
    EntregaDotacionCreateSchema.partial();

export const NivelCriticidadSchema = z.enum(["ALTA", "MEDIA", "BAJA"]);
export const EstadoPreoperacionalSchema = z.enum(["APROBADO", "RECHAZADO"]);

export const DetallePreoperacionalSchema = z.object({
    item: z.string().min(1, "El ítem es requerido"),
    estado: z.boolean(),
    criticidad: NivelCriticidadSchema,
    observacion: z.string().optional().nullable(),
});

export const PreoperacionalCreateSchema = z.object({
    vehiculoId: z.string().uuid("ID de vehículo inválido"),
    conductorId: z.string().uuid("ID de conductor inválido"),
    fecha: z.coerce.date().default(() => new Date()),
    kilometraje: z.coerce.number().min(0, "El kilometraje no puede ser negativo"),
    detalles: z
        .array(DetallePreoperacionalSchema)
        .min(1, "Debe evaluar al menos un ítem"),
    observaciones: z.string().optional().nullable(),
    firmaDigital: z.string().optional().nullable(),
});

export type DetallePreoperacional = z.infer<typeof DetallePreoperacionalSchema>;
export type PreoperacionalCreate = z.infer<typeof PreoperacionalCreateSchema>;

export const GravedadSiniestroSchema = z.enum([
    "SOLO_DANOS",
    "CON_HERIDOS",
    "MORTAL",
]);

export const InvestigacionSiniestroSchema = z.object({
    siniestroId: z.string().uuid("ID de siniestro inválido"),
    participantes: z
        .string()
        .min(3, "Indique quiénes participan en la investigación"),
    analisisCausas: z
        .string()
        .min(10, "El análisis de causas (5 porqués) es requerido"),
    planAccion: z.string().min(10, "El plan de acción es requerido"),
    conclusiones: z.string().min(10, "Debe incluir conclusiones"),
    diasPerdidos: z.number().min(0).default(0),
    costoEstimado: z.number().min(0).optional().nullable(),
});

export type InvestigacionSiniestroCreate = z.infer<
    typeof InvestigacionSiniestroSchema
>;

export type ExamenMedicoCreate = z.infer<typeof ExamenMedicoCreateSchema>;
export type ExamenMedicoUpdate = z.infer<typeof ExamenMedicoUpdateSchema>;
export type EntregaDotacionCreate = z.infer<typeof EntregaDotacionCreateSchema>;
export type EntregaDotacionUpdate = z.infer<typeof EntregaDotacionUpdateSchema>;
