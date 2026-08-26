import { cn } from "@/lib/utils";
import { AlertColor } from "./types";
import { DashboardVehicle } from "@/lib/types";

interface StatusFilterBtnProps {
    active: boolean;
    onClick: () => void;
    label: string;
    count: number;
    color: AlertColor;
}

export function StatusFilterBtn({
    active,
    onClick,
    label,
    count,
    color,
}: StatusFilterBtnProps) {
    const colorClasses = {
        slate: active
            ? "bg-slate-900 border-slate-900 text-emerald-400 shadow-md scale-105"
            : "bg-white border-slate-200 text-slate-900 hover:text-slate-900 hover:border-slate-300",
        red: active
            ? "bg-rose-600 border-rose-600 text-white shadow-md scale-105"
            : "bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100",
        amber: active
            ? "bg-amber-500 border-amber-500 text-white shadow-md scale-105"
            : "bg-amber-50 border-amber-100 text-amber-600 hover:bg-amber-100",
        emerald: active
            ? "bg-emerald-600 border-emerald-600 text-white shadow-md scale-105"
            : "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100",
    };

    return (
        <button
            onClick={onClick}
        >
            <span>{label}</span>
            <div>
                {count}
            </div>
        </button>
    );
}

interface StatusFiltersProps {
    filterStatus: string;
    onFilterChange: (status: string) => void;
    vehicles: DashboardVehicle[];
}

export function StatusFilters({
    filterStatus,
    onFilterChange,
    vehicles,
}: StatusFiltersProps) {
    return (
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <StatusFilterBtn
                active={filterStatus === "all"}
                onClick={() => onFilterChange("all")}
                label="Todos"
                count={vehicles.length}
                color="slate"
            />
            <StatusFilterBtn
                active={filterStatus === "red"}
                onClick={() => onFilterChange("red")}
                label="Inoperativos"
                count={vehicles.filter((v) => v.alertLevel === "red").length}
                color="red"
            />
            <StatusFilterBtn
                active={filterStatus === "yellow"}
                onClick={() => onFilterChange("yellow")}
                label="Próximos"
                count={vehicles.filter((v) => v.alertLevel === "yellow").length}
                color="amber"
            />
            <StatusFilterBtn
                active={filterStatus === "green"}
                onClick={() => onFilterChange("green")}
                label="Al Día"
                count={vehicles.filter((v) => v.alertLevel === "green").length}
                color="emerald"
            />
        </div>
    );
}
