"use server";

import { revalidatePath } from "next/cache";
import { ResumeService } from "@/services/resume.service";
import {
    ExperienciaLaboralCreateSchema,
    ExperienciaLaboralCreate,
    ExperienciaLaboralUpdateSchema,
    ExperienciaLaboralUpdate,
} from "@/lib/validations";
import { withAuth } from "@/lib/safe-action";
import { ActionResult } from "@/types";

/**
 * Patrón 5.1: Crear Experiencia Laboral
 */
export const createExperienciaLaboral = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        const data = dataInput as ExperienciaLaboralCreate;
        if (
            session.user.rol !== "ADMIN" &&
            data.usuarioId !== session.user.id
        ) {
            return {
                success: false,
                error: "No puedes crear experiencias para otros usuarios",
            };
        }

        const validatedFields = ExperienciaLaboralCreateSchema.safeParse(data);
        if (!validatedFields.success) {
            return {
                success: false,
                error: validatedFields.error.issues[0].message,
            };
        }

        const result = await ResumeService.createExperienciaLaboral(
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
 * Patrón 5.1: Actualizar Experiencia Laboral
 */
export const updateExperienciaLaboral = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        const { id, ...data } = dataInput as {
            id: string;
        } & ExperienciaLaboralUpdate;

        if (
            session.user.rol !== "ADMIN" &&
            data.usuarioId !== session.user.id
        ) {
            return {
                success: false,
                error: "No puedes actualizar experiencias de otros usuarios",
            };
        }

        const validatedFields = ExperienciaLaboralUpdateSchema.safeParse(data);
        if (!validatedFields.success) {
            return {
                success: false,
                error: validatedFields.error.issues[0].message,
            };
        }

        const result = await ResumeService.updateExperienciaLaboral(
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
 * Patrón 5.1: Eliminar Experiencia Laboral
 */
export const deleteExperienciaLaboral = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        const { id, usuarioId } = dataInput as {
            id: string;
            usuarioId: string;
        };

        if (session.user.rol !== "ADMIN" && usuarioId !== session.user.id) {
            return {
                success: false,
                error: "No puedes eliminar experiencias de otros usuarios",
            };
        }

        const result = await ResumeService.deleteExperienciaLaboral(id);
        if (result.success) {
            revalidatePath(`/dashboard/perfil/hoja-vida`);
            revalidatePath(`/dashboard/usuarios/${usuarioId}`);
        }
        return result;
    },
);
