import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ActionResult, UsuarioWithRelations, UsuarioListItem } from "@/types";
import logger from "@/lib/logger";
import { USER_FULL_INCLUDE, USER_LIST_SELECT } from "../user-constants";
import { CacheService } from "@/lib/cache";
import {
    PaginationParams,
    PaginatedResponse,
    parsePaginationParams,
    calculatePagination,
    calculateSkip,
} from "@/types/pagination";

export class UserQueryService {
    /**
     * Internal generic method to find a user by ID with standard relations
     */
    static async getById(
        id: string,
    ): Promise<ActionResult<unknown>> {
        return await CacheService.remember(`user:id:${id}`, 3600, async () => {
            try {
                const usuario = await prisma.usuario.findUnique({
                    where: { id },
                    include: USER_FULL_INCLUDE,
                });

                if (!usuario)
                    return { success: false, error: "Usuario no encontrado" };

                return { success: true, data: usuario as UsuarioWithRelations };
            } catch (error) {
                logger.error({ id, error }, "UserQueryService.getById error");
                return { success: false, error: "Error al obtener usuario" };
            }
        });
    }

    /**
     * Fetches paginated users
     */
    static async getAll(
        params: PaginationParams & { where?: Prisma.UsuarioWhereInput } = {},
    ): Promise<ActionResult<unknown>> {
        const { where = { activo: true }, ...paginationParams } = params;
        const options = parsePaginationParams(paginationParams);
        const skip = calculateSkip(options);
        const cacheKey = `user:list:${JSON.stringify(where)}:${options.page}:${options.pageSize}`;

        return await CacheService.remember(cacheKey, 600, async () => {
            try {
                const [usuarios, total] = await Promise.all([
                    prisma.usuario.findMany({
                        where,
                        skip,
                        take: options.pageSize,
                        select: USER_LIST_SELECT,
                        orderBy: { creadoEn: "desc" },
                    }),
                    prisma.usuario.count({ where }),
                ]);

                return {
                    success: true,
                    data: {
                        data: usuarios,
                        pagination: calculatePagination(total, options),
                    },
                };
            } catch (error) {
                logger.error(
                    { params, error },
                    "UserQueryService.getAll error",
                );
                return { success: false, error: "Error al obtener usuarios" };
            }
        });
    }

    /**
     * Search users by name, email or document
     */
    static async search(
        query: string,
        limit = 20,
    ): Promise<ActionResult<unknown>> {
        try {
            const users = await prisma.usuario.findMany({
                where: {
                    activo: true,
                    OR: [
                        { nombres: { contains: query, mode: "insensitive" } },
                        { apellidos: { contains: query, mode: "insensitive" } },
                        { email: { contains: query, mode: "insensitive" } },
                        {
                            numeroDocumento: {
                                contains: query,
                                mode: "insensitive",
                            },
                        },
                    ],
                },
                take: limit,
                select: USER_LIST_SELECT,
                orderBy: { nombres: "asc" },
            });

            return {
                success: true,
                data: users as unknown as UsuarioListItem[],
            };
        } catch (error) {
            logger.error({ query, error }, "UserQueryService.search error");
            return { success: false, error: "Error al buscar usuarios" };
        }
    }
}
