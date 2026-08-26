export const ROLES = {
    ADMIN: "ADMIN",
    CONDUCTOR: "CONDUCTOR",
    SECRETARIA: "SECRETARIA",
    PROPIETARIO: "PROPIETARIO",
} as const;

export type UserRole = keyof typeof ROLES;

export const RESOURCES = {
    USUARIOS: "USUARIOS",
    VEHICULOS: "VEHICULOS",
    DOCUMENTOS: "DOCUMENTOS",
    VINCULACIONES: "VINCULACIONES",
    ALERTAS: "ALERTAS",
    SINIESTROS: "SINIESTROS",
    NOVEDADES: "NOVEDADES",
    CONFIGURACION: "CONFIGURACION",
    REPORTES: "REPORTES",
    CERTIFICADOS: "CERTIFICADOS",
    EXPERIENCIA: "EXPERIENCIA",
    REFERENCIAS: "REFERENCIAS",
    FINANCIERO: "FINANCIERO",
    MANTENIMIENTO: "MANTENIMIENTO",
    FUEC: "FUEC",
    SAFETY: "SAFETY",
} as const;

export type Resource = keyof typeof RESOURCES;

export const ACTIONS = {
    CREATE: "CREATE",
    READ: "READ",
    UPDATE: "UPDATE",
    DELETE: "DELETE",
} as const;

export type Action = keyof typeof ACTIONS;

/**
 * Access Control Configuration
 * Defines capabilities for non-admin roles (ADMIN implies full access)
 */
const ROLE_PERMISSIONS: Partial<Record<UserRole, Partial<Record<Resource, Action[]>>>> = {
    SECRETARIA: {
        VEHICULOS: ["CREATE", "READ", "UPDATE"],
        USUARIOS: ["READ"],
        DOCUMENTOS: ["CREATE", "READ", "UPDATE", "DELETE"], // Secretaria can manage docs
        VINCULACIONES: ["CREATE", "READ", "UPDATE"],
        REPORTES: ["READ"],
        ALERTAS: ["READ"],
        FINANCIERO: ["CREATE", "READ", "UPDATE"],
        MANTENIMIENTO: ["CREATE", "READ", "UPDATE"],
        FUEC: ["CREATE", "READ", "UPDATE"],
        SAFETY: ["CREATE", "READ", "UPDATE"],
    },
    CONDUCTOR: {
        USUARIOS: ["READ", "UPDATE"], // Own profile
        VEHICULOS: ["READ"], // Own vehicles
        CERTIFICADOS: ["CREATE", "READ", "UPDATE", "DELETE"], // Own
        EXPERIENCIA: ["CREATE", "READ", "UPDATE", "DELETE"], // Own
        REFERENCIAS: ["CREATE", "READ", "UPDATE", "DELETE"], // Own
        REPORTES: ["READ"], // Own
        ALERTAS: ["READ"], // Own
    },
    PROPIETARIO: {
        USUARIOS: ["READ", "UPDATE"], // Own profile
        VEHICULOS: ["READ"], // Own vehicles
        REPORTES: ["READ"], // Own
        ALERTAS: ["READ"], // Own
    },
};

/**
 * Checks if a user has permission to perform an action on a resource.
 * Note: This checks ROLE capability. Ownership checks (READ_OWN) must be handled by logic inside the action/query.
 */
export function hasPermission(
    role: string | undefined,
    resource: Resource,
    action: Action,
): boolean {
    if (!role) return false;
    if (role === ROLES.ADMIN) return true;

    const permissions = ROLE_PERMISSIONS[role as UserRole];
    if (!permissions) return false;

    const resourcePerms = permissions[resource];
    if (!resourcePerms) return false;

    return resourcePerms.includes(action);
}

/**
 * Helper to standardise unauthorized responses in Server Actions
 */
export function unauthorizedResponse() {
    return {
        success: false,
        error: "No tiene permisos para realizar esta acción",
    };
}
