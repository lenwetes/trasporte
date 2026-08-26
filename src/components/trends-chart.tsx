"use client";


import { TrendingUp } from "lucide-react";

interface ProjectionData {
    label: string;
    count: number;
}

interface TrendsChartProps {
    data: ProjectionData[];
}

export function TrendsChart({ data }: TrendsChartProps) {
    const maxCount = Math.max(...data.map((d) => d.count), 1);
    const criticalMonth = data.reduce(
        (prev, current) => (prev.count > current.count ? prev : current),
        data[0] || { label: "N/A", count: 0 },
    );
    const totalNext = data.reduce((sum, item) => sum + item.count, 0);

    return (
        <div>
            <div>
                <div>
                    <div>
                        <TrendingUp />
                    </div>
                    <div>
                        <h3>
                            Proyecciones
                        </h3>
                        <p>
                            Vencimientos próximos 6 meses
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", height: "200px", gap: "10px", margin: "20px 0" }}>
                {data.map((item, idx) => {
                    const heightPercentage = (item.count / maxCount) * 100;
                    return (
                        <div
                            key={idx}
                            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}
                        >
                            <div style={{ width: "100%", flex: 1, display: "flex", alignItems: "flex-end", backgroundColor: "#f8fafc", borderRadius: "4px" }}>
                                <div
                                    style={{
                                        height: `${heightPercentage}%`,
                                        width: "100%",
                                        backgroundColor: item.count > 0 ? "#10b981" : "#e2e8f0",
                                        borderRadius: "4px",
                                        position: "relative"
                                    }}
                                >
                                    {item.count > 0 && (
                                        <div style={{ position: "absolute", top: "-25px", width: "100%", textAlign: "center", fontSize: "10px", fontWeight: "bold" }}>
                                            {item.count} doc
                                        </div>
                                    )}
                                </div>
                            </div>
                            <span style={{ fontSize: "10px", marginTop: "8px", fontWeight: "bold", color: "#64748b" }}>
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div>
                <div>
                    <div>
                        <span>[CALENDAR]</span>
                    </div>
                    <div>
                        <p>
                            Crítico
                        </p>
                        <p>
                            {criticalMonth.label}
                        </p>
                    </div>
                </div>
                <div>
                    <div>
                        <span>[ALERTTRIANGLE]</span>
                    </div>
                    <div>
                        <p>
                            Total
                        </p>
                        <p>
                            {totalNext} Doc
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
