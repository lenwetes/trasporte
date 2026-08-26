import { getVehiculos } from "@/actions";
import { VehiculosListadoView } from "./_components/vehiculos-listado-view";
import { AlertsService } from "@/services/alerts.service";
import { VehiculoWithRelations } from "@/types";

export const dynamic = "force-dynamic";

export default async function VehiculosPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string }>;
}) {
    const params = await searchParams;
    const currentPage = Number(params.page) || 1;
    const searchTerm = params.search || "";
    
    // 1. Obtener Vehículos
    const result = await getVehiculos({
        page: currentPage,
        pageSize: 12,
        search: searchTerm,
    });

    // 2. Obtener Alertas y Reglas
    const [alertasResumen, reglasInitial] = await Promise.all([
        AlertsService.getResumen(50),
        AlertsService.getReglas(),
    ]);

    if (!result.success || !result.data) {
        return (
            <div className="p-10 text-center text-red-500">
                <h2 className="text-xl font-bold">Error de Conexión</h2>
                <p>No se pudo sincronizar la base de datos de activos operativos.</p>
            </div>
        );
    }

    const { data: vehiculos, pagination } = result.data;

    return (
        <div className="max-w-[1700px] mx-auto p-5">
            <div className="mt-8">
                <VehiculosListadoView 
                    vehiculos={vehiculos as VehiculoWithRelations[]} 
                    alertasResumen={alertasResumen}
                    reglasInitial={reglasInitial}
                    metadata={{
                        total: pagination.totalItems,
                        page: pagination.page,
                        totalPages: pagination.totalPages,
                        totalBlocked: pagination.totalBlocked || 0
                    }}
                />
            </div>
        </div>
    );
}
