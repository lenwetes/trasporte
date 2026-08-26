export interface SGSSTUser {
    id: string;
    nombres: string;
    apellidos: string;
    numeroDocumento: string;
    rol: string;
    email: string;
    examenesMedicos: Array<{
        tipo: string;
        fechaRealizacion: string;
        fechaVencimiento: string | null;
        concepto: string;
    }>;
    entregasDotacion: Array<{
        fechaEntrega: string;
    }>;
}
