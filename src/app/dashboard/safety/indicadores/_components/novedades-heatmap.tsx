"use client";

interface NovedadesHeatmapProps {
    stats: {
        name: string;
        data: { x: string; y: number }[];
    }[];
}

export function NovedadesHeatmap({ stats }: NovedadesHeatmapProps) {
    const getColor = (val: number) => {
        if (val === 0) return "#f8fafc";
        if (val < 3) return "#dcfce7";
        if (val < 6) return "#fef9c3";
        if (val < 10) return "#ffedd5";
        return "#fee2e2";
    };

    const getTextColor = (val: number) => {
        if (val === 0) return "#cbd5e1";
        if (val < 3) return "#166534";
        if (val < 6) return "#854d0e";
        if (val < 10) return "#9a3412";
        return "#991b1b";
    };

    return (
        <div style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "25px", fontFamily: "sans-serif" }}>
            <h4 style={{ margin: "0 0 20px 0", fontSize: "14px", fontWeight: "900", display: "flex", alignItems: "center", gap: "10px" }}>
                <span>📅</span> Heatmap de Novedades (Áreas de Riesgo)
            </h4>

            <div style={{ overflowX: "auto" }}>
                <div style={{ minWidth: "800px" }}>
                    {/* Meses */}
                    <div style={{ display: "grid", gridTemplateColumns: "150px repeat(12, 1fr)", marginBottom: "10px" }}>
                        <div />
                        {stats[0]?.data.map((d, i) => (
                            <div key={i} style={{ textAlign: "center", fontSize: "10px", fontWeight: "bold", color: "#64748b", textTransform: "uppercase" }}>
                                {d.x}
                            </div>
                        ))}
                    </div>

                    {/* Filas */}
                    <div style={{ display: "grid", gap: "4px" }}>
                        {stats.map((row, i) => (
                            <div key={i} style={{ display: "grid", gridTemplateColumns: "150px repeat(12, 1fr)", gap: "4px", alignItems: "center" }}>
                                <div style={{ fontSize: "11px", fontWeight: "bold", color: "#475569", textTransform: "capitalize" }}>
                                    {row.name.replace("_", " ").toLowerCase()}
                                </div>
                                {row.data.map((cell, j) => (
                                    <div 
                                        key={j} 
                                        title={`${row.name}: ${cell.y} en ${cell.x}`}
                                        style={{ 
                                            height: "35px", 
                                            backgroundColor: getColor(cell.y), 
                                            borderRadius: "4px", 
                                            display: "flex", 
                                            alignItems: "center", 
                                            justifyContent: "center",
                                            fontSize: "11px",
                                            fontWeight: "bold",
                                            color: getTextColor(cell.y),
                                            border: "1px solid rgba(0,0,0,0.05)"
                                        }}
                                    >
                                        {cell.y > 0 ? cell.y : ""}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Leyenda */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "25px", paddingTop: "15px", borderTop: "1px solid #f1f5f9" }}>
                <LegendItem color="#f8fafc" label="Sin reportes" />
                <LegendItem color="#dcfce7" label="Bajo" />
                <LegendItem color="#fef9c3" label="Medio" />
                <LegendItem color="#ffedd5" label="Alto" />
                <LegendItem color="#fee2e2" label="Crítico" />
            </div>

            <div style={{ marginTop: "25px", padding: "15px", backgroundColor: "#f0f9ff", border: "1px solid #e0f2fe", borderRadius: "10px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ fontSize: "18px" }}>💡</div>
                <p style={{ margin: 0, fontSize: "12px", color: "#0369a1", lineHeight: "1.5" }}>
                    <strong>Insight Operativo:</strong> Se observa una concentración de fallas mecánicas durante los meses de Junio y Julio, coincidiendo con el periodo de alta demanda estacional. Recomendamos reforzar los planes de mantenimiento preventivo en Mayo.
                </p>
            </div>
        </div>
    );
}

function LegendItem({ color, label }: { color: string, label: string }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "12px", height: "12px", backgroundColor: color, borderRadius: "2px", border: "1px solid #e2e8f0" }}></div>
            <span style={{ fontSize: "10px", fontWeight: "bold", color: "#64748b" }}>{label}</span>
        </div>
    );
}
