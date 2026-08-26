"use server";

import { revalidatePath } from "next/cache";
import { ResumeService } from "@/services/resume.service";
import {
    CertificadoCreateSchema,
    CertificadoCreate,
    CertificadoUpdateSchema,
    CertificadoUpdate,
} from "@/lib/validations";
import { withAuth } from "@/lib/safe-action";
import { ActionResult } from "@/types";
import { CacheService } from "@/lib/cache";

/**
 * Patrón 5.1: Crear Certificado
 */
export const createCertificado = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        const data = dataInput as CertificadoCreate;
        const currentUserId = session.user.id;
        const currentUserRole = session.user.rol;

        if (
            currentUserRole !== "ADMIN" &&
            currentUserRole !== "SECRETARIA" &&
            currentUserRole !== "AUDITOR" &&
            data.usuarioId !== currentUserId
        ) {
            return {
                success: false,
                error: "No puedes crear certificados para otros usuarios",
            };
        }

        const validatedFields = CertificadoCreateSchema.safeParse(data);
        if (!validatedFields.success) {
            return {
                success: false,
                error: validatedFields.error.issues[0].message,
            };
        }

        const result = await ResumeService.createCertificado(
            validatedFields.data,
        );
        if (result.success) {
            await CacheService.delete(`user:id:${data.usuarioId}`);
            revalidatePath(`/dashboard/perfil/hoja-vida`);
            revalidatePath(`/dashboard/usuarios/${data.usuarioId}`);
            revalidatePath(`/dashboard/conductores/${data.usuarioId}`);
        }
        return result;
    },
);

/**
 * Patrón 5.1: Actualizar Certificado
 */
export const updateCertificado = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        const { id, ...data } = dataInput as { id: string } & CertificadoUpdate;

        if (
            session.user.rol !== "ADMIN" &&
            session.user.rol !== "SECRETARIA" &&
            session.user.rol !== "AUDITOR" &&
            data.usuarioId !== session.user.id
        ) {
            return {
                success: false,
                error: "No puedes actualizar certificados de otros usuarios",
            };
        }

        const validatedFields = CertificadoUpdateSchema.safeParse(data);
        if (!validatedFields.success) {
            return {
                success: false,
                error: validatedFields.error.issues[0].message,
            };
        }

        const result = await ResumeService.updateCertificado(
            id,
            validatedFields.data,
        );
        if (result.success) {
            await CacheService.delete(`user:id:${data.usuarioId}`);
            revalidatePath(`/dashboard/perfil/hoja-vida`);
            revalidatePath(`/dashboard/usuarios/${data.usuarioId}`);
            revalidatePath(`/dashboard/conductores/${data.usuarioId}`);
        }
        return result;
    },
);

/**
 * Patrón 5.1: Eliminar Certificado
 */
export const deleteCertificado = withAuth(
    async (session, dataInput: unknown): Promise<ActionResult> => {
        const { id, usuarioId } = dataInput as {
            id: string;
            usuarioId: string;
        };

        if (
            session.user.rol !== "ADMIN" &&
            session.user.rol !== "SECRETARIA" &&
            session.user.rol !== "AUDITOR" &&
            usuarioId !== session.user.id
        ) {
            return {
                success: false,
                error: "No puedes eliminar certificados de otros usuarios",
            };
        }

        const result = await ResumeService.deleteCertificado(id);
        if (result.success) {
            await CacheService.delete(`user:id:${usuarioId}`);
            revalidatePath(`/dashboard/perfil/hoja-vida`);
            revalidatePath(`/dashboard/usuarios/${usuarioId}`);
            revalidatePath(`/dashboard/conductores/${usuarioId}`);
        }
        return result;
    },
);
