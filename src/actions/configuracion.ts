"use server";

import fs from "node:fs";
import path from "node:path";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ConfiguracionGlobal } from "@/lib/validations";
import { hash } from "argon2";
import { ActionResult } from "@/types";
import { ConfiguracionGlobal as ConfigModel } from "@prisma/client";
import { withAuth } from "@/lib/safe-action";
import { serializeDecimal } from "@/lib/utils";
import { cache } from "@/lib/cache";

export const getConfiguracionGlobal = withAuth(
    "ALL",
    async (): Promise<ActionResult<ConfigModel>> => {
        const CACHE_KEY = "config:default";
        
        // 1. Try Cache
        const cached = await cache.get<ConfigModel>(CACHE_KEY);
        if (cached) return { success: true, data: cached };

        // 2. Database Fallback
        let config = await prisma.configuracionGlobal.findUnique({
            where: { id: "default" },
        });

        if (!config) {
            config = await prisma.configuracionGlobal.create({
                data: { id: "default" },
            });
        }

        const serialized = serializeDecimal(config) as ConfigModel;
        
        // 3. Save to Cache (TTL 1 hour)
        await cache.set(CACHE_KEY, serialized, 3600);

        return { success: true, data: serialized };
    },
    "getConfiguracionGlobal",
);

export const updateConfiguracionGlobal = withAuth(
    "ADMIN",
    async (dataInput: unknown): Promise<ActionResult> => {
        const data = dataInput as Partial<ConfigModel>;
        
        // Sanitize data
        const payload: Partial<ConfigModel> = { ...data };
        
        // Relationships: convert empty to null
        if (payload.cuentaCajaId === "") payload.cuentaCajaId = null;
        if (payload.cuentaBancosId === "") payload.cuentaBancosId = null;
        if (payload.cuentaCobrarId === "") payload.cuentaCobrarId = null;
        if (payload.cuentaIngresosId === "") payload.cuentaIngresosId = null;
        if (payload.cuentaGastosId === "") payload.cuentaGastosId = null;
        if (payload.cuentaPrestamosId === "") payload.cuentaPrestamosId = null;

        const config = await prisma.configuracionGlobal.upsert({
            where: { id: "default" },
            update: payload,
            create: { id: "default", ...payload },
        });

        // 1. Invalidate Cache
        await cache.del("config:default");

        revalidatePath("/dashboard/configuracion");
        return { success: true, data: serializeDecimal(config) as ConfigModel };
    },
    "updateConfiguracionGlobal",
);

/**
 * OPTIMIZE DATABASE
 */
export const optimizeDatabase = withAuth(
    "ADMIN",
    async (): Promise<ActionResult> => {
        // Run VACUUM to reclaim space and optimize indexes
        // Note: $executeRawUnsafe is used because VACUUM cannot run within a transaction
        await prisma.$executeRawUnsafe(`VACUUM ANALYZE`);

        return {
            success: true,
            message: "Base de datos optimizada e índices actualizados.",
        };
    },
    "optimizeDatabase",
);

/**
 * RESET DATABASE (Destructive)
 * Clears all data except default configuration and Admin user.
 * Resets Admin password to 'admin'.
 */
