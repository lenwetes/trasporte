"use client";

export function StorageSection() {
    return (
        <div style={{ display: "grid", gap: "10px" }}>
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "bold" }}>Almacenamiento de Archivos</h3>
            <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                        type="radio"
                        id="local"
                        name="storage"
                        defaultChecked
                        readOnly
                    />
                    <label htmlFor="local" style={{ fontSize: "13px" }}>Local (Servidor)</label>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", opacity: 0.5 }}>
                    <input
                        type="radio"
                        id="cloud"
                        name="storage"
                        disabled
                    />
                    <label htmlFor="cloud" style={{ fontSize: "13px" }}>Nube (S3/GCP) - Próximamente</label>
                </div>
            </div>
        </div>
    );
}
