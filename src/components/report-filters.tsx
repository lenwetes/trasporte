"use client";

import { useState, useEffect } from "react";
import { FormField } from "./ui/form-field";
import { FormSelect } from "./ui/form-select";
import { Filter, X, ChevronDown } from "lucide-react";

export interface ReportFilters {
    fechaInicio?: string;
    fechaFin?: string;
    conductorId?: string;
    vehiculoId?: string;
}

interface ReportFiltersProps {
    onFilterChange: (filters: ReportFilters) => void;
    showConductorFilter?: boolean;
    showVehiculoFilter?: boolean;
    showDateFilters?: boolean;
}

interface Conductor {
    id: string;
    nombres: string;
    apellidos: string;
}

interface Vehiculo {
    id: string;
    placa: string;
}

export function ReportFiltersComponent({
    onFilterChange,
    showConductorFilter = true,
    showVehiculoFilter = true,
    showDateFilters = true,
}: ReportFiltersProps) {
    const [filters, setFilters] = useState<ReportFilters>({});
    const [conductores, setConductores] = useState<Conductor[]>([]);
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                if (showConductorFilter) {
                    const response = await fetch("/api/conductores");
                    if (response.ok) {
                        const data = await response.json();
                        setConductores(data);
                    }
                }
                if (showVehiculoFilter) {
                    const response = await fetch("/api/vehiculos");
                    if (response.ok) {
                        const data = await response.json();
                        setVehiculos(data);
                    }
                }
            } catch (error) {
                console.error("Error loading filter data:", error);
            }
        };
        loadData();
    }, [showConductorFilter, showVehiculoFilter]);

    const handleFilterChange = (key: keyof ReportFilters, value: string) => {
        const newFilters = { ...filters, [key]: value || undefined };
        setFilters(newFilters);
    };

    const handleApplyFilters = () => {
        onFilterChange(filters);
    };

    const handleClearFilters = () => {
        setFilters({});
        onFilterChange({});
    };

    const hasActiveFilters = Object.values(filters).some((v) => v);

    return (
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", backgroundColor: "white", marginBottom: "20px" }}>
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    backgroundColor: "white",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left"
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ 
                        width: "40px", 
                        height: "40px", 
                        borderRadius: "8px", 
                        backgroundColor: "#f1f5f9", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        color: "#475569"
                    }}>
                        <Filter size={20} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>
                            Filtros de Reporte
                        </h3>
                        <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                            {hasActiveFilters
                                ? "Filtros aplicados"
                                : "Personaliza tu reporte"}
                        </p>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {hasActiveFilters && (
                        <span style={{ 
                            fontSize: "11px", 
                            fontWeight: "700", 
                            backgroundColor: "#f0fdf4", 
                            color: "#166534", 
                            padding: "2px 8px", 
                            borderRadius: "12px",
                            textTransform: "uppercase"
                        }}>
                            Activo
                        </span>
                    )}
                    <ChevronDown size={20} style={{ 
                        color: "#64748b", 
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s"
                    }} />
                </div>
            </button>

            {/* Filters Content */}
            {isExpanded && (
                <div style={{ padding: "20px", borderTop: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                        {/* Fecha Inicio */}
                        {showDateFilters && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Fecha Inicio</label>
                                <input 
                                    type="date"
                                    value={filters.fechaInicio || ""}
                                    onChange={(e) => handleFilterChange("fechaInicio", e.target.value)}
                                    style={{
                                        padding: "8px 12px",
                                        borderRadius: "8px",
                                        border: "1px solid #cbd5e1",
                                        fontSize: "14px"
                                    }}
                                />
                            </div>
                        )}

                        {/* Fecha Fin */}
                        {showDateFilters && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Fecha Fin</label>
                                <input 
                                    type="date"
                                    value={filters.fechaFin || ""}
                                    onChange={(e) => handleFilterChange("fechaFin", e.target.value)}
                                    style={{
                                        padding: "8px 12px",
                                        borderRadius: "8px",
                                        border: "1px solid #cbd5e1",
                                        fontSize: "14px"
                                    }}
                                />
                            </div>
                        )}

                        {/* Conductor */}
                        {showConductorFilter && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Conductor</label>
                                <select 
                                    value={filters.conductorId || ""}
                                    onChange={(e) => handleFilterChange("conductorId", e.target.value)}
                                    style={{
                                        padding: "8px 12px",
                                        borderRadius: "8px",
                                        border: "1px solid #cbd5e1",
                                        fontSize: "14px",
                                        backgroundColor: "white"
                                    }}
                                >
                                    <option value="">Todos los conductores</option>
                                    {conductores.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.nombres} {c.apellidos}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Vehículo */}
                        {showVehiculoFilter && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Vehículo</label>
                                <select 
                                    value={filters.vehiculoId || ""}
                                    onChange={(e) => handleFilterChange("vehiculoId", e.target.value)}
                                    style={{
                                        padding: "8px 12px",
                                        borderRadius: "8px",
                                        border: "1px solid #cbd5e1",
                                        fontSize: "14px",
                                        backgroundColor: "white"
                                    }}
                                >
                                    <option value="">Todos los vehículos</option>
                                    {vehiculos.map((v) => (
                                        <option key={v.id} value={v.id}>
                                            {v.placa}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #e2e8f0" }}>
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            disabled={!hasActiveFilters}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 16px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                backgroundColor: "white",
                                color: "#64748b",
                                cursor: hasActiveFilters ? "pointer" : "not-allowed",
                                fontSize: "14px",
                                fontWeight: "600",
                                opacity: hasActiveFilters ? 1 : 0.5
                            }}
                        >
                            <X size={16} />
                            Limpiar
                        </button>
                        <button 
                            onClick={handleApplyFilters}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 20px",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: "#10b981",
                                color: "white",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "600"
                            }}
                        >
                            <Filter size={16} />
                            Aplicar Filtros
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
