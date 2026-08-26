"use client";

import { DocumentUploadCard } from "./document-upload-card";
import { FolderOpen, ShieldCheck, AlertCircle, FileText } from "lucide-react";

interface VehicleDocument {
    id: string;
    tipo: string;
    fechaVencimiento: Date | null;
    archivoId: string | null;
    archivo?: {
        rutaAbsoluta: string;
        nombreUnico: string;
        nombreOriginal: string;
    } | null;
    creadoEn: Date;
}

interface DocumentsTabProps {
    documentos: VehicleDocument[];
    vehiculoId: string;
}

const DOCUMENT_CONFIG: Record<string, { label: string; description: string; obligatorio: boolean }> = {
    SOAT: {
        label: "SOAT",
        description: "Seguro Obligatorio de Accidentes de Tránsito",
        obligatorio: true,
    },
    LICENCIA_TRANSITO: {
        label: "Licencia de Tránsito",
        description: "Tarjeta de propiedad del vehículo",
        obligatorio: true,
    },
    REVISION_TECNOMECANICA: {
        label: "Revisión Tecnomecánica",
        description: "Certificado de revisión físico-mecánica y gases",
        obligatorio: true,
    },
    TARJETA_OPERACION: {
        label: "Tarjeta de Operación",
        description: "Autorización para prestación del servicio público",
        obligatorio: true,
    },
    POLIZA_RESPONSABILIDAD_CIVIL: {
        label: "Póliza de Responsabilidad Civil Contractual y Extra Contractual",
        description: "Responsabilidad Civil Contractual (RCC) y Extracontractual (RCE)",
        obligatorio: true,
    },
};

export function DocumentsTab({ documentos, vehiculoId }: DocumentsTabProps) {
    const tiposObligatorios = Object.keys(DOCUMENT_CONFIG);

    const documentosPorTipo = documentos.reduce(
        (acc, doc) => {
            if (!acc[doc.tipo]) acc[doc.tipo] = [];
            acc[doc.tipo].push(doc);
            return acc;
        },
        {} as Record<string, VehicleDocument[]>,
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="bg-white border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start">
                <div className="h-16 w-16 bg-slate-900 flex items-center justify-center text-white shadow-xl">
                    <FolderOpen className="h-8 w-8" />
                </div>
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
                        Expediente Digital Maestro
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    </h3>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-600 mt-2 leading-relaxed max-w-2xl">
                        Centralización de documentos obligatorios para cumplimiento PESV y control de vigencias en tiempo real bajo estándares del Ministerio de Transporte.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-slate-100" />
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                        <FileText className="h-3 w-3" />
                        Documentación Técnica Obligatoria
                    </h4>
                    <div className="h-px flex-1 bg-slate-100" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {tiposObligatorios.map((tipo) => (
                        <DocumentUploadCard
                            key={tipo}
                            tipo={tipo}
                            label={DOCUMENT_CONFIG[tipo].label}
                            color="blue"
                            vehiculoId={vehiculoId}
                            description={DOCUMENT_CONFIG[tipo].description}
                            documents={documentosPorTipo[tipo] || []}
                        />
                    ))}
                </div>
            </div>

            {Object.keys(documentosPorTipo).some((tipo) => !tiposObligatorios.includes(tipo)) && (
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-slate-100" />
                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                            <AlertCircle className="h-3 w-3" />
                            Certificaciones Adicionales
                        </h4>
                        <div className="h-px flex-1 bg-slate-100" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {Object.entries(documentosPorTipo)
                            .filter(([tipo]) => !tiposObligatorios.includes(tipo))
                            .map(([tipo, docs]) => (
                                <DocumentUploadCard
                                    key={tipo}
                                    tipo={tipo}
                                    label={tipo.replace(/_/g, " ")}
                                    color="slate"
                                    vehiculoId={vehiculoId}
                                    documents={docs}
                                />
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}
