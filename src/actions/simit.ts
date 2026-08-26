"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/actions/audit";
import { ActionResult } from "@/types";
import { withAuth } from "@/lib/safe-action";
import { spawn } from "child_process";
import path from "path";
import { TipoNovedad } from "@prisma/client";

interface SimitComparendo {
    numeroComparendo: string;
    fecha: string;
    infraccion: string;
    valor: number;
    estado: string;
    secretaria?: string;
}

interface SimitScraperResult {
    success: boolean;
    error?: string;
    estadoCuenta: string;
    valorTotal: number;
    numeroComparendos: number;
    comparendos: SimitComparendo[];
}

import { simitQueue } from "@/lib/queue/simit.queue";

/**
 * Acción principal para consultar SIMIT (Encola el trabajo en BullMQ)
 */
export const checkSimitAction = withAuth(
    "ALL",
    async (argsInput: unknown): Promise<ActionResult> => {
        const { id, type, criterio } = argsInput as { id: string, type: 'CONDUCTOR' | 'VEHICULO', criterio: string };
        
        const { auth } = await import("@/auth");
        const session = await auth();
        const userId = session!.user.id;

        try {
            // 1. Crear Registro Inicial en Base de Datos (ConsultaSIMIT) en estado PROCESANDO
            const consulta = await prisma.consultaSIMIT.create({
                data: {
                    conductorId: type === 'CONDUCTOR' ? id : null,
                    vehiculoId: type === 'VEHICULO' ? id : null,
                    criterio,
                    estadoCuenta: "PROCESANDO_EN_SEGUNDO_PLANO",
                    valorTotal: 0,
                    numeroComparendos: 0,
                    detalles: { status: "QUEUED", enqueuedAt: new Date().toISOString() }
                }
            });

            // 2. Encolar el trabajo en BullMQ (solo si Redis está disponible)
            if (!simitQueue) {
                return { success: false, error: "Cola de trabajos no disponible (Redis no configurado)" };
            }

            await simitQueue.add(`simit-query-${consulta.id}`, {
                consultaId: consulta.id,
                criterio,
                type,
                targetId: id,
                requestedBy: userId
            });

            // 3. Log de auditoría de inicio de proceso
            await createAuditLog(
                userId,
                "ACTUALIZAR",
                type === 'CONDUCTOR' ? "USUARIO" : "VEHICULO",
                id,
                `Consulta SIMIT encolada para ${criterio}. ID de Seguimiento: ${consulta.id}`
            );

            // No revalidamos path aquí porque el resultado aún no está listo
            // La UI debe manejar el estado 'PROCESANDO_EN_SEGUNDO_PLANO'

            return { 
                success: true, 
                data: {
                    id: consulta.id,
                    estado: "EN_COLA",
                    mensaje: "La consulta ha sido encolada. El resultado estará disponible en unos minutos."
                } 
            };

        } catch (error) {
            const message = error instanceof Error ? error.message : "Error desconocido";
            console.error("[SIMIT_ACTION] Error al encolar:", message);
            return { success: false, error: "Error al programar la consulta SIMIT" };
        }
    },
    "checkSimitAction"
);

/**
 * Obtener historial de consultas SIMIT
 */
export const getSimitHistory = withAuth(
    "ALL",
    async (args: { id: string, type: 'CONDUCTOR' | 'VEHICULO' }): Promise<ActionResult> => {
        const { id, type } = args;
        const history = await prisma.consultaSIMIT.findMany({
            where: {
                conductorId: type === 'CONDUCTOR' ? id : null,
                vehiculoId: type === 'VEHICULO' ? id : null,
            },
            include: {
                comparendos: true
            },
            orderBy: { fechaConsulta: "desc" }
        });

        return { success: true, data: history };
    },
    "getSimitHistory"
);
