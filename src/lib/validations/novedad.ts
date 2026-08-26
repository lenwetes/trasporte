import { z } from "zod";
import { GravedadSiniestroSchema } from "./safety";

export const SiniestroCreateSchema = z.object({
    fecha: z.coerce.date(),
    lugar: z.string().min(3, "Debe indicar la dirección o lugar de los hechos"),
    reporteHechos: z.string().min(10, "Por favor, describa detalladamente lo sucedido"),
    gravedad: GravedadSiniestroSchema.default("SOLO_DANOS"),
    conductorId: z.string().uuid("Debe asignar un conductor al siniestro"),
    vehiculoId: z.string().uuid("Debe indicar el vehículo involucrado"),
    fotoIds: z.array(z.string().uuid()).optional().default([]),
});

export const SiniestroUpdateSchema = SiniestroCreateSchema.partial();

export const TipoNovedadSchema = z.enum([
    "MULTA",
    "COMPARENDO",
    "FALLA_MECANICA",
    "CONDUCTA",
    "OTRO",
]);
export const EstadoNovedadSchema = z.enum([
    "PENDIENTE",
    "EN_PROCESO",
    "RESUELTO",
    "ANULADO",
]);

export const NovedadCreateSchema = z.object({
    tipo: TipoNovedadSchema,
    descripcion: z.string().optional().nullable(),
    fecha: z.coerce.date(),
    monto: z.coerce.number().optional().nullable(),
    estado: EstadoNovedadSchema.default("PENDIENTE"),
    conductorId: z.string().uuid().optional().nullable(),
    vehiculoId: z.string().uuid().optional().nullable(),
    consultaSimitId: z.string().uuid().optional().nullable(),
});

export const NovedadUpdateSchema = NovedadCreateSchema.partial();

export type SiniestroCreate = z.infer<typeof SiniestroCreateSchema>;
export type SiniestroUpdate = z.infer<typeof SiniestroUpdateSchema>;
export type NovedadCreate = z.infer<typeof NovedadCreateSchema>;
export type NovedadUpdate = z.infer<typeof NovedadUpdateSchema>;
