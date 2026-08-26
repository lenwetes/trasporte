import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

/**
 * Conexión para BullMQ.
 * Solo se instancia si REDIS_URL está configurada.
 * Si no, exportamos undefined y las colas deben estar desactivadas.
 */
let connection: Redis | undefined;

if (redisUrl) {
    connection = new Redis(redisUrl, {
        maxRetriesPerRequest: null, // Obligatorio para BullMQ
        lazyConnect: true,
    });
    // Silencio total — BullMQ maneja sus propios reintentos
    connection.on("error", () => {});
}

export { connection };
