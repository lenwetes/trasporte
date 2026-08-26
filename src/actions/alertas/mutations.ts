"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/actions/audit";
import { ActionResult } from "@/types";
import { withAuth } from "@/lib/safe-action";
import { AlertsService } from "@/services/alerts.service";
import { Session } from "next-auth";

/**
 * Create or update alert rule
 */
export const upsertReglaAlerta = withAuth(
    async (session: Session, dataInput: unknown): Promise<ActionResult> => {
        const data = dataInput as {
            tipoDocumento: string;
            diasAnticipacion: number;
            activo: boolean;
        };

        const regla = await prisma.reglaAlerta.upsert({
            where: { tipoDocumento: data.tipoDocumento },
            update: {
                diasAnticipacion: data.diasAnticipacion,
                activo: data.activo,
            },
            create: {
                tipoDocumento: data.tipoDocumento,
                diasAnticipacion: data.diasAnticipacion,
                activo: data.activo,
            },
        });

        await createAuditLog(
            session.user.id,
            "ACTUALIZAR",
            "ReglaAlerta",
            regla.id,
            `Configuración de alerta para ${data.tipoDocumento} (${data.diasAnticipacion} días)`,
        );

        revalidatePath("/dashboard");
        return { success: true, data: regla };
    },
    "upsertReglaAlerta",
);

/**
 * Trigger manual fleet audit of alerts
 */
export const triggerAlertSync = withAuth(
    async (session: Session, _data: unknown): Promise<ActionResult> => {
        try {
            const results = await AlertsService.triggerUpdate();
            
            await createAuditLog(
                session.user.id,
                "ACTUALIZAR",
                "AlertaVencimiento",
                null,
                `Sincronización manual de motor de alertas. Resultados: ${results.vencidos} vencidos, ${results.porVencer} por vencer`,
            );

            revalidatePath("/dashboard");
            return { 
                success: true, 
                message: "Sincronización de alertas completada exitosamente.",
                data: results 
            };
        } catch (error) {
            console.error("Error in triggerAlertSync:", error);
            return { success: false, error: "Fallo al sincronizar sensores de flota" };
        }
    },
    "triggerAlertSync"
);
