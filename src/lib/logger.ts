import pino, { Logger } from "pino";

const globalForLogger = globalThis as unknown as {
    logger: Logger | undefined;
};

const createLogger = () => {
    return pino({
        level: process.env.NODE_ENV === "development" ? "debug" : "info",
        transport:
            process.env.NODE_ENV === "development"
                ? {
                      target: "pino-pretty",
                      options: {
                          colorize: true,
                          ignore: "pid,hostname",
                          translateTime: "SYS:standard",
                      },
                  }
                : process.env.PINO_LOG_TARGET
                  ? {
                        target: process.env.PINO_LOG_TARGET,
                        options: {
                            level: process.env.LOG_LEVEL || "info",
                        },
                    }
                  : undefined,
    });
};

const logger = globalForLogger.logger ?? createLogger();

if (process.env.NODE_ENV !== "production") globalForLogger.logger = logger;

export default logger;
