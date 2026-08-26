import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    turbopack: {
        resolveAlias: {
            "pako/lib/zlib/zstream.js": "pako/lib/zlib/zstream.js",
        },
    },
    serverExternalPackages: ["@react-pdf/renderer"],
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb",
        },
    },
    webpack: (config: any, { isServer }: { isServer: boolean }) => {
        if (isServer) {
            // Forzar bundling de @react-pdf/renderer en el servidor
            // (Next.js lo externalizaría por defecto y rompería el renderizado JSX)
            if (Array.isArray(config.externals)) {
                config.externals = config.externals.map((external: unknown) => {
                    if (typeof external === "function") {
                        return (ctx: { request?: string }, callback: (err?: Error | null, result?: string) => void) => {
                            if (ctx.request?.includes("@react-pdf")) return callback();
                            return (external as (ctx: { request?: string }, callback: (err?: Error | null, result?: string) => void) => void)(ctx, callback);
                        };
                    }
                    return external;
                });
            }
        }
        
        // Resolver problemas de dependencias de @react-pdf/renderer en el cliente
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                path: false,
                stream: false,
                zlib: false,
                canvas: false,
                encoding: false,
            };
        }

        return config;
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "X-DNS-Prefetch-Control",
                        value: "on",
                    },
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "SAMEORIGIN",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "origin-when-cross-origin",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=()",
                    },
                ],
            },
        ];
    },
    async redirects() {
        return [
            {
                source: "/dashboard/configuracion/bancos",
                destination: "/dashboard/finance/settings",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
