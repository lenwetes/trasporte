import { prisma } from "@/lib/prisma";
import { ActionResult, SiniestroWithRelations } from "@/types";
import logger from "@/lib/logger";
import { InvestigacionSiniestroCreate } from "@/lib/validations/safety";
import { generateSiniestroPDF } from "@/lib/pdf/siniestros/generator";
import { ArchiveEngine } from "@/lib/archive-engine";

export class SiniestroService {
    static async createInvestigacion(
        data: InvestigacionSiniestroCreate,
    ): Promise<ActionResult> {
        try {
            const result = await prisma.$transaction(async (tx) => {
                // 1. Create Investigation Record
                const investigacion = await tx.investigacionSiniestro.create({
                    data: {
                        siniestroId: data.siniestroId,
                        participantes: data.participantes,
                        analisisCausas: data.analisisCausas,
                        planAccion: data.planAccion,
                        conclusiones: data.conclusiones,
                        diasPerdidos: data.diasPerdidos,
                        costoEstimado: data.costoEstimado,
                    },
                    include: {
                        siniestro: {
                            include: {
                                conductor: true,
                                vehiculo: true,
                                fotos: true,
                                investigacion: true,
                            },
                        },
                    },
                });

                // 2. Close the Siniestro case
                await tx.siniestro.update({
                    where: { id: data.siniestroId },
                    data: { estado: "CERRADO"  },
                });

                return investigacion;
            });

            // 3. AUTOMATED PESV CLOSURE: Generate and Archive Report PDF
            try {
                const config = await prisma.configuracionGlobal.findUnique({
                    where: { id: "default"  },
                });

                // Prepare PDF data
                const pdfData = {
                    ...(result.siniestro as SiniestroWithRelations),
                    investigacion: result,
                    config,
                };

                const doc = await generateSiniestroPDF(pdfData);
                if (!doc) throw new Error("Abortando guardado pdf");
                const pdfArrayBuffer = doc.output("arraybuffer");
                const buffer = Buffer.from(pdfArrayBuffer);

                const fileName = `Informe_PESV_${pdfData.id.substring(0, 8).toUpperCase()}_${pdfData.vehiculo.placa}.pdf`;

                const archiveResult = await ArchiveEngine.archiveBuffer(
                    buffer,
                    {
                        nombreOriginal: fileName,
                        tipoMime: "application/pdf",
                        tamano: buffer.length,
                        entidadTipo: "Siniestro",
                        entidadId: data.siniestroId,
                    },
                );

                if (archiveResult.success) {
                    const archivedFile = archiveResult.data as { id: string };
                    logger.info(
                        { archiveId: archivedFile.id },
                        "PESV Closure: Investigation PDF archived silently",
                    );
                }
            } catch (pdfError) {
                // Non-blocking for the main transaction
                logger.error(
                    { pdfError, siniestroId: data.siniestroId },
                    "Error during automated PESV PDF archival",
                );
            }

            logger.info(
                {
                    investigacionId: result.id,
                    siniestroId: data.siniestroId,
                },
                "Accident investigation registered and case closed",
            );
            return { success: true, data: result };
        } catch (error) {
            logger.error(
                { data, error },
                "SiniestroService.createInvestigacion error",
            );
            return {
                success: false,
                error: "Error al registrar investigación de siniestro",
            };
        }
    }

    static async getInvestigacionBySiniestro(
        siniestroId: string,
    ): Promise<ActionResult> {
        try {
            const investigacion =
                await prisma.investigacionSiniestro.findUnique({
                    where: { siniestroId },
                    include: { siniestro: true },
                });
            return { success: true, data: investigacion };
        } catch (error) {
            logger.error(
                { siniestroId, error },
                "SiniestroService.getInvestigacionBySiniestro error",
            );
            return { success: false, error: "Error al obtener investigación" };
        }
    }
}
