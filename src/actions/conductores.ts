"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { calculateVehicleAlerts } from "@/lib/alerts";
import { calculateMaintenanceAlerts } from "@/lib/maintenance-logic";
import { Session } from "next-auth";
import { ActionResult } from "@/types";
import { UserService } from "@/services/user.service";
import { withAuth } from "@/lib/safe-action";

/**
 * Get data for reports context (Conductor Dashboard)
 */
export const getConductorData = withAuth(
    async (session: Session, userId: unknown): Promise<ActionResult> => {
        const id = userId as string;
        const conductorResult = await UserService.getById(id);
        if (!conductorResult.success) return conductorResult;
        const conductor = conductorResult.data!;

        const alertRules = await prisma.reglaAlerta.findMany({
            where: { activo: true },
        });
        const planesMantenimiento = await prisma.planMantenimiento.findMany();

        const vinculacionesWithAlerts = await Promise.all(
            (conductor as any).vinculaciones.map(async (v: any) => {
                const documentsAlerts = calculateVehicleAlerts(
                    v.vehiculo,
                    alertRules,
                );
                const vehiculoWithMants = await prisma.vehiculo.findUnique({
                    where: { id: v.vehiculoId },
                    include: {
                        mantenimientos: {
                            orderBy: { fecha: "desc" },
                            include: { plan: true },
                        },
                    },
                });

                const maintenanceAlerts = vehiculoWithMants
                    ? calculateMaintenanceAlerts(
                          vehiculoWithMants,
                          planesMantenimiento,
                      )
                    : [];

                return {
                    ...v,
                    vehiculo: {
                        ...v.vehiculo,
                        alertLevel: documentsAlerts.status,
                        alerts: documentsAlerts.alerts,
                        maintenanceAlerts,
                    },
                };
            }),
        );

        const fuecActivo = await prisma.planillaFUEC.findFirst({
            where: {
                OR: [
                    { conductor1Id: id },
                    { conductor2Id: id },
                    { conductor3Id: id },
                ],
                estado: "ACTIVO",
                fechaFin: { gte: new Date() },
            },
            include: {
                vehiculo: true,
                contrato: true,
            },
            orderBy: { fechaInicio: "desc" },
        });

        return {
            success: true,
            data: {
                ...conductor,
                vinculaciones: vinculacionesWithAlerts,
                fuecActivo,
            },
        };
    },
    "getConductorData",
);

/**
 * Get simple list of conductors for selectors
 */
export const getConductoresList = withAuth(
    async (session: Session): Promise<ActionResult> => {
        const role = session.user.rol;
        const userId = session.user.id;

        const where: Prisma.UsuarioWhereInput = { rol: "CONDUCTOR" };
        if (role !== "ADMIN" && role !== "SECRETARIA") {
            if (role === "CONDUCTOR") where.id = userId;
            else if (role === "PROPIETARIO") {
                where.vinculaciones = {
                    some: { vehiculo: { propietarioId: userId }, activo: true },
                };
            }
        }

        const conductors = await prisma.usuario.findMany({
            where,
            select: { id: true, nombres: true, apellidos: true },
            orderBy: [{ nombres: "asc" }, { apellidos: "asc" }],
        });
        return {
            success: true,
            data: conductors.map((c) => ({
                id: c.id,
                nombre: `${c.nombres} ${c.apellidos}`,
            })),
        };
    },
    "getConductoresList",
);

/**
 * Get current active FUEC for a driver
 */
export const getConductorRuta = withAuth(
    async (session: Session, userId: unknown): Promise<ActionResult> => {
        const id = userId as string;
        const now = new Date();

        const currentFuec = await prisma.planillaFUEC.findFirst({
            where: {
                OR: [
                    { conductor1Id: id },
                    { conductor2Id: id },
                    { conductor3Id: id },
                ],
                estado: "ACTIVO",
                fechaFin: { gte: now },
            },
            include: {
                vehiculo: true,
                contrato: true,
            },
            orderBy: { fechaInicio: "desc" },
        });

        return { success: true, data: currentFuec };
    },
    "getConductorRuta",
);
