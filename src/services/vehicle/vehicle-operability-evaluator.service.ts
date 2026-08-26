import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { EstadoOperativo } from "@prisma/client";
import logger from "@/lib/logger";
import { DebtService } from "../debt.service";

const DOCUMENTOS_OBLIGATORIOS = [
    "SOAT",
    "REVISION_TECNOMECANICA",
    "TARJETA_OPERACION",
    "LICENCIA_TRANSITO",
    "POLIZA_RESPONSABILIDAD_CIVIL",
];

const DIAS_ALERTA_VENCIMIENTO = 30;

export class VehicleOperabilityEvaluatorService {
    static async evaluateOperability(
        vehiculoId: string,
        userId?: string,
    ): Promise<ActionResult<unknown>> {try {
            // Si no se provee un userId, intentamos buscar el admin por defecto
            if (!userId) {
                const defaultAdmin = await prisma.usuario.findFirst({
                    where: { rol: "ADMIN"  },
                });
                userId = defaultAdmin?.id;
            }

            if (!userId) {
                logger.error(
                    { vehiculoId },
                    "No se pudo determinar un usuario para el historial de operatividad",
                );
                return {
                    success: false,
                    error: "Error de integridad: Usuario no identificado",
                };
            }
            const vehiculo = await prisma.vehiculo.findUnique({
                where: { id: vehiculoId },
                include: {
                    documentos: true,
                    vinculaciones: {
                        where: { activo: true },
                        include: { conductor: true },
                    },
                    ordenesServicio: {
                        where: { estado: "PENDIENTE"  },
                    },
                },
            });

            if (!vehiculo) {
                return { success: false, error: "Vehículo no encontrado"  };
            }

            const estadoAnterior = vehiculo.estadoOperativo;
            let estadoNuevo: EstadoOperativo = EstadoOperativo.EVALUANDO;
            const issues: string[] = [];
            let razon = "";

            // 1. Regla: Override de Administrador (Super Usuario)
            // Esta regla tiene la mayor prioridad
            if (vehiculo.overrideActivo) {
                estadoNuevo = EstadoOperativo.OPERATIVO_OVERRIDE;
                razon =
                    vehiculo.justificacionOverride ||
                    "Desbloqueo manual por super-usuario";
                issues.push(razon);
            }
            // 2. Regla: Bloqueo Manual
            else if (vehiculo.bloqueadoManualmente) {
                estadoNuevo = EstadoOperativo.BLOQUEADO_ADMIN;
                razon =
                    vehiculo.razonBloqueo ||
                    "Bloqueo manual por administración";
                issues.push(razon);
            } else {
                // ... rest of existing rules ...
                // 3. Regla: Documentos Obligatorios Faltantes o Vencidos
                const docsMap = new Map(
                    vehiculo.documentos.map((d) => [d.tipo, d]),
                );
                const hoy = new Date();
                let docFaltante = false;
                let docVencido = false;
                let docsPorVencer = false;

                for (const tipo of DOCUMENTOS_OBLIGATORIOS) {
                    const doc = docsMap.get(tipo);
                    if (!doc) {
                        docFaltante = true;
                        issues.push(`Falta documento obligatorio: ${tipo}`);
                        continue;
                    }
                    if (doc.fechaVencimiento && doc.fechaVencimiento < hoy) {
                        docVencido = true;
                        issues.push(
                            `Documento vencido: ${tipo} (${doc.fechaVencimiento.toLocaleDateString()})`,
                        );
                        continue;
                    }
                    // Check if expiring soon
                    if (doc.fechaVencimiento) {
                        const diasRestantes = Math.ceil(
                            (doc.fechaVencimiento.getTime() - hoy.getTime()) /
                                (1000 * 60 * 60 * 24),
                        );
                        if (diasRestantes <= DIAS_ALERTA_VENCIMIENTO) {
                            docsPorVencer = true;
                        }
                    }
                }

                if (docFaltante || docVencido) {
                    estadoNuevo = EstadoOperativo.NO_OPERATIVO;
                } else {
                    // 4. Regla: Conductor Activo
                    const vinculacionActiva = vehiculo.vinculaciones[0];
                    if (!vinculacionActiva) {
                        estadoNuevo = EstadoOperativo.NO_OPERATIVO;
                        issues.push("Sin conductor activo vinculado");
                    } else {
                        // 5. Regla: Estado Financiero del Conductor (Kill Switch)
                        const debtStatus = await DebtService.canOperate(
                            vinculacionActiva.conductorId,
                        );
                        if (
                            debtStatus.success &&
                            !debtStatus.data?.canOperate
                        ) {
                            estadoNuevo = EstadoOperativo.NO_OPERATIVO;
                            issues.push(
                                `Conductor en mora: ${debtStatus.data?.saldoPendiente} superó el umbral`,
                            );
                        } else {
                            // 6. Regla: Mantenimientos Críticos
                            if (vehiculo.ordenesServicio.length > 0) {
                                estadoNuevo =
                                    EstadoOperativo.OPERATIVO_CON_ALERTAS;
                                issues.push(
                                    `Existen ${vehiculo.ordenesServicio.length} órdenes de mantenimiento críticas pendientes`,
                                );
                            } else if (docsPorVencer) {
                                // 7. Regla: Documentos por vencer
                                estadoNuevo =
                                    EstadoOperativo.OPERATIVO_CON_ALERTAS;
                                issues.push(
                                    "Existen documentos próximos a vencer",
                                );
                            } else {
                                // 8. Regla: Operativo
                                estadoNuevo = EstadoOperativo.OPERATIVO;
                                issues.push(
                                    "Cumple con todos los requisitos operativos",
                                );
                            }
                        }
                    }
                }
            }

            razon = issues.join(" | ");

            // Actualizar si el estado cambió
            if (estadoNuevo !== estadoAnterior) {
                await prisma.$transaction([
                    prisma.vehiculo.update({
                        where: { id: vehiculoId },
                        data: {
                            estadoOperativo: estadoNuevo,
                        },
                    }),
                    prisma.historialEstadoVehiculo.create({
                        data: {
                            vehiculoId,
                            estadoAnterior,
                            estadoNuevo,
                            razon,
                            userId,
                        },
                    }),
                ]);
            }

            return { success: true, data: estadoNuevo, metadata: { issues } };
        } catch (error) {
            logger.error({ error, vehiculoId }, "Error en evaluateOperability");
            return {
                success: false,
                error: "Error al evaluar la operatividad",
            };
        }
    }
}
