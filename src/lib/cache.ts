/**
 * @module cache
 * @description Capa de caché resiliente con ioredis.
 *
 * REGLA: Redis SOLO se instancia si la variable REDIS_URL está explícitamente
 * configurada en el entorno. Sin ella, todos los métodos operan en modo "noop"
 * (sin caché, consultando directamente la base de datos) para eliminar el spam
 * de AggregateError/ECONNREFUSED en entornos de desarrollo sin Redis activo.
 */
import type Redis from "ioredis";

// ─── Singleton global (evita nuevas instancias en HMR de Next.js) ────────────
const globalForRedis = global as unknown as {
    redis: Redis | undefined;
};

/**
 * Crea la instancia de Redis SOLO si REDIS_URL está configurada.
 * Retorna `undefined` en caso contrario, habilitando el modo noop.
 */
const createRedisInstance = (): Redis | undefined => {
    // ← GUARDIA PRINCIPAL: sin REDIS_URL no tocamos ioredis
    if (!process.env.REDIS_URL) {
        return undefined;
    }

    try {
        // Importación dinámica para que ioredis no se evalúe si no hay URL
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { default: Redis } = require("ioredis") as { default: typeof import("ioredis").default };

        const instance = new Redis(process.env.REDIS_URL, {
            lazyConnect: true,
            maxRetriesPerRequest: 1,
            retryStrategy(times: number) {
                if (times > 3) return null; // Falla rápido
                return Math.min(times * 100, 1000);
            },
        });

        // Silencio total de errores de red para no ensuciar la consola
        instance.on("error", () => {});

        return instance;
    } catch {
        return undefined;
    }
};

export const redis: Redis | undefined =
    globalForRedis.redis ?? createRedisInstance();

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

// ─── Métodos de caché tipados (noop automático si redis es undefined) ─────────

export const cache = {
    async get<T>(key: string): Promise<T | null> {
        if (!redis || redis.status !== "ready") return null;
        try {
            const data = await redis.get(key);
            if (!data) return null;
            return JSON.parse(data) as T;
        } catch {
            return null;
        }
    },

    async set(key: string, value: unknown, ttlSeconds: number = 1800): Promise<void> {
        if (!redis || redis.status !== "ready") return;
        try {
            await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
        } catch {
            // noop en offline
        }
    },

    async del(key: string): Promise<void> {
        if (!redis || redis.status !== "ready") return;
        try {
            await redis.del(key);
        } catch {
            // noop en offline
        }
    },

    async delPrefix(prefix: string): Promise<void> {
        if (!redis || redis.status !== "ready") return;
        try {
            const keys = await redis.keys(`${prefix}*`);
            if (keys.length > 0) await redis.del(...keys);
        } catch {
            // noop en offline
        }
    },

    async remember<T>(key: string, ttlSeconds: number, fn: () => Promise<T>): Promise<T> {
        const cached = await this.get<T>(key);
        if (cached !== null) return cached;
        const fresh = await fn();
        await this.set(key, fresh, ttlSeconds);
        return fresh;
    },
};

// ─── CacheService: alias conveniente ─────────────────────────────────────────

export const CacheService = {
    invalidate: (prefix: string) => cache.delPrefix(prefix),
    remember: <T>(key: string, ttl: number, fn: () => Promise<T>) => cache.remember(key, ttl, fn),
    get: cache.get.bind(cache),
    set: cache.set.bind(cache),
    del: cache.del.bind(cache),
    delete: cache.del.bind(cache),
    delPrefix: cache.delPrefix.bind(cache),

    /** Obtiene la configuración global con caché (TTL 30 min) */
    async getConfig() {
        const { prisma } = await import("@/lib/prisma");
        return cache.remember("config:global", 1800, async () =>
            prisma.configuracionGlobal.findFirst(),
        );
    },

    /** Obtiene una cuenta contable por código con caché (TTL 60 min) */
    async getAccountByCode(codigo: string) {
        const { prisma } = await import("@/lib/prisma");
        return cache.remember(`finance:account:${codigo}`, 3600, async () =>
            prisma.cuentaContable.findUnique({ where: { codigo } }),
        );
    },
};
