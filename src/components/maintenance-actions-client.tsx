"use client";

import { useState } from "react";
import {
    optimizeDatabase,
    resetDatabase,
    getSystemErrorLogs,
} from "@/actions/configuracion";
import { useRouter } from "next/navigation";

export function MaintenanceActionsClient() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleOptimize = async () => {
        if (!confirm("Se realizará una limpieza física de la base de datos (VACUUM ANALYZE). ¿Continuar?")) return;
        setIsLoading(true);
        try {
            const res = await optimizeDatabase();
            alert(res.success ? res.message : res.error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async () => {
        const pin = prompt("OPERACIÓN CRÍTICA. Escriba 'BORRAR TODO' para confirmar el reinicio de fábrica:");
        if (pin !== "BORRAR TODO") return;
        
        setIsLoading(true);
        try {
            const res = await resetDatabase();
            if (res.success) {
                alert(res.message);
                router.push("/login");
            } else {
                alert(res.error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewLogs = async () => {
        const res = await getSystemErrorLogs();
        if (res.success) {
            console.table(res.data);
            alert("Logs impresos en la consola del navegador (F12).");
        }
    };

    return (
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
                onClick={handleOptimize}
                disabled={isLoading}
                style={{ padding: "10px 15px", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
            >
                {isLoading ? "..." : "Optimizar Base de Datos"}
            </button>

            <button
                onClick={handleReset}
                disabled={isLoading}
                style={{ padding: "10px 15px", backgroundColor: "#fee2e2", border: "1px solid #ef4444", color: "#b91c1c", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
            >
                Reiniciar Sistema (Factory Reset)
            </button>

            <button
                onClick={handleViewLogs}
                style={{ padding: "10px 15px", backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
            >
                Ver Logs de Error
            </button>
        </div>
    );
}
