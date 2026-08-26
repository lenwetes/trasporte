import { MonitoringService } from "../src/services/monitoring.service";
import logger from "../src/lib/logger";

/**
 * Monitoring Script
 * Starts continuous health monitoring and metrics logging
 */

async function main() {
    logger.info("🔍 Starting Coopetraes Monitoring Service");

    // Start health monitoring
    const healthInterval = MonitoringService.startMonitoring((health) => {
        if (!health || health.status === "unhealthy") {
            logger.error({ health }, "🚨 CRITICAL ALERT: System is unhealthy!");

            // TODO: Add notification integrations here
            // - Send email
            // - Send Slack message
            // - Trigger PagerDuty
            // - etc.
        } else if (health.status === "degraded") {
            logger.warn({ health }, "⚠️  WARNING: System is degraded");
        }
    });

    if (!healthInterval) {
        logger.error("Failed to start health monitoring");
        process.exit(1);
    }

    // Log system metrics every 5 minutes
    const metricsInterval = setInterval(
        async () => {
            await MonitoringService.logMetrics();
        },
        5 * 60 * 1000,
    );

    // Log initial metrics
    await MonitoringService.logMetrics();

    // Graceful shutdown
    const shutdown = () => {
        logger.info("🛑 Shutting down monitoring service");

        if (healthInterval) {
            MonitoringService.stopMonitoring(healthInterval);
        }

        if (metricsInterval) {
            clearInterval(metricsInterval);
        }

        process.exit(0);
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

    logger.info("✅ Monitoring service started successfully");
    logger.info("   - Health checks: every 60 seconds");
    logger.info("   - Metrics logging: every 5 minutes");
}

main().catch((error) => {
    logger.error({ error }, "Fatal error in monitoring service");
    process.exit(1);
});
