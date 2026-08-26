"use client";

import { useState, useMemo } from "react";
import { AlertCircle, TrendingUp, ChevronRight, CheckCircle2, Printer, Truck, Clock } from "lucide-react";
import type { MaintenanceAlert } from "../../types";

interface MaintenanceAlertsTabProps {
    alertas: MaintenanceAlert[];
    onIssueOrder: (vehiculoId: string, planId: string) => void;
    onCompleteOrder: (ordenId: string) => void;
    onPrintOrder: (ordenId: string) => void;
    onDirectRegister: (alerta: MaintenanceAlert) => void;
    onReviewOrder: (ordenId: string) => void;
}

export function MaintenanceAlertsTab({
    alertas,
    onIssueOrder,
    onCompleteOrder,
    onPrintOrder,
    onDirectRegister,
    onReviewOrder,
}: MaintenanceAlertsTabProps) {
    // Group alerts by vehicle
    const alertsByVehicle = useMemo(() => {
        const groups: Record<string, { placa: string; alerts: MaintenanceAlert[] }> = {};
        alertas.forEach((alerta) => {
            if (!groups[alerta.vehiculoId]) {
                groups[alerta.vehiculoId] = { placa: alerta.placa, alerts: [] };
            }
            groups[alerta.vehiculoId].alerts.push(alerta);
        });
        return Object.entries(groups).map(([id, data]) => ({ id, ...data }));
    }, [alertas]);

    const [activeVehicleId, setActiveVehicleId] = useState<string | null>(
        alertsByVehicle.length > 0 ? alertsByVehicle[0].id : null,
    );

    const activeVehicle =
        alertsByVehicle.find((v) => v.id === activeVehicleId) ||
        (alertsByVehicle.length > 0 ? alertsByVehicle[0] : null);

    if (alertas.length === 0) {
        return (
            <div style={{ padding: "40px", textAlign: "center", backgroundColor: "#ecfdf5", border: "1px solid #10b981", borderRadius: "12px" }}>
                <CheckCircle2 size={48} style={{ color: "#10b981", marginBottom: "15px" }} />
                <h3 style={{ margin: "0 0 5px 0", fontSize: "18px", fontWeight: "bold", color: "#065f46" }}>¡Todo al día!</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#065f46" }}>No hay vehículos con mantenimientos críticos pendientes.</p>
            </div>
        );
    }

    const btnPrimary = {
        padding: "8px 16px",
        backgroundColor: "#0f172a",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        gap: "6px"
    };

    const btnOutline = {
        padding: "8px 16px",
        backgroundColor: "#fff",
        color: "#0f172a",
        border: "1px solid #e2e8f0",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        gap: "6px"
    };

    return (
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "25px", fontFamily: "sans-serif" }}>
            {/* SELECTION SIDEBAR */}
            <div style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <div style={{ padding: "15px 20px", borderBottom: "1px solid #f1f5f9", backgroundColor: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "bold" }}>Vehículos Críticos</h3>
                    <span style={{ backgroundColor: "#dc2626", color: "#fff", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: "bold" }}>
                        {alertsByVehicle.length}
                    </span>
                </div>
                <div style={{ padding: "10px", maxHeight: "600px", overflowY: "auto" }}>
                    {alertsByVehicle.map((v) => (
                        <button
                            key={v.id}
                            onClick={() => setActiveVehicleId(v.id)}
                            style={{ 
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "12px",
                                border: "1px solid",
                                borderColor: activeVehicleId === v.id ? "#0f172a" : "#f1f5f9",
                                borderRadius: "8px",
                                backgroundColor: activeVehicleId === v.id ? "#f8fafc" : "#fff",
                                marginBottom: "8px",
                                cursor: "pointer",
                                textAlign: "left"
                            }}
                        >
                            <div style={{ color: "#dc2626", backgroundColor: "#fef2f2", padding: "8px", borderRadius: "8px" }}>
                                <Truck size={18} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: "bold", fontSize: "14px", color: "#0f172a" }}>{v.placa}</div>
                                <div style={{ fontSize: "11px", color: "#dc2626", fontWeight: "bold" }}>
                                    {v.alerts.length} {v.alerts.length === 1 ? "Servicio" : "Servicios"}
                                </div>
                            </div>
                            <ChevronRight size={14} style={{ color: "#cbd5e1" }} />
                        </button>
                    ))}
                </div>
            </div>

            {/* DETAIL VIEW */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {activeVehicle ? (
                    <>
                        <div style={{ padding: "25px", backgroundColor: "#0f172a", color: "#fff", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                                <div style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "15px", borderRadius: "12px" }}>
                                    <Truck size={32} />
                                </div>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                                        <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "bold" }}>{activeVehicle.placa}</h2>
                                        <span style={{ backgroundColor: "#dc2626", padding: "4px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold" }}>CRÍTICO</span>
                                    </div>
                                    <p style={{ margin: 0, opacity: 0.6, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Resumen de mantenimiento pendiente</p>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "30px", borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: "30px" }}>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "24px", fontWeight: "bold" }}>{activeVehicle.alerts.length}</div>
                                    <div style={{ fontSize: "10px", opacity: 0.6, textTransform: "uppercase" }}>Tareas</div>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "24px", fontWeight: "bold" }}>{activeVehicle.alerts[0].kilometrajeActual?.toLocaleString()}</div>
                                    <div style={{ fontSize: "10px", opacity: 0.6, textTransform: "uppercase" }}>Kilometraje</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            {activeVehicle.alerts.map((alerta, idx) => (
                                <div key={idx} style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                                    <div style={{ padding: "15px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8fafc" }}>
                                        <div>
                                            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "bold", textTransform: "uppercase" }}>Plan de Servicio</span>
                                            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>{alerta.planNombre}</h4>
                                        </div>
                                        <span style={{ color: "#94a3b8", fontWeight: "bold" }}>#{idx + 1}</span>
                                    </div>
                                    <div style={{ padding: "20px" }}>
                                        <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                                            <AlertCircle size={20} style={{ color: "#dc2626", marginTop: "2px" }} />
                                            <div>
                                                <p style={{ margin: "0 0 4px 0", fontSize: "13px", fontWeight: "bold", color: "#dc2626" }}>Motivo de la Alerta</p>
                                                <p style={{ margin: 0, fontSize: "14px", color: "#475569", lineHeight: "1.5" }}>{alerta.razon}</p>
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", gap: "20px", marginBottom: "25px" }}>
                                            <div>
                                                <p style={{ margin: "0 0 5px 0", fontSize: "11px", color: "#64748b", fontWeight: "bold" }}>Estado</p>
                                                <span style={{ backgroundColor: "#fef2f2", color: "#dc2626", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", border: "1px solid #fecaca" }}>VENCIDO</span>
                                            </div>
                                            <div>
                                                <p style={{ margin: "0 0 5px 0", fontSize: "11px", color: "#64748b", fontWeight: "bold" }}>Proyección</p>
                                                <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#dc2626", fontWeight: "bold", fontSize: "13px" }}>
                                                    <TrendingUp size={14} /> CRÍTICO
                                                </div>
                                            </div>
                                        </div>

                                        {alerta.ordenPendiente ? (
                                            <div style={{ padding: "20px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                                                {alerta.ordenPendiente.estado === "EN_REVISION" ? (
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                                                            <div style={{ backgroundColor: "#eff6ff", padding: "10px", borderRadius: "8px", color: "#3b82f6" }}>
                                                                <Clock size={20} />
                                                            </div>
                                                            <div>
                                                                <p style={{ margin: "0 0 2px 0", fontSize: "14px", fontWeight: "bold" }}>Validación en curso</p>
                                                                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Evidencias cargadas por el conductor</p>
                                                            </div>
                                                        </div>
                                                        <button style={btnPrimary} onClick={() => onReviewOrder(alerta.ordenPendiente!.id)}>
                                                            Validar Documentación <ChevronRight size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <div style={{ display: "flex", gap: "10px" }}>
                                                            <button style={btnPrimary} onClick={() => onCompleteOrder(alerta.ordenPendiente!.id)}>
                                                                Completar <CheckCircle2 size={14} />
                                                            </button>
                                                            <button style={btnOutline} onClick={() => onPrintOrder(alerta.ordenPendiente!.id)}>
                                                                <Printer size={14} />
                                                            </button>
                                                        </div>
                                                        {alerta.ordenPendiente.estado === "RECHAZADA" && (
                                                            <p style={{ margin: 0, color: "#dc2626", fontSize: "12px", fontWeight: "bold" }}>ORDEN RECHAZADA - REQUIERE ATENCIÓN</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div style={{ display: "flex", gap: "10px" }}>
                                                <button style={btnPrimary} onClick={() => onDirectRegister(alerta)}>
                                                    Validar Alerta (Ya Realizado) <CheckCircle2 size={14} />
                                                </button>
                                                <button style={btnOutline} onClick={() => onIssueOrder(alerta.vehiculoId, alerta.planId)}>
                                                    Emitir Orden para Conductor
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div style={{ height: "400px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", border: "2px dashed #e2e8f0", borderRadius: "12px", color: "#b4bcca" }}>
                        <Truck size={64} style={{ marginBottom: "20px", opacity: 0.1 }} />
                        <h3 style={{ margin: "0 0 5px 0", fontSize: "20px", fontWeight: "bold" }}>Seleccione un Vehículo</h3>
                        <p style={{ margin: 0, fontSize: "14px", maxWidth: "300px" }}>Gestione los mantenimientos de su flota de forma organizada.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
