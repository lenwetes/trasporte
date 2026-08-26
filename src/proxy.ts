import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import logger from "@/lib/logger";

const { auth } = NextAuth(authConfig);

// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; startTime: number }>();

export default auth(async (req) => {
    // 1. Rate Limiting Strategy
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";

    // Increased limit to 1000 to avoid blocking legit dashboard traffic
    const limit = 1000;
    const windowMs = 60 * 1000;

    if (!rateLimit.has(ip)) {
        rateLimit.set(ip, { count: 0, startTime: Date.now() });
    }

    const currentUsage = rateLimit.get(ip)!;
    const now = Date.now();

    // Reset window
    if (now - currentUsage.startTime > windowMs) {
        currentUsage.count = 1;
        currentUsage.startTime = now;
    } else {
        currentUsage.count += 1;
    }

    if (currentUsage.count > limit) {
        logger.warn(
            {
                ip,
                count: currentUsage.count,
                path: req.nextUrl.pathname,
                method: req.method,
            },
            "Rate limit exceeded - Request blocked",
        );
        return new NextResponse("Too Many Requests", {
            status: 429,
            headers: {
                "Retry-After": "60",
                "Content-Type": "text/plain",
            },
        });
    }

    return;
});

export const config = {
    // Exclude API, static files, and common asset extensions from middleware
    // Refined to exclude more common developer assets and fonts
    matcher: [
        "/((?!api|_next/static|_next/image|manifest.json|favicon.ico|robots.txt|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico|woff2?|ttf|otf|css|js|map)$).*)",
    ],
};
