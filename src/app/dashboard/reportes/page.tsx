"use client";

import { ReportHeader } from "./_components/report-header";
import { ReportFilters } from "./_components/report-filters";
import { ReportList } from "./_components/report-list";
import { ReportSummary } from "./_components/report-summary";
import { useReportData } from "./hooks/use-report-data";
import { useReportGeneration } from "./hooks/use-report-generation";

export default function ReportesPage() {
    const {
        filters,
        setFilters,
        resetFilters,
        conductores,
        vehiculos,
        userSession,
        loading,
        setLoading,
    } = useReportData();

    const { handleExportExcel, handleGenerateReport } = useReportGeneration(
        setLoading,
        filters,
    );

    const isAdminOrSecretary =
        userSession?.role === "ADMIN" || userSession?.role === "SECRETARIA";

    return (
        <div>
            {/* Contextualized Background - Removed blobs for clean dark view */}

            {/* Header */}
            <ReportHeader />

            {/* Filters Section */}
            <div>
                <ReportFilters
                    filters={filters}
                    setFilters={setFilters}
                    conductores={conductores}
                    vehiculos={vehiculos}
                    isAdminOrSecretary={isAdminOrSecretary}
                    onReset={resetFilters}
                />
            </div>

            {/* Report Grid */}
            <div>
                <ReportList
                    isAdminOrSecretary={isAdminOrSecretary}
                    vehiculosCount={vehiculos.length}
                    loading={loading}
                    onExport={handleExportExcel}
                    onGenerate={handleGenerateReport}
                />
            </div>

            {/* Quick Analytics Summary */}
            <div>
                <ReportSummary />
            </div>
        </div>
    );
}
