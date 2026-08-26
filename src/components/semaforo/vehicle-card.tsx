import {
    ChevronRight,
    User,
    AlertTriangle,
    Clock,
    ShieldCheck,
    ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardVehicle } from "@/lib/types";
import { useRouter } from "next/navigation";

interface VehicleCardProps {
    vehiculo: DashboardVehicle;
    idx: number;
}

export function VehicleCard({ vehiculo, idx }: VehicleCardProps) {
    const router = useRouter();

    const statusColors = {
        red: {
            bg: "bg-rose-50",
            border: "border-rose-100",
            text: "text-rose-600",
            dot: "bg-rose-500 shadow-sm",
            glow: "from-rose-500/5 to-transparent",
        },
        yellow: {
            bg: "bg-amber-50",
            border: "border-amber-100",
            text: "text-amber-600",
            dot: "bg-amber-500 shadow-sm",
            glow: "from-amber-500/5 to-transparent",
        },
        green: {
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            text: "text-emerald-600",
            dot: "bg-emerald-500 shadow-sm",
            glow: "from-emerald-500/5 to-transparent",
        },
    };

    const currentStatus =
        statusColors[vehiculo.alertLevel as keyof typeof statusColors] ||
        statusColors.green;

    return (
        <div
            onClick={() => router.push(`/dashboard/vehiculos/${vehiculo.id}`)}
        >
            <div />

            <div>
                {/* ID & Plate Section */}
                <div>
                    <div>
                        <span>
                            Estado
                        </span>
                        <div />
                    </div>
                    <h4>
                        {vehiculo.placa.slice(0, 3)}
                        <span>•</span>
                        {vehiculo.placa.slice(3)}
                    </h4>
                    <div>
                        <span>
                            {vehiculo.marca}
                        </span>
                        <span>
                            {vehiculo.modelo}
                        </span>
                    </div>
                </div>

                {/* Owner Info */}
                <div>
                    <div>
                        <span>[USER]</span>
                    </div>
                    <div>
                        <p>
                            Propietario
                        </p>
                        <p>
                            {vehiculo.propietario}
                        </p>
                    </div>
                </div>

                {/* Alerts Timeline */}
                <div>
                    {vehiculo.alerts.slice(0, 3).map((alert, i) => {
                        const alertStatus =
                            statusColors[
                                alert.status as keyof typeof statusColors
                            ] || statusColors.green;
                        return (
                            <div
                                key={i}
                            >
                                {alert.status === "red"  ? (<span>[ALERTTRIANGLE]</span>
                                ) : alert.status === "yellow" ? (
                                    <span>[CLOCK]</span>
                                ) : (
                                    <ShieldCheck />
                                )}
                                <span>
                                    {alert.tipo.split(" ")[0]}
                                </span>
                                <div />
                                <span>
                                    {alert.daysUntilExpiry}d
                                </span>
                            </div>
                        );
                    })}
                    {vehiculo.alerts.length > 3 && (
                        <div>
                            + {vehiculo.alerts.length - 3}
                        </div>
                    )}
                </div>

                {/* Action Indicator */}
                <div>
                    <div>
                        <span>[CHEVRONRIGHT]</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
