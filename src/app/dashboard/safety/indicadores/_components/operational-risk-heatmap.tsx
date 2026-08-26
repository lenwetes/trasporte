"use client";

interface HeatmapCell {
    x: string;
    y: number;
    count: number;
}

interface OperationalRiskHeatmapProps {
    stats: {
        name: string;
        data: HeatmapCell[];
    }[];
}

export function OperationalRiskHeatmap({ stats }: OperationalRiskHeatmapProps) {
    return (
        <div style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "15px", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold", color: "#0f172a", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span>⚠️</span>
                    Predictive Risk Heatmap (Riesgo Operacional)
                </h3>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "5px" }}>
                    En tiempo real
                </div>
            </div>
            
            <div>
                <div style={{ overflowX: "auto" }}>
                    <div style={{ minWidth: "800px" }}>
                        {/* Month Headers */}
                        <div style={{ display: "grid", gridTemplateColumns: "100px repeat(12, 1fr)", gap: "5px", marginBottom: "10px" }}>
                            <div />
                            {stats[0]?.data.map((d: any, i: number) => (
                                <div key={i} style={{ textAlign: "center", fontSize: "11px", color: "#64748b", fontWeight: "bold" }}>
                                    {d.x}
                                </div>
                            ))}
                        </div>

                        {/* Rows */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                            {stats.map((row: any, i: number) => (
                                <div key={i} style={{ display: "grid", gridTemplateColumns: "100px repeat(12, 1fr)", gap: "5px", alignItems: "center" }}>
                                    <div style={{ fontSize: "11px", fontWeight: "bold", color: "#475569" }}>
                                        {row.name}
                                    </div>
                                    {row.data.map((cell: any, j: number) => {
                                        let bgColor = "#f1f5f9";
                                        let textColor = "#94a3b8";
                                        
                                        if (cell.count > 0) {
                                            if (cell.y < 3) bgColor = "#dcfce7";
                                            else if (cell.y < 5) bgColor = "#fef9c3";
                                            else if (cell.y < 7) bgColor = "#ffedd5";
                                            else bgColor = "#fee2e2";
                                            
                                            textColor = "#0f172a";
                                        }

                                        return (
                                            <div
                                                key={j}
                                                title={`${row.name}: Intensidad ${cell.y} (${cell.count} eventos) en ${cell.x}`}
                                                style={{
                                                    height: "35px",
                                                    backgroundColor: bgColor,
                                                    borderRadius: "4px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "9px",
                                                    color: textColor,
                                                    transition: "transform 0.2s"
                                                }}
                                            >
                                                {cell.count > 0 && (
                                                    <>
                                                        <span style={{ fontWeight: "bold" }}>{cell.count}</span>
                                                        <span style={{ opacity: 0.7 }}>{cell.y}pts</span>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div style={{ marginTop: "25px", paddingTop: "15px", borderTop: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginBottom: "15px" }}>
                        <LegendItem color="#f1f5f9" label="Sin Riesgo" />
                        <LegendItem color="#dcfce7" label="Controlado" />
                        <LegendItem color="#fef9c3" label="Preventivo" />
                        <LegendItem color="#ffedd5" label="Elevado" />
                        <LegendItem color="#fee2e2" label="Crítico" />
                    </div>

                    <p style={{ margin: 0, fontSize: "10px", color: "#94a3b8", fontStyle: "italic" }}>
                        * Intensidad calculada por severidad de siniestros, fallas técnicas y multas.
                    </p>
                </div>

                <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", gap: "15px" }}>
                    <div style={{ fontSize: "20px" }}>🧠</div>
                    <div>
                        <h4 style={{ margin: "0 0 5px 0", fontSize: "13px", fontWeight: "bold", color: "#0f172a" }}>Análisis Predictivo Smart Fleet IA</h4>
                        <p style={{ margin: 0, fontSize: "12px", color: "#475569", lineHeight: "1.5" }}>
                            Se detecta una correlación directa entre el aumento de <strong>Fallas Mecánicas</strong> y la consecuente <strong>Accidentalidad</strong> en los meses posteriores. El índice de riesgo indica que se requiere una auditoría técnica profunda en la flota de camiones antes del cierre del trimestre.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LegendItem({ color, label }: { color: string, label: string }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: color, border: "1px solid rgba(0,0,0,0.05)" }} />
            <span style={{ fontSize: "11px", color: "#64748b" }}>{label}</span>
        </div>
    );
}
