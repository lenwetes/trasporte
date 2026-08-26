"use server";

import { revalidatePath } from "next/cache";
import { ResumeService } from "@/services/resume.service";
import {
    ReferenciaPersonalCreateSchema,
    ReferenciaPersonalCreate,
    ReferenciaPersonalUpdateSchema,
    ReferenciaPersonalUpdate,
} from "@/lib/validations";
import { withAuth } from "@/lib/safe-action";
import { ActionResult } from "@/types";

/**
 * Patrón 5.1: Crear Referencia Personal
 */
export const createReferenciaPersonal = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        const data = dataInput as ReferenciaPersonalCreate;
        if (
            session.user.rol !== "ADMIN" &&
            data.usuarioId !== session.user.id
        ) {
            return {
                success: false,
                error: "No puedes crear referencias para otros usuarios",
            };
        }

        const validatedFields = ReferenciaPersonalCreateSchema.safeParse(data);
        if (!validatedFields.success) {
            return {
                success: false,
                error: validatedFields.error.issues[0].message,
            };
        }

        const result = await ResumeService.createReferenciaPersonal(
            validatedFields.data,
        );
        if (result.success) {
            revalidatePath(`/dashboard/perfil/hoja-vida`);
            revalidatePath(`/dashboard/usuarios/${data.usuarioId}`);
        }
        return result;
    },
);

/**
 * Patrón 5.1: Actualizar Referencia Personal
 */
export const updateReferenciaPersonal = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        const { id, ...data } = dataInput as {
            id: string;
        } & ReferenciaPersonalUpdate;

        if (
            session.user.rol !== "ADMIN" &&
            data.usuarioId !== session.user.id
        ) {
            return {
                success: false,
                error: "No puedes actualizar referencias de otros usuarios",
            };
        }

        const validatedFields = ReferenciaPersonalUpdateSchema.safeParse(data);
        if (!validatedFields.success) {
            return {
                success: false,
                error: validatedFields.error.issues[0].message,
            };
        }

        const result = await ResumeService.updateReferenciaPersonal(
            id,
            validatedFields.data,
        );
        if (result.success) {
            revalidatePath(`/dashboard/perfil/hoja-vida`);
            revalidatePath(`/dashboard/usuarios/${data.usuarioId}`);
        }
        return result;
    },
);

/**
 * Patrón 5.1: Eliminar Referencia Personal
 */
export const deleteReferenciaPersonal = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        const { id, usuarioId } = dataInput as {
            id: string;
            usuarioId: string;
        };

        if (session.user.rol !== "ADMIN" && usuarioId !== session.user.id) {
            return {
                success: false,
                error: "No puedes eliminar referencias de otros usuarios",
            };
        }

        const result = await ResumeService.deleteReferenciaPersonal(id);
        if (result.success) {
            revalidatePath(`/dashboard/perfil/hoja-vida`);
            revalidatePath(`/dashboard/usuarios/${usuarioId}`);
        }
        return result;
    },
);
