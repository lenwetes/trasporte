"use client";

import { DollarSign, TrendingUp, BarChart3 } from "lucide-react";

interface MaintenanceStatsTabProps {
    stats: { placa: string; total: number }[];
    searchTerm: string;
}

export function MaintenanceStatsTab({
    stats,
    searchTerm,
}: MaintenanceStatsTabProps) {
    const filteredStats = stats.filter((stat) =>
        stat.placa.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
        }).format(value);
    };

    const totalFlota = filteredStats.reduce((acc, curr) => acc + curr.total, 0);

    const cardStyle = {
        backgroundColor: "#fff",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
    };

    const iconBoxStyle = {
        padding: "12px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "25px", fontFamily: "sans-serif" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                <div style={cardStyle}>
                    <div style={{ ...iconBoxStyle, backgroundColor: "#ecfdf5", color: "#059669" }}>
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#64748b", fontWeight: "bold", textTransform: "uppercase" }}>Inversión Total</p>
                        <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "bold", color: "#0f172a" }}>{formatCurrency(totalFlota)}</h3>
                    </div>
                </div>

                <div style={cardStyle}>
                    <div style={{ ...iconBoxStyle, backgroundColor: "#eff6ff", color: "#3b82f6" }}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#64748b", fontWeight: "bold", textTransform: "uppercase" }}>Máximo Gasto</p>
                        <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "bold", color: "#0f172a" }}>
                            {filteredStats.length > 0 ? filteredStats[0].placa : "N/A"}
                        </h3>
                    </div>
                </div>

                <div style={cardStyle}>
                    <div style={{ ...iconBoxStyle, backgroundColor: "#fdf2f8", color: "#db2777" }}>
                        <BarChart3 size={24} />
                    </div>
                    <div>
                        <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#64748b", fontWeight: "bold", textTransform: "uppercase" }}>Promedio Unidad</p>
                        <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "bold", color: "#0f172a" }}>
                            {filteredStats.length > 0 ? formatCurrency(totalFlota / filteredStats.length) : "$0"}
                        </h3>
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <div style={{ padding: "20px", borderBottom: "1px solid #f1f5f9", backgroundColor: "#f8fafc", display: "flex", alignItems: "center", gap: "10px" }}>
                    <BarChart3 size={20} style={{ color: "#64748b" }} />
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>Gasto por Vehículo (Histórico)</h3>
                </div>
                <div style={{ padding: "30px", minHeight: "300px" }}>
                    {filteredStats.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {filteredStats.map((stat, index) => {
                                const maxVal = Math.max(...filteredStats.map(s => s.total));
                                const percentage = (stat.total / maxVal) * 100;
                                
                                return (
                                    <div key={stat.placa} style={{ display: "grid", gridTemplateColumns: "100px 1fr 150px", alignItems: "center", gap: "15px" }}>
                                        <div style={{ fontSize: "12px", fontWeight: "bold", color: "#64748b" }}>
                                            {stat.placa}
                                        </div>
                                        <div style={{ height: "24px", backgroundColor: "#f1f5f9", borderRadius: "12px", overflow: "hidden", position: "relative" }}>
                                            <div 
                                                style={{ 
                                                    height: "100%", 
                                                    width: `${percentage}%`, 
                                                    backgroundColor: index === 0 ? "#10b981" : "#3b82f6",
                                                    borderRadius: "12px",
                                                    transition: "width 0.5s ease-out"
                                                }} 
                                            />
                                        </div>
                                        <div style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a", textAlign: "right" }}>
                                            {formatCurrency(stat.total)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8", gap: "10px", padding: "60px 0" }}>
                            <BarChart3 size={48} style={{ opacity: 0.2 }} />
                            <p style={{ margin: 0, fontSize: "14px" }}>No hay registros de costos de mantenimiento aún.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
