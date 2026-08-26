import { Metadata } from "next";
import { getPendingObligationsAction } from "@/actions/finance";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Users } from "lucide-react";
import { ReceivablesDashboard } from "./_components/receivables-dashboard";
import { UnifiedReceivable } from "@/types";

export const metadata: Metadata = {
    title: "Gestión de Cartera | Coopetraes",
    description: "Control de cuentas por cobrar y gestión de cobranza premium Solid Sharp.",
};

export const dynamic = "force-dynamic";

export default async function ReceivablesPage() {
    // Increase limit to cover full portfolio view, or use a specific get without pagination
    const result = await getPendingObligationsAction({ page: 1, limit: 1000 });
    
    // El resultado ahora viene unificado desde el servicio
    const resultData = result.data as unknown as { data: UnifiedReceivable[] };
    const obligaciones = result.success && resultData?.data ? resultData.data : [];

    return (
        <div className="pb-32 space-y-12 animate-in fade-in slide-in-from-top-4 duration-1000">
            <DashboardHeader
                title="Gestión de Cartera"
                tagline="CUENTAS POR COBRAR Y MOROSOS"
                subtitle="Monitoreo de obligaciones financieras, cobranza y recuperación de cartera activa."
                icon={Users}
            />

            <ReceivablesDashboard obligaciones={obligaciones} />
        </div>
    );
}
