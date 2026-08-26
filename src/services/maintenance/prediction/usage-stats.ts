import { prisma } from "@/lib/prisma";

export class UsageStatsService {
    static async calculateUsageStats(
        vehiculoId: string,
        currentKm: number,
    ): Promise<{ dailyKm: number }> {
        try {
            const firstPreop = await prisma.preoperacional.findFirst({
                where: { vehiculoId },
                orderBy: { fecha: "asc"  },
            });
            if (!firstPreop || !firstPreop.kilometraje) return { dailyKm: 50 };
            const daysDiff =
                (new Date().getTime() - firstPreop.fecha.getTime()) /
                (1000 * 3600 * 24);
            const kmDiff = currentKm - firstPreop.kilometraje;
            return {
                dailyKm: daysDiff > 0 && kmDiff > 0 ? kmDiff / daysDiff : 50,
            };
        } catch (error) {
            return { dailyKm: 50 };
        }
    }
}
