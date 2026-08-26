import { z } from "zod";
import { ClaseVehiculoSchema, ModalidadSchema } from "./common";

export const VehiculoCreateSchema = z.object({
    placa: z
        .string()
        .min(7, "La placa debe tener al menos 7 caracteres")
        .max(8, "La placa debe tener máximo 8 caracteres")
        .regex(
            /^[A-Z]{3}-[0-9]{3,4}$/,
            "Formato de placa inválido (ej: ABC-123)",
        ),
    marca: z.string().optional().nullable(),
    numeroInterno: z.string().optional().nullable(),
    modelo: z.string().optional().nullable(),
    anho: z.coerce
        .number()
        .min(1900, "El año debe ser mayor a 1900")
        .max(new Date().getFullYear() + 1, "El año no es válido")
        .optional()
        .nullable(),
    color: z.string().optional().nullable(),
    cilindraje: z.string().optional().nullable(),
    peso: z.string().optional().nullable(),
    capacidadPuestos: z.coerce
        .number()
        .min(1, "La capacidad debe ser de al menos 1 pasajero")
        .optional()
        .nullable(),
    numeroMotor: z.string().optional().nullable(),
    numeroChasis: z.string().optional().nullable(),
    lugarExpedicion: z.string().optional().nullable(),
    clase: ClaseVehiculoSchema.default("OTRO"),
    modalidad: ModalidadSchema.optional().nullable(),
    propietario: z.string().optional().nullable(),
    propietarioId: z.string().uuid().optional().nullable(),
    kilometrajeActual: z.coerce.number().optional().nullable(),
});

export const VehiculoUpdateSchema = VehiculoCreateSchema.partial().extend({
    version: z.number().optional().nullable(),
});

export const VinculacionCreateSchema = z.object({
    conductorId: z.string().uuid("Debe seleccionar un conductor válido"),
    vehiculoId: z.string().uuid("Debe seleccionar un vehículo válido"),
    fechaInicio: z.date().default(() => new Date()),
    fechaFin: z.date().optional().nullable(),
    activo: z.boolean().default(true),
});

export const VinculacionUpdateSchema = VinculacionCreateSchema.partial();

export const DocumentoVehiculoCreateSchema = z.object({
    vehiculoId: z.string().uuid("Debe seleccionar un vehículo válido"),
    tipo: z
        .string()
        .refine(
            (val) =>
                [
                    "SOAT",
                    "TECNOMECANICA",
                    "REVISION_TECNOMECANICA",
                    "TARJETA_OPERACION",
                    "POLIZA_RESPONSABILIDAD_CIVIL",
                    "LICENCIA_TRANSITO",
                    "SIMIT",
                    "OTRO",
                ].includes(val),
            "Tipo de documento no reconocido",
        ),
    fechaVencimiento: z.coerce.date().optional().nullable(),
    archivoId: z.string().uuid("Debe adjuntar un archivo válido").optional().nullable(),
});

export const DocumentoVehiculoUpdateSchema =
    DocumentoVehiculoCreateSchema.partial();

export const FrecuenciaMantenimientoSchema = z.enum([
    "KILOMETROS",
    "TIEMPO",
    "AMBOS",
]);

export const PlanMantenimientoCreateSchema = z.object({
    nombre: z.string().min(3, "El nombre del plan es requerido"),
    descripcion: z.string().optional().nullable(),
    frecuencia: FrecuenciaMantenimientoSchema,
    kmIntervalo: z.coerce.number().optional().nullable(),
    mesesIntervalo: z.coerce.number().optional().nullable(),
});

export const PlanMantenimientoUpdateSchema =
    PlanMantenimientoCreateSchema.partial();

export const MantenimientoRealizadoCreateSchema = z.object({
    vehiculoId: z.string().uuid("ID de vehículo inválido"),
    planId: z.string().uuid("ID de plan inválido"),
    fecha: z.coerce.date(),
    kilometraje: z.coerce.number().min(0, "El kilometraje debe ser positivo"),
    costo: z.coerce.number().optional().nullable(),
    observaciones: z.string().optional().nullable(),
    archivoId: z.string().uuid().optional().nullable(),
});

export const MantenimientoRealizadoUpdateSchema =
    MantenimientoRealizadoCreateSchema.partial();

export type VehiculoCreate = z.infer<typeof VehiculoCreateSchema>;
export type VehiculoUpdate = z.infer<typeof VehiculoUpdateSchema>;
export type VinculacionCreate = z.infer<typeof VinculacionCreateSchema>;
export type VinculacionUpdate = z.infer<typeof VinculacionUpdateSchema>;
export type DocumentoVehiculoCreate = z.infer<
    typeof DocumentoVehiculoCreateSchema
>;
export type DocumentoVehiculoUpdate = z.infer<
    typeof DocumentoVehiculoUpdateSchema
>;
export type PlanMantenimientoCreate = z.infer<
    typeof PlanMantenimientoCreateSchema
>;
export type PlanMantenimientoUpdate = z.infer<
    typeof PlanMantenimientoUpdateSchema
>;
export type MantenimientoRealizadoCreate = z.infer<
    typeof MantenimientoRealizadoCreateSchema
>;
export type MantenimientoRealizadoUpdate = z.infer<
    typeof MantenimientoRealizadoUpdateSchema
>;
