import { Suspense } from "react";
import { QuickActionsWidget } from "./quick-actions-widget";
import { FleetListWidget } from "./widgets/fleet-list-widget";
import { PersonalListWidget } from "./widgets/personal-list-widget";
import { FinancialStatsWidget } from "./widgets/financial-stats-widget";
import { FleetStatsWidget } from "./widgets/fleet-stats-widget";
import { ExpiringDocsWidget } from "./widgets/expiring-docs-widget";
import { Loader2 } from "lucide-react";

/**
 * @module AdminDashboardShell
 * @description Shell principal del admin con streaming via Suspense.
 * Layout:
 *   1. QuickActionsWidget  → Barra de acciones completa (ancho 100%)
 *   2. FleetListWidget + PersonalListWidget → Grid 2 columnas simétricas
 *   3. Widgets secundarios (finanzas, KPIs, alertas) → Al final
 */
export function AdminDashboardShell() {
    return (
        <div className="pb-20 bg-[#f4f6f8] min-h-screen">

            {/* ─── BARRA DE ACCIÓN RÁPIDA (ANCHO COMPLETO) ─── */}
            <div className="bg-white border-b border-slate-200">
                <QuickActionsWidget />
            </div>

            {/* ─── CONTENIDO PRINCIPAL ─── */}
            <div className="px-10 py-10 space-y-8">

                {/* GRID BICOLUMNA: Flota + Personal (misma altura y ancho) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    <Suspense fallback={<ListSkeleton label="Cargando Flota..." />}>
                        <FleetListWidget />
                    </Suspense>
                    <Suspense fallback={<ListSkeleton label="Cargando Personal..." />}>
                        <PersonalListWidget />
                    </Suspense>
                </div>

                {/* SEPARADOR VISUAL */}
                <div className="border-t border-slate-200 pt-8 space-y-8">
                    {/* KPIs de Flota */}
                    <Suspense fallback={<WidgetSkeleton label="Analizando Operaciones..." height="h-32" />}>
                        <FleetStatsWidget />
                    </Suspense>

                    {/* Finanzas */}
                    <Suspense fallback={<WidgetSkeleton label="Cargando Finanzas..." height="h-40" />}>
                        <FinancialStatsWidget />
                    </Suspense>

                    {/* Alertas / Vencimientos */}
                    <Suspense fallback={<WidgetSkeleton label="Escaneando Documentación..." height="h-64" />}>
                        <ExpiringDocsWidget />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function ListSkeleton({ label }: { label: string }) {
    return (
        <div className="bg-white border border-slate-200 min-h-[400px] flex flex-col animate-pulse">
            <div className="flex items-center gap-4 px-6 py-5 border-b border-slate-100">
                <div className="h-10 w-10 bg-slate-100" />
                <div className="space-y-2">
                    <div className="h-3 w-32 bg-slate-100" />
                    <div className="h-2 w-20 bg-slate-50" />
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-5 w-5 text-slate-200 animate-spin" />
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{label}</p>
                </div>
            </div>
        </div>
    );
}

function WidgetSkeleton({ label, height }: { label: string; height: string }) {
    return (
        <div className={`w-full ${height} bg-white border border-slate-200 flex flex-col items-center justify-center gap-3 animate-pulse`}>
            <Loader2 className="h-4 w-4 text-slate-200 animate-spin" />
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{label}</p>
        </div>
    );
}
