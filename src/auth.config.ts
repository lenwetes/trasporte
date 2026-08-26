import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// This is the Edge-compatible part of the configuration
export const authConfig = {
    trustHost: true,
    secret:
        process.env.AUTH_SECRET ||
        process.env.NEXTAUTH_SECRET ||
        "coopetraes_fallback_auth_secret_32_chars_long",
    providers: [
        // We leave Credentials empty here, it will be handled in the main auth.ts
        Credentials({
            async authorize() {
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
            const isPublicRoute = [
                "/",
                "/login",
                "/registro",
                "/manifest.json",
                "/favicon.ico",
                "/robots.txt",
                "/logo-empresa.png",
            ].includes(nextUrl.pathname);
            const isAuthRoute = ["/login", "/registro"].includes(
                nextUrl.pathname,
            );

            if (isApiAuthRoute) return true;

            if (isAuthRoute) {
                if (isLoggedIn) {
                    return Response.redirect(new URL("/dashboard", nextUrl));
                }
                return true;
            }

            if (!isLoggedIn && !isPublicRoute) {
                return false; // Redirect to login
            }

            return true;
        },
    },
} satisfies NextAuthConfig;
