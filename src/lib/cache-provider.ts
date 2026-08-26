import logger from "./logger";
import Redis from "ioredis";

export interface ICacheProvider {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
    del(key: string): Promise<void>;
    delByTag(tag: string): Promise<void>;
}

class MemoryCacheProvider implements ICacheProvider {
    private cache = new Map<string, { value: unknown; expires: number }>();
    private tags = new Map<string, Set<string>>();

    async get<T>(key: string): Promise<T | null> {
        const item = this.cache.get(key);
        if (!item) return null;
        if (Date.now() > item.expires) {
            this.cache.delete(key);
            return null;
        }
        return item.value as T;
    }

    async set<T>(
        key: string,
        value: T,
        ttlSeconds: number = 3600,
    ): Promise<void> {
        this.cache.set(key, {
            value,
            expires: Date.now() + ttlSeconds * 1000,
        });

        if (key.includes(":")) {
            const tag = key.split(":")[0];
            if (!this.tags.has(tag)) this.tags.set(tag, new Set());
            this.tags.get(tag)!.add(key);
        }
    }

    async del(key: string): Promise<void> {
        this.cache.delete(key);
    }

    async delByTag(tag: string): Promise<void> {
        const keys = this.tags.get(tag);
        if (keys) {
            keys.forEach((key) => this.cache.delete(key));
            this.tags.delete(tag);
            logger.debug({ tag }, "Memory cache invalidated by tag");
        }
    }
}

class RedisCacheProvider implements ICacheProvider {
    private redis: Redis;

    constructor() {
        const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
        this.redis = new Redis(redisUrl, {
            maxRetriesPerRequest: 3,
            lazyConnect: true,
            retryStrategy: (times) => times > 3 ? null : Math.min(times * 50, 2000),
        });

        this.redis.on("error", () => {});
        this.redis.on("connect", () => logger.info("Redis Connected"));
    }

    async get<T>(key: string): Promise<T | null> {
        if (this.redis.status !== "ready") return null;
        const data = await this.redis.get(key);
        if (!data) return null;
        try {
            return JSON.parse(data) as T;
        } catch {
            return data as unknown as T;
        }
    }

    async set<T>(
        key: string,
        value: T,
        ttlSeconds: number = 3600,
    ): Promise<void> {
        const data = JSON.stringify(value);
        await this.redis.set(key, data, "EX", ttlSeconds);

        // Tagging logic for Redis: we store keys in a set named 'tag:{tagName}'
        if (key.includes(":")) {
            const tag = key.split(":")[0];
            await this.redis.sadd(`tag:${tag}`, key);
            await this.redis.expire(`tag:${tag}`, 86400); // 24h safety expiry
        }
    }

    async del(key: string): Promise<void> {
        await this.redis.del(key);
    }

    async delByTag(tag: string): Promise<void> {
        const tagKey = `tag:${tag}`;
        const keys = await this.redis.smembers(tagKey);
        if (keys && keys.length > 0) {
            await this.redis.del(...keys, tagKey);
            logger.debug(
                { tag, count: keys.length },
                "Redis cache invalidated by tag",
            );
        }
    }
}

// Global instance to persist in development
const globalForCache = globalThis as unknown as {
    cacheProvider: ICacheProvider | undefined;
};

const createProvider = (): ICacheProvider => {
    if (process.env.CACHE_PROVIDER === "REDIS") {
        return new RedisCacheProvider();
    }
    return new MemoryCacheProvider();
};

export const cacheProvider: ICacheProvider =
    globalForCache.cacheProvider ?? createProvider();

if (process.env.NODE_ENV !== "production")
    globalForCache.cacheProvider = cacheProvider;
