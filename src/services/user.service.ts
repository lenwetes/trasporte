import { UserQueryService } from "./user/user-query.service";
import { UserMutationService } from "./user/user-mutation.service";
import { Prisma } from "@prisma/client";
import { ActionResult, UsuarioWithRelations, UsuarioListItem } from "@/types";
import { UsuarioCreate, UsuarioUpdate } from "@/lib/validations";
import { PaginationParams, PaginatedResponse } from "@/types/pagination";

/**
 * @deprecated Use specific services in src/services/user/ instead.
 */
export class UserService {
    static async getById(
        id: string,
    ): Promise<ActionResult<unknown>> {
        return UserQueryService.getById(id);
    }

    static async getAll(
        params: PaginationParams & { where?: Prisma.UsuarioWhereInput } = {},
    ): Promise<ActionResult<unknown>> {
        return UserQueryService.getAll(params);
    }

    static async search(
        query: string,
        limit = 20,
    ): Promise<ActionResult<unknown>> {
        return UserQueryService.search(query, limit);
    }

    static async create(
        data: UsuarioCreate,
    ): Promise<ActionResult<unknown>> {
        return UserMutationService.create(data);
    }

    static async update(
        id: string,
        data: Partial<UsuarioUpdate>,
    ): Promise<ActionResult<unknown>> {
        return UserMutationService.update(id, data);
    }

    static async delete(id: string): Promise<ActionResult> {
        return UserMutationService.delete(id);
    }
}
