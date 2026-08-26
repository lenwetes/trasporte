"use client";

import { useState } from "react";
import { CertificadoForm } from "@/components/forms/certificado-form";

interface Certificado {
    id: string;
    nombre: string;
    institucion?: string | null;
    fechaEmision?: Date | null;
    fechaVencimiento?: Date | null;
    archivoId?: string | null;
    archivo?: {
        id: string;
        nombreUnico: string;
        nombreOriginal: string;
    } | null;
}

interface CertificadosSectionProps {
    usuarioId: string;
    certificados: Certificado[];
    onDelete: (id: string) => Promise<void>;
    onRefresh: () => void;
}

export function CertificadosSection({
    usuarioId,
    certificados,
    onDelete,
    onRefresh,
}: CertificadosSectionProps) {
    const [showForm, setShowForm] = useState(false);
    const [previewPdf, setPreviewPdf] = useState<string | null>(null);
    const [previewTitle, setPreviewTitle] = useState<string>("");

    const formatDate = (date: Date | null | undefined) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleViewPdf = (cert: Certificado) => {
        if (cert.archivo?.nombreUnico) {
            setPreviewPdf(`/api/files/${cert.archivo.nombreUnico}`);
            setPreviewTitle(cert.nombre);
        }
    };

    const handleDownloadPdf = (cert: Certificado) => {
        if (cert.archivo?.nombreUnico) {
            const link = document.createElement("a");
            link.href = `/api/files/${cert.archivo.nombreUnico}`;
            link.download = cert.archivo.nombreOriginal || `${cert.nombre}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <>
            <div style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", fontFamily: "sans-serif" }}>
                <div style={{ paddingBottom: "15px", borderBottom: "1px solid #f1f5f9", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>📜</span> Certificados y Cursos ({certificados.length})
                    </h3>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        style={{ padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "12px", border: "1px solid #e2e8f0", backgroundColor: showForm ? "#f1f5f9" : "#fff", color: "#0f172a" }}
                    >
                        {showForm ? "❌ Cancelar" : "➕ Agregar"}
                    </button>
                </div>
                
                <div>
                    {showForm && (
                        <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: "#f8fafc" }}>
                            <CertificadoForm
                                usuarioId={usuarioId}
                                onSuccess={() => {
                                    setShowForm(false);
                                    onRefresh();
                                }}
                                onCancel={() => setShowForm(false)}
                            />
                        </div>
                    )}

                    {certificados.length === 0 && !showForm ? (
                        <p style={{ textAlign: "center", padding: "20px", color: "#94a3b8", fontSize: "14px", border: "1px dashed #e2e8f0", borderRadius: "8px", margin: 0 }}>
                            No hay certificados registrados
                        </p>
                    ) : (
                        <div style={{ display: "grid", gap: "15px" }}>
                            {certificados.map((cert) => (
                                <div key={cert.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "15px", border: "1px solid #f1f5f9", borderRadius: "8px", backgroundColor: "#fff", flexWrap: "wrap", gap: "15px" }}>
                                    <div style={{ flex: 1, minWidth: "250px" }}>
                                        <h4 style={{ margin: "0 0 5px 0", fontSize: "15px", fontWeight: "bold", color: "#0f172a" }}>{cert.nombre}</h4>
                                        {cert.institucion && <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#475569" }}>{cert.institucion}</p>}
                                        
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", fontSize: "12px", color: "#64748b" }}>
                                            {cert.fechaEmision && <span>✅ Emitido: {formatDate(cert.fechaEmision)}</span>}
                                            {cert.fechaVencimiento && <span>⚠️ Vence: {formatDate(cert.fechaVencimiento)}</span>}
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                        {cert.archivo && (
                                            <div style={{ display: "flex", gap: "5px" }}>
                                                <button
                                                    onClick={() => handleViewPdf(cert)}
                                                    style={{ padding: "6px 10px", backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", cursor: "pointer", color: "#0f172a" }}
                                                >
                                                    👁️ Ver
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadPdf(cert)}
                                                    style={{ padding: "6px 10px", backgroundColor: "#fff", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", cursor: "pointer", color: "#0f172a" }}
                                                >
                                                    📥 Descargar
                                                </button>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => onDelete(cert.id)}
                                            style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "16px", padding: "5px" }}
                                            title="Eliminar"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Simple HTML */}
            {previewPdf && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px" }}>
                    <div style={{ backgroundColor: "#fff", borderRadius: "12px", width: "100%", maxWidth: "800px", height: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                        <div style={{ padding: "15px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8fafc" }}>
                            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>{previewTitle}</h3>
                            <button onClick={() => setPreviewPdf(null)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>❌</button>
                        </div>
                        <div style={{ flex: 1, backgroundColor: "#e2e8f0" }}>
                            <iframe
                                src={previewPdf}
                                style={{ width: "100%", height: "100%", border: "none" }}
                                title="Vista previa"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
