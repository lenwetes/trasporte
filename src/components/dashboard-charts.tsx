"use client";

interface DashboardStatsProps {
    total: number;
    green: number;
    yellow: number;
    red: number;
}

export function DashboardCharts({
    total,
    green,
    yellow,
    red,
}: DashboardStatsProps) {
    // Calculate percentages for SVG Donut
    const totalCount = green + yellow + red || 1;
    const greenPct = (green / totalCount) * 100;
    const yellowPct = (yellow / totalCount) * 100;
    const redPct = (red / totalCount) * 100;

    // SVG coordinates for a donut chart
    const radius = 40;
    const circum = 2 * Math.PI * radius;

    // Offset calculation
    const greenOffset = 0;
    const yellowOffset = circum * (greenPct / 100);
    const redOffset = circum * ((greenPct + yellowPct) / 100);

    return (
        <div>
            {/* Status Chart Card */}
            <div>
                <div></div>

                <div>
                    <svg
                        viewBox="0 0 100 100"
                    >
                        {/* Background */}
 <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="10"
                            
                        />
                        {/* Green Segment */}
                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="10"
                            strokeDasharray={`${(greenPct / 100) * circum} ${circum}`}
                            strokeDashoffset={-greenOffset}
                            
                            strokeLinecap="round"
                        />
                        {/* Yellow Segment */}
                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="10"
                            strokeDasharray={`${(yellowPct / 100) * circum} ${circum}`}
                            strokeDashoffset={-yellowOffset}
                            
                            strokeLinecap="round"
                        />
                        {/* Red Segment */}
                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="10"
                            strokeDasharray={`${(redPct / 100) * circum} ${circum}`}
                            strokeDashoffset={-redOffset}
                            
                            strokeLinecap="round"
                        />
                    </svg>
                    <div>
                        <span>
                            {total}
                        </span>
                        <span>
                            Vehículos
                        </span>
                    </div>
                </div>

                <div>
                    <div>
                        <h3>
                            Distribución de Flota
                        </h3>
                        <p>
                            Estado operativo basado en la vigencia de documentos
                            legales
                        </p>
                    </div>

                    <div>
                        <div>
                            <p>
                                Operativo
                            </p>
                            <p>
                                {green}
                            </p>
                        </div>
                        <div>
                            <p>
                                Por Vencer
                            </p>
                            <p>
                                {yellow}
                            </p>
                        </div>
                        <div>
                            <p>
                                Vencidos
                            </p>
                            <p>
                                {red}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Card */}
            <div>
                <div></div>

                <div>
                    <p>
                        Cumplimiento Global
                    </p>
                    <h2>
                        {Math.round((green / totalCount) * 100)}%
                    </h2>
                </div>

                <div>
                    <p>
                        Tu flota mantiene un nivel de cumplimiento del{" "}
                        <strong>
                            {Math.round((green / totalCount) * 100)}%
                        </strong>
                        . Hay {red} vehículos que requieren atención inmediata
                        para evitar sanciones.
                    </p>
                    <div>
                        <div
                            style={{ width: `${(green / totalCount) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
