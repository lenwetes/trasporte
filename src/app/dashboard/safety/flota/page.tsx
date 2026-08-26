/**
 * Fleet Safety Dashboard - Skeleton HTML Refactoring
 */
import { getFleetStatus, getConfiguracionGlobal } from "@/actions";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { VehicleStatusCard, type FleetVehicle } from "./_components/vehicle-status-card";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function FleetDashboardPage() {
    const [res, configRes] = await Promise.all([
        getFleetStatus(),
        getConfiguracionGlobal(),
    ]);

    const data: FleetVehicle[] = res.success
        ? (res.data as FleetVehicle[])
        : [];

    const companyConfig = configRes.success
        ? (configRes.data as any)
        : null;

    const stats = {
        total: data.length,
        green: data.filter((v: any) => v.status === "GREEN").length,
        yellow: data.filter((v: any) => v.status === "YELLOW").length,
        red: data.filter((v: any) => v.status === "RED").length,
        override: data.filter((v: any) => v.status === "OVERRIDE").length || 0,
    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <DashboardHeader
                title="Semáforo de Flota"
                tagline="Seguridad Vial"
                subtitle="Monitoreo de cumplimiento documental y estado operativo"
            />

            {/* KPI Cards Grid */}
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                gap: "20px", 
                marginBottom: "30px",
                marginTop: "20px"
            }}>
                <CardKPI
                    title="Total Flota"
                    value={stats.total}
                    icon="🚛"
                    color="#fff"
                    textColor="#000"
                    label="Vehículos"
                />
                <CardKPI
                    title="Operativo"
                    value={stats.green}
                    icon="✅"
                    color="#f0fdf4"
                    textColor="#166534"
                    label="Sin Alertas"
                    percentage={stats.total > 0 ? (stats.green / stats.total) * 100 : 0}
                />
                <CardKPI
                    title="En Alerta"
                    value={stats.yellow}
                    icon="⚠️"
                    color="#fffbeb"
                    textColor="#92400e"
                    label="Vencidos"
                    percentage={stats.total > 0 ? (stats.yellow / stats.total) * 100 : 0}
                />
                <CardKPI
                    title="Sin Operación"
                    value={stats.red}
                    icon="🛑"
                    color="#fef2f2"
                    textColor="#991b1b"
                    label="Bloqueados"
                    percentage={stats.total > 0 ? (stats.red / stats.total) * 100 : 0}
                />
            </div>

            {/* Control Bar */}
            <div style={{ 
                backgroundColor: "#fff", 
                padding: "15px", 
                borderRadius: "8px", 
                border: "1px solid #eee", 
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
               <div style={{ display: "flex", gap: "10px", flex: 1 }}>
                    <input 
                        type="text" 
                        placeholder="Buscar placa o unidad..." 
                        style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", width: "300px" }}
                    />
                    <button style={{ padding: "8px 15px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}>
                        Filtros Avanzados
                    </button>
               </div>
               <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "bold" }}>
                    {data.length} UNIDADES ACTIVAS
               </div>
            </div>

            {/* Vehicles Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
                {data.map((vehicle) => (
                    <VehicleStatusCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        companyConfig={companyConfig}
                    />
                ))}
            </div>

            {data.length === 0 && (
                <div style={{ textAlign: "center", padding: "100px", border: "2px dashed #eee", borderRadius: "12px", color: "#94a3b8" }}>
                    No hay vehículos registrados para mostrar en el monitor.
                </div>
            )}
        </div>
    );
}

function CardKPI({
    title,
    value,
    icon,
    color,
    textColor,
    label,
    percentage,
}: {
    title: string;
    value: number;
    icon: string;
    color: string;
    textColor: string;
    label: string;
    percentage?: number;
}) {
    return (
        <div style={{ 
            backgroundColor: color, 
            color: textColor,
            padding: "20px", 
            borderRadius: "12px", 
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <label style={{ fontSize: "11px", fontWeight: "900", textTransform: "uppercase", opacity: 0.7 }}>{title}</label>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "5px", marginTop: "5px" }}>
                        <span style={{ fontSize: "28px", fontWeight: "900" }}>{value}</span>
                        <span style={{ fontSize: "12px", fontWeight: "bold" }}>{label}</span>
                    </div>
                </div>
                <div style={{ fontSize: "24px" }}>{icon}</div>
            </div>

            {percentage !== undefined && (
                <div style={{ marginTop: "15px" }}>
                    <div style={{ height: "4px", backgroundColor: "rgba(0,0,0,0.05)", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ width: `${percentage}%`, height: "100%", backgroundColor: textColor }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginTop: "5px", fontWeight: "bold" }}>
                        <span>CUMPLIMIENTO</span>
                        <span>{percentage.toFixed(1)}%</span>
                    </div>
                </div>
            )}
        </div>
    );
}
