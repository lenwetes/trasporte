import { prisma } from "@/lib/prisma";
import { Rol } from "@prisma/client";

export type SearchResultItem = {
    id: string;
    type: "vehicle" | "user" | "order" | "document" | "maintenance";
    title: string;
    subtitle: string;
    url: string;
    metadata?: Record<string, unknown>;
};

export class SearchService {
    /**
     * Realiza una búsqueda global en múltiples entidades del sistema
     * @param query Texto a buscar
     * @param role Rol del usuario que busca (para filtrar resultados sensibles)
     */
    static async searchGlobal(
        query: string,
        role: Rol,
    ): Promise<SearchResultItem[]> {
        if (!query || query.length < 2) return [];

        const isStaff = role === "ADMIN" || role === "SECRETARIA";

        // Normalizar query para búsqueda insensible (Postgres ilike se maneja con mode: insensitive)
        const searchMode = "insensitive" as const;

        const promises = [];

        // 1. Búsqueda de Vehículos (Todos pueden buscar, pero con diferente detalle)
        promises.push(
            prisma.vehiculo
                .findMany({
                    where: {
                        OR: [
                            { placa: { contains: query, mode: searchMode } },
                            { marca: { contains: query, mode: searchMode } },
                            { modelo: { contains: query, mode: searchMode } },
                            {
                                numeroChasis: {
                                    contains: query,
                                    mode: searchMode,
                                },
                            },
                        ],
                        eliminadoEn: null,
                    },
                    take: 5,
                    include: { propietarioUser: true },
                })
                .then((vehicles) =>
                    vehicles.map((v) => ({
                        id: v.id,
                        type: "vehicle" as const,
                        title: `Vehículo ${v.placa}`,
                        subtitle: `${v.marca} ${v.modelo || ""} - ${v.propietario || "Sin propietario"}`,
                        url: `/dashboard/vehiculos/${v.id}`,
                    })),
                ),
        );

        // 2. Búsqueda de Usuarios (Solo Staff)
        if (isStaff) {
            promises.push(
                prisma.usuario
                    .findMany({
                        where: {
                            OR: [
                                {
                                    nombres: {
                                        contains: query,
                                        mode: searchMode,
                                    },
                                },
                                {
                                    apellidos: {
                                        contains: query,
                                        mode: searchMode,
                                    },
                                },
                                {
                                    numeroDocumento: {
                                        contains: query,
                                        mode: searchMode,
                                    },
                                },
                                {
                                    email: {
                                        contains: query,
                                        mode: searchMode,
                                    },
                                },
                            ],
                            eliminadoEn: null,
                        },
                        take: 5,
                    })
                    .then((users) =>
                        users.map((u) => ({
                            id: u.id,
                            type: "user" as const,
                            title: `${u.nombres} ${u.apellidos}`,
                            subtitle: `${u.rol} - CC: ${u.numeroDocumento || "N/A"}`,
                            url: `/dashboard/usuarios/${u.id}`,
                        })),
                    ),
            );
        }

        // 3. Búsqueda de Órdenes de Servicio (Solo Staff)
        if (isStaff) {
            promises.push(
                prisma.ordenServicio
                    .findMany({
                        where: {
                            OR: [
                                {
                                    codigo: {
                                        contains: query,
                                        mode: searchMode,
                                    },
                                },
                            ],
                            eliminadoEn: null,
                        },
                        take: 3,
                        include: { vehiculo: true },
                    })
                    .then((orders) =>
                        orders.map((o) => ({
                            id: o.id,
                            type: "order" as const,
                            title: `Orden ${o.codigo}`,
                            subtitle: `Vehículo: ${o.vehiculo.placa} - Estado: ${o.estado}`,
                            url: `/dashboard/mantenimiento/ordenes/${o.id}`, // Asumiendo ruta, validar
                        })),
                    ),
            );
        }

        // 4. Búsqueda de Documentos / Archivos (Solo Staff - Deep Indexing)
        if (isStaff) {
            promises.push(
                prisma.repositorioArchivo
                    .findMany({
                        where: {
                            nombreOriginal: {
                                contains: query,
                                mode: searchMode,
                            },
                        },
                        take: 5,
                        include: {
                            documento: { include: { vehiculo: true } },
                            licencias: { include: { usuario: true } },
                            comprobanteOrden: true,
                        },
                    })
                    .then((files) =>
                        files.map((f) => {
                            let context = "Archivo General";
                            let url = "#"; // Default fallback

                            if (f.documento) {
                                context = `Doc. Vehículo ${f.documento.vehiculo.placa} (${f.documento.tipo})`;
                                url = `/dashboard/vehiculos/${f.documento.vehiculo.id}?tab=documentos`;
                            } else if (f.licencias && f.licencias.length > 0) {
                                const lic = f.licencias[0];
                                context = `Licencia ${lic.usuario.nombres}`;
                                url = `/dashboard/usuarios/${lic.usuario.id}?tab=documentos`;
                            } else if (f.comprobanteOrden) {
                                context = "Comprobante Orden de Servicio";
                            }

                            return {
                                id: f.id,
                                type: "document" as const,
                                title: f.nombreOriginal,
                                subtitle: context,
                                url: url,
                            };
                        }),
                    ),
            );
        }

        // Ejecutar todas las promesas en paralelo
        const results = await Promise.all(promises);
        return results.flat();
    }
}
