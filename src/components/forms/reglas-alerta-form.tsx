"use client";

import React, { useState } from "react";
import { upsertReglaAlerta } from "@/actions";

interface ReglaAlertaRowProps {
    tipo: string;
    label: string;
    initialData?: any;
}

function ReglaAlertaRow({ tipo, label, initialData }: ReglaAlertaRowProps) {
    const [dias, setDias] = useState(initialData?.diasAnticipacion || 30);
    const [activo, setActivo] = useState(initialData?.activo ?? true);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        setSaved(false);
        try {
            const result = await upsertReglaAlerta({
                tipoDocumento: tipo,
                diasAnticipacion: dias,
                activo,
            });
            if (result.success) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error(error);
            alert("Error al guardar la regla");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "15px", borderBottom: "1px solid #eee", marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h4 style={{ margin: "0 0 5px 0", fontSize: "14px" }}>{label}</h4>
                    <p style={{ margin: 0, color: "#666", fontSize: "11px" }}>Configurar alerta anticipada</p>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <span style={{ fontSize: "12px" }}>Días:</span>
                        <input 
                            type="number"
                            value={dias}
                            onChange={(e) => setDias(parseInt(e.target.value) || 0)}
                            style={{ width: "60px", padding: "4px" }}
                        />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <input 
                            type="checkbox"
                            checked={activo}
                            onChange={(e) => setActivo(e.target.checked)}
                        />
                        <span style={{ fontSize: "12px" }}>{activo ? "Activo" : "Inactivo"}</span>
                    </div>
                    <button 
                        onClick={handleSave}
                        disabled={loading}
                        style={{ 
                            padding: "6px 15px", 
                            backgroundColor: saved ? "#4caf50" : "#000", 
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: loading ? "not-allowed" : "pointer",
                            fontSize: "12px"
                        }}
                    >
                        {loading ? "..." : (saved ? "Guardado" : "Guardar")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function ReglasAlertaForm({
    initialReglas,
}: {
    initialReglas: any[];
}) {
    const documentTypes = [
        { id: "SOAT", label: "SOAT" },
        { id: "TECNOMECANICA", label: "Revisión Tecnomecánica" },
        { id: "TARJETA_OPERACION", label: "Tarjeta de Operación" },
        { id: "POLIZA_RESPONSABILIDAD_CIVIL", label: "Póliza de Responsabilidad Civil Contractual y Extra Contractual" },
        { id: "LICENCIA", label: "Licencia de Conducción" },
    ];

    return (
        <div style={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #ddd" }}>
            {documentTypes.map((type) => (
                <ReglaAlertaRow
                    key={type.id}
                    tipo={type.id}
                    label={type.label}
                    initialData={initialReglas.find(
                        (r) => r.tipoDocumento === type.id,
                    )}
                />
            ))}
        </div>
    );
}
