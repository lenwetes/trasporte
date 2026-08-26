import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import { Siniestro, InvestigacionSiniestro } from "@prisma/client";
import { CacheService } from "@/lib/cache";

export class IndicadoresService {
    static async getSafetyKPIs(year: number): Promise<ActionResult> {
        return await CacheService.remember(`safety:kpis:${year}`, 1800, async () => {
            try {
                const startOfYear = new Date(year, 0, 1);
                const endOfYear = new Date(year, 11, 31, 23, 59, 59);

                const siniestros = await prisma.siniestro.findMany({
                    where: {
                        fecha: { gte: startOfYear, lte: endOfYear },
                    },
                    include: {
                        investigacion: true,
                    },
                });

                const totalSiniestros = siniestros.length;
                const totalDiasPerdidos = siniestros.reduce(
                    (
                        acc: number,
                        s: Siniestro & {
                            investigacion: InvestigacionSiniestro | null;
                        },
                    ) => acc + (s.investigacion?.diasPerdidos || 0),
                    0,
                );

                // Constante K para Colombia (generalmente 240.000 horas hombre o según norma)
                const K = 240000;
                const totalConductores = await prisma.usuario.count({
                    where: { rol: "CONDUCTOR", activo: true },
                });
                const horasHombreEstimadas = totalConductores * 240 * 12;

                const IF =
                    horasHombreEstimadas > 0
                        ? (totalSiniestros * K) / horasHombreEstimadas
                        : 0;
                const IS =
                    horasHombreEstimadas > 0
                        ? (totalDiasPerdidos * K) / horasHombreEstimadas
                        : 0;

                return {
                    success: true,
                    data: {
                        periodo: year,
                        totalSiniestros,
                        totalDiasPerdidos,
                        frecuencia: Number(IF.toFixed(2)),
                        severidad: Number(IS.toFixed(2)),
                        porGravedad: {
                            soloDanos: siniestros.filter(
                                (s: Siniestro) => s.gravedad === "SOLO_DANOS",
                            ).length,
                            conHeridos: siniestros.filter(
                                (s: Siniestro) => s.gravedad === "CON_HERIDOS",
                            ).length,
                            mortal: siniestros.filter(
                                (s: Siniestro) => s.gravedad === "MORTAL",
                            ).length,
                        },
                    },
                };
            } catch (error) {
                logger.error(
                    { year, error },
                    "IndicadoresService.getSafetyKPIs error",
                );
                return { success: false, error: "Error al calcular indicadores"  };
            }
        });
    }

    /**
     * Get consolidated operational risk data for heatmap
     */
    static async getOperationalRiskHeatmap(): Promise<ActionResult> {
        return await CacheService.remember("safety:risk:heatmap", 600, async () => {
            try {
                const now = new Date();
                const twelveMonthsAgo = new Date();
                twelveMonthsAgo.setMonth(now.getMonth() - 11);
                twelveMonthsAgo.setDate(1);
                twelveMonthsAgo.setHours(0, 0, 0, 0);

                const [siniestros, preops, docs, multas] = await Promise.all([
                    prisma.siniestro.findMany({
                        where: { fecha: { gte: twelveMonthsAgo } },
                        select: { fecha: true, gravedad: true },
                    }),
                    prisma.preoperacional.findMany({
                        where: {
                            fecha: { gte: twelveMonthsAgo },
                            resultado: "RECHAZADO",
                        },
                        select: { fecha: true },
                    }),
                    prisma.documentoVehiculo.findMany({
                        where: {
                            fechaVencimiento: { gte: twelveMonthsAgo, lte: now },
                            estadoAlerta: "VENCIDO",
                        },
                        select: { fechaVencimiento: true },
                    }),
                    prisma.novedad.findMany({
                        where: {
                            fecha: { gte: twelveMonthsAgo },
                            tipo: "MULTA",
                        },
                        select: { fecha: true },
                    }),
                ]);

                const months = [
                    "Ene",
                    "Feb",
                    "Mar",
                    "Abr",
                    "May",
                    "Jun",
                    "Jul",
                    "Ago",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dic",
                ];

                type RiskItem = {
                    fecha?: Date | string;
                    fechaVencimiento?: Date | string;
                    gravedad?: string;
                    [key: string]: unknown;
                };

                interface RiskCategory {
                    id: string;
                    label: string;
                    data: RiskItem[];
                    dateKey: string;
                    weight: (item: RiskItem) => number;
                }

                const categories: RiskCategory[] = [
                    {
                        id: "ACCIDENTALIDAD",
                        label: "Accidentalidad",
                        data: siniestros as unknown as RiskItem[],
                        dateKey: "fecha",
                        weight: (item: RiskItem) => {
                            return item.gravedad === "MORTAL"
                                ? 10
                                : item.gravedad === "CON_HERIDOS"
                                  ? 5
                                  : 2;
                        },
                    },
                    {
                        id: "FALLAS_CRITICAS",
                        label: "Fallas Mecánicas",
                        data: preops as unknown as RiskItem[],
                        dateKey: "fecha",
                        weight: () => 3,
                    },
                    {
                        id: "DOCUMENTACION",
                        label: "Documentos Vencidos",
                        data: docs as unknown as RiskItem[],
                        dateKey: "fechaVencimiento",
                        weight: () => 2,
                    },
                    {
                        id: "INFRACCIONES",
                        label: "Infracciones (Multas)",
                        data: multas as unknown as RiskItem[],
                        dateKey: "fecha",
                        weight: () => 4,
                    },
                ];

                const result = categories.map((cat) => ({
                    name: cat.label,
                    data: Array.from({ length: 12 }).map((_, i) => {
                        const monthDate = new Date();
                        monthDate.setMonth(now.getMonth() - (11 - i));
                        const monthIndex = monthDate.getMonth();
                        const year = monthDate.getFullYear();

                        const filtered = cat.data.filter((item) => {
                            const val = item[cat.dateKey];
                            const d = new Date(val as string | Date);
                            return (
                                d.getMonth() === monthIndex &&
                                d.getFullYear() === year
                            );
                        });

                        const intensity = filtered.reduce(
                            (acc: number, item) => acc + cat.weight(item),
                            0,
                        );

                        return {
                            x: months[monthIndex],
                            y: intensity,
                            count: filtered.length,
                        };
                    }),
                }));

                return { success: true, data: result };
            } catch (error) {
                logger.error(
                    error,
                    "IndicadoresService.getOperationalRiskHeatmap error",
                );
                return {
                    success: false,
                    error: "Error al generar heatmap de riesgos",
                };
            }
        });
    }
}
