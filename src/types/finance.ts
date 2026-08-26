import {
    Transaccion,
    AsientoContable,
    CuentaContable,
    ConceptoFinanciero,
} from "@prisma/client";

export type TransaccionWithAsientos = Transaccion & {
    asientos: (AsientoContable & {
        cuenta: CuentaContable;
    })[];
    tercero: {
        nombres: string;
        apellidos: string;
    } | null;
    creadoPor: {
        nombres: string;
        apellidos: string;
    };
};

export type ConceptoWithCuenta = ConceptoFinanciero & {
    cuenta: CuentaContable;
};

export interface FinanceStats {
    ingresosHoy: number;
    egresosHoy: number;
    balanceHoy: number;
    countIngresos: number;
    countEgresos: number;
    movimientosTotales: number;
}
export interface FinancialReportData {
    ingresos: {
        total: number;
        cuentas: Record<string, { nombre: string; valor: number }>;
    };
    costos: {
        total: number;
        cuentas: Record<string, { nombre: string; valor: number }>;
    };
    gastos: {
        total: number;
        cuentas: Record<string, { nombre: string; valor: number }>;
    };
    utilidadBruta: number;
    utilidadOperacional: number;
    utilidadNeta: number;
}
