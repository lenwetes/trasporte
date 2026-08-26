"use strict";
exports.__esModule = true;
exports.UsuarioInclude = exports.USER_FULL_INCLUDE = exports.UsuarioSelect = exports.Prisma = exports.satisfies = exports.USER_LIST_SELECT = void 0;
/**
 * Standard selection for user lists to keep results lean
 */
exports.USER_LIST_SELECT = {
    id: true,
    nombres: true,
    apellidos: true,
    email: true,
    telefono: true,
    rol: true,
    creadoEn: true,
    tipoDocumento: true,
    numeroDocumento: true,
    fotoPerfil: { select: { id: true, nombreUnico: true } },
    vinculaciones: {
        where: { activo: true },
        select: {
            id: true,
            vehiculo: {
                select: {
                    id: true,
                    placa: true,
                    marca: true,
                    modelo: true
                }
            }
        }
    }
};
/**
 * Standard relations to include when fetching a full user profile
 */
exports.USER_FULL_INCLUDE = {
    hojaVida: true,
    fotoPerfil: true,
    documentoIdentidad: true,
    vehiculosPropiedad: { include: { documentos: true } },
    vinculaciones: {
        where: { activo: true },
        include: {
            vehiculo: { include: { documentos: true } }
        }
    },
    certificados: { include: { archivo: true } },
    experienciasLaborales: {
        include: { archivo: true },
        orderBy: { fechaInicio: "desc" }
    },
    referenciasPersonales: true,
    siniestrosAsociados: {
        include: { vehiculo: { select: { placa: true } } },
        orderBy: { fecha: "desc" }
    },
    novedadesAsociadas: {
        include: { vehiculo: { select: { placa: true } } },
        orderBy: { fecha: "desc" }
    },
    licencias: {
        include: { archivo: true },
        orderBy: { fechaVencimiento: "desc" }
    },
    examenesMedicos: {
        include: { archivo: true },
        orderBy: { fechaRealizacion: "desc" }
    }
};
