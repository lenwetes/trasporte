import { auth } from "@/auth";
import logger from "@/lib/logger";
import { ActionResult } from "@/types";
import { Rol } from "@prisma/client";
import { Session } from "next-auth";

/**
 * Patrón 5.1 - Server Action Estándar
 * Este wrapper proporciona la sesión automáticamente al cuerpo de la acción.
 */
export function withAuth<T>(
    action: (session: Session, data: unknown) => Promise<ActionResult<T>>,
    actionName?: string
): (data?: unknown) => Promise<ActionResult<T>>;

/**
 * @deprecated Versión antigua que requiere roles y nombre como argumentos.
 */
export function withAuth<T, Args extends unknown[] = unknown[]>(
    roles: Rol[] | Rol | "ALL",
    action: (...args: Args) => Promise<ActionResult<T>>,
    actionName: string
): (...args: Args) => Promise<ActionResult<T>>;

export function withAuth<T>(
    param1: unknown,
    param2?: unknown,
    param3?: string
): unknown {
    if (typeof param1 === "function") {
        const action = param1 as (
            session: Session,
            data: unknown,
        ) => Promise<ActionResult<T>>;
        const actionName = (param2 as string) || "unnamed-safe-action";

        return async (data?: unknown): Promise<ActionResult<T>> => {
            try {
                const session = await auth();
                if (!session?.user) {
                    return { success: false, error: "No autenticado" };
                }
                return await action(session, data);
            } catch (error) {
                logger.error(
                    { error, action: actionName, data },
                    `Error en withAuth wrapper (5.1): ${actionName}`,
                );
                return { success: false, error: "Error interno del servidor" };
            }
        };
    }

    const roles = param1;
    const action = param2 as (...args: unknown[]) => Promise<ActionResult<T>>;
    const actionName = param3 || "unnamed-action";

    return async (...args: unknown[]): Promise<ActionResult<T>> => {
        try {
            const session = await auth();
            if (!session?.user) {
                return { success: false, error: "No autenticado" };
            }

            if (roles !== "ALL") {
                const allowedRoles = Array.isArray(roles) ? roles : [roles];
                if (!allowedRoles.includes(session.user.rol as Rol)) {
                    logger.warn({
                        userId: session.user.id,
                        userRole: session.user.rol as string,
                        action: actionName
                    }, "Intento de acceso no autorizado");
                    return { success: false, error: "No autorizado para esta acción" };
                }
            }

            return await action(...args);
        } catch (error) {
            logger.error({ error, action: actionName, args }, `Error en acción: ${actionName}`);
            return { success: false, error: `Error inesperado en ${actionName}` };
        }
    };
}

export function safeAction<T, Args extends unknown[] = unknown[]>(
    action: (...args: Args) => Promise<ActionResult<T>>,
    actionName: string
) {
    return async (...args: Args): Promise<ActionResult<T>> => {
        try {
            return await action(...args);
        } catch (error) {
            logger.error({ error, action: actionName, args }, `Error en acción: ${actionName}`);
            return { success: false, error: `Error interno en el servidor` };
        }
    };
}
