import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cacheProvider } from "@/lib/cache-provider";

export const dynamic = "force-dynamic";

interface HealthCheckResult {
    status: "healthy" | "degraded" | "unhealthy";
    timestamp: string;
    uptime: number;
    checks: {
        database: {
            status: "up" | "down";
            responseTime?: number;
            error?: string;
        };
        cache: {
            status: "up" | "down";
            type: "memory" | "redis";
            error?: string;
        };
    };
    version: string;
    environment: string;
}

/**
 * Enhanced Health Check Endpoint
 * GET /api/health
 *
 * Returns comprehensive health status including:
 * - Database connectivity
 * - Cache system status
 * - Application uptime
 * - System version
 */
export async function GET() {
    const startTime = Date.now();
    const result: HealthCheckResult = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        checks: {
            database: {
                status: "down",
            },
            cache: {
                status: "down",
                type: "memory",
            },
        },
        version: process.env.npm_package_version || "0.1.0",
        environment: process.env.NODE_ENV || "development",
    };

    // Check Database
    try {
        const dbStart = Date.now();
        await prisma.$queryRaw`SELECT 1`;
        const dbEnd = Date.now();

        result.checks.database = {
            status: "up",
            responseTime: dbEnd - dbStart,
        };
    } catch (error) {
        result.checks.database = {
            status: "down",
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown database error",
        };
        result.status = "unhealthy";
    }

    // Check Cache
    try {
        const testKey = "health:check:test";
        const testValue = { timestamp: Date.now() };

        // Test write
        await cacheProvider.set(testKey, testValue, 10);

        // Test read
        const retrieved = await cacheProvider.get(testKey);

        // Test delete
        await cacheProvider.del(testKey);

        result.checks.cache = {
            status: retrieved !== null ? "up" : "down",
            type: process.env.REDIS_URL ? "redis" : "memory",
        };

        if (retrieved === null) {
            result.status =
                result.status === "unhealthy" ? "unhealthy" : "degraded";
        }
    } catch (error) {
        result.checks.cache = {
            status: "down",
            type: process.env.REDIS_URL ? "redis" : "memory",
            error:
                error instanceof Error ? error.message : "Unknown cache error",
        };
        result.status =
            result.status === "unhealthy" ? "unhealthy" : "degraded";
    }

    const statusCode =
        result.status === "healthy"
            ? 200
            : result.status === "degraded"
              ? 200
              : 503;

    return NextResponse.json(result, {
        status: statusCode,
        headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "X-Response-Time": `${Date.now() - startTime}ms`,
        },
    });
}
