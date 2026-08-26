import { prisma } from "@/lib/prisma";
import { hash } from "argon2";
import { ActionResult, UsuarioWithRelations } from "@/types";
import { sendWelcomeEmail } from "@/lib/notifications";
import logger from "@/lib/logger";
import { UsuarioCreate } from "@/lib/validations";
import { CacheService } from "@/lib/cache";
import { UserPrismaErrorHandler } from "./user-error-handler";

export class UserCreateService {
    /**
     * Logic for creating a user
     */
    static async create(
        data: UsuarioCreate,
    ): Promise<ActionResult<unknown>> {try {
            const {
                password,
                rh,
                eps,
                arl,
                fondoPensiones,
                fondoCesantias,
                perfilProfesional,
                contactoEmergenciaNombre,
                contactoEmergenciaTelefono,
                experiencias,
                certificados,
                licencias,
                ...userData
            } = data;

            const isTempPassword = !password || password.length < 8;
            const passwordToHash = !isTempPassword
                ? (password as string)
                : `Temp${Math.random().toString(36).slice(-8)}!`;
            const hashedPassword = await hash(passwordToHash);

            const cleanedUserData = {
                ...userData,
                numeroDocumento: userData.numeroDocumento || null,
                email: (userData.email as string)?.trim() || null,
            };

            const validExperiencias = (experiencias || []).filter(
                (e): e is typeof e & { empresa: string; cargo: string } =>
                    !!e.empresa && !!e.cargo,
            );

            const validCertificados = (certificados || []).filter(
                (c): c is typeof c & { nombre: string } => !!c.nombre,
            );

            const user = await prisma.usuario.create({
                data: {
                    ...cleanedUserData,
                    passwordHash: hashedPassword,
                    licencias: { create: licencias || [] },
                    hojaVida: {
                        create: {
                            rh,
                            eps,
                            arl,
                            fondoPensiones,
                            fondoCesantias,
                            perfilProfesional,
                            contactoEmergenciaNombre,
                            contactoEmergenciaTelefono,
                        },
                    },
                    experienciasLaborales: { create: validExperiencias },
                    certificados: { create: validCertificados },
                },
                include: { hojaVida: true, fotoPerfil: true },
            });

            await CacheService.invalidate("user");

            if (user.email) {
                await sendWelcomeEmail(
                    user.email,
                    isTempPassword ? passwordToHash : undefined,
                );
            }

            logger.info(
                { userId: user.id, email: user.email },
                "User created successfully",
            );

            // Convertir a POJO para evitar problemas de serialización con Decimal o tipos complejos de Prisma
            const serializedUser = JSON.parse(JSON.stringify(user));

            return {
                success: true,
                data: serializedUser as UsuarioWithRelations,
                message: isTempPassword ? "TEMP_PASSWORD_GENERATED" : undefined,
            };
        } catch (error) {
            return UserPrismaErrorHandler.handle(error, data, "create");
        }
    }
}
