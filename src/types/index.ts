import { Prisma } from "@prisma/client";

/**
 * Global standardized response for all Server Actions
 */
export type ActionResult<T = unknown> = {
    success: boolean;
    data?: T;
    error?: string;
    errors?: Record<string, unknown>;
    message?: string;
    metadata?: {
        total?: number;
        page?: number;
        totalPages?: number;
        [key: string]: unknown;
    };
};

export type SiniestroWithRelations = Prisma.SiniestroGetPayload<{
    include: {
        conductor: {
            select: { nombres: true; apellidos: true; numeroDocumento: true };
        };
        vehiculo: { select: { placa: true; marca: true; modelo: true } };
        fotos: true;
        investigacion: true;
    };
}>;

export type NovedadWithRelations = Prisma.NovedadGetPayload<{
    include: {
        conductor: { select: { nombres: true; apellidos: true } };
        vehiculo: { select: { placa: true } };
    };
}>;

export type VehiculoWithRelations = Prisma.VehiculoGetPayload<{
    include: {
        documentos: true;
        vinculaciones: {
            where: { activo: true };
            include: {
                conductor: {
                    select: {
                        id: true;
                        nombres: true;
                        apellidos: true;
                        numeroDocumento: true;
                    };
                };
            };
        };
        mantenimientos: {
            include: {
                plan: true;
                factura: true;
            };
        };
        ordenesServicio: {
            include: {
                plan: true;
            };
        };
        siniestros: {
            include: {
                conductor: {
                    select: {
                        nombres: true;
                        apellidos: true;
                        numeroDocumento: true;
                    };
                };
                vehiculo: {
                    select: { placa: true; marca: true; modelo: true };
                };
                fotos: true;
                investigacion: true;
            };
        };
        propietarioUser: {
            select: {
                nombres: true;
                apellidos: true;
            };
        };
        _count: {
            select: {
                documentos: true;
                vinculaciones: true;
            };
        };
    };
}>;

export type UsuarioListItem = Prisma.UsuarioGetPayload<{
    select: {
        id: true;
        nombres: true;
        apellidos: true;
        email: true;
        telefono: true;
        rol: true;
        creadoEn: true;
        tipoDocumento: true;
        numeroDocumento: true;
        fotoPerfil: { select: { id: true; nombreUnico: true } };
        vinculaciones: {
            where: { activo: true };
            select: {
                id: true;
                vehiculo: {
                    select: {
                        id: true;
                        placa: true;
                        marca: true;
                        modelo: true;
                    };
                };
            };
        };
    };
}>;

export type UsuarioWithRelations = Prisma.UsuarioGetPayload<{
    include: {
        fotoPerfil: true,
        hojaVida: true,
        documentoIdentidad: true,
        experienciasLaborales: {
            include: { archivo: true }
        },
        certificados: {
            include: { archivo: true }
        },
        referenciasPersonales: true,
        licencias: {
            include: { archivo: true }
        },
        examenesMedicos: {
            include: { archivo: true }
        },
        vehiculosPropiedad: {
            include: { documentos: true }
        },
        vinculaciones: {
            where: { activo: true },
            include: {
                vehiculo: {
                    include: {
                        documentos: true
                    }
                }
            }
        },
        siniestrosAsociados: {
            include: {
                vehiculo: { select: { placa: true } }
            }
        },
        novedadesAsociadas: {
            include: {
                vehiculo: { select: { placa: true } }
            }
        }
    }
}>;


export type LibraryItem = {
    id: string;
    modulo:
        | "VEHICULOS"
        | "CONDUCTORES"
        | "MANTENIMIENTO"
        | "SINIESTROS"
        | "SAFETY";
    tipo: string;
    fecha: Date;
    nombreArchivo: string;
    archivoId: string;
    url: string;
    metadata: {
        placa?: string;
        conductor?: string;
        conductorCC?: string;
        mantenimientoPlan?: string;
        siniestroLugar?: string;
    };
};

export type ReporteFinanciero = {
    ingresos: {
        total: number;
        cuentas: Record<string, { nombre: string; valor: number }>;
    };
    gastos: {
        total: number;
        cuentas: Record<string, { nombre: string; valor: number }>;
    };
    costos: {
        total: number;
        cuentas: Record<string, { nombre: string; valor: number }>;
    };
    utilidadBruta: number;
    utilidadOperacional: number;
    utilidadNeta: number;
};

export type ItemCartera = {
    id: string;
    tercero: string;
    documento: string;
    placa: string;
    concepto: string;
    vence: Date;
    diasMora: number;
    rango: string;
    saldo: number;
};

export type ReporteCartera = {
    resumen: {
        total: number;
        corriente: number;
        vencido30: number;
        vencido60: number;
        vencido90: number;
    };
    cartera: ItemCartera[];
};

export type PreoperacionalWithRelations = Prisma.PreoperacionalGetPayload<{
    include: {
        vehiculo: { select: { placa: true } };
        conductor: { select: { nombres: true; apellidos: true } };
    };
}> & {
    detalles: {
        item: string;
        estado: boolean;
        criticidad: string;
        observacion: string | null;
    }[];
};

export type TransaccionWithRelations = Prisma.TransaccionGetPayload<{
    include: {
        asientos: { include: { cuenta: true } };
        tercero: true;
        proveedor: true;
        creadoPor: true;
        archivos: true;
    };
}>;

export type SimitMulta = {
    id: string;
    numeroComparendo: string;
    fecha: string;
    infraction: string;
    valor: number;
    estado: string;
    secretaria: string;
};

export type SafetyKPIsData = {
    periodo: number;
    totalSiniestros: number;
    totalDiasPerdidos: number;
    frecuencia: number;
    severidad: number;
    porGravedad: {
        soloDanos: number;
        conHeridos: number;
        mortal: number;
    };
};

export type AuditLogWithActor = Prisma.AuditLogGetPayload<{
    include: {
        actor: {
            select: {
                nombres: true;
                apellidos: true;
                rol: true;
            };
        };
    };
}>;
export type CuotaPrestamoItem = Prisma.CuotaPrestamoGetPayload<{}>;

export type PrestamoWithRelations = Prisma.PrestamoGetPayload<{
    include: {
        usuario: {
            select: {
                id: true;
                nombres: true;
                apellidos: true;
                numeroDocumento: true;
                telefono: true;
                direccion: true;
            };
        };
        cuotas: {
            orderBy: { numCuota: "asc" };
        };
    };
}>;

export interface DashboardData {
    totalPrestado: number;
    carteraVigente: number;
    prestamosActivos: number;
    fondoDisponible: number;
    cajaGeneral: number;
    nombreFondo: string;
    recientes: PrestamoWithRelations[];
}

export interface UnifiedReceivable {
    id: string;
    tipoPrincipal: "OBLIGACION" | "PRESTAMO";
    tipo: string;
    usuario: {
        id: string;
        nombres: string;
        apellidos: string;
        numeroDocumento: string | null;
    };
    vehiculo?: {
        id: string;
        placa: string;
    } | null;
    fechaVence: Date | string;
    periodo?: Date | string | null;
    montoInicial: number;
    saldoPendiente: number;
    estado: string;
    consecutivo: string;
}
export interface Notificacion {
    id: string;
    titulo: string;
    mensaje: string;
    tipo: "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "MANTENIMIENTO";
    leida: Boolean;
    vinculo?: string | null;
    creadoEn: Date;
}
