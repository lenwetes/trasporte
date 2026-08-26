import { z } from "zod";
import {
    RolSchema,
    TipoDocumentoIdSchema,
    CategoriaLicenciaSchema,
    ServicioLicenciaSchema,
} from "./common";

export const LicenciaDetalleSchema = z.object({
    categoria: CategoriaLicenciaSchema,
    servicio: ServicioLicenciaSchema.default("PARTICULAR"),
    fechaVencimiento: z.coerce.date(),
    archivoId: z.string().uuid().optional().nullable(),
});

export const UsuarioCreateSchema = z.object({
    nombres: z.string().trim().min(1, "Los nombres son requeridos"),
    apellidos: z.string().trim().min(1, "Los apellidos son requeridos"),
    tipoDocumento: TipoDocumentoIdSchema.default("CC"),
    numeroDocumento: z.string().optional().nullable().or(z.literal("")),

    fechaNacimiento: z.coerce.date().optional().nullable(),
    lugarNacimiento: z.string().optional().nullable(),
    estadoCivil: z.string().optional().nullable(),

    direccion: z.string().optional().nullable(),
    municipio: z.string().optional().default("Sincelejo"),
    telefono: z.string().optional().nullable(),
    email: z.string().optional().nullable().or(z.literal("")),

    password: z.string().optional().nullable().or(z.literal("")),
    rol: RolSchema,

    numeroLicencia: z.string().optional().nullable().or(z.literal("")),
    licencias: z.array(LicenciaDetalleSchema).optional().default([]),

    idFotoPerfil: z.string().uuid().optional().nullable(),
    idDocumentoIdentidad: z.string().uuid().optional().nullable(),

    // Hoja de Vida
    rh: z.string().optional().nullable(),
    eps: z.string().optional().nullable(),
    arl: z.string().optional().nullable(),
    fondoPensiones: z.string().optional().nullable(),
    fondoCesantias: z.string().optional().nullable(),
    contactoEmergenciaNombre: z.string().optional().nullable(),
    contactoEmergenciaTelefono: z.string().optional().nullable(),
    perfilProfesional: z.string().optional().nullable(),

    experiencias: z
        .array(
            z.object({
                empresa: z.string().optional().or(z.literal("")),
                cargo: z.string().optional().or(z.literal("")),
                jefeInmediato: z.string().optional().nullable(),
                telefonoJefe: z.string().optional().nullable(),
                fechaInicio: z.coerce.date().optional().nullable(),
                fechaFin: z.coerce.date().optional().nullable(),
                tiempoLaborado: z.string().optional().nullable(),
                archivoId: z.string().uuid().optional().nullable(),
            }),
        )
        .optional()
        .default([]),

    certificados: z
        .array(
            z.object({
                nombre: z.string().optional().or(z.literal("")),
                institucion: z.string().optional().nullable(),
                fechaEmision: z.coerce.date().optional().nullable(),
                fechaVencimiento: z.coerce.date().optional().nullable(),
                categoria: z.string().optional().nullable(),
                archivoId: z.string().uuid().optional().nullable(),
            }),
        )
        .optional()
        .default([]),
});

export const UsuarioUpdateSchema = UsuarioCreateSchema.partial().extend({
    password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .optional()
        .nullable()
        .or(z.literal("")),
});

export const LoginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "La contraseña es requerida"),
});

export const CertificadoCreateSchema = z.object({
    nombre: z.string().min(1, "El nombre del certificado es requerido"),
    institucion: z.string().optional().nullable(),
    fechaEmision: z.coerce.date().optional().nullable(),
    fechaVencimiento: z.coerce.date().optional().nullable(),
    categoria: z.string().optional().nullable().default("OTRO"),
    usuarioId: z.string().uuid("Debe seleccionar un usuario válido de la lista"),
    archivoId: z.string().uuid("Debe adjuntar un archivo válido").optional().nullable(),
});

export const CertificadoUpdateSchema = CertificadoCreateSchema.partial().extend(
    {
        usuarioId: z.string().uuid("ID de usuario inválido"),
    },
);

export const ExperienciaLaboralCreateSchema = z.object({
    empresa: z.string().min(1, "El nombre de la empresa es requerido"),
    cargo: z.string().min(1, "El cargo es requerido"),
    jefeInmediato: z.string().optional().nullable(),
    telefonoJefe: z.string().optional().nullable(),
    fechaInicio: z.coerce.date().optional().nullable(),
    fechaFin: z.coerce.date().optional().nullable(),
    tiempoLaborado: z.string().optional().nullable(),
    usuarioId: z.string().uuid("Debe estar vinculado a un usuario válido"),
    archivoId: z.string().uuid().optional().nullable(),
});

export const ExperienciaLaboralUpdateSchema =
    ExperienciaLaboralCreateSchema.partial().extend({
        usuarioId: z.string().uuid("ID de usuario inválido"),
    });

export const ReferenciaPersonalCreateSchema = z.object({
    nombre: z.string().min(1, "El nombre de la referencia es requerido"),
    ocupacion: z.string().optional().nullable(),
    telefono: z.string().optional().nullable(),
    usuarioId: z.string().uuid("Debe estar vinculado a un usuario válido"),
});

export const ReferenciaPersonalUpdateSchema =
    ReferenciaPersonalCreateSchema.partial().extend({
        usuarioId: z.string().uuid("ID de usuario inválido"),
    });

export const HojaVidaUpdateSchema = z.object({
    rh: z.string().optional().nullable(),
    eps: z.string().optional().nullable(),
    arl: z.string().optional().nullable(),
    fondoPensiones: z.string().optional().nullable(),
    fondoCesantias: z.string().optional().nullable(),
    contactoEmergenciaNombre: z.string().optional().nullable(),
    contactoEmergenciaTelefono: z.string().optional().nullable(),
    perfilProfesional: z.string().optional().nullable(),
});

export type UsuarioCreate = z.infer<typeof UsuarioCreateSchema>;
export type UsuarioUpdate = z.infer<typeof UsuarioUpdateSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CertificadoCreate = z.infer<typeof CertificadoCreateSchema>;
export type CertificadoUpdate = z.infer<typeof CertificadoUpdateSchema>;
export type ExperienciaLaboralCreate = z.infer<
    typeof ExperienciaLaboralCreateSchema
>;
export type ExperienciaLaboralUpdate = z.infer<
    typeof ExperienciaLaboralUpdateSchema
>;
export type ReferenciaPersonalCreate = z.infer<
    typeof ReferenciaPersonalCreateSchema
>;
export type ReferenciaPersonalUpdate = z.infer<
    typeof ReferenciaPersonalUpdateSchema
>;
export type HojaVidaUpdate = z.infer<typeof HojaVidaUpdateSchema>;
