import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import {
    CertificadoCreate,
    CertificadoUpdate,
    ExperienciaLaboralCreate,
    ExperienciaLaboralUpdate,
    ReferenciaPersonalCreate,
    ReferenciaPersonalUpdate,
} from "@/lib/validations";

export class ResumeService {
    // CERTIFICADOS
    static async createCertificado(
        data: CertificadoCreate,
    ): Promise<ActionResult> {
        try {
            const certificado = await prisma.certificado.create({
                data,
            });
            return { success: true, data: certificado };
        } catch (error) {
            logger.error(
                { data, error },
                "ResumeService.createCertificado error",
            );
            return {
                success: false,
                error: "Error al registrar el certificado",
            };
        }
    }

    static async updateCertificado(
        id: string,
        data: CertificadoUpdate,
    ): Promise<ActionResult> {
        try {
            const certificado = await prisma.certificado.update({
                where: { id },
                data,
            });
            return { success: true, data: certificado };
        } catch (error) {
            logger.error(
                { id, data, error },
                "ResumeService.updateCertificado error",
            );
            return {
                success: false,
                error: "Error al actualizar el certificado",
            };
        }
    }

    static async deleteCertificado(id: string): Promise<ActionResult> {
        try {
            await prisma.certificado.delete({ where: { id } });
            return { success: true };
        } catch (error) {
            logger.error(
                { id, error },
                "ResumeService.deleteCertificado error",
            );
            return {
                success: false,
                error: "Error al eliminar el certificado",
            };
        }
    }

    // EXPERIENCIAS LABORALES
    static async createExperienciaLaboral(
        data: ExperienciaLaboralCreate,
    ): Promise<ActionResult> {
        try {
            const experiencia = await prisma.experienciaLaboral.create({
                data,
            });
            return { success: true, data: experiencia };
        } catch (error) {
            logger.error(
                { data, error },
                "ResumeService.createExperienciaLaboral error",
            );
            return {
                success: false,
                error: "Error al registrar la experiencia",
            };
        }
    }

    static async updateExperienciaLaboral(
        id: string,
        data: ExperienciaLaboralUpdate,
    ): Promise<ActionResult> {
        try {
            const experiencia = await prisma.experienciaLaboral.update({
                where: { id },
                data,
            });
            return { success: true, data: experiencia };
        } catch (error) {
            logger.error(
                { id, data, error },
                "ResumeService.updateExperienciaLaboral error",
            );
            return {
                success: false,
                error: "Error al actualizar la experiencia",
            };
        }
    }

    static async deleteExperienciaLaboral(id: string): Promise<ActionResult> {
        try {
            await prisma.experienciaLaboral.delete({ where: { id } });
            return { success: true };
        } catch (error) {
            logger.error(
                { id, error },
                "ResumeService.deleteExperienciaLaboral error",
            );
            return {
                success: false,
                error: "Error al eliminar la experiencia",
            };
        }
    }

    // REFERENCIAS PERSONALES
    static async createReferenciaPersonal(
        data: ReferenciaPersonalCreate,
    ): Promise<ActionResult> {
        try {
            const referencia = await prisma.referenciaPersonal.create({
                data,
            });
            return { success: true, data: referencia };
        } catch (error) {
            logger.error(
                { data, error },
                "ResumeService.createReferenciaPersonal error",
            );
            return {
                success: false,
                error: "Error al registrar la referencia",
            };
        }
    }

    static async updateReferenciaPersonal(
        id: string,
        data: ReferenciaPersonalUpdate,
    ): Promise<ActionResult> {
        try {
            const referencia = await prisma.referenciaPersonal.update({
                where: { id },
                data,
            });
            return { success: true, data: referencia };
        } catch (error) {
            logger.error(
                { id, data, error },
                "ResumeService.updateReferenciaPersonal error",
            );
            return {
                success: false,
                error: "Error al actualizar la referencia",
            };
        }
    }

    static async deleteReferenciaPersonal(id: string): Promise<ActionResult> {
        try {
            await prisma.referenciaPersonal.delete({ where: { id } });
            return { success: true };
        } catch (error) {
            logger.error(
                { id, error },
                "ResumeService.deleteReferenciaPersonal error",
            );
            return {
                success: false,
                error: "Error al eliminar la referencia",
            };
        }
    }
}
