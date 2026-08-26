"use server";

import { ActionResult, UsuarioWithRelations, UsuarioListItem } from "@/types";
import { UserService } from "@/services/user.service";
import { withAuth } from "@/lib/safe-action";
import { serializeDecimal } from "@/lib/utils";
import { hasPermission, unauthorizedResponse } from "@/lib/permissions";
import { Prisma } from "@prisma/client";
import { PaginationParams } from "@/types/pagination";

/**
 * Acciones de Lectura (Siguen con withAuth para seguridad)
 */

interface ConductorQueryParams extends PaginationParams {
    search?: string;
}

export const getConductores = withAuth(
    async (_session, params: unknown): Promise<ActionResult> => {
        const p = (params as ConductorQueryParams) || {};
        const { page = 1, pageSize = 12, search } = p;

        const whereInput: Prisma.UsuarioWhereInput = {
            rol: "CONDUCTOR",
            activo: true,
        };

        if (search) {
            whereInput.OR = [
                { nombres: { contains: search, mode: "insensitive" } },
                { apellidos: { contains: search, mode: "insensitive" } },
                { numeroDocumento: { contains: search, mode: "insensitive" } },
            ];
        }

        const result = await UserService.getAll({
            page,
            pageSize,
            where: whereInput,
        });

        if (result.success && result.data) {
            result.data = serializeDecimal(result.data);
        }

        return result;
    },
);

export const getUsuarios = withAuth(
    async (session, params: unknown): Promise<ActionResult> => {
        if (!hasPermission(session.user.rol, "USUARIOS", "READ")) {
            return unauthorizedResponse();
        }

        const {
            page = 1,
            pageSize = 12,
            search,
        } = (params as ConductorQueryParams) || {};

        const whereInput: Prisma.UsuarioWhereInput = {
            activo: true,
        };

        if (search) {
            whereInput.OR = [
                { nombres: { contains: search, mode: "insensitive" } },
                { apellidos: { contains: search, mode: "insensitive" } },
                { numeroDocumento: { contains: search, mode: "insensitive" } },
            ];
        }

        const result = await UserService.getAll({
            page,
            pageSize,
            where: whereInput,
        });

        if (result.success && result.data) {
            result.data = serializeDecimal(result.data);
        }
        return result;
    },
);

export const searchUsuarios = withAuth(
    async (
        session,
        params: unknown,
    ): Promise<ActionResult<unknown>> => {
        if (!hasPermission(session.user.rol, "USUARIOS", "READ")) {
            return unauthorizedResponse();
        }

        const { query = "", limit = 20 } =
            (params as { query?: string; limit?: number }) || {};
        const result = await UserService.search(query, limit);

        if (result.success && result.data) {
            result.data = serializeDecimal(result.data);
        }
        return result;
    },
);

export const getUsuarioById = withAuth(
    async (
        session,
        id: unknown,
    ): Promise<ActionResult<unknown>> => {
        if (typeof id !== "string") {
            return { success: false, error: "ID inválido" };
        }

        const result = await UserService.getById(id);

        // Ownership check if not admin
        if (result.success && result.data && session.user.rol !== "ADMIN") {
            const userData = result.data as { id: string };
            if (
                userData.id !== session.user.id &&
                !hasPermission(session.user.rol, "USUARIOS", "READ")
            ) {
                return unauthorizedResponse();
            }
        }

        if (result.success && result.data) {
            result.data = serializeDecimal(result.data);
        }
        return result;
    },
);
