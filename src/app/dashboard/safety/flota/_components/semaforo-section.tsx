"use client";

import { useState } from "react";
import {
    ShieldCheck,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Car,
    Filter,
    Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
    VehicleStatusCard as VehicleStatusCardType,
    FleetVehicle,
} from "./vehicle-status-card";
import { VehicleStatusCard } from "./vehicle-status-card";
import type { ConfiguracionGlobal } from "@prisma/client";

interface SemaforoSectionProps {
    data: FleetVehicle[];
    companyConfig: ConfiguracionGlobal | null;
}

const STATUS_CONFIG = {
    GREEN: {
        label: "Operativo",
        color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    YELLOW: {
        label: "Alerta de Vencimiento",
        color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    RED: {
        label: "Fuera de Servicio",
        color: "bg-rose-50 text-rose-600 border-rose-100",
    },
    OVERRIDE: {
        label: "Desbloqueo Supervisado",
        color: "bg-slate-100 text-slate-700 border-slate-200",
    },
} as const;

export function SemaforoSection({ data, companyConfig }: SemaforoSectionProps) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<
        "ALL" | "GREEN" | "YELLOW" | "RED" | "OVERRIDE"
    >("ALL");

    const stats = {
        total: data.length,
        green: data.filter((v) => v.status === "GREEN").length,
        yellow: data.filter((v) => v.status === "YELLOW").length,
        red: data.filter((v) => v.status === "RED").length,
        override: data.filter((v) => v.status === "OVERRIDE").length,
    };

    const filtered = data.filter((v) => {
        const matchSearch =
            !search ||
            v.placa.toLowerCase().includes(search.toLowerCase()) ||
            v.marca?.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "ALL" || v.status === filter;
        return matchSearch && matchFilter;
    });

    const kpis = [
        {
            key: "ALL" as const,
            title: "Total Flota",
            value: stats.total,
            icon: <Car />,
            color: "bg-slate-100 text-slate-600",
        },
        {
            key: "GREEN" as const,
            title: "Operativo",
            value: stats.green,
            icon: <span>[CHECK]</span>,
            color: "bg-emerald-50 text-emerald-600 border-emerald-100",
            percentage: stats.total > 0 ? (stats.green / stats.total) * 100 : 0,
        },
        {
            key: "YELLOW" as const,
            title: "Alerta / Vencido",
            value: stats.yellow,
            icon: <span>[ALERTTRIANGLE]</span>,
            color: "bg-amber-50 text-amber-600 border-amber-100",
            percentage:
                stats.total > 0 ? (stats.yellow / stats.total) * 100 : 0,
        },
        {
            key: "RED" as const,
            title: "Fuera de Servicio",
            value: stats.red,
            icon: <span>[X]</span>,
            color: "bg-rose-50 text-rose-600 border-rose-100",
            percentage: stats.total > 0 ? (stats.red / stats.total) * 100 : 0,
        },
        {
            key: "OVERRIDE" as const,
            title: "Super-Override",
            value: stats.override,
            icon: <ShieldCheck />,
            color: "bg-slate-100 text-slate-600 border-slate-200",
            percentage:
                stats.total > 0 ? (stats.override / stats.total) * 100 : 0,
        },
    ];

    return (
        <div>
            {/* KPI Cards - clickable to filter */}
            <div>
                {kpis.map((kpi) => (
                    <button
                        key={kpi.key}
                        onClick={() => setFilter(kpi.key)}>
                        <div>
                            <div>
                                <p>
                                    {kpi.title}
                                </p>
                                <h3>
                                    {kpi.value}
                                </h3>
                            </div>
                            <div>
                                {kpi.icon}
                            </div>
                        </div>
                        {kpi.percentage !== undefined && (
                            <div>
                                <div>
                                    <div
                                        style={{ width: `${kpi.percentage || 0}%` }}
                                    />
                                </div>
                                <p>
                                    {kpi.percentage.toFixed(0)}%
                                    representatividad
                                </p>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Filters bar */}
            <div>
                <h2>
                    <div>
                        <ShieldCheck />
                    </div>
                    Listado de Cumplimiento PESV
                    <span>
                        {filtered.length} unds
                    </span>
                    {filter !== "ALL" && (
                        <span>
                            Vista: {STATUS_CONFIG[filter].label}
                        </span>
                    )}
                </h2>
                <div>
                    <div>
                        <span>[SEARCH]</span>
                        <input
                            type="text"
                            placeholder="Buscar por placa..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            
                        />
                    </div>
                    {filter !== "ALL" && (
                        <button
                            onClick={() => setFilter("ALL")}>
                            Limpiar filtros
                        </button>
                    )}
                </div>
            </div>

            {/* Vehicle grid */}
            <div>
                {filtered.length === 0 ? (
                    <div>
                        Sin resultados para la búsqueda actual.
                    </div>
                ) : (
                    filtered.map((vehicle) => (
                        <VehicleStatusCard
                            key={vehicle.id}
                            vehicle={vehicle}
                            companyConfig={companyConfig}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
