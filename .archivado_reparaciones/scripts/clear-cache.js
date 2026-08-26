const { Redis } = require("ioredis");

async function main() {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    console.log("Connecting to Redis at:", redisUrl);

    try {
        const redis = new Redis(redisUrl);
        await redis.flushall();
        console.log("Cache cleared successfully (FLUSHALL).");
        await redis.quit();
    } catch (e) {
        console.warn("Redis not available or error clearing cache:", e.message);
        console.log("Assuming memory cache or alternative provider.");
    }
}

main();
