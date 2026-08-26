"use client";

import { useState } from "react";
import { ExperienciaLaboralForm } from "@/components/forms/experiencia-laboral-form";

interface Experiencia {
    id: string;
    empresa: string;
    cargo: string;
    jefeInmediato?: string | null;
    telefonoJefe?: string | null;
    fechaInicio?: Date | null;
    fechaFin?: Date | null;
    tiempoLaborado?: string | null;
}

interface ExperienciaSectionProps {
    usuarioId: string;
    experiencias: Experiencia[];
    onDelete: (id: string) => Promise<void>;
    onRefresh: () => void;
}

export function ExperienciaSection({
    usuarioId,
    experiencias,
    onDelete,
    onRefresh,
}: ExperienciaSectionProps) {
    const [showForm, setShowForm] = useState(false);

    const formatDate = (date: Date | null | undefined) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", fontFamily: "sans-serif" }}>
            <div style={{ paddingBottom: "15px", borderBottom: "1px solid #f1f5f9", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>💼</span> Experiencia Laboral ({experiencias.length})
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
                        <ExperienciaLaboralForm
                            usuarioId={usuarioId}
                            onSuccess={() => {
                                setShowForm(false);
                                onRefresh();
                            }}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                )}

                {experiencias.length === 0 && !showForm ? (
                    <p style={{ textAlign: "center", padding: "20px", color: "#94a3b8", fontSize: "14px", border: "1px dashed #e2e8f0", borderRadius: "8px", margin: 0 }}>
                        No hay experiencias laborales registradas
                    </p>
                ) : (
                    <div style={{ display: "grid", gap: "15px" }}>
                        {experiencias.map((exp) => (
                            <div key={exp.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "15px", border: "1px solid #f1f5f9", borderRadius: "8px", backgroundColor: "#fff" }}>
                                <div>
                                    <h4 style={{ margin: "0 0 5px 0", fontSize: "15px", fontWeight: "bold", color: "#0f172a" }}>{exp.cargo}</h4>
                                    <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#334155", fontWeight: "500" }}>{exp.empresa}</p>
                                    
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", fontSize: "12px", color: "#64748b", marginBottom: "8px" }}>
                                        {exp.fechaInicio && <span>📅 Inicio: {formatDate(exp.fechaInicio)}</span>}
                                        {exp.fechaFin && <span>📅 Fin: {formatDate(exp.fechaFin)}</span>}
                                        {exp.tiempoLaborado && <span style={{ backgroundColor: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>⏱️ {exp.tiempoLaborado}</span>}
                                    </div>
                                    
                                    {exp.jefeInmediato && (
                                        <p style={{ margin: 0, fontSize: "12px", color: "#475569" }}>
                                            👤 Jefe: <strong>{exp.jefeInmediato}</strong> {exp.telefonoJefe && `📞 ${exp.telefonoJefe}`}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => onDelete(exp.id)}
                                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "16px", padding: "5px", flexShrink: 0 }}
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
