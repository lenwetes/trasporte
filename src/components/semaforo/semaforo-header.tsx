import {
    Search,
    LayoutList,
    Calendar as CalendarIcon,
    FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ViewMode } from "./types";
import { DashboardVehicle } from "@/lib/types";
import { exportToCSV } from "./utils";
// [REMOVED IMPORT]
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

interface SemaforoHeaderProps {
    search: string;
    setSearch: (value: string) => void;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    vehicles: DashboardVehicle[];
    filteredVehicles: DashboardVehicle[];
    selectedDate?: Date;
}

export function SemaforoHeader({
    search,
    setSearch,
    viewMode,
    setViewMode,
    vehicles,
    filteredVehicles,
    selectedDate,
}: SemaforoHeaderProps) {
    return (
        <div>
            {/* Subtle brand decoration */}
            <div />

            <div>
                <div>
                    <div>
                        <span>[SEARCH]</span>
                        <input
                            type="text"
                            placeholder="Buscar placa, marca o propietario..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            
                        />
                    </div>

                    <div>
                        <button
                            onClick={() => setViewMode("list")}>
                            <LayoutList />
                            <span>Listado</span>
                        </button>
                        <button
                            onClick={() => setViewMode("calendar")}>
                            <span>[ICON]</span>
                            <span>Calendario</span>
                        </button>
                    </div>
                </div>

                <div>
                    <button
                        onClick={() => exportToCSV(filteredVehicles)}>
                        <FileSpreadsheet />
                        <span>Exportar Datos</span>
                        <span>Exportar</span>
                    </button>
                </div>
            </div>

            {selectedDate && viewMode === "calendar" && (
                <div>
                    <div>
                        <div>
                            <span>[ICON]</span>
                        </div>
                        <div>
                            <p>
                                Fecha Seleccionada
                            </p>
                            <p>
                                {format(selectedDate, "EEEE, d 'de' MMMM", {
                                    locale: es,
                                })}
                            </p>
                        </div>
                    </div>
                    <Link href="/dashboard/safety/calendario">
                        <button
                            style={{ 
                                padding: "8px 16px", 
                                border: "1px solid #e2e8f0", 
                                borderRadius: "8px", 
                                backgroundColor: "white", 
                                color: "#64748b",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "500"
                            }}
                        >
                            Ver Calendario Maestro
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}
