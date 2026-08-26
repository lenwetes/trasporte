"use client";

const DOC_TYPES = [
    { id: "LICENCIA_TRANSITO", label: "Licencia de Tránsito"  },
    { id: "SOAT", label: "SOAT"  },
    { id: "REVISION_TECNOMECANICA", label: "Revisión Tecnomecánica"  },
    { id: "TARJETA_OPERACION", label: "Tarjeta de Operación"  },
    { id: "POLIZA_RESPONSABILIDAD_CIVIL", label: "Póliza de Responsabilidad Civil Contractual y Extra Contractual"  },
];

interface DocumentsSectionProps {
    files: Record<string, File>;
    expiryDates: Record<string, string>;
    onFileChange: (type: string, file: File | null) => void;
    onDateChange: (type: string, date: string) => void;
}

export function DocumentsSection({
    files,
    expiryDates,
    onFileChange,
    onDateChange,
}: DocumentsSectionProps) {
    return (
        <section style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", fontFamily: "sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", borderBottom: "1px solid #f1f5f9", paddingBottom: "15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ fontSize: "20px" }}>🛡️</div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "bold", color: "#0f172a" }}>Bóveda Digital</h3>
                        <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>Gestión de Anexos y Vencimientos</p>
                    </div>
                </div>
                <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "bold", textTransform: "uppercase" }}>
                    Formatos: PDF, JPG, PNG (Max 10MB)
                </div>
            </div>

            <div style={{ display: "grid", gap: "12px" }}>
                {DOC_TYPES.map((doc) => (
                    <div key={doc.id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "15px", alignItems: "center", padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: files[doc.id] ? "#d1fae5" : "#f1f5f9", borderRadius: "5px", fontSize: "12px" }}>
                                {files[doc.id] ? "✅" : "📄"}
                            </div>
                            <span style={{ fontSize: "13px", fontWeight: "bold", color: "#334155" }}>{doc.label}</span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <label style={{ fontSize: "11px", color: "#64748b", fontWeight: "bold" }}>Vence:</label>
                            <input 
                                type="date" 
                                value={expiryDates[doc.id] || ""} 
                                onChange={(e) => onDateChange(doc.id, e.target.value)}
                                style={{ padding: "4px 8px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px", outline: "none" }}
                            />
                        </div>

                        <div>
                            <input 
                                type="file" 
                                id={`file-${doc.id}`} 
                                hidden 
                                accept=".pdf,image/*" 
                                onChange={(e) => onFileChange(doc.id, e.target.files?.[0] || null)}
                            />
                            <label 
                                htmlFor={`file-${doc.id}`} 
                                style={{ 
                                    padding: "6px 12px", 
                                    backgroundColor: files[doc.id] ? "#059669" : "#0f172a", 
                                    color: "#fff", 
                                    borderRadius: "4px", 
                                    fontSize: "11px", 
                                    fontWeight: "bold", 
                                    cursor: "pointer",
                                    display: "block"
                                }}
                            >
                                {files[doc.id] ? "Sustituir" : "Subir Archivo"}
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
