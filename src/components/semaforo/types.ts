import { DashboardVehicle } from "@/lib/types";

export interface SemaforoOverviewProps {
    vehicles: DashboardVehicle[];
    itemsPerPage?: number;
}

export type ViewMode = "list" | "calendar";

export type AlertColor = "slate" | "red" | "amber" | "emerald";
