/**
 * @module alerts.service.ts
 * @description Servicio centralizado de gestión de alertas de vencimiento.
 * Provee consultas optimizadas sobre el estado de documentos y reglas de alerta.
 */
import { prisma } from "@/lib/prisma";
import { cache } from "@/lib/cache";

// ─── Tipos Exportables ────────────────────────────────────────────────────────

export interface AlertaVencimiento {
    id: string;
    vehiculoId: string;
    placa: string;
    marca: string | null;
    tipo: string;
    fechaVencimiento: Date;
    diasRestantes: number;
    estado: "VENCIDO" | "POR_VENCER" | "OK";
    propietario: string | null;
}

export interface ResumenAlertas {
    totalVencidos: number;
    totalPorVencer: number;
    totalOk: number;
    alertas: AlertaVencimiento[];
}

export interface ReglaAlertaData {
    id: string;
    tipoDocumento: string;
    diasAnticipacion: number;
    activo: boolean;
}

// ─── AlertsService ────────────────────────────────────────────────────────────

export const AlertsService = {
    /**
     * Obtiene un resumen de todas las alertas activas, priorizando vencidos y por vencer.
     * TTL de caché: 5 minutos (actualizado por el cron cada hora).
     */
    async getResumen(limite: number = 50): Promise<ResumenAlertas> {
        const cacheKey = `alerts:resumen:${limite}`;
        const cached = await cache.get<ResumenAlertas>(cacheKey);
        if (cached) return cached;

        const today = new Date();

        const documentos = await prisma.documentoVehiculo.findMany({
            where: {
                estadoAlerta: { in: ["VENCIDO", "POR_VENCER"] },
            },
            include: {
                vehiculo: {
                    select: {
                        placa: true,
                        marca: true,
                        propietario: true,
                    },
                },
            },
            orderBy: [
                { estadoAlerta: "asc" }, // VENCIDO primero
                { fechaVencimiento: "asc" },
            ],
            take: limite,
        });

        const [countVencidos, countPorVencer, countOk] = await Promise.all([
            prisma.documentoVehiculo.count({ where: { estadoAlerta: "VENCIDO" } }),
            prisma.documentoVehiculo.count({ where: { estadoAlerta: "POR_VENCER" } }),
            prisma.documentoVehiculo.count({ where: { estadoAlerta: "OK" } }),
        ]);

        const alertas: AlertaVencimiento[] = documentos.map((doc) => {
            const diff = doc.fechaVencimiento.getTime() - today.getTime();
            const diasRestantes = Math.ceil(diff / (1000 * 60 * 60 * 24));
            return {
                id: doc.id,
                vehiculoId: doc.vehiculoId,
                placa: doc.vehiculo.placa,
                marca: doc.vehiculo.marca,
                tipo: doc.tipo,
                fechaVencimiento: doc.fechaVencimiento,
                diasRestantes,
                estado: doc.estadoAlerta as AlertaVencimiento["estado"],
                propietario: doc.vehiculo.propietario,
            };
        });

        const resumen: ResumenAlertas = {
            totalVencidos: countVencidos,
            totalPorVencer: countPorVencer,
            totalOk: countOk,
            alertas,
        };

        await cache.set(cacheKey, resumen, 300); // 5 min TTL
        return resumen;
    },

    /**
     * Obtiene todas las reglas de alerta configuradas.
     */
    async getReglas(): Promise<ReglaAlertaData[]> {
        const cacheKey = "alerts:reglas";
        const cached = await cache.get<ReglaAlertaData[]>(cacheKey);
        if (cached) return cached;

        const reglas = await prisma.reglaAlerta.findMany({
            orderBy: { tipoDocumento: "asc" },
        });

        const data: ReglaAlertaData[] = reglas.map((r) => ({
            id: r.id,
            tipoDocumento: r.tipoDocumento,
            diasAnticipacion: r.diasAnticipacion,
            activo: r.activo,
        }));

        await cache.set(cacheKey, data, 600); // 10 min TTL
        return data;
    },

    /**
     * Crea o actualiza una regla de alerta.
     */
    async upsertRegla(tipoDocumento: string, diasAnticipacion: number, activo: boolean): Promise<ReglaAlertaData> {
        const regla = await prisma.reglaAlerta.upsert({
            where: { tipoDocumento },
            create: { tipoDocumento, diasAnticipacion, activo },
            update: { diasAnticipacion, activo },
        });
        // Invalidar caché
        await cache.del("alerts:reglas");
        return {
            id: regla.id,
            tipoDocumento: regla.tipoDocumento,
            diasAnticipacion: regla.diasAnticipacion,
            activo: regla.activo,
        };
    },

    /**
     * Ejecuta manualmente el motor de actualización de alertas (simplificado).
     * El cron completo está en /api/cron/alerts.
     * Invalida el caché al finalizar.
     */
    async triggerUpdate(): Promise<{ vencidos: number; porVencer: number }> {
        const reglas = await prisma.reglaAlerta.findMany({ where: { activo: true } });
        const today = new Date();

        for (const rule of reglas) {
            const warningDate = new Date(today);
            warningDate.setDate(today.getDate() + rule.diasAnticipacion);

            await prisma.documentoVehiculo.updateMany({
                where: { tipo: rule.tipoDocumento, fechaVencimiento: { lt: today } },
                data: { estadoAlerta: "VENCIDO" },
            });
            await prisma.documentoVehiculo.updateMany({
                where: { tipo: rule.tipoDocumento, fechaVencimiento: { gte: today, lte: warningDate } },
                data: { estadoAlerta: "POR_VENCER" },
            });
            await prisma.documentoVehiculo.updateMany({
                where: { tipo: rule.tipoDocumento, fechaVencimiento: { gt: warningDate } },
                data: { estadoAlerta: "OK" },
            });
        }

        const [vencidos, porVencer] = await Promise.all([
            prisma.documentoVehiculo.count({ where: { estadoAlerta: "VENCIDO" } }),
            prisma.documentoVehiculo.count({ where: { estadoAlerta: "POR_VENCER" } }),
        ]);

        // Invalidar todo el caché de alertas
        await cache.del("alerts:resumen:50");
        await cache.del("alerts:reglas");

        return { vencidos, porVencer };
    },
};
