/**
 * Tipos compartidos para el módulo de configuración financiera.
 * Single Source of Truth para el estado del formulario de settings.
 */

/** Estado del formulario de configuración financiera global. */
export interface ConfigForm {
    montoCuotaAdministracion: number;
    umbralBloqueoMora: number;
    porcentajeMoraDiaria: number;
    cuentaPrestamosId: string;
    cuentaCajaId: string;
    cuentaBancosId: string;
}
