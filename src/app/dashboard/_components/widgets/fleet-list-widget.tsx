import Link from "next/link";
import { Truck, Car, ChevronRight } from "lucide-react";
import { getRecentActivity } from "@/actions/dashboard-overview";

/**
 * @module FleetListWidget
 * @description Widget de servidor que muestra la lista reciente de vehículos activos.
 * Diseñado para ocupar el 50% del ancho en el grid bicolumna del dashboard.
 */
export async function FleetListWidget() {
    const result = await getRecentActivity();
    const vehicles = result.success && result.data ? result.data.recentVehicles : [];

    return (
        <div className="bg-white border border-slate-200 flex flex-col overflow-hidden h-full">
            {/* Encabezado */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 border border-slate-100 flex items-center justify-center bg-slate-50">
                        <Truck className="h-5 w-5 text-[#00b7b5]" />
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black text-[#005461] uppercase tracking-[0.25em] leading-none">
                            Flota Registrada
                        </h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                            {vehicles.length} unidades recientes
                        </p>
                    </div>
                </div>
                <Link href="/dashboard/vehiculos">
                    <div className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:border-[#005461] text-[#005461] text-[8.5px] font-black uppercase tracking-widest transition-all whitespace-nowrap">
                        Ver Flota <ChevronRight className="h-3 w-3" />
                    </div>
                </Link>
            </div>

            {/* Lista */}
            <div className="flex-1 divide-y divide-slate-50">
                {vehicles.length > 0 ? vehicles.map((v, idx) => (
                    <Link key={v.id} href={`/dashboard/vehiculos/${v.id}`}>
                        <div className="flex items-center gap-5 px-6 py-4 hover:bg-slate-50/70 transition-colors group cursor-pointer">
                            <span className="text-[9px] font-mono font-bold text-slate-200 w-5 shrink-0">
                                {String(idx + 1).padStart(2, "0")}
                            </span>
                            <div className="h-10 w-10 bg-[#005461] text-white flex items-center justify-center shrink-0 group-hover:bg-[#007a8a] transition-colors">
                                <Car className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight">{v.placa}</p>
                                <p className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                    {v.marca} {v.modelo ?? ""}
                                </p>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 text-slate-200 group-hover:text-[#005461] transition-colors shrink-0" />
                        </div>
                    </Link>
                )) : (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Truck className="h-8 w-8 text-slate-100 mb-3" />
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Sin vehículos registrados</p>
                    </div>
                )}
            </div>
        </div>
    );
}
