import * as z from "zod";

export const CertificadoItemSchema = z.object({
    nombre: z.string().optional().or(z.literal("")),
    institucion: z.string().optional().nullable(),
    fechaEmision: z.string().optional().nullable(),
    fechaVencimiento: z.string().optional().nullable(),
    categoria: z.string().optional().nullable(),
    archivo: z.any().optional().nullable(),
});

export const WizardCertificadosSchema = z.object({
    certificados: z.array(CertificadoItemSchema),
});

export type CertificadoItem = z.infer<typeof CertificadoItemSchema>;
export type CertificadosFormValues = z.infer<typeof WizardCertificadosSchema>;
