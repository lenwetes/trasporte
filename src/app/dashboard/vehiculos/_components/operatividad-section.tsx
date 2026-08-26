"use client";

import { useState } from "react";
import { VehiclesBlockingTable } from "@/app/dashboard/safety/operatividad/_components/vehicles-blocking-table";
import { OwnersTable } from "@/app/dashboard/safety/operatividad/_components/owners-table";
import { Car, Users, ShieldAlert } from "lucide-react";

export interface OperatividadOwner {
    id: string;
    nombres: string;
    apellidos: string;
    email: string | null;
    numeroDocumento: string | null;
    bloqueadoPorDeuda?: boolean;
    _count: { vehiculosPropiedad: number };
}

export interface OperatividadVehicle {
    id: string;
    placa: string;
    marca: string | null;
    modelo: string | null;
    bloqueadoManualmente: boolean;
    razonBloqueo: string | null;
    estadoOperativo: string;
    propietario: string | null;
}

interface OperatividadSectionProps {
    initialVehicles: OperatividadVehicle[];
    initialOwners: OperatividadOwner[];
}

type InnerTab = "vehiculos" | "propietarios";

export function OperatividadSection({
    initialVehicles,
    initialOwners,
}: OperatividadSectionProps) {
    const [activeTab, setActiveTab] = useState<InnerTab>("vehiculos");

    const blockedVehicles = initialVehicles.filter(
        (v: OperatividadVehicle) => v.bloqueadoManualmente,
    ).length;
    const blockedOwners = initialOwners.filter(
        (o) => o.bloqueadoPorDeuda,
    ).length;

    const tabs: {
        value: InnerTab;
        label: string;
        icon: React.ElementType;
        count?: number;
        countColor?: string;
    }[] = [
        {
            value: "vehiculos",
            label: "Control de Flota",
            icon: Car,
            count: blockedVehicles,
            countColor: "bg-rose-50 text-rose-700 border-rose-100",
        },
        {
            value: "propietarios",
            label: "Gestión Propietarios",
            icon: Users,
            count: blockedOwners,
            countColor: "bg-amber-50 text-amber-700 border-amber-100",
        },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Banner informativo */}
            <div style={{ backgroundColor: "#fff1f2", padding: "20px", borderRadius: "20px", border: "1px solid #ffe4e6", display: "flex", alignItems: "flex-start", gap: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#ffe4e6", display: "flex", alignItems: "center", justifyContent: "center", color: "#e11d48", flexShrink: 0 }}>
                    <ShieldAlert size={20} />
                </div>
                <div>
                    <p style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "800", color: "#9f1239" }}>
                        Sistema de Bloqueo Centralizado
                    </p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#be123c", fontWeight: "500", lineHeight: "1.5" }}>
                        {blockedVehicles} unidad{blockedVehicles !== 1 ? "es" : ""} con restricción
                        operativa manual actual. No podrán generar documentos ni
                        reportes hasta su habilitación formal en el sistema.
                    </p>
                </div>
            </div>

            {/* Inner Tab Nav */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px" }}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.value;
                    return (
                        <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "12px 20px",
                                borderRadius: "14px",
                                border: "none",
                                backgroundColor: isActive ? "#0f172a" : "transparent",
                                color: isActive ? "white" : "#64748b",
                                fontSize: "13px",
                                fontWeight: "800",
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                            {(tab.count ?? 0) > 0 && (
                                <span style={{
                                    backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "#f1f5f9",
                                    color: isActive ? "white" : "#0f172a",
                                    padding: "2px 8px",
                                    borderRadius: "8px",
                                    fontSize: "11px"
                                }}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div style={{ backgroundColor: "white", padding: "32px", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                {activeTab === "vehiculos" && (
                    <VehiclesBlockingTable initialVehicles={initialVehicles} />
                )}
                {activeTab === "propietarios" && (
                    <OwnersTable initialOwners={initialOwners} />
                )}
            </div>
        </div>
    );
}
