import { prisma } from "@/lib/prisma";
import { ActionResult, UsuarioWithRelations } from "@/types";
import logger from "@/lib/logger";
import { UsuarioCreate, UsuarioUpdate } from "@/lib/validations";
import { CacheService } from "@/lib/cache";
import { UserCreateService } from "./user-create.service";
import { UserUpdateService } from "./user-update.service";

/**
 * UserMutationService
 * Facade for user creation, update, and deletion.
 */
export class UserMutationService {
    static async create(
        data: UsuarioCreate,
    ): Promise<ActionResult<unknown>> {
        return UserCreateService.create(data);
    }

    static async update(
        id: string,
        data: Partial<UsuarioUpdate>,
    ): Promise<ActionResult<unknown>> {
        return UserUpdateService.update(id, data);
    }

    /**
     * Soft delete user
     */
    static async delete(id: string): Promise<ActionResult> {
        try {
            const usuario = await prisma.usuario.findUnique({ where: { id } });
            if (!usuario)
                return { success: false, error: "Usuario no encontrado" };

            await prisma.usuario.update({
                where: { id },
                data: { activo: false, eliminadoEn: new Date() },
            });

            await CacheService.invalidate("user");
            await CacheService.invalidate(`user:id:${id}`);

            logger.info(
                { id, email: usuario.email },
                "User deactivated (Soft Delete)",
            );
            return { success: true };
        } catch (error) {
            logger.error({ id, error }, "UserMutationService.delete error");
            return { success: false, error: "Error al desactivar el usuario" };
        }
    }
}
