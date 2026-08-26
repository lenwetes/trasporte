import React from "react";

interface MaintenanceHeaderProps {
    onNewRecord: () => void;
    onNewPlan: () => void;
}

export function MaintenanceHeader({
    onNewRecord,
    onNewPlan,
}: MaintenanceHeaderProps) {
    return (
        <div style={{ borderBottom: "1px solid #eee", paddingBottom: "15px", marginBottom: "20px" }}>
            <h1 style={{ margin: 0 }}>Mantenimiento</h1>
            <p style={{ color: "#666", fontSize: "14px" }}>Control de flota operativa (Preventivo y Correctivo)</p>
            
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <button 
                    onClick={onNewRecord}
                    style={{ padding: "8px 16px", backgroundColor: "#000", color: "#fff", border: "none" }}
                >
                    + Nuevo Registro
                </button>
                <button 
                    onClick={onNewPlan}
                    style={{ padding: "8px 16px", backgroundColor: "#eee", border: "1px solid #ccc" }}
                >
                    Configurar Plan
                </button>
            </div>
        </div>
    );
}
