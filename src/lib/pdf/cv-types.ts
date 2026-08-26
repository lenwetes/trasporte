export interface CVData {
    config?: {
        nombreEmpresa?: string | null;
        colorPrimario?: string | null;
        telefono?: string | null;
        email?: string | null;
        direccion?: string | null;
        nit?: string | null;
        logoLocalPath?: string | null;
        logoUrl?: string | null;
    } | null;
    usuario: {
        id: string;
        nombres: string;
        apellidos: string;
        email?: string | null;
        telefono?: string | null;
        direccion?: string | null;
        numeroDocumento?: string | null;
        tipoDocumento: string;
        fechaNacimiento?: Date | string | null;
        lugarNacimiento?: string | null;
        estadoCivil?: string | null;
        municipio?: string | null;
        fotoPerfil?: { nombreUnico: string } | null;
        documentoIdentidad?: { nombreUnico: string } | null;
    };
    numeroLicencia?: string | null;
    licencias?: Array<{
        categoria: string;
        servicio: string;
        fechaVencimiento: Date | string;
        archivo?: { nombreUnico: string } | null;
    }>;
    hojaVida?: {
        rh?: string | null;
        eps?: string | null;
        arl?: string | null;
        fondoPensiones?: string | null;
        fondoCesantias?: string | null;
        contactoEmergenciaNombre?: string | null;
        contactoEmergenciaTelefono?: string | null;
        perfilProfesional?: string | null;
    } | null;
    certificados: Array<{
        nombre: string;
        institucion?: string | null;
        fechaEmision?: Date | string | null;
        archivo?: { nombreUnico: string } | null;
    }>;
    experienciasLaborales: Array<{
        cargo: string;
        empresa: string;
        tiempoLaborado?: string | null;
        jefeInmediato?: string | null;
        telefonoJefe?: string | null;
        archivo?: { nombreUnico: string } | null;
    }>;
    referenciasPersonales: Array<{
        nombre: string;
        ocupacion?: string | null;
        telefono?: string | null;
    }>;
}
