"use client";

import { signOut } from "next-auth/react";

/**
 * Hook para manejar el cierre de sesión de forma segura
 * Asegura que se limpien las cookies y se redirija correctamente
 */
export const logoutAction = async () => {
    try {
        await signOut({
            callbackUrl: "/login",
            redirect: true,
        });
        // Forzar limpieza local si signOut no redirige inmediatamente
        window.location.href = "/login";
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        window.location.href = "/login";
    }
};
