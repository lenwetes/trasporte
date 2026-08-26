import { getRecentActivity } from "@/actions/dashboard-overview";
import { MiniVehicleList, MiniConductorList } from "../mini-entity-lists";
import { QuickActionsWidget } from "../quick-actions-widget";

export async function RecentActivityWidget() {
    const result = await getRecentActivity();
    const data = (result.success && result.data) 
        ? result.data 
        : { recentVehicles: [], recentConductores: [] };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
                <QuickActionsWidget />
                <MiniVehicleList vehicles={data.recentVehicles} />
            </div>
            <div className="space-y-8">
                <MiniConductorList conductores={data.recentConductores} />
            </div>
        </div>
    );
}
