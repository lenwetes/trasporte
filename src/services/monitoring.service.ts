/**
 * System Monitoring Service
 * Provides utilities for monitoring system health and performance
 */

import logger from "@/lib/logger";

export interface HealthStatus {
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

export class MonitoringService {
    private static getHealthCheckUrl() {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.coopetraes.com";
        return `${baseUrl}/api/health`;
    }
    private static checkInterval = 60000; // 1 minute
    private static alertThreshold = 3; // Alert after 3 consecutive failures
    private static consecutiveFailures = 0;

    /**
     * Check system health
     */
    static async checkHealth(): Promise<HealthStatus | null> {
        try {
            const response = await fetch(this.getHealthCheckUrl(), {
                cache: "no-store",
            });

            if (!response.ok) {
                logger.warn(
                    { status: response.status },
                    "Health check returned non-OK status",
                );
            }

            const health: HealthStatus = await response.json();
            return health;
        } catch (error) {
            logger.error({ error }, "Failed to check system health");
            return null;
        }
    }

    /**
     * Start continuous health monitoring (server-side only)
     */
    static startMonitoring(
        onStatusChange?: (status: HealthStatus | null) => void,
    ): NodeJS.Timeout | null {
        // Only run on server
        if (typeof window !== "undefined") {
            logger.warn("Monitoring can only run on server-side");
            return null;
        }

        logger.info("Starting health monitoring");

        const interval = setInterval(async () => {
            const health = await this.checkHealth();

            if (!health || health.status === "unhealthy") {
                this.consecutiveFailures++;

                if (this.consecutiveFailures >= this.alertThreshold) {
                    logger.error(
                        {
                            consecutiveFailures: this.consecutiveFailures,
                            health,
                        },
                        "ALERT: System health check failing",
                    );

                    // Trigger alert callback
                    if (onStatusChange) {
                        onStatusChange(health);
                    }
                }
            } else {
                // Reset counter on success
                if (this.consecutiveFailures > 0) {
                    logger.info("System health recovered");
                }
                this.consecutiveFailures = 0;
            }

            // Log health status
            logger.debug({ health }, "Health check completed");
        }, this.checkInterval);

        return interval;
    }

    /**
     * Stop monitoring
     */
    static stopMonitoring(interval: NodeJS.Timeout): void {
        clearInterval(interval);
        logger.info("Stopped health monitoring");
    }

    /**
     * Get current system metrics
     */
    static async getMetrics(): Promise<{
        uptime: number;
        memoryUsage: NodeJS.MemoryUsage;
        cpuUsage: NodeJS.CpuUsage;
    }> {
        return {
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            cpuUsage: process.cpuUsage(),
        };
    }

    /**
     * Log system metrics
     */
    static async logMetrics(): Promise<void> {
        const metrics = await this.getMetrics();
        const memoryMB = {
            rss: Math.round(metrics.memoryUsage.rss / 1024 / 1024),
            heapTotal: Math.round(metrics.memoryUsage.heapTotal / 1024 / 1024),
            heapUsed: Math.round(metrics.memoryUsage.heapUsed / 1024 / 1024),
            external: Math.round(metrics.memoryUsage.external / 1024 / 1024),
        };

        logger.info(
            {
                uptime: Math.round(metrics.uptime),
                memory: memoryMB,
                cpu: metrics.cpuUsage,
            },
            "System metrics",
        );
    }
}
