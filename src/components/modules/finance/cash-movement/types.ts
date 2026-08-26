/**
 * Tipos compartidos del módulo CashMovement
 */
import { ConceptoFinanciero, CuentaContable, MetodoPago, ConfiguracionGlobal } from "@prisma/client";

export type TipoMovimiento = "INGRESO" | "EGRESO" | "SALDO_INICIAL";
export type TerceroType = "user" | "provider";

export interface TerceroData {
    id: string;
    type: TerceroType;
    nombres: string;
    apellidos?: string;
    documento?: string;
}

export interface FinanceMetadata {
    usuarios: {
        id: string;
        nombres: string;
        apellidos: string;
        numeroDocumento: string | null;
    }[];
    proveedores: {
        id: string;
        nombres: string;
        numeroDocumento: string | null;
    }[];
}

export type ConceptoWithCuenta = ConceptoFinanciero & {
    cuenta: CuentaContable;
};

export interface CashMovementFormProps {
    conceptosIngreso: ConceptoWithCuenta[];
    conceptosEgreso: ConceptoWithCuenta[];
}

export interface FinanceSettingsData {
    configuracionGlobal: ConfiguracionGlobal | null;
}
