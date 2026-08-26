"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { ActionResult } from "@/types";

/**
 * Server Action para manejar el inicio de sesión
 */
export async function loginAction(formData: FormData): Promise<ActionResult> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { success: false, error: "Email y contraseña son requeridos" };
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard",
        });
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { success: false, error: "Credenciales inválidas" };
                default:
                    return { success: false, error: "Algo salió mal" };
            }
        }
        // Next.js redirect throws a special error, we must re-throw it
        throw error;
    }
}