export const resetDatabase = withAuth(
    "ADMIN",
    async (): Promise<ActionResult> => {
        const { auth } = await import("@/auth");
        const session = await auth();

        if (!session?.user?.id) {
            return {
                success: false,
                error: "Sesión no válida o expirada",
            };
        }

        // 1. Get the admin user to preserve it
        const adminUser = await prisma.usuario.findUnique({
            where: { id: session.user.id },
        });

        if (!adminUser) {
            return {
                success: false,
                error: "Usuario administrador no encontrado",
            };
        }

        // 2. Perform deletions in correct order to avoid FK violations
        // We use a transaction for safety
        await prisma.$transaction([
            // Niveles más bajos (dependencias)
            prisma.auditLog.deleteMany({}),
            prisma.notificacion.deleteMany({}),
            prisma.asientoContable.deleteMany({}),
            prisma.obligacionFinanciera.deleteMany({}),
            prisma.planillaFUEC.deleteMany({}),

            // Módulos operativos
            prisma.novedad.deleteMany({}),
            prisma.siniestro.deleteMany({}),
            prisma.mantenimientoRealizado.deleteMany({}),
            prisma.ordenServicio.deleteMany({}),
            prisma.planMantenimiento.deleteMany({}),
            prisma.preoperacional.deleteMany({}),

            // Documentos y vinculaciones
            prisma.documentoVehiculo.deleteMany({}),
            prisma.vinculacion.deleteMany({}),
            prisma.hojaVidaVehiculo.deleteMany({}),
            prisma.historialEstadoVehiculo.deleteMany({}),

            // Personal y Usuarios
            prisma.detalleLicencia.deleteMany({}),
            prisma.examenMedico.deleteMany({}),
            prisma.entregaDotacion.deleteMany({}),
            prisma.certificado.deleteMany({}),
            prisma.experienciaLaboral.deleteMany({}),
            prisma.referenciaPersonal.deleteMany({}),
            prisma.hojaVida.deleteMany({}),

            // Financiero y Configuración FUEC
            prisma.transaccion.deleteMany({}),
            prisma.contratoEmpresa.deleteMany({}),
            prisma.resolucionFUEC.deleteMany({}),
            prisma.proveedor.deleteMany({}),

            // Entidad principal: Vehículo
            prisma.vehiculo.deleteMany({}),

            // Usuarios (preservando el admin actual)
            prisma.usuario.deleteMany({
                where: { id: { not: adminUser.id } },
            }),

            // Configuración final
            prisma.reglaAlerta.deleteMany({}),
            prisma.repositorioArchivo.deleteMany({}),
        ]);

        // 3. Reset admin password to 'admin'
        const defaultHashedPassword = await hash("admin");
        await prisma.usuario.update({
            where: { id: adminUser.id },
            data: {
                passwordHash: defaultHashedPassword,
                nombres: "Admin",
                apellidos: "Principal",
                rol: "ADMIN",
                activo: true,
            },
        });

        // 4. Re-poblate default alert rules
        const defaultAlertRules = [
            { tipoDocumento: "SOAT", diasAnticipacion: 30 },
            { tipoDocumento: "TECNOMECANICA", diasAnticipacion: 30 },
            { tipoDocumento: "TARJETA_OPERACION", diasAnticipacion: 45 },
            { tipoDocumento: "POLIZA_RESPONSABILIDAD_CIVIL", diasAnticipacion: 30 },
        ];

        for (const rule of defaultAlertRules) {
            await prisma.reglaAlerta.upsert({
                where: { tipoDocumento: rule.tipoDocumento },
                update: {
                    diasAnticipacion: rule.diasAnticipacion,
                    activo: true,
                },
                create: { ...rule, activo: true },
            });
        }

        // 5. Try to clear physical files (Local storage)
        // Note: This is a best-effort operation
        try {
            const configInstance = await prisma.configuracionGlobal.findUnique({ where: { id: "default" }});
            const logoLocalPath = configInstance?.logoLocalPath;
            const logoUrl = configInstance?.logoUrl;
            
            // Deduce the pure filename of the logo if possible
            const logofs1 = logoLocalPath ? path.basename(logoLocalPath) : null;
            const logofs2 = logoUrl ? path.basename(logoUrl) : null;

            const uploadDir = process.env.UPLOAD_DIR || "storage/uploads";
            const fullPath = path.join(process.cwd(), uploadDir);

            if (fs.existsSync(fullPath)) {
                const files = fs.readdirSync(fullPath);
                for (const file of files) {
                    if (
                        file !== ".gitkeep" && 
                        file !== logofs1 && 
                        file !== logofs2
                    ) {
                        fs.unlinkSync(path.join(fullPath, file));
                    }
                }
            }
        } catch (e) {
            const logger = (await import("@/lib/logger")).default;
            logger.error({ error: e }, "Non-critical error clearing files");
        }

        // 6. Revalidate all paths
        revalidatePath("/", "layout");

        return {
            success: true,
            message:
                "Sistema reiniciado a estado de limpieza operativa. Datos operativos eliminados y admin preservado.",
        };
    },
    "resetDatabase",
);

/**
 * GET SYSTEM ERROR LOGS (Placeholder)
 */
export const getSystemErrorLogs = withAuth(
    "ADMIN",
    async (): Promise<ActionResult> => {
        // For now, return mock logs
        return {
            success: true,
            data: [
                {
                    id: 1,
                    type: "error",
                    message: "Prisma client connection timeout",
                    timestamp: new Date(),
                },
                {
                    id: 2,
                    type: "warning",
                    message: "Large result set in reporting query",
                    timestamp: new Date(),
                },
            ],
        };
    },
    "getSystemErrorLogs",
);
