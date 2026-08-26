"use server";

import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/safe-action";
import { ActionResult, LibraryItem } from "@/types";
import { Prisma } from "@prisma/client";

export interface LibraryFilters {
    placa?: string;
    conductorId?: string;
    conductorCC?: string; // Search by CC
    query?: string; // Search by conductor name or file name
    tipo?: string;
    modulo?:
        | "VEHICULOS"
        | "CONDUCTORES"
        | "MANTENIMIENTO"
        | "SINIESTROS"
        | "SAFETY";
    fechaInicio?: string;
    fechaFin?: string;
}

/**
 * Patrón 5.1: Búsqueda multifactor en la biblioteca institucional
 */
export const searchFleetLibrary = withAuth(
    async (
        session,
        filtersInput: unknown,
    ): Promise<ActionResult<unknown>> => {
        const filters = (filtersInput as LibraryFilters) || {};
        const {
            placa,
            conductorId,
            conductorCC,
            query,
            tipo,
            modulo,
            fechaInicio,
            fechaFin,
        } = filters;

        const dateRange: Prisma.DateTimeFilter = {};
        if (fechaInicio) dateRange.gte = new Date(fechaInicio);
        if (fechaFin) dateRange.lte = new Date(fechaFin);

        const hasDateFilter = Object.keys(dateRange).length > 0;

        // Filtros comunes
        const userFilter: Prisma.UsuarioWhereInput = {};
        if (conductorId) userFilter.id = conductorId;
        if (conductorCC) userFilter.numeroDocumento = { contains: conductorCC };
        if (query) {
            userFilter.OR = [
                { nombres: { contains: query, mode: "insensitive" } },
                { apellidos: { contains: query, mode: "insensitive" } },
            ];
        }

        const vehicleFilter: Prisma.VehiculoWhereInput = {};
        if (placa)
            vehicleFilter.placa = { contains: placa, mode: "insensitive" };
        const items: LibraryItem[] = [];

        // 1. CONDUCTORES (Licencias, Certificados, Exámenes)
        if (!modulo || modulo === "CONDUCTORES" || modulo === "SAFETY") {
            const licencias = await prisma.detalleLicencia.findMany({
                where: {
                    usuario: userFilter,
                    archivoId: { not: null },
                    ...(hasDateFilter ? { fechaVencimiento: dateRange } : {}),
                    ...(tipo
                        ? { categoria: { contains: tipo, mode: "insensitive" } }
                        : {}),
                },
                include: { usuario: true, archivo: true },
            });

            licencias.forEach((l) => {
                if (l.archivo) {
                    items.push({
                        id: l.id,
                        modulo: "CONDUCTORES",
                        tipo: `LICENCIA ${l.categoria}`,
                        fecha: l.fechaVencimiento || new Date(),
                        nombreArchivo: l.archivo.nombreOriginal,
                        archivoId: l.archivoId!,
                        url: `/api/files/${l.archivo.nombreUnico}`,
                        metadata: {
                            conductor: `${l.usuario.nombres} ${l.usuario.apellidos}`,
                            conductorCC: l.usuario.numeroDocumento || undefined,
                        },
                    });
                }
            });

            const certificados = await prisma.certificado.findMany({
                where: {
                    usuario: userFilter,
                    archivoId: { not: null },
                    ...(hasDateFilter ? { fechaEmision: dateRange } : {}),
                    ...(tipo
                        ? { nombre: { contains: tipo, mode: "insensitive" } }
                        : {}),
                },
                include: { usuario: true, archivo: true },
            });

            certificados.forEach((c) => {
                if (c.archivo) {
                    items.push({
                        id: c.id,
                        modulo: "CONDUCTORES",
                        tipo: c.nombre.toUpperCase(),
                        fecha: c.fechaEmision || c.creadoEn,
                        nombreArchivo: c.archivo.nombreOriginal,
                        archivoId: c.archivoId!,
                        url: `/api/files/${c.archivo.nombreUnico}`,
                        metadata: {
                            conductor: `${c.usuario.nombres} ${c.usuario.apellidos}`,
                            conductorCC: c.usuario.numeroDocumento || undefined,
                        },
                    });
                }
            });

            const examenes = await prisma.examenMedico.findMany({
                where: {
                    conductor: userFilter,
                    archivoId: { not: null },
                    ...(hasDateFilter ? { fechaRealizacion: dateRange } : {}),
                },
                include: { conductor: true, archivo: true },
            });

            examenes.forEach((e) => {
                if (e.archivo) {
                    items.push({
                        id: e.id,
                        modulo: "SAFETY",
                        tipo: `EXAMEN MÉDICO ${e.tipo}`,
                        fecha: e.fechaRealizacion || new Date(),
                        nombreArchivo: e.archivo.nombreOriginal,
                        archivoId: e.archivoId!,
                        url: `/api/files/${e.conductor.nombres} ${e.conductor.apellidos}`,
                        metadata: {
                            conductor: `${e.conductor.nombres} ${e.conductor.apellidos}`,
                            conductorCC:
                                e.conductor.numeroDocumento || undefined,
                        },
                    });
                }
            });
        }

        // 2. VEHICULOS (Documentos SOAT/TECNOMECANICA, etc)
        if (!modulo || modulo === "VEHICULOS") {
            const documentos = await prisma.documentoVehiculo.findMany({
                where: {
                    vehiculo: vehicleFilter,
                    archivoId: { not: null },
                    ...(hasDateFilter ? { fechaVencimiento: dateRange } : {}),
                    ...(tipo
                        ? { tipo: { contains: tipo, mode: "insensitive" } }
                        : {}),
                },
                include: { vehiculo: true, archivo: true },
            });

            documentos.forEach((d) => {
                if (d.archivo) {
                    items.push({
                        id: d.id,
                        modulo: "VEHICULOS",
                        tipo: d.tipo,
                        fecha: d.fechaVencimiento || new Date(),
                        nombreArchivo: d.archivo.nombreOriginal,
                        archivoId: d.archivoId!,
                        url: `/api/files/${d.archivo.nombreUnico}`,
                        metadata: {
                            placa: d.vehiculo.placa,
                        },
                    });
                }
            });
        }

        // 3. MANTENIMIENTO
        if (!modulo || modulo === "MANTENIMIENTO") {
            const mantenimientos = await prisma.mantenimientoRealizado.findMany(
                {
                    where: {
                        vehiculo: vehicleFilter,
                        archivoId: { not: null },
                        ...(hasDateFilter ? { fecha: dateRange } : {}),
                    },
                    include: { vehiculo: true, plan: true, factura: true },
                },
            );

            mantenimientos.forEach((m) => {
                if (m.factura) {
                    items.push({
                        id: m.id,
                        modulo: "MANTENIMIENTO",
                        tipo: `FACTURA MANTENIMIENTO`,
                        fecha: m.fecha,
                        nombreArchivo: m.factura.nombreOriginal,
                        archivoId: m.archivoId!,
                        url: `/api/files/${m.factura.nombreUnico}`,
                        metadata: {
                            placa: m.vehiculo.placa,
                            mantenimientoPlan: m.plan.nombre,
                        },
                    });
                }
            });
        }

        // 4. SINIESTROS
        if (!modulo || modulo === "SINIESTROS") {
            const siniestros = await prisma.siniestro.findMany({
                where: {
                    vehiculo: vehicleFilter,
                    conductor: userFilter,
                    ...(hasDateFilter ? { fecha: dateRange } : {}),
                },
                include: { conductor: true, vehiculo: true, fotos: true },
            });

            siniestros.forEach((s) => {
                s.fotos.forEach((f) => {
                    items.push({
                        id: f.id,
                        modulo: "SINIESTROS",
                        tipo: "FOTO SINIESTRO",
                        fecha: s.fecha,
                        nombreArchivo: f.nombreOriginal,
                        archivoId: f.id,
                        url: `/api/files/${f.nombreUnico}`,
                        metadata: {
                            placa: s.vehiculo.placa,
                            conductor: `${s.conductor.nombres} ${s.conductor.apellidos}`,
                            siniestroLugar: s.lugar,
                        },
                    });
                });
            });
        }

        // Ordenar por fecha descendente
        items.sort((a, b) => (b.fecha?.getTime() || 0) - (a.fecha?.getTime() || 0));

        return { success: true, data: items };
    },
);
