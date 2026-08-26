import * as z from "zod";

export const WizardHojaVidaSchema = z.object({
    rh: z.string().optional().nullable(),
    eps: z.string().optional().nullable(),
    arl: z.string().optional().nullable(),
    fondoPensiones: z.string().optional().nullable(),
    fondoCesantias: z.string().optional().nullable(),
    contactoEmergenciaNombre: z.string().optional().nullable(),
    contactoEmergenciaTelefono: z.string().optional().nullable(),
    perfilProfesional: z.string().optional().nullable(),
});

export type HojaVidaFormValues = z.infer<typeof WizardHojaVidaSchema>;
