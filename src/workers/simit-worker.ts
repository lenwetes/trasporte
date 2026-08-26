/**
 * @module simit-worker
 * @description Worker de BullMQ para consultas SIMIT.
 * Solo se inicializa si REDIS_URL está configurado en el entorno.
 */
import { Worker, Job } from "bullmq";
import { connection } from "../lib/queue/redis-connection";
import { SIMIT_QUEUE_NAME, SimitJobData } from "../lib/queue/simit.queue";
import { prisma } from "../lib/prisma";
import { spawn } from "child_process";
import path from "path";
import { TipoNovedad } from "@prisma/client";
import logger from "../lib/logger";

interface SimitComparendo {
    numeroComparendo: string;
    fecha: string;
    infraccion: string;
    valor: number;
    estado: string;
    secretaria?: string;
}

interface SimitScraperResult {
    success: boolean;
    error?: string;
    estadoCuenta: string;
    valorTotal: number;
    numeroComparendos: number;
    comparendos: SimitComparendo[];
}

/**
 * Ejecuta el scraper de SIMIT en un subproceso aislado
 */
async function runSimitScraper(criterio: string): Promise<SimitScraperResult> {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(process.cwd(), "src", "lib", "scrapers", "simit-scraper-cli.ts");
        logger.info({ criterio, scriptPath }, "Iniciando scraper SIMIT...");

        const child = spawn("npx", ["tsx", scriptPath], {
            stdio: ["pipe", "pipe", "pipe"],
            shell: true,
            env: { ...process.env, NODE_OPTIONS: "--no-warnings" }
        });

        const chunks: Buffer[] = [];
        const errors: Buffer[] = [];

        child.stdin.write(JSON.stringify({ criterio }));
        child.stdin.end();

        child.stdout.on("data", (chunk) => chunks.push(chunk));
        child.stderr.on("data", (chunk) => errors.push(chunk));

        child.on("close", (code) => {
            if (code !== 0) {
                const errorStr = Buffer.concat(errors).toString();
                logger.error({ code, errorStr }, "Scraper SIMIT falló");
                reject(new Error(`Scraper failed (code ${code}): ${errorStr}`));
                return;
            }
            try {
                const output = Buffer.concat(chunks).toString();
                const result = JSON.parse(output) as SimitScraperResult;
                resolve(result);
            } catch (e) {
                logger.error({ error: e }, "Error al parsear salida del scraper");
                reject(new Error("Failed to parse scraper output"));
            }
        });
    });
}

// ─── Guardia: no inicializar el worker si no hay conexión Redis ──────────────
if (!connection) {
    logger.warn("Worker SIMIT desactivado: REDIS_URL no configurado.");
} else {
    const worker = new Worker<SimitJobData>(
        SIMIT_QUEUE_NAME,
        async (job: Job<SimitJobData>) => {
            const { consultaId, criterio, type, targetId } = job.data;
            logger.info({ jobId: job.id, consultaId, criterio }, "Procesando trabajo SIMIT");

            try {
                const result = await runSimitScraper(criterio);

                if (!result.success) {
                    throw new Error(result.error ?? "Error desconocido en el scraper");
                }

                const consulta = await prisma.consultaSIMIT.update({
                    where: { id: consultaId },
                    data: {
                        estadoCuenta: result.estadoCuenta,
                        valorTotal: result.valorTotal,
                        numeroComparendos: result.numeroComparendos,
                        detalles: result as unknown as import("@prisma/client").Prisma.InputJsonValue,
                        comparendos: {
                            create: result.comparendos.map((c) => ({
                                numeroComparendo: c.numeroComparendo,
                                fecha: new Date(c.fecha),
                                infraccion: c.infraccion,
                                valor: c.valor,
                                estado: c.estado,
                                secretaria: c.secretaria ?? "SIMIT",
                            }))
                        }
                    }
                });

                if (result.numeroComparendos > 0) {
                    await prisma.novedad.create({
                        data: {
                            tipo: TipoNovedad.MULTA,
                            descripcion: `SIMIT detectó ${result.numeroComparendos} comparendos por $${result.valorTotal.toLocaleString()}. Consulta: ${consulta.id}`,
                            fecha: new Date(),
                            monto: result.valorTotal,
                            estado: "PENDIENTE",
                            conductorId: type === "CONDUCTOR" ? targetId : null,
                            vehiculoId: type === "VEHICULO" ? targetId : null,
                            consultaSimitId: consulta.id,
                        }
                    });
                }

                if (type === "CONDUCTOR") {
                    await prisma.usuario.update({
                        where: { id: targetId },
                        data: { ultimaRevisionSimit: new Date() }
                    });
                }

                logger.info({ consultaId, status: "SUCCESS" }, "Consulta SIMIT completada");
                return { success: true, consultaId };

            } catch (error) {
                const message = error instanceof Error ? error.message : "Error desconocido";
                logger.error({ jobId: job.id, error: message }, "Fallo en el trabajador SIMIT");

                await prisma.consultaSIMIT.update({
                    where: { id: consultaId },
                    data: { estadoCuenta: "ERROR_SISTEMA" }
                }).catch(() => {});

                throw error;
            }
        },
        {
            connection,
            concurrency: 2,
        }
    );

    worker.on("completed", (job) => {
        logger.info({ jobId: job.id }, "Trabajo SIMIT completado exitosamente");
    });

    worker.on("failed", (job, err) => {
        logger.error({ jobId: job?.id, error: err.message }, "Trabajo SIMIT falló definitivamente");
    });

    logger.info(`🚀 Trabajador SIMIT iniciado (Queue: ${SIMIT_QUEUE_NAME})`);
}
