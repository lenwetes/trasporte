"use client";

interface FleetDistributionProps {
    total: number;
    green: number;
    yellow: number;
    red: number;
}

export function FleetDistribution({
    total,
    green,
    yellow,
    red,
}: FleetDistributionProps) {
    const totalCount = total || 0;
    const greenPct = totalCount > 0 ? (green / totalCount) * 100 : 0;
    const yellowPct = totalCount > 0 ? (yellow / totalCount) * 100 : 0;
    const redPct = totalCount > 0 ? (red / totalCount) * 100 : 0;

    const radius = 35;
    const circum = 2 * Math.PI * radius;

    const greenOffset = 0;
    const yellowOffset = circum * (greenPct / 100);
    const redOffset = circum * ((greenPct + yellowPct) / 100);

    return (
        <div>
            <div>
                <div>
                    <svg
                        
                        viewBox="0 0 100 100">
 <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="10"
                            
                        />
                        {green > 0 && (
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                fill="transparent"
                                stroke="#16a34a"
                                strokeWidth="10"
                                strokeDasharray={`${(greenPct / 100) * circum} ${circum}`}
                                strokeDashoffset={-greenOffset}
                                
                                strokeLinecap="round"
                            />
                        )}
                        {yellow > 0 && (
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                fill="transparent"
                                stroke="#eab308"
                                strokeWidth="10"
                                strokeDasharray={`${(yellowPct / 100) * circum} ${circum}`}
                                strokeDashoffset={-yellowOffset}
                                
                                strokeLinecap="round"
                            />
                        )}
                        {red > 0 && (
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                fill="transparent"
                                stroke="#ef4444"
                                strokeWidth="10"
                                strokeDasharray={`${(redPct / 100) * circum} ${circum}`}
                                strokeDashoffset={-redOffset}
                                
                                strokeLinecap="round"
                            />
                        )}
                    </svg>
                    <div>
                        <span>
                            {total}
                        </span>
                        <span>
                            Total
                        </span>
                    </div>
                </div>

                <div>
                    <div>
                        <h3>
                            Distribución
                        </h3>
                        <p>
                            Estado por documentación
                        </p>
                    </div>

                    <div>
                        <LegendItem
                            color="bg-primary"
                            label="Operativos"
                            count={green}
                        />
                        <LegendItem
                            color="bg-yellow-500"
                            label="Por Vencer"
                            count={yellow}
                        />
                        <LegendItem
                            color="bg-destructive"
                            label="Vencidos"
                            count={red}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function LegendItem({
    color,
    label,
    count,
}: {
    color: string;
    label: string;
    count: number;
}) {
    return (
        <div>
            <div>
                <div></div>
                <span>
                    {label}
                </span>
            </div>
            <span>
                {count}
            </span>
        </div>
    );
}
