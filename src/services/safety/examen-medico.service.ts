import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import {
    ExamenMedicoCreate,
    ExamenMedicoUpdate,
} from "@/lib/validations/safety";

export class ExamenMedicoService {
    static async create(data: ExamenMedicoCreate): Promise<ActionResult> {
        try {
            const examen = await prisma.examenMedico.create({
                data: {
                    conductorId: data.conductorId,
                    tipo: data.tipo,
                    fechaRealizacion: data.fechaRealizacion,
                    fechaVencimiento: data.fechaVencimiento,
                    entidadMedica: data.entidadMedica,
                    concepto: data.concepto,
                    restricciones: data.restricciones,
                    archivoId: data.archivoId,
                },
                include: { conductor: true },
            });
            logger.info(
                { examenId: examen.id, conductorId: data.conductorId },
                "Medical exam registered",
            );
            return { success: true, data: examen };
        } catch (error) {
            logger.error({ data, error }, "ExamenMedicoService.create error");
            return {
                success: false,
                error: "Error al registrar examen médico",
            };
        }
    }

    static async getByConductor(conductorId: string): Promise<ActionResult> {
        try {
            const examenes = await prisma.examenMedico.findMany({
                where: { conductorId },
                orderBy: { fechaRealizacion: "desc"  },
                include: { archivo: true },
            });
            return { success: true, data: examenes };
        } catch (error) {
            logger.error(
                { conductorId, error },
                "ExamenMedicoService.getByConductor error",
            );
            return {
                success: false,
                error: "Error al obtener exámenes médicos",
            };
        }
    }

    static async update(
        id: string,
        data: ExamenMedicoUpdate,
    ): Promise<ActionResult> {
        try {
            const examen = await prisma.examenMedico.update({
                where: { id },
                data,
            });
            logger.info({ examenId: id }, "Medical exam updated");
            return { success: true, data: examen };
        } catch (error) {
            logger.error(
                { id, data, error },
                "ExamenMedicoService.update error",
            );
            return {
                success: false,
                error: "Error al actualizar examen médico",
            };
        }
    }

    /**
     * Obtiene el resumen consolidado de SG-SST para todos los conductores/usuarios
     */
    static async getSGSSTSummary(): Promise<ActionResult> {
        try {
            const users = await prisma.usuario.findMany({
                where: {
                    activo: true,
                    eliminadoEn: null,
                    rol: { in: ["CONDUCTOR", "ADMIN", "SECRETARIA"] },
                },
                select: {
                    id: true,
                    nombres: true,
                    apellidos: true,
                    numeroDocumento: true,
                    rol: true,
                    email: true,
                    examenesMedicos: {
                        orderBy: { fechaRealizacion: "desc"  },
                        take: 1,
                        select: {
                            tipo: true,
                            fechaRealizacion: true,
                            fechaVencimiento: true,
                            concepto: true,
                        },
                    },
                    entregasDotacion: {
                        orderBy: { fechaEntrega: "desc"  },
                        take: 1,
                        select: {
                            fechaEntrega: true,
                        },
                    },
                },
                orderBy: { nombres: "asc"  },
            });
            return { success: true, data: users };
        } catch (error) {
            logger.error(
                { error },
                "ExamenMedicoService.getSGSSTSummary error",
            );
            return {
                success: false,
                error: "Error al obtener resumen de SG-SST",
            };
        }
    }
}
