import Link from "next/link";
import { Car, ShieldCheck, ShieldAlert } from "lucide-react";

interface VehiculosTabsNavProps {
    activeTab: string;
    isAdmin: boolean;
    blockedCount: number;
}

export function VehiculosTabsNav({
    activeTab,
    isAdmin,
    blockedCount,
}: VehiculosTabsNavProps) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px", marginBottom: "32px", overflowX: "auto" }}>
            <Link
                href="/dashboard/vehiculos?tab=listado"
                style={{ textDecoration: "none" }}
            >
                <button
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 16px",
                        borderRadius: "12px",
                        border: "none",
                        backgroundColor: activeTab === "listado" ? "#eff6ff" : "transparent",
                        color: activeTab === "listado" ? "#2563eb" : "#64748b",
                        fontSize: "14px",
                        fontWeight: "700",
                        cursor: "pointer",
                        transition: "all 0.2s"
                    }}
                >
                    <Car size={18} />
                    <span>Flota</span>
                </button>
            </Link>

            <Link
                href="/dashboard/vehiculos?tab=semaforo"
                style={{ textDecoration: "none" }}
            >
                <button
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 16px",
                        borderRadius: "12px",
                        border: "none",
                        backgroundColor: activeTab === "semaforo" ? "#f0fdf4" : "transparent",
                        color: activeTab === "semaforo" ? "#16a34a" : "#64748b",
                        fontSize: "14px",
                        fontWeight: "700",
                        cursor: "pointer",
                        transition: "all 0.2s"
                    }}
                >
                    <ShieldCheck size={18} />
                    <span>Seguridad</span>
                </button>
            </Link>

            {isAdmin && (
                <Link
                    href="/dashboard/vehiculos?tab=operatividad"
                    style={{ textDecoration: "none" }}
                >
                    <button
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "10px 16px",
                            borderRadius: "12px",
                            border: "none",
                            backgroundColor: activeTab === "operatividad" ? "#fef2f2" : "transparent",
                            color: activeTab === "operatividad" ? "#dc2626" : "#64748b",
                            fontSize: "14px",
                            fontWeight: "700",
                            cursor: "pointer",
                            transition: "all 0.2s"
                        }}
                    >
                        <ShieldAlert size={18} />
                        <span>Restricción</span>
                        {blockedCount > 0 && (
                            <span style={{
                                backgroundColor: activeTab === "operatividad" ? "#dc2626" : "#f1f5f9",
                                color: activeTab === "operatividad" ? "white" : "#0f172a",
                                padding: "2px 8px",
                                borderRadius: "8px",
                                fontSize: "11px",
                                fontWeight: "800"
                            }}>
                                {blockedCount}
                            </span>
                        )}
                    </button>
                </Link>
            )}
        </div>
    );
}
