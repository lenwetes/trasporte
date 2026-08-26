"use client";

import {
    AlertTriangle,
    BrainCircuit,
    Settings,
    History,
    BarChart3,
    Command
} from "lucide-react";

interface MaintenanceSidebarProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
    alertCount?: number;
    reviewCount?: number;
}

const NAVIGATION_ITEMS = [
    {
        id: "operaciones",
        label: "OPERACIONES",
        icon: AlertTriangle,
        description: "Alertas y Revisiones",
        color: "#10b981", // emerald
    },
    {
        id: "inteligencia",
        label: "INTELIGENCIA",
        icon: BrainCircuit,
        description: "Predicciones de IA",
        color: "#8b5cf6", // violet
    },
    {
        id: "planes",
        label: "PLANES",
        icon: Settings,
        description: "Programas de Mantenimiento",
        color: "#3b82f6", // blue
    },
    {
        id: "historial",
        label: "HISTORIAL",
        icon: History,
        description: "Registro Global",
        color: "#64748b", // slate
    },
    {
        id: "reportes",
        label: "REPORTES",
        icon: BarChart3,
        description: "Estadísticas y Rendimiento",
        color: "#6366f1", // indigo
    },
] as const;

export function MaintenanceSidebar({
    activeSection,
    onSectionChange,
    alertCount = 0,
    reviewCount = 0,
}: MaintenanceSidebarProps) {
    const totalOperations = alertCount + reviewCount;

    return (
        <div style={{ fontFamily: "sans-serif", display: "flex", flexDirection: "column", gap: "25px" }}>
            <div style={{ padding: "0 10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <Command size={24} style={{ color: "#0f172a" }} />
                    <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "bold", color: "#0f172a" }}>
                        Centro de Mando
                    </h2>
                </div>
                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                    Gestión Integral de Mantenimiento
                </p>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {NAVIGATION_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    const showBadge = item.id === "operaciones" && totalOperations > 0;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onSectionChange(item.id)}
                            style={{
                                width: "100%",
                                padding: "12px 15px",
                                border: "none",
                                borderRadius: "12px",
                                backgroundColor: isActive ? "#f1f5f9" : "transparent",
                                cursor: "pointer",
                                textAlign: "left" as const,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                transition: "all 0.2s"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                <div style={{ 
                                    backgroundColor: isActive ? item.color : "#f8fafc", 
                                    color: isActive ? "#fff" : item.color, 
                                    padding: "8px", 
                                    borderRadius: "10px",
                                    border: isActive ? "none" : "1px solid #e2e8f0"
                                }}>
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <h3 style={{ margin: 0, fontSize: "13px", fontWeight: "bold", color: isActive ? "#0f172a" : "#475569" }}>
                                            {item.label}
                                        </h3>
                                        {showBadge && (
                                            <span style={{ 
                                                fontSize: "10px", 
                                                backgroundColor: "#dc2626", 
                                                color: "#fff", 
                                                padding: "2px 6px", 
                                                borderRadius: "10px", 
                                                fontWeight: "bold" 
                                            }}>
                                                {totalOperations}
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                            {isActive && <div style={{ width: "4px", height: "20px", backgroundColor: "#0f172a", borderRadius: "2px" }} />}
                        </button>
                    );
                })}
            </nav>

            {/* Quick Stats */}
            <div style={{ marginTop: "auto", padding: "15px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "18px", fontWeight: "bold", color: "#dc2626" }}>
                            {alertCount}
                        </div>
                        <div style={{ fontSize: "10px", fontWeight: "bold", color: "#94a3b8", textTransform: "uppercase" }}>
                            Alertas
                        </div>
                    </div>
                    <div style={{ textAlign: "center", borderLeft: "1px solid #e2e8f0" }}>
                        <div style={{ fontSize: "18px", fontWeight: "bold", color: "#3b82f6" }}>
                            {reviewCount}
                        </div>
                        <div style={{ fontSize: "10px", fontWeight: "bold", color: "#94a3b8", textTransform: "uppercase" }}>
                            En Revisión
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

