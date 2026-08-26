import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { hash } from "argon2";
import { ActionResult, UsuarioWithRelations } from "@/types";
import logger from "@/lib/logger";
import { UsuarioUpdate } from "@/lib/validations";
import { CacheService } from "@/lib/cache";
import { UserPrismaErrorHandler } from "./user-error-handler";

export class UserUpdateService {
    /**
     * Update user logic
     */
    static async update(
        id: string,
        data: Partial<UsuarioUpdate>,
    ): Promise<ActionResult<unknown>> {try {
            const {
                rh,
                eps,
                arl,
                fondoPensiones,
                fondoCesantias,
                perfilProfesional,
                contactoEmergenciaNombre,
                contactoEmergenciaTelefono,
                licencias,
                experiencias,
                certificados,
                password,
                ...userData
            } = data;

            if ("id" in userData) delete userData.id;
            if ("password" in userData) delete userData.password;

            const updateData: Prisma.UsuarioUpdateInput = {
                ...userData,
                numeroDocumento:
                    userData.numeroDocumento === ""
                        ? null
                        : userData.numeroDocumento,
                email:
                    typeof userData.email === "string" &&
                    userData.email.trim() === ""
                        ? null
                        : userData.email,
            } as Prisma.UsuarioUpdateInput;

            if (password) updateData.passwordHash = await hash(password);

            if (licencias) {
                await prisma.detalleLicencia.deleteMany({
                    where: { usuarioId: id },
                });
                updateData.licencias = {
                    create: licencias.map((lic) => ({ ...lic, activo: true })),
                };
            }

            if (experiencias) {
                await prisma.experienciaLaboral.deleteMany({
                    where: { usuarioId: id },
                });
                const validExperiencias = experiencias
                    .filter(
                        (
                            e,
                        ): e is typeof e & { empresa: string; cargo: string } =>
                            !!e.empresa && !!e.cargo,
                    )
                    .map((e) => ({
                        empresa: e.empresa,
                        cargo: e.cargo,
                        jefeInmediato: e.jefeInmediato,
                        telefonoJefe: e.telefonoJefe,
                        fechaInicio: e.fechaInicio,
                        fechaFin: e.fechaFin,
                        tiempoLaborado: e.tiempoLaborado,
                        archivoId: e.archivoId,
                    }));
                if (validExperiencias.length > 0)
                    updateData.experienciasLaborales = {
                        create: validExperiencias,
                    };
            }

            if (certificados) {
                await prisma.certificado.deleteMany({
                    where: { usuarioId: id },
                });
                const validCertificados = certificados
                    .filter(
                        (c): c is typeof c & { nombre: string } => !!c.nombre,
                    )
                    .map((c) => ({
                        nombre: c.nombre,
                        institucion: c.institucion,
                        fechaEmision: c.fechaEmision,
                        fechaVencimiento: c.fechaVencimiento,
                        categoria: c.categoria,
                        archivoId: c.archivoId,
                    }));
                if (validCertificados.length > 0)
                    updateData.certificados = { create: validCertificados };
            }

            const hv = {
                rh,
                eps,
                arl,
                fondoPensiones,
                fondoCesantias,
                perfilProfesional,
                contactoEmergenciaNombre,
                contactoEmergenciaTelefono,
            };
            const hvFiltered = Object.fromEntries(
                Object.entries(hv).filter(([, v]) => v !== undefined),
            );

            if (Object.keys(hvFiltered).length > 0) {
                updateData.hojaVida = {
                    upsert: { create: hvFiltered, update: hvFiltered },
                };
            }

            const user = await prisma.usuario.update({
                where: { id },
                data: updateData,
                include: { hojaVida: true, fotoPerfil: true },
            });

            await CacheService.invalidate("user");
            await CacheService.invalidate(`user:id:${user.id}`);

            logger.info({ id }, "User updated successfully");
            return { success: true, data: user as UsuarioWithRelations };
        } catch (error) {
            return UserPrismaErrorHandler.handle(
                error,
                { ...data, id },
                "update",
            );
        }
    }
}
