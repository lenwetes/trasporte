import { getExpiringDocumentsOverview } from "@/actions/dashboard-overview";
import { UpcomingExpiriesWidget } from "../upcoming-expiries-widget";
import { getExpiryProjections } from "@/actions";
import { ExpiryProjectionChart } from "../fleet-widgets";
import { CalendarWidget } from "../calendar-widget";
import { ExpiryProjection } from "@/lib/types";

/**
 * @module ExpiringDocsWidget
 * @description Sección final del dashboard con distribución:
 *   Fila 1: [Vencimientos Próximos] | [Proyección Documental]  ← Grid 2 cols
 *   Fila 2: [Calendario de Abril - Ancho Completo]             ← Col span 2
 */
export async function ExpiringDocsWidget() {
    const [expiriesRes, projectionsRes] = await Promise.all([
        getExpiringDocumentsOverview(),
        getExpiryProjections(),
    ]);

    const upcomingExpiries = (expiriesRes.success && expiriesRes.data)
        ? expiriesRes.data.upcomingExpiries
        : [];
    const projections = projectionsRes.success
        ? (projectionsRes.data as ExpiryProjection[])
        : [];

    return (
        <div className="space-y-6">
            {/* FILA 1: Dos paneles lado a lado */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UpcomingExpiriesWidget expiries={upcomingExpiries} />
                <ExpiryProjectionChart projections={projections} />
            </div>

            {/* FILA 2: Calendario a ancho completo */}
            <div className="w-full border-2 border-dashed border-[#00b7b5]/30">
                <CalendarWidget />
            </div>
        </div>
    );
}

