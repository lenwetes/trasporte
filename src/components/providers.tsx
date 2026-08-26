"use client";

import { SessionProvider } from "next-auth/react";
import { SessionValidator } from "./session-validator";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider refetchInterval={60} refetchOnWindowFocus={true}> <SessionValidator>{children}</SessionValidator>
        </SessionProvider>
    );
}
