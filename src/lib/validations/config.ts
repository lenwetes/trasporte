import { z } from "zod";

export const ReglaAlertaCreateSchema = z.object({
    tipoDocumento: z.string().min(1, "El tipo de documento es requerido"),
    diasAnticipacion: z
        .number()
        .int("Debe ser un número entero")
        .min(1, "Debe ser al menos 1 día")
        .max(365, "No puede superar 365 días")
        .default(30),
    activo: z.boolean().default(true),
});

export const ReglaAlertaUpdateSchema = ReglaAlertaCreateSchema.partial();

export const ConfiguracionGlobalSchema = z.object({
    nombreEmpresa: z.string().min(2, "El nombre de la empresa es requerido"),
    logoUrl: z.string().optional().nullable().or(z.literal("")),
    logoLocalPath: z.string().optional().nullable().or(z.literal("")),
    colorPrimario: z
        .string()
        .regex(
            /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
            "Color inválido (ej: #10b981)",
        ),

    representanteLegal: z.string().optional().nullable(),
    nit: z.string().optional().nullable(),
    telefono: z.string().optional().nullable(),
    email: z
        .string()
        .email("Email inválido")
        .optional()
        .nullable()
        .or(z.literal("")),
    direccion: z.string().optional().nullable(),

    moduloSiniestros: z.boolean(),
    moduloReportes: z.boolean(),
    moduloConductores: z.boolean(),

    smtpHost: z.string().optional().nullable().or(z.literal("")),
    smtpPort: z.coerce.number().optional().nullable(),
    smtpUser: z.string().optional().nullable().or(z.literal("")),
    smtpPass: z.string().optional().nullable().or(z.literal("")),

    modoMantenimiento: z.boolean().default(false),
    sessionTimeout: z.coerce.number().int().min(15).max(1440).default(480),
    montoCuotaAdministracion: z.coerce.number().optional(),
    diaCorteMensual: z.coerce.number().optional(),
    umbralBloqueoMora: z.coerce.number().optional(),
    porcentajeMoraDiaria: z.coerce.number().optional(),
    costoBaseFuec: z.coerce.number().min(0, "Monto inválido").default(30000).optional(),
    dashboardTheme: z.enum(["command-classic", "hybrid-premium"]).default("command-classic").optional(),
});

export type ReglaAlertaCreate = z.infer<typeof ReglaAlertaCreateSchema>;
export type ReglaAlertaUpdate = z.infer<typeof ReglaAlertaUpdateSchema>;
export type ConfiguracionGlobal = z.infer<typeof ConfiguracionGlobalSchema>;
