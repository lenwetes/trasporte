// [REMOVED IMPORT]
import { DashboardVehicle } from "@/lib/types";
import { VehicleCard } from "./vehicle-card";

interface VehicleListViewProps {
    paginatedVehicles: DashboardVehicle[];
}

export function VehicleListView({ paginatedVehicles }: VehicleListViewProps) {
    return (
        <div key="list">
            {paginatedVehicles.map((vehiculo, idx) => (
                <VehicleCard key={vehiculo.id} vehiculo={vehiculo} idx={idx} />
            ))}
        </div>
    );
}
