"use client";

import React from "react";
import { UnifiedReceivable } from "@/types";
import { useReceivablesDashboard } from "./use-receivables-dashboard";
import { ReceivablesMetricsSidebar } from "./receivables-metrics-sidebar";
import { ReceivablesTableWidget } from "./receivables-table-widget";

// @refactored 2026-04-01 | M11 - Receivables Dashboard Dividido en Widgets
export function ReceivablesDashboard({ obligaciones: data }: { obligaciones: UnifiedReceivable[] }) {
    const {
        filter,
        setFilter,
        searchTerm,
        setSearchTerm,
        isNotifying,
        morosos,
        prestamos,
        obligaciones,
        totalCartera,
        totalMora,
        totalLoans,
        filteredList,
        handleNotifyMorosos
    } = useReceivablesDashboard(data);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <ReceivablesMetricsSidebar
                totalCartera={totalCartera}
                totalMora={totalMora}
                totalLoans={totalLoans}
                morososCount={morosos.length}
                prestamosCount={prestamos.length}
                filter={filter}
                setFilter={setFilter}
                isNotifying={isNotifying}
                handleNotifyMorosos={handleNotifyMorosos}
            />
            
            <ReceivablesTableWidget
                filteredList={filteredList}
                dataLength={data.length}
                prestamosCount={prestamos.length}
                obligacionesCount={obligaciones.length}
                morososCount={morosos.length}
                filter={filter}
                setFilter={setFilter}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />
        </div>
    );
}
