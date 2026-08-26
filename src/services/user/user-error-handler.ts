import logger from "@/lib/logger";
import { ActionResult, UsuarioWithRelations } from "@/types";

export class UserPrismaErrorHandler {
    static handle(
        error: unknown,
        data: Record<string, unknown>,
        op: string,
    ): ActionResult<UsuarioWithRelations> {
        logger.error(
            { data: { ...data, password: "[REDACTED]" }, error },
            `UserMutationService.${op} error`,
        );

        const result: ActionResult<UsuarioWithRelations> = {
            success: false,
            error: `No se pudo completar la operación`,
            message: "Error de base de datos"
        };

        if (error && typeof error === "object") {
            const err = error as any;
            
            // P2002: Error de Unicidad
            if (err.code === "P2002") {
                const target = err.meta?.target || [];
                const field = (Array.isArray(target) ? target[0] : String(target)) || "";
                
                if (typeof field === "string" && field.includes("email")) {
                    result.error = "Este correo electrónico ya está registrado en el sistema.";
                } else if (typeof field === "string" && field.includes("documento")) {
                    result.error = "Ya existe un usuario registrado con este número de documento.";
                } else if (typeof field === "string" && (field.includes("id_foto_perfil") || field.includes("id_documento_identidad"))) {
                    result.error = "Los archivos adjuntos ya están vinculados a otro expediente.";
                } else {
                    result.error = "Existe información duplicada que impide crear el registro.";
                }
                result.message = "Verifique que el documento y el correo sean únicos.";
            } 
            // P2003: Error de Relación
            else if (err.code === "P2003") {
                result.error = "Uno de los registros relacionados no existe o no es válido.";
            }
            // Errores de Zod o Validación de Esquema
            else if (err.name === "PrismaClientValidationError") {
                result.error = "Faltan datos obligatorios o el formato de la información es incorrecto.";
            } else {
                // Mensaje genérico amigable
                result.error = "Hubo un problema al conectar con la base de datos.";
                result.message = "Por favor, intente de nuevo en unos momentos.";
            }
        }

        return result;
    }
}
