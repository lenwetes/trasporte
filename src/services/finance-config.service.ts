import { prisma } from "@/lib/prisma";
import { Prisma, ConfiguracionGlobal } from "@prisma/client";
import logger from "@/lib/logger";

// Interfaz extendida para asegurar que TS reconozca los campos financieros
// aunque la generación de Prisma tenga retraso o problemas de caché
interface FinanceConfig extends ConfiguracionGlobal {
    cuentaCajaId: string | null;
    cuentaBancosId: string | null;
    cuentaCobrarId: string | null;
    cuentaIngresosId: string | null;
    cuentaGastosId: string | null;
}

export class FinanceConfigService {
    /**
     * Obtiene los IDs de las cuentas contables configuradas.
     * Si alguna no está configurada, busca por defecto o crea la cuenta y actualiza la configuración.
     */
    static async getAccountIds() {
        // 1. Obtener configuración
        // Usamos un cast explícito para evitar errores si los tipos de Prisma no se han actualizado
        const configRaw = await prisma.configuracionGlobal.findFirst();
        let config = configRaw as unknown as FinanceConfig;
        if (!config) {
            // Crear default si no existe (raro, pero posible)
            const newConfig = await prisma.configuracionGlobal.create({
                data: {
                    id: "default",
                    nombreEmpresa: "COOPETRAES",
                },
            });
            config = newConfig as unknown as FinanceConfig;
        }

        const updates: Record<string, string> = {};
        let needsUpdate = false;

        // Helper para resolver cuenta
        const resolve = async (
            currentId: string | null,
            field: string,
            code: string,
            name: string,
            naturaleza: "DEBITO" | "CREDITO",
            tipo: "ACTIVO" | "PASIVO" | "PATRIMONIO" | "INGRESO" | "GASTO",
        ): Promise<string> => {
            if (currentId) return currentId;

            // Buscar por código
            let cuenta = await prisma.cuentaContable.findUnique({
                where: { codigo: code },
            });

            if (!cuenta) {
                cuenta = await prisma.cuentaContable.create({
                    data: {
                        codigo: code,
                        nombre: name,
                        naturaleza,
                        tipo,
                        activa: true,
                    },
                });
                logger.info(
                    `Cuenta ${code} autogenerada por FinanceConfigService.`,
                );
            }

            // Marcar para actualizar config
            updates[field] = cuenta.id;
            needsUpdate = true;

            return cuenta.id;
        };

        // Resolver todas las cuentas críticas
        const cajaId = await resolve(
            config!.cuentaCajaId,
            "cuentaCajaId",
            "1105",
            "Caja General",
            "DEBITO",
            "ACTIVO",
        );
        const bancosId = await resolve(
            config!.cuentaBancosId,
            "cuentaBancosId",
            "1110",
            "Bancos",
            "DEBITO",
            "ACTIVO",
        );
        const cxcId = await resolve(
            config!.cuentaCobrarId,
            "cuentaCobrarId",
            "1305",
            "Cuentas por Cobrar",
            "DEBITO",
            "ACTIVO",
        );
        const ingresosId = await resolve(
            config!.cuentaIngresosId,
            "cuentaIngresosId",
            "4155",
            "Ingresos Transporte",
            "CREDITO",
            "INGRESO",
        );
        const gastosId = await resolve(
            config!.cuentaGastosId,
            "cuentaGastosId",
            "5195",
            "Gastos Diversos",
            "DEBITO",
            "GASTO",
        );

        // Aplicar actualizaciones a config si es necesario
        if (needsUpdate) {
            await prisma.configuracionGlobal.update({
                where: { id: config!.id },
                data: updates as unknown as Prisma.ConfiguracionGlobalUpdateInput,
            });
        }

        return {
            cajaId,
            bancosId,
            cxcId,
            ingresosId,
            gastosId,
        };
    }

    /**
     * Obtiene la configuración global actual.
     */
    static async getConfig() {
        const config = await prisma.configuracionGlobal.findFirst();

        if (!config) {
            // Retornar defaults simulados si no existe
            return {
                montoCuotaAdministracion: 80000,
                diaCorteMensual: 5,
                porcentajeMoraDiaria: 0,
                nombreEmpresa: "COOPETRAES",
            };
        }

        return {
            ...config,
            montoCuotaAdministracion: Number(config.montoCuotaAdministracion),
            porcentajeMoraDiaria: Number(config.porcentajeMoraDiaria),
        };
    }

    /**
     * Actualiza la configuración global.
     */
    static async updateConfig(data: {
        montoCuotaAdministracion?: number;
        diaCorteMensual?: number;
        porcentajeMoraDiaria?: number;
        nombreEmpresa?: string;
        nit?: string;
        direccion?: string;
        email?: string;
        telefono?: string;
        representanteLegal?: string;
        nombrePresidente?: string;
    }) {
        try {
            const current = await prisma.configuracionGlobal.findFirst();
            const id = current?.id || "default";

            const payload: Prisma.ConfiguracionGlobalUpdateInput = {};
            if (data.montoCuotaAdministracion !== undefined)
                payload.montoCuotaAdministracion =
                    data.montoCuotaAdministracion;
            if (data.diaCorteMensual !== undefined)
                payload.diaCorteMensual = data.diaCorteMensual;
            if (data.porcentajeMoraDiaria !== undefined)
                payload.porcentajeMoraDiaria = data.porcentajeMoraDiaria;
            if (data.nombreEmpresa !== undefined)
                payload.nombreEmpresa = data.nombreEmpresa;
            if (data.nit !== undefined) payload.nit = data.nit;
            if (data.direccion !== undefined)
                payload.direccion = data.direccion;
            if (data.email !== undefined) payload.email = data.email;
            if (data.telefono !== undefined) payload.telefono = data.telefono;
            if (data.representanteLegal !== undefined)
                payload.representanteLegal = data.representanteLegal;
            if (data.nombrePresidente !== undefined)
                payload.nombrePresidente = data.nombrePresidente;

            const updated = await prisma.configuracionGlobal.upsert({
                where: { id },
                create: {
                    id: "default",
                    montoCuotaAdministracion:
                        data.montoCuotaAdministracion ?? 80000,
                    diaCorteMensual: data.diaCorteMensual ?? 5,
                    porcentajeMoraDiaria: data.porcentajeMoraDiaria ?? 0,
                    nombreEmpresa: data.nombreEmpresa ?? "COOPETRAES",
                    nit: data.nit,
                    direccion: data.direccion,
                    email: data.email,
                    telefono: data.telefono,
                    representanteLegal: data.representanteLegal,
                    nombrePresidente: data.nombrePresidente,
                },
                update: payload,
            });

            return { success: true, data: updated };
        } catch (error) {
            logger.error(
                { error, data },
                "Error al actualizar configuración global",
            );
            return {
                success: false,
                error: "Error al guardar la configuración",
            };
        }
    }
}
