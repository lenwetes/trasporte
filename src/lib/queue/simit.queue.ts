import { Queue } from "bullmq";
import { connection } from "./redis-connection";

export type SimitJobData = {
    consultaId: string;
    criterio: string;
    type: 'CONDUCTOR' | 'VEHICULO';
    targetId: string;
    requestedBy: string;
};

export const SIMIT_QUEUE_NAME = "simit-queries";

/**
 * Cola SIMIT.
 * Solo disponible si REDIS_URL está configurado en el entorno.
 * En desarrollo sin Redis, es `undefined` para evitar errores de conexión.
 */
export const simitQueue = connection
    ? new Queue<SimitJobData>(SIMIT_QUEUE_NAME, {
        connection,
        defaultJobOptions: {
            attempts: 3,
            backoff: { type: "exponential", delay: 5000 },
            removeOnComplete: true,
            removeOnFail: false,
        },
    })
    : undefined;
