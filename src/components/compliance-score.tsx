"use client";

import { ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";

interface ComplianceScoreProps {
    percentage: number;
    redCount: number;
}

export function ComplianceScore({
    percentage,
    redCount,
}: ComplianceScoreProps) {
    const isExcellent = percentage > 90;
    const isGood = percentage > 70 && percentage <= 90;
    const isCritical = percentage <= 70;

    let statusColor = "#16a34a"; // green
    if (isGood) statusColor = "#eab308"; // yellow
    if (isCritical) statusColor = "#dc2626"; // red

    return (
        <div style={{ backgroundColor: "white", borderRadius: "32px", padding: "32px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)", position: "relative", overflow: "hidden" }}>
            {/* Background elements */}
            <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", borderRadius: "50%", background: `radial-gradient(circle, ${statusColor}10 0%, rgba(255,255,255,0) 70%)`, pointerEvents: "none" }} />
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", position: "relative", zIndex: 1 }}>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: statusColor }} />
                        <span style={{ fontSize: "12px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>
                            Indicador de Cumplimiento
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                        <h2 style={{ margin: 0, fontSize: "48px", fontWeight: "900", color: "#0f172a", letterSpacing: "-1px" }}>
                            {percentage}
                        </h2>
                        <span style={{ fontSize: "24px", fontWeight: "700", color: "#94a3b8" }}>
                            %
                        </span>
                    </div>
                </div>

                <div style={{ width: "56px", height: "56px", borderRadius: "16px", backgroundColor: isExcellent ? "#f0fdf4" : isGood ? "#fefce8" : "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", color: statusColor }}>
                    {isExcellent ? <ShieldCheck size={28} /> : isGood ? <AlertTriangle size={28} /> : <ShieldAlert size={28} />}
                </div>
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
                <p style={{ margin: "0 0 20px 0", fontSize: "14px", color: "#475569", fontWeight: "500", lineHeight: "1.5" }}>
                    {redCount === 0
                        ? "Tu flota mantiene un nivel óptimo de cumplimiento. Sigue así para evitar sanciones y garantizar operaciones seguras."
                        : `El cumplimiento global está en ${percentage}%. Se detectaron ${redCount} vehículos que requieren atención inmediata para regularización.`}
                </p>

                <div style={{ marginBottom: "16px" }}>
                    <div style={{ width: "100%", height: "8px", borderRadius: "4px", backgroundColor: "#f1f5f9", overflow: "hidden" }}>
                        <div
                            style={{ 
                                height: "100%", 
                                width: `${percentage}%`,
                                backgroundColor: statusColor,
                                borderRadius: "4px",
                                transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)"
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#64748b" }}>
                        Estado actual:
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: "800", color: statusColor, padding: "4px 12px", borderRadius: "8px", backgroundColor: "white", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                        {isExcellent ? "Óptimo y Seguro" : isGood ? "Requiere Revisión Parcial" : "Atención Urgente"}
                    </span>
                </div>
            </div>
        </div>
    );
}
