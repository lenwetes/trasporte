import * as z from "zod";

export const ExperienciaItemSchema = z.object({
    empresa: z.string().optional().or(z.literal("")),
    cargo: z.string().optional().or(z.literal("")),
    jefeInmediato: z.string().optional().nullable(),
    telefonoJefe: z.string().optional().nullable(),
    fechaInicio: z.string().optional().nullable(),
    fechaFin: z.string().optional().nullable(),
    tiempoLaborado: z.string().optional().nullable(),
    archivoId: z.string().uuid().optional().nullable(),
});

export const WizardExperienciasSchema = z.object({
    experiencias: z.array(ExperienciaItemSchema),
});

export type ExperienciaItem = z.infer<typeof ExperienciaItemSchema>;
export type ExperienciasFormValues = z.infer<typeof WizardExperienciasSchema>;
