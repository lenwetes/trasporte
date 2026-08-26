import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";

export const dynamic = "force-dynamic"; // Prevent caching

export async function GET() {
    try {
        logger.info("Starting alert status update job...");

        // 1. Get Active Rules
        const rules = await prisma.reglaAlerta.findMany({
            where: { activo: true },
        });
        const today = new Date();

        // 2. Update Documents based on rules
        // This is O(R) queries where R is number of rules (usually < 10)

        for (const rule of rules) {
            const warningDate = new Date(today);
            warningDate.setDate(today.getDate() + rule.diasAnticipacion);

            // a) Mark VENCIDO
            await prisma.documentoVehiculo.updateMany({
                where: {
                    tipo: rule.tipoDocumento,
                    fechaVencimiento: { lt: today },
                },
                data: { estadoAlerta: "VENCIDO"  },
            });

            // b) Mark POR_VENCER
            await prisma.documentoVehiculo.updateMany({
                where: {
                    tipo: rule.tipoDocumento,
                    fechaVencimiento: { gte: today, lte: warningDate },
                },
                data: { estadoAlerta: "POR_VENCER"  },
            });

            // c) Mark OK
            await prisma.documentoVehiculo.updateMany({
                where: {
                    tipo: rule.tipoDocumento,
                    fechaVencimiento: { gt: warningDate },
                },
                data: { estadoAlerta: "OK"  },
            });
        }

        // 3. Aggregate Vehicle Status

        // Find vehicles with at least one VENCIDO document
        const vencidos = await prisma.documentoVehiculo.findMany({
            where: { estadoAlerta: "VENCIDO"  },
            select: { vehiculoId: true },
            distinct: ["vehiculoId"],
        });
        const idsVencidos = vencidos.map((d) => d.vehiculoId);

        // Find vehicles with at least one POR_VENCER document (and NOT in vencidos)
        const porVencer = await prisma.documentoVehiculo.findMany({
            where: {
                estadoAlerta: "POR_VENCER",
                vehiculoId: { notIn: idsVencidos }, // Optimization: Exclude already marked VENCIDO
            },
            select: { vehiculoId: true },
            distinct: ["vehiculoId"],
        });
        const idsPorVencer = porVencer.map((d) => d.vehiculoId);

        // Update Vehicles
        // Set VENCIDO
        if (idsVencidos.length > 0) {
            await prisma.vehiculo.updateMany({
                where: { id: { in: idsVencidos } },
                data: { estadoAlertas: "VENCIDO"  },
            });
        }

        // Set POR_VENCER
        if (idsPorVencer.length > 0) {
            await prisma.vehiculo.updateMany({
                where: { id: { in: idsPorVencer } },
                data: { estadoAlertas: "POR_VENCER"  },
            });
        }

        // Set OK (All others)
        // We exclude VENCIDO and POR_VENCER ids
        await prisma.vehiculo.updateMany({
            where: {
                id: { notIn: [...idsVencidos, ...idsPorVencer] },
            },
            data: { estadoAlertas: "OK"  },
        });

        logger.info(
            { vencidos: idsVencidos.length, porVencer: idsPorVencer.length },
            "Alert update finished",
        );

        return NextResponse.json({
            success: true,
            message: "Alertas actualizadas correctamente",
            stats: {
                vencidos: idsVencidos.length,
                porVencer: idsPorVencer.length,
            },
        });
    } catch (error) {
        logger.error({ error }, "Error updating alerts");
        return NextResponse.json(
            { success: false, error: "Error interno al actualizar alertas"  },
            { status: 500 },
        );
    }
}
