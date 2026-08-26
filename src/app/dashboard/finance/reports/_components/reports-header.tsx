"use client";

import React from "react";
import { FinancialReportData } from "@/types/finance";

interface ReportsHeaderProps {
    dateRange: { from: Date; to: Date };
    setDateRange: (range: { from: Date; to: Date }) => void;
    fetchReport: () => void;
    loading: boolean;
    report: FinancialReportData | null;
}

export function ReportsHeader({
    dateRange,
    setDateRange,
    fetchReport,
    loading,
    report,
}: ReportsHeaderProps) {
    const fromStr = dateRange.from.toISOString().split('T')[0];
    const toStr = dateRange.to.toISOString().split('T')[0];

    const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val) setDateRange({ ...dateRange, from: new Date(val) });
    };

    const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val) setDateRange({ ...dateRange, to: new Date(val) });
    };

    return (
        <div style={{ backgroundColor: "#fff", border: "1px solid #eee", padding: "15px", borderRadius: "12px", marginBottom: "20px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ minWidth: "200px" }}>
                <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "bold" }}>Filtros de Reporte</h3>
                <p style={{ margin: 0, fontSize: "11px", color: "#888" }}>Seleccione el rango de fechas para auditoría</p>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input 
                    type="date" 
                    value={fromStr} 
                    onChange={handleFromChange} 
                    style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                />
                <span style={{ fontSize: "12px", color: "#ccc" }}>→</span>
                <input 
                    type="date" 
                    value={toStr} 
                    onChange={handleToChange} 
                    style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                />
                
                <button 
                    onClick={fetchReport} 
                    disabled={loading}
                    style={{ padding: "8px 16px", backgroundColor: "#000", color: "#fff", border: "none", cursor: "pointer" }}
                >
                    {loading ? "Generando..." : "Cargar"}
                </button>
            </div>
        </div>
    );
}
