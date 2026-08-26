"use server";

import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";

/**
 * Get maintenance alerts
 * Calculates which vehicles are due for maintenance based on plans
 * RBAC: Conductors see only their assigned vehicles, Admins see all
 */
export async function getAlertasMantenimiento() {
    const { auth: getAuth } = await import("@/auth");
    const session = await getAuth();

    if (!session?.user) {
        return { success: false, error: "No autorizado"  };
    }

    try {
        // Build vehicle filter based on role
        const vehiculoWhere: Record<string, unknown> = {};

        if (session.user.rol === "CONDUCTOR") {
            // Conductors only see their assigned vehicles
            vehiculoWhere.vinculaciones = {
                some: {
                    conductorId: session.user.id,
                    activo: true,
                },
            };
        }
        // Admins and Secretaria see all vehicles (no filter needed)

        const [vehiculosResult, planes] = await Promise.all([
            prisma.vehiculo.findMany({
                where: vehiculoWhere,
                include: {
                    mantenimientos: {
                        orderBy: { fecha: "desc"  },
                        include: { plan: true },
                    },
                    ordenesServicio: {
                        where: {
                            estado: {
                                in: ["PENDIENTE", "EN_REVISION", "RECHAZADA"],
                            },
                        },
                    },
                },
            }),
            prisma.planMantenimiento.findMany(),
        ]);

        const vehiculos = vehiculosResult;

        const alertas = [];

        for (const vehiculo of vehiculos) {
            for (const plan of planes) {
                // Find last maintenance of this plan for this vehicle
                const ultimo = vehiculo.mantenimientos.find(
                    (m) => m.planId === plan.id,
                );

                let due = false;
                let razon = "";

                if (!ultimo) {
                    due = true;
                    razon = "Nunca realizado";
                } else {
                    // Check by KM
                    if (
                        plan.frecuencia === "KILOMETROS" ||
                        plan.frecuencia === "AMBOS"
                    ) {
                        const kmDesdeUltimo =
                            (vehiculo.kilometrajeActual || 0) -
                            ultimo.kilometraje;
                        if (
                            plan.kmIntervalo &&
                            kmDesdeUltimo >= plan.kmIntervalo
                        ) {
                            due = true;
                            razon = `Exceso de KMS: ${kmDesdeUltimo}km (Límite: ${plan.kmIntervalo}km)`;
                        }
                    }

                    // Check by Time
                    if (
                        !due &&
                        (plan.frecuencia === "TIEMPO" ||
                            plan.frecuencia === "AMBOS")
                    ) {
                        const mesesDesdeUltimo =
                            (new Date().getTime() -
                                new Date(ultimo.fecha).getTime()) /
                            (1000 * 60 * 60 * 24 * 30.44);
                        if (
                            plan.mesesIntervalo &&
                            mesesDesdeUltimo >= plan.mesesIntervalo
                        ) {
                            due = true;
                            razon = `Tiempo cumplido: ${Math.floor(mesesDesdeUltimo)} meses (Límite: ${plan.mesesIntervalo} meses)`;
                        }
                    }
                }

                if (due) {
                    // Look for any order related to this plan/vehicle that isn't completed
                    const orden = vehiculo.ordenesServicio.find(
                        (o) =>
                            o.planId === plan.id && o.estado !== "COMPLETADA" && o.estado !== "CANCELADA",
                    );

                    if (!orden) {
                        alertas.push({
                            vehiculoId: vehiculo.id,
                            placa: vehiculo.placa,
                            planId: plan.id,
                            planNombre: plan.nombre,
                            razon,
                            ultimoKilometraje: ultimo?.kilometraje || 0,
                            ultimaFecha: ultimo?.fecha || null,
                            kilometrajeActual: vehiculo.kilometrajeActual,
                        });
                    }
                }
            }
        }

        return { success: true, data: alertas };
    } catch (error) {
        logger.error({ error }, "Error calculating alerts");
        return {
            success: false,
            error: "Error al calcular alertas de mantenimiento",
        };
    }
}

/**
 * Get maintenance alerts for a specific vehicle
 */
export async function getAlertasMantenimientoPorVehiculo(vehiculoId: string) {
    try {
        const [vehiculo, planes] = await Promise.all([
            prisma.vehiculo.findUnique({
                where: { id: vehiculoId },
                include: {
                    mantenimientos: {
                        orderBy: { fecha: "desc"  },
                        include: { plan: true },
                    },
                },
            }),
            prisma.planMantenimiento.findMany(),
        ]);

        if (!vehiculo)
            return { success: false, error: "Vehículo no encontrado"  };
        const alertas = [];

        for (const plan of planes) {
            const ultimo = vehiculo.mantenimientos.find(
                (m) => m.planId === plan.id,
            );
            let due = false;
            let razon = "";

            if (!ultimo) {
                due = true;
                razon = "Nunca realizado";
            } else {
                if (
                    plan.frecuencia === "KILOMETROS" ||
                    plan.frecuencia === "AMBOS"
                ) {
                    const kmDesdeUltimo =
                        (vehiculo.kilometrajeActual || 0) - ultimo.kilometraje;
                    if (plan.kmIntervalo && kmDesdeUltimo >= plan.kmIntervalo) {
                        due = true;
                        razon = `Próximo cambio: +${kmDesdeUltimo}km`;
                    }
                }

                if (
                    !due &&
                    (plan.frecuencia === "TIEMPO" ||
                        plan.frecuencia === "AMBOS")
                ) {
                    const mesesDesdeUltimo =
                        (new Date().getTime() -
                            new Date(ultimo.fecha).getTime()) /
                        (1000 * 60 * 60 * 24 * 30.44);
                    if (
                        plan.mesesIntervalo &&
                        mesesDesdeUltimo >= plan.mesesIntervalo
                    ) {
                        due = true;
                        razon = `Vencido hace ${Math.floor(mesesDesdeUltimo)} meses`;
                    }
                }
            }

            if (due) {
                alertas.push({
                    planId: plan.id,
                    planNombre: plan.nombre,
                    razon,
                });
            }
        }

        return { success: true, data: alertas };
    } catch (error) {
        logger.error({ error }, "Error calculating vehicle alerts");
        return { success: false, error: "Error al calcular alertas"  };
    }
}
