import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { LoginSchema } from "@/lib/validations";
import { verify } from "argon2";
import { type JWT } from "next-auth/jwt"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { authConfig } from "./auth.config";
import logger from "@/lib/logger";

declare module "next-auth" {
    interface User {
        rol?: string;
    }
    interface Session {
        user: {
            id: string;
            rol?: string;
            lastIp?: string;
            lastUserAgent?: string;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        rol?: string;
        image?: string | null;
        lastIp?: string;
        lastUserAgent?: string;
    }
}

import { AuditService } from "@/services/audit.service";
import { headers } from "next/headers";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                console.log("LOGIN_DEBUG: Inicia authorize para", credentials?.email);
                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email: rawEmail, password } = validatedFields.data;
                    const email = rawEmail.toLowerCase();

                    const user = await prisma.usuario.findUnique({
                        where: {
                            email,
                            activo: true, // Block inactive users
                        },
                        include: { fotoPerfil: true },
                    });

                    if (!user) {
                        console.log("LOGIN_DEBUG: Usuario no encontrado:", email);
                        return null;
                    }

                    if (!user.passwordHash) {
                        console.log("LOGIN_DEBUG: Usuario sin hash de password");
                        return null;
                    }

                    const passwordsMatch = await verify(
                        user.passwordHash,
                        password,
                    );

                    console.log("LOGIN_DEBUG: Coincidencia de password:", passwordsMatch);

                    if (passwordsMatch)
                        return {
                            id: user.id,
                            email: user.email,
                            name: `${user.nombres} ${user.apellidos}`,
                            rol: user.rol,
                            image: user.fotoPerfil
                                ? `/api/files/${user.fotoPerfil.nombreUnico}`
                                : null,
                        };
                } else {
                    console.log("LOGIN_DEBUG: Error de validación Zod:", validatedFields.error.format());
                }

                return null;
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.rol && session.user) {
                session.user.rol = token.rol as string;
            }

            if (token.image && session.user) {
                session.user.image = token.image;
            }

            if (token.lastIp && session.user) {
                session.user.lastIp = token.lastIp as string;
            }

            if (token.lastUserAgent && session.user) {
                session.user.lastUserAgent = token.lastUserAgent as string;
            }

            return session;
        },
        async jwt({ token, user }) {
            // Initial sign in - Capturamos los datos una sola vez
            if (user) {
                token.rol = (user as { rol?: string }).rol;
                token.image = user.image;

                // Capturar metadatos SOLO al iniciar sesión para evitar errores de
                // "Cookies can only be modified in a Server Action or Route Handler"
                const headersList = await headers();
                token.lastIp =
                    headersList.get("x-forwarded-for") || "127.0.0.1";
                token.lastUserAgent =
                    headersList.get("user-agent") || "Desconocido";

                return token;
            }

            // For subsequent requests, validate the user still exists
            if (!token.sub) {
                logger.warn("JWT: No subject in token");
                throw new Error("Invalid token");
            }

            try {
                const existingUser = await prisma.usuario.findUnique({
                    where: {
                        id: token.sub,
                        activo: true,
                    },
                });

                if (!existingUser) {
                    logger.warn(
                        { userId: token.sub },
                        "JWT: User not found or inactive - returning null to invalidate session",
                    );
                    return null;
                }

                // Sincronizamos el rol
                token.rol = existingUser.rol;

                // Refresh image if not set
                if (!token.image) {
                    const userWithImage = await prisma.usuario.findUnique({
                        where: { id: token.sub },
                        include: { fotoPerfil: true },
                    });
                    token.image = userWithImage?.fotoPerfil
                        ? `/api/files/${userWithImage.fotoPerfil.nombreUnico}`
                        : null;
                }

                return token;
            } catch (error) {
                logger.error({ sub: token.sub, error }, "JWT Callback Error");
                // Throwing an error will invalidate the session
                throw error;
            }
        },
    },
    events: {
        async signIn({ user }) {
            if (user.id) {
                const headersList = await headers();
                const ip = headersList.get("x-forwarded-for") || "127.0.0.1";
                const ua = headersList.get("user-agent");

                await AuditService.registerLogin(user.id, ip, ua);
            }
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 8 * 60 * 60, // 8 hours in seconds
        updateAge: 4 * 60 * 60, // 4 hours in seconds
    },
    jwt: {
        maxAge: 8 * 60 * 60,
    },
});
