"use client";

import { useState, useMemo } from "react";
import { SemaforoOverviewProps, ViewMode } from "./types";
import { SemaforoHeader } from "./semaforo-header";
import { StatusFilters } from "./status-filters";
import { VehicleListView } from "./vehicle-list-view";
import { CalendarView } from "./calendar-view";
import { Pagination } from "./pagination";
// [REMOVED IMPORT]
export function SemaforoOverview({
    vehicles,
    itemsPerPage = 10,
}: SemaforoOverviewProps) {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [sortBy] = useState<string>("status");
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date(),
    );
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    // Memoized derived data
    const filteredVehicles = useMemo(() => {
        return vehicles
            .filter((v) => {
                const matchesSearch =
                    v.placa.toLowerCase().includes(search.toLowerCase()) ||
                    (v.propietario &&
                        (v.propietario as string)
                            .toLowerCase()
                            .includes(search.toLowerCase()));
                const matchesStatus =
                    filterStatus === "all" || v.alertLevel === filterStatus;
                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => {
                if (sortBy === "status") {
                    const priority: Record<string, number> = {
                        red: 3,
                        yellow: 2,
                        green: 1,
                    };
                    return priority[b.alertLevel] - priority[a.alertLevel];
                }
                if (sortBy === "placa") return a.placa.localeCompare(b.placa);
                return 0;
            });
    }, [vehicles, search, filterStatus, sortBy]);

    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
    const paginatedVehicles = useMemo(() => {
        return filteredVehicles.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage,
        );
    }, [filteredVehicles, currentPage, itemsPerPage]);

    const calendarAlerts = useMemo(() => {
        return vehicles
            .flatMap((v) =>
                (v.alerts || []).map((a) => ({
                    date: new Date(a.fechaVencimiento),
                    placa: v.placa,
                    tipo: a.tipo,
                    status: a.status,
                    vehicleId: v.id,
                })),
            )
            .filter((a) => a.status !== "green");
    }, [vehicles]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleFilterChange = (status: string) => {
        setFilterStatus(status);
        setCurrentPage(1);
    };

    return (
        <div>
            {/* Subtle brand decoration */}
            <div />
            <div />

            <SemaforoHeader
                search={search}
                setSearch={(val) => {
                    setSearch(val);
                    setCurrentPage(1);
                }}
                viewMode={viewMode}
                setViewMode={setViewMode}
                vehicles={vehicles}
                filteredVehicles={filteredVehicles}
                selectedDate={selectedDate}
            />

            <div>
                <StatusFilters
                    filterStatus={filterStatus}
                    onFilterChange={handleFilterChange}
                    vehicles={vehicles}
                />
            </div>

            <div>
                <>
                    {viewMode === "list" ? (
                        <div key="list-view">
                            <VehicleListView
                                paginatedVehicles={paginatedVehicles}
                            />
                        </div>
                    ) : (
                        <div key="calendar-view">
                            <CalendarView
                                calendarAlerts={calendarAlerts}
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                currentMonth={currentMonth}
                                setCurrentMonth={setCurrentMonth}
                            />
                        </div>
                    )}
                </>
            </div>

            {viewMode === "list" && (
                <div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalResults={filteredVehicles.length}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}
