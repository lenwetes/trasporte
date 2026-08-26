"use client";

import { useHojaVida } from "./hoja-vida/use-hoja-vida";
import { BasicaSection } from "./hoja-vida/basica-section";
import { CertificadosSection } from "./hoja-vida/certificados-section";
import { ExperienciaSection } from "./hoja-vida/experiencia-section";
import { ReferenciasSection } from "./hoja-vida/referencias-section";

interface HojaVidaData {
    config?: {
        nombreEmpresa?: string | null;
        colorPrimario?: string | null;
        telefono?: string | null;
        email?: string | null;
        direccion?: string | null;
    } | null;
    usuario: {
        id: string;
        nombres: string;
        apellidos: string;
        email: string;
        telefono?: string | null;
        direccion?: string | null;
        tipoDocumento: string;
        numeroDocumento: string;
        fotoPerfil?: { nombreUnico: string } | null;
    };
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
        id: string;
        nombre: string;
        institucion?: string | null;
        fechaEmision?: Date | null;
        fechaVencimiento?: Date | null;
        archivo?: {
            id: string;
            nombreUnico: string;
            nombreOriginal: string;
        } | null;
    }>;
    experienciasLaborales: Array<{
        id: string;
        empresa: string;
        cargo: string;
        jefeInmediato?: string | null;
        telefonoJefe?: string | null;
        fechaInicio?: Date | null;
        fechaFin?: Date | null;
        tiempoLaborado?: string | null;
    }>;
    referenciasPersonales: Array<{
        id: string;
        nombre: string;
        ocupacion?: string | null;
        telefono?: string | null;
    }>;
}

interface HojaVidaClientProps {
    data: HojaVidaData;
}

export function HojaVidaClient({ data }: HojaVidaClientProps) {
    const {
        handleDeleteCertificado,
        handleDeleteExperiencia,
        handleDeleteReferencia,
        handleSaveBasicInfo,
        handleDownloadPDF,
        onRefresh,
    } = useHojaVida(data.usuario.id);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "30px", fontFamily: "sans-serif" }}>
            <BasicaSection
                data={data.hojaVida}
                onSave={handleSaveBasicInfo}
                isSubmitting={false}
            />

            <CertificadosSection
                usuarioId={data.usuario.id}
                certificados={data.certificados}
                onDelete={handleDeleteCertificado}
                onRefresh={onRefresh}
            />

            <ExperienciaSection
                usuarioId={data.usuario.id}
                experiencias={data.experienciasLaborales}
                onDelete={handleDeleteExperiencia}
                onRefresh={onRefresh}
            />

            <ReferenciasSection
                usuarioId={data.usuario.id}
                referencias={data.referenciasPersonales}
                onDelete={handleDeleteReferencia}
                onRefresh={onRefresh}
            />

            {/* Consolidado PDF */}
            <div style={{ padding: "25px", border: "1px solid #e2e8f0", borderRadius: "12px", backgroundColor: "#f8fafc" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
                    <div>
                        <h3 style={{ margin: "0 0 5px 0", fontSize: "16px", fontWeight: "bold" }}>📄 Generar Hoja de Vida Completa</h3>
                        <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Descarga un PDF consolidado con toda tu información profesional</p>
                    </div>
                    <button
                        onClick={() => handleDownloadPDF(data)}
                        style={{ 
                            padding: "10px 20px", 
                            backgroundColor: "#0f172a", 
                            color: "#fff", 
                            border: "none", 
                            borderRadius: "8px", 
                            fontWeight: "bold", 
                            cursor: "pointer",
                            fontSize: "14px"
                        }}
                    >
                        📥 Descargar Acta Consolidada
                    </button>
                </div>
            </div>
        </div>
    );
}
