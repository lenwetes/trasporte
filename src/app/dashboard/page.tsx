import {
    getVehiclesWithExpiringDocuments,
    getExpiryProjections,
    getConductorData,
    getAdminDashboardStats,
    getDashboardOverview,
} from "@/actions";
import nextDynamic from "next/dynamic";
import { auth } from "@/auth";
import { AlertCircle, Loader2 } from "lucide-react";
import { ConfiguracionGlobal as ConfigModel } from "@prisma/client";

export const dynamic = "force-dynamic";

const AdminDashboard = nextDynamic(
    () => import("./_components/admin-dashboard").then((m) => m.AdminDashboard),
    {
        loading: () => <DashboardLoading />,
    },
);
const ConductorDashboard = nextDynamic(
    () =>
        import("./_components/conductor-dashboard").then(
            (m) => m.ConductorDashboard,
        ),
    {
        loading: () => <DashboardLoading />,
    },
);
const SecretariaDashboard = nextDynamic(
    () =>
        import("./_components/secretaria-dashboard").then(
            (m) => m.SecretariaDashboard,
        ),
    {
        loading: () => <DashboardLoading />,
    },
);
const PropietarioDashboard = nextDynamic(
    () =>
        import("./_components/propietario-dashboard").then(
            (m) => m.PropietarioDashboard,
        ),
    {
        loading: () => <DashboardLoading />,
    },
);

import {
    DashboardVehicle,
    ExpiryProjection,
    AdminDashboardStats,
} from "@/lib/types";
import type { DashboardOverviewData } from "@/actions/dashboard-overview";
import { getConfiguracionGlobal } from "@/actions/configuracion";

const HybridPremiumDashboard = nextDynamic(
    () => import("./_components/hybrid-premium-dashboard").then((m) => m.HybridPremiumDashboard),
    {
        loading: () => <DashboardLoading />,
    },
);

import { AdminDashboardShell } from "./_components/admin-dashboard-shell";

function DashboardLoading() {
    return (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="h-8 w-8 text-primary/20 animate-spin" />
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                Sincronizando Panel Operativo...
            </p>
        </div>
    );
}

export default async function DashboardPage() {
    const session = await auth();
    const role = session?.user?.rol;
    const userId = session?.user?.id;
    const userName = session?.user?.name || "";

    // Global Config for all roles to respect theme setting
    const configResult = await getConfiguracionGlobal();
    const configData = configResult.success ? (configResult.data as ConfigModel) : null;
    const theme = configData?.dashboardTheme ?? "command-classic";

    // Data for Admin
    if (role === "ADMIN") {
        if (theme === "hybrid-premium") {
            const [result, projectionsResult, statsResult, overviewResult] =
                await Promise.all([
                    getVehiclesWithExpiringDocuments(),
                    getExpiryProjections(),
                    getAdminDashboardStats(),
                    getDashboardOverview(),
                ]);

            if (!result.success)
                return (
                    <ErrorMessage message="Error al cargar el dashboard global" />
                );

            const dashboardProps = {
                vehicles: result.data as unknown as DashboardVehicle[],
                projections: projectionsResult.success
                    ? (projectionsResult.data as ExpiryProjection[])
                    : [],
                stats: statsResult.success
                    ? (statsResult.data as AdminDashboardStats)
                    : undefined,
                overview: overviewResult.success
                    ? (overviewResult.data as DashboardOverviewData)
                    : undefined
            };
            return <HybridPremiumDashboard {...dashboardProps} />;
        }

        // Default Admin Dashboard with Streaming
        return <AdminDashboardShell />;
    }

    // Data for Secretaria
    if (role === "SECRETARIA") {
        const [result, projectionsResult, overviewResult] = await Promise.all([
            getVehiclesWithExpiringDocuments(),
            getExpiryProjections(),
            getDashboardOverview(),
        ]);

        if (!result.success)
            return (
                <ErrorMessage message="Error al cargar el panel de gestión documental" />
            );
        return (
            <SecretariaDashboard
                vehicles={result.data as unknown as DashboardVehicle[]}
                theme={theme}
            />
        );
    }

    // Data for Conductor
    if (role === "CONDUCTOR" && userId) {
        const result = await getConductorData(userId);
        if (!result.success || !result.data)
            return (
                <ErrorMessage message="No se pudo cargar tu información de conductor" />
            );
        return (
            <ConductorDashboard 
                conductorData={result.data as import("@/lib/types").ConductorData} 
                theme={theme}
            />
        );
    }

    // Data for Propietario
    if (role === "PROPIETARIO") {
        const result = await getVehiclesWithExpiringDocuments();
        if (!result.success)
            return <ErrorMessage message="Error al cargar tus propiedades" />;
        return (
            <PropietarioDashboard
                vehicles={result.data as unknown as DashboardVehicle[]}
                userName={userName}
                theme={theme}
            />
        );
    }

    // Fallback or unauthorized
    return (
        <ErrorMessage message="No tienes permisos para visualizar este panel" />
    );
}

function ErrorMessage({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="h-16 w-16 bg-red-50 border border-red-500/20 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="text-center space-y-2">
                <h2 className="text-sm font-black text-red-700 uppercase tracking-widest">Error de Sistema</h2>
                <p className="text-[10px] font-bold text-red-600/60 uppercase tracking-[0.2em] max-w-sm">
                    {message}
                </p>
            </div>
        </div>
    );
}
