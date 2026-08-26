import logger from "./logger";
import { AlertNotification } from "./alerts";

// ─────────────────────────────────────────────────────────────────────────────
// MAIL SERVICE — Usa Pino en lugar de console.log.
// En producción reemplazar el cuerpo de cada función por Nodemailer/Resend/SES.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Envía email de recordatorio de vencimiento a un conductor.
 * @todo Reemplazar el mock por llamada real a Nodemailer/Resend cuando se
 *       configure SMTP en ConfiguracionGlobal.
 */
export async function sendExpirationEmail(
    conductorEmail: string,
    alert: AlertNotification,
) {
    logger.info(
        {
            recipient: conductorEmail,
            tipo: alert.tipo,
            placa: alert.vehiculoPlaca,
            daysUntilExpiry: alert.daysUntilExpiry,
        },
        "[MAIL MOCK] Recordatorio de vencimiento pendiente de envío",
    );

    // Simula latencia de red
    await new Promise((resolve) => setTimeout(resolve, 500));

    return { success: true };
}

/**
 * Procesa un lote de alertas y las registra según su criticidad.
 */
export async function processAlertNotifications(alerts: AlertNotification[]) {
    logger.info({ count: alerts.length }, "[NOTIFIER] Procesando alertas");

    for (const alert of alerts) {
        if (alert.status === "red") {
            logger.warn(
                { placa: alert.vehiculoPlaca, tipo: alert.tipo },
                "[CRITICAL] Documento VENCIDO",
            );
        } else if (alert.status === "yellow") {
            logger.info(
                { placa: alert.vehiculoPlaca, tipo: alert.tipo },
                "[WARNING] Documento próximo a vencer",
            );
        }
    }
}

/**
 * Mock de email de bienvenida para nuevos usuarios.
 * @todo Reemplazar por implementación real cuando SMTP esté configurado.
 */
export async function sendWelcomeEmail(
    userEmail: string,
    temporaryPassword?: string,
) {
    logger.info(
        { recipient: userEmail, hasTemporaryPassword: !!temporaryPassword },
        "[MAIL MOCK] Email de bienvenida pendiente de envío",
    );
    return { success: true };
}
