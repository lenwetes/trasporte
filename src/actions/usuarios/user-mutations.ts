"use server";

import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/actions/audit";
import { ActionResult, UsuarioWithRelations } from "@/types";
import { UserService } from "@/services/user.service";
import { withAuth } from "@/lib/safe-action";
import { hasPermission, unauthorizedResponse } from "@/lib/permissions";
import logger from "@/lib/logger";
import {
    UsuarioCreateSchema,
    UsuarioCreate,
    UsuarioUpdateSchema,
    UsuarioUpdate,
} from "@/lib/validations";

/**
 * 5.1 Patrón: Crear Usuario
 */
export const createUser = withAuth(
    async (
        session,
        data: unknown,
    ): Promise<ActionResult<unknown>> => {
        // 1. RBAC
        if (!hasPermission(session.user.rol, "USUARIOS", "CREATE")) {
            return unauthorizedResponse();
        }

        // 2. Zod
        const validatedFields = UsuarioCreateSchema.safeParse(data);
        if (!validatedFields.success) {
            return {
                success: false,
                error: "Datos inválidos",
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        // 3. Logic + Audit + Revalidate
        try {
            const result = await UserService.create(
                validatedFields.data as UsuarioCreate,
            );

            if (!result.success || !result.data) {
                return result;
            }

            const createdUser = result.data as UsuarioWithRelations;

            await createAuditLog(
                session.user.id,
                "CREAR",
                "Usuario",
                createdUser.id,
                `Creación de usuario ${createdUser.nombres} ${createdUser.apellidos} (${createdUser.rol})`,
                session.user.lastIp,
                session.user.lastUserAgent,
            );

            revalidatePath("/dashboard/usuarios");
            return result;
        } catch (error) {
            logger.error(
                { error, userId: session.user.id },
                "Error en createUser",
            );
            return { success: false, error: "Error interno del servidor"  };
        }
    },
);

/**
 * 5.1 Patrón: Actualizar Usuario
 */
export const updateUser = withAuth(
    async (
        session,
        dataInput: unknown,
    ): Promise<ActionResult<unknown>> => {
        const { id, ...data } = dataInput as { id: string } & UsuarioUpdate;

        // 1. RBAC & Ownership
        const isSelf = session.user.id === id;
        const isAdmin = session.user.rol === "ADMIN";

        if (!isAdmin && !isSelf) {
            return unauthorizedResponse();
        }

        if (!hasPermission(session.user.rol, "USUARIOS", "UPDATE") && !isSelf) {
            return unauthorizedResponse();
        }

        // 2. Zod
        const schema = isAdmin
            ? UsuarioUpdateSchema.partial()
            : UsuarioUpdateSchema;
        const validatedFields = schema.safeParse(data);
        if (!validatedFields.success) {
            return {
                success: false,
                error: "Error de validación",
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        // 3. Logic + Audit + Revalidate
        try {
            const result = await UserService.update(
                id,
                validatedFields.data as UsuarioUpdate,
            );

            if (!result.success || !result.data) {
                return result;
            }

            const updatedUser = result.data as UsuarioWithRelations;

            await createAuditLog(
                session.user.id,
                "ACTUALIZAR",
                "Usuario",
                id,
                `Actualización de usuario ${updatedUser.nombres} ${updatedUser.apellidos}`,
                session.user.lastIp,
                session.user.lastUserAgent,
            );

            revalidatePath("/dashboard/usuarios");
            revalidatePath(`/dashboard/usuarios/${id}`);
            revalidatePath("/dashboard/perfil");

            return result;
        } catch (error) {
            logger.error(
                { error, userId: session.user.id, id },
                "Error en updateUser",
            );
            return { success: false, error: "Error interno del servidor"  };
        }
    },
);

/**
 * 5.1 Patrón: Eliminar Usuario (Baja Lógica)
 */
export const deleteUser = withAuth(
    async (session, id: unknown): Promise<ActionResult> => {
        // 1. RBAC
        if (!hasPermission(session.user.rol, "USUARIOS", "DELETE")) {
            return unauthorizedResponse();
        }

        if (typeof id !== "string") {
            return { success: false, error: "ID inválido"  };
        }

        // 2. Logic + Audit + Revalidate
        try {
            const result = await UserService.delete(id);

            if (!result.success) {
                return result;
            }

            await createAuditLog(
                session.user.id,
                "ELIMINAR",
                "Usuario",
                id,
                "Desactivación de usuario (Baja Lógica)",
                session.user.lastIp,
                session.user.lastUserAgent,
            );

            revalidatePath("/dashboard/usuarios");
            return { success: true };
        } catch (error) {
            logger.error(
                { error, userId: session.user.id, id },
                "Error en deleteUser",
            );
            return { success: false, error: "Error interno del servidor"  };
        }
    },
);
