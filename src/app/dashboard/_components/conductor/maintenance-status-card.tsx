import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Wrench, ChevronRight, Check } from "lucide-react";

interface MaintenanceAlert {
    planNombre: string;
    razon: string;
}

interface MaintenanceStatusCardProps {
    maintenanceAlerts?: MaintenanceAlert[];
}

export function MaintenanceStatusCard({
    maintenanceAlerts,
}: MaintenanceStatusCardProps) {
    const hasAlerts = maintenanceAlerts && maintenanceAlerts.length > 0;

    return (
        <div>
            <div>
                <div>
                    <p>
                        Gestión Técnica
                    </p>
                    <h4 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div>
                            <Wrench size={18} />
                        </div>
                        Mantenimientos
                    </h4>
                </div>
                {hasAlerts && (
                    <Badge variant="destructive">
                        Urgente
                    </Badge>
                )}
            </div>

            {hasAlerts ? (
                <div>
                    {maintenanceAlerts.map((m, idx) => (
                        <div
                            key={idx}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", border: "1px solid #eee", borderRadius: "8px", marginBottom: "8px" }}
                        >
                            <div>
                                <p style={{ fontSize: "11px", color: "#666" }}>
                                    Reporte Interno
                                </p>
                                <p style={{ fontWeight: "600" }}>
                                    {m.planNombre}
                                </p>
                                <p style={{ fontSize: "13px" }}>
                                    {m.razon}
                                </p>
                            </div>
                            <div>
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", backgroundColor: "#f0fdf4", borderRadius: "12px" }}>
                    <div style={{ padding: "8px", backgroundColor: "#dcfce7", borderRadius: "50%", color: "#166534" }}>
                        <Check size={20} />
                    </div>
                    <div>
                        <p style={{ fontWeight: "600", color: "#166534" }}>
                            Todo en orden
                        </p>
                        <p style={{ fontSize: "13px", color: "#14532d" }}>
                            No se detectaron alertas de mantenimiento para este
                            ciclo operativo.
                        </p>
                    </div>
                </div>
            )}

            <Link href="/dashboard/mantenimiento" style={{ textDecoration: "none", marginTop: "16px", display: "block" }}>
                <button style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "10px 16px",
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500"
                }}>
                    Ver Historial Completo
                    <ChevronRight size={16} />
                </button>
            </Link>
        </div>
    );
}

import { cn } from "@/lib/utils";
