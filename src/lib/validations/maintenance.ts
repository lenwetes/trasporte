import { z } from "zod";

export const CreateOrdenServicioSchema = z.object({
    vehiculoId: z.string().min(1, "Vehículo es requerido"),
    planId: z.string().min(1, "Plan es requerido"),
    observaciones: z.string().optional(),
});

export const SubmitComprobanteOrdenSchema = z.object({
    ordenId: z.string().min(1, "Orden es requerida"),
    kilometraje: z.number().min(0, "Kilometraje debe ser mayor a 0"),
    costo: z.number().min(0, "Costo debe ser mayor a 0"),
    observaciones: z.string().optional(),
    archivoId: z.string().min(1, "Archivo es requerido"),
});

export const SolicitarRevisionSchema = z.object({
    vehiculoId: z.string().min(1),
    planId: z.string().min(1),
    kilometraje: z.number().min(0),
    costo: z.number().min(0),
    observaciones: z.string().optional(),
    archivoId: z.string().min(1),
});

export type CreateOrdenServicio = z.infer<typeof CreateOrdenServicioSchema>;
export type SubmitComprobanteOrden = z.infer<
    typeof SubmitComprobanteOrdenSchema
>;
export type SolicitarRevision = z.infer<typeof SolicitarRevisionSchema>;
