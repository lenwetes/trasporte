"use client";

export function ExportBackupButton() {
    const handleBackup = () => {
        try {
            alert("Iniciando descarga del respaldo...");
            window.location.href = "/api/backup";
        } catch (error) {
            console.error(error);
            alert("Error al iniciar la descarga.");
        }
    };

    return (
        <button
            onClick={handleBackup}
            style={{
                padding: "10px 20px",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "13px"
            }}
        >
            Crear Backup Ahora
        </button>
    );
}
