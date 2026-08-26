"use client";

import { useState } from "react";
import { ReferenciaPersonalForm } from "@/components/forms/referencia-personal-form";

interface Referencia {
    id: string;
    nombre: string;
    ocupacion?: string | null;
    telefono?: string | null;
}

interface ReferenciasSectionProps {
    usuarioId: string;
    referencias: Referencia[];
    onDelete: (id: string) => Promise<void>;
    onRefresh: () => void;
}

export function ReferenciasSection({
    usuarioId,
    referencias,
    onDelete,
    onRefresh,
}: ReferenciasSectionProps) {
    const [showForm, setShowForm] = useState(false);

    return (
        <div style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", fontFamily: "sans-serif" }}>
            <div style={{ paddingBottom: "15px", borderBottom: "1px solid #f1f5f9", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>🤝</span> Referencias Personales ({referencias.length})
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
                        <ReferenciaPersonalForm
                            usuarioId={usuarioId}
                            onSuccess={() => {
                                setShowForm(false);
                                onRefresh();
                            }}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                )}

                {referencias.length === 0 && !showForm ? (
                    <p style={{ textAlign: "center", padding: "20px", color: "#94a3b8", fontSize: "14px", border: "1px dashed #e2e8f0", borderRadius: "8px", margin: 0 }}>
                        No hay referencias personales registradas
                    </p>
                ) : (
                    <div style={{ display: "grid", gap: "10px" }}>
                        {referencias.map((ref) => (
                            <div key={ref.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 15px", border: "1px solid #f1f5f9", borderRadius: "8px", backgroundColor: "#fff" }}>
                                <div>
                                    <h4 style={{ margin: "0 0 5px 0", fontSize: "14px", fontWeight: "bold" }}>{ref.nombre}</h4>
                                    <div style={{ display: "flex", gap: "10px", fontSize: "12px", color: "#64748b" }}>
                                        {ref.ocupacion && <span>💼 {ref.ocupacion}</span>}
                                        {ref.telefono && <span>📞 {ref.telefono}</span>}
                                    </div>
                                </div>
                                <button
                                    onClick={() => onDelete(ref.id)}
                                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "16px", padding: "5px" }}
                                    title="Eliminar"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
