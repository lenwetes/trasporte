"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * Client-side session validator that checks for invalid sessions
 * and forces a clean logout + redirect to login
 */
export function SessionValidator({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        // If session is explicitly unauthenticated and we're not on a public page
        if (status === "unauthenticated" && typeof window !== "undefined") {
            const currentPath = window.location.pathname;
            const publicPaths = ["/", "/login", "/registro"];

            if (!publicPaths.includes(currentPath)) {
                signOut({ callbackUrl: "/login", redirect: true });
            }
        }

        // Check if session exists but user data is missing (corrupted session)
        if (status === "authenticated" && session && !session.user?.id) {
            console.warn("Corrupted session detected - forcing logout");
            signOut({ callbackUrl: "/login", redirect: true });
        }
    }, [status, session, router]);

    return <>{children}</>;
}
