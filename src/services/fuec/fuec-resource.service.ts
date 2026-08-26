import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ActionResult } from "@/types";
import logger from "@/lib/logger";
import { CacheService } from "@/lib/cache";
import { z } from "zod";
import { ClientCreateSchema } from "@/lib/validations/fuec";

export class FuecResourceService {
    /**
     * Gestión de Resoluciones
     */
    static async getResoluciones(): Promise<ActionResult> {
        return await CacheService.remember(
            "fuec:resoluciones",
            86400,
            async () => {
                try {
                    const res = await prisma.resolucionFUEC.findMany({
                        orderBy: { creadoEn: "desc"  },
                    });
                    return { success: true, data: res };
                } catch (error) {
                    logger.error(
                        { error },
                        "FuecResourceService.getResoluciones error",
                    );
                    return {
                        success: false,
                        error: "Error al obtener resoluciones",
                    };
                }
            },
        );
    }

    static async updateResolucionConsecutivo(
        id: string,
        actual: number,
    ): Promise<ActionResult> {
        try {
            const res = await prisma.resolucionFUEC.update({
                where: { id },
                data: { actual },
            });
            await CacheService.invalidate("fuec");
            return { success: true, data: res };
        } catch (error) {
            logger.error(
                { error, id },
                "FuecResourceService.updateResolucionConsecutivo error",
            );
            return { success: false, error: "Error al actualizar consecutivo"  };
        }
    }

    /**
     * Gestión de Resoluciones
     */
    static async createResolucion(
        data: Prisma.ResolucionFUECCreateInput,
    ): Promise<ActionResult> {
        try {
            const res = await prisma.resolucionFUEC.create({
                data: {
                    ...data,
                    actual: (data.rangoDesde as number) - 1,
                    creadoEn: new Date(),
                    habilitada: true,
                },
            });
            await CacheService.invalidate("fuec");
            return { success: true, data: res };
        } catch (error) {
            logger.error(
                { error, data },
                "FuecResourceService.createResolucion error",
            );
            return { success: false, error: "Error al crear resolución"  };
        }
    }

    /**
     * Gestión de Contratos
     */
    static async createContrato(
        data: Prisma.ContratoEmpresaCreateInput,
    ): Promise<ActionResult> {
        try {
            const contrato = await prisma.contratoEmpresa.create({
                data: {
                    ...data,
                    activo: true,
                },
            });
            await CacheService.invalidate("fuec");
            return { success: true, data: contrato };
        } catch (error) {
            logger.error(
                { error, data },
                "FuecResourceService.createContrato error",
            );
            return { success: false, error: "Error al crear contrato"  };
        }
    }

    static async updateContrato(
        id: string,
        data: Prisma.ContratoEmpresaUpdateInput,
    ): Promise<ActionResult> {
        try {
            const contrato = await prisma.contratoEmpresa.update({
                where: { id },
                data,
            });
            await CacheService.invalidate("fuec");
            return { success: true, data: contrato };
        } catch (error) {
            logger.error(
                { error, id, data },
                "FuecResourceService.updateContrato error",
            );
            return { success: false, error: "Error al actualizar contrato"  };
        }
    }

    static async deleteContrato(id: string): Promise<ActionResult> {
        try {
            await prisma.contratoEmpresa.update({
                where: { id },
                data: { activo: false },
            });
            await CacheService.invalidate("fuec");
            return { success: true };
        } catch (error) {
            logger.error({ error, id }, "FuecResourceService.deleteContrato error");
            return { success: false, error: "Error al eliminar contrato"  };
        }
    }

    /**
     * Gestión de Clientes (Usuarios tipo CLIENTE o similar)
     */
    static async createClient(
        data: z.infer<typeof ClientCreateSchema>,
    ): Promise<ActionResult> {
        try {
            const client = await prisma.usuario.create({
                data: {
                    nombres: data.nombres,
                    apellidos: data.apellidos,
                    tipoDocumento: data.tipoDocumento,
                    numeroDocumento: data.numeroDocumento,
                    email: data.email || null,
                    telefono: data.telefono || null,
                    direccion: data.direccion || `${data.municipio || ""}, ${data.departamento || ""}`,
                    municipio: data.municipio || "SINCELEJO",
                    rol: "PROPIETARIO", // Usamos un rol existente que actúe como cliente o mapeamos a uno nuevo si existe
                    passwordHash: "CLIENT_NO_LOGIN",
                },
            });
            return { success: true, data: client };
        } catch (error) {
            logger.error({ error, data }, "FuecResourceService.createClient error");
            return { success: false, error: "Error al crear cliente" };
        }
    }

    static async getClientesFrecuentes(): Promise<ActionResult> {
        return await CacheService.remember("fuec:clientes", 86400, async () => {
            try {
                const res = await prisma.clienteFrecuente.findMany({ orderBy: { creadoEn: "desc" }});
                return { success: true, data: res };
            } catch (error) {
                return { success: false, error: "Error al obtener clientes" };
            }
        });
    }

    static async createClienteFrecuente(data: { nombre: string, nit?: string }): Promise<ActionResult> {
        try {
            const cliente = await prisma.clienteFrecuente.create({ data });
            await CacheService.invalidate("fuec");
            await CacheService.invalidate("fuec:clientes");
            return { success: true, data: cliente };
        } catch (error) {
            return { success: false, error: "Error al crear cliente frecuente" };
        }
    }

    static async getResponsablesFrecuentes(): Promise<ActionResult> {
        return await CacheService.remember("fuec:responsables", 86400, async () => {
            try {
                const res = await prisma.responsableFrecuente.findMany({ orderBy: { creadoEn: "desc" }});
                return { success: true, data: res };
            } catch (error) {
                return { success: false, error: "Error al obtener responsables" };
            }
        });
    }

    static async createResponsableFrecuente(data: { nombre: string, cedula?: string, telefono?: string, direccion?: string }): Promise<ActionResult> {
        try {
            const res = await prisma.responsableFrecuente.create({ data });
            await CacheService.invalidate("fuec");
            await CacheService.invalidate("fuec:responsables");
            return { success: true, data: res };
        } catch (error) {
            return { success: false, error: "Error al crear responsable frecuente" };
        }
    }
}
