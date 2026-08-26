import { z } from "zod";

export const RolSchema = z.enum([
    "ADMIN",
    "CONDUCTOR",
    "SECRETARIA",
    "PROPIETARIO",
]);
export const ModalidadSchema = z.enum(["FLOTA_PROPIA", "CONVENIO_EXTERNO"]);
export const TipoDocumentoIdSchema = z.enum(["CC", "CE", "PASAPORTE", "NIT"]);
export const ClaseVehiculoSchema = z.enum([
    "MICROBUS",
    "BUSETA",
    "BUS",
    "CAMIONETA",
    "OTRO",
]);

export const CategoriaLicenciaSchema = z.enum([
    "A1",
    "A2",
    "B1",
    "B2",
    "B3",
    "C1",
    "C2",
    "C3",
]);

export const ServicioLicenciaSchema = z.enum([
    "PARTICULAR",
    "ESPECIAL",
    "PUBLICO",
]);

export const FileUploadSchema = z.object({
    file: z
        .instanceof(File)
        .refine(
            (file) => file.size <= 10 * 1024 * 1024,
            "El archivo no debe superar 10MB",
        )
        .refine(
            (file) =>
                [
                    "application/pdf",
                    "image/jpeg",
                    "image/png",
                    "image/jpg",
                ].includes(file.type),
            "Solo se permiten archivos PDF, JPG o PNG",
        ),
});
