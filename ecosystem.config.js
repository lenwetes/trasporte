module.exports = {
    apps: [
        {
            name: "coopetraes-app",
            script: "node_modules/next/dist/bin/next",
            args: "start",
            cwd: process.cwd(),
            instances: "max",
            exec_mode: "cluster",
            env: {
                NODE_ENV: "production",
                PORT: 3000,
            },
            error_file: "./logs/pm2-error.log",
            out_file: "./logs/pm2-out.log",
            log_date_format: "YYYY-MM-DD HH:mm:ss Z",
            merge_logs: true,
            autorestart: true,
            max_memory_restart: "1G",
            watch: false,
            // Configuración de reinicio en caso de fallo
            min_uptime: "10s",
            max_restarts: 10,
            // Tiempo de espera antes de forzar el cierre
            kill_timeout: 5000,
            // Tiempo de espera para que la aplicación esté lista
            listen_timeout: 10000,
            // Variables de entorno adicionales para producción
            env_production: {
                NODE_ENV: "production",
                PORT: 3000,
            },
            // Variables de entorno para staging
            env_staging: {
                NODE_ENV: "production",
                PORT: 3001,
            },
        },
    ],
};
