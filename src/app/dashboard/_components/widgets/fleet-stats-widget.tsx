import { getFleetStats } from "@/actions/dashboard-overview";
import { KpiCard } from "../kpi-card";
import { Truck, Users, FileText, AlertTriangle, Activity } from "lucide-react";

export async function FleetStatsWidget() {
    const result = await getFleetStats();
    const data = (result.success && result.data) ? result.data : {
        totalVehiculos: 0,
        totalConductores: 0,
        totalContratos: 0,
        totalSiniestros: 0,
        totalNovedades: 0,
        totalFuecActivos: 0,
        vehiculosConAlertaRoja: 0
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <KpiCard label="FLOTA ACTIVA" value={data.totalVehiculos} icon={Truck} accent />
                <KpiCard label="CONDUCTORES" value={data.totalConductores} icon={Users} />
                <KpiCard label="VINCULACIONES" value={data.totalContratos} icon={FileText} />
                <KpiCard label="FUEC CORRIENDO" value={data.totalFuecActivos} icon={Activity} accent />
                <KpiCard label="ALERTAS ROJAS" value={data.vehiculosConAlertaRoja} icon={AlertTriangle} danger={data.vehiculosConAlertaRoja > 0} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-100 p-6 flex items-center gap-5 shadow-sm hover:border-amber-500/30 transition-colors group">
                    <div className="h-10 w-10 bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-500/10 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-500">
                        <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-1">REGISTRO DE SINIESTROS</p>
                        <p className="text-xl font-black text-primary font-mono tracking-tighter leading-none">{data.totalSiniestros}</p>
                    </div>
                </div>
                <div className="bg-white border border-slate-100 p-6 flex items-center gap-5 shadow-sm hover:border-primary/30 transition-colors group">
                    <div className="h-10 w-10 bg-slate-50 text-slate-900 flex items-center justify-center shrink-0 border border-primary/5 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                        <FileText className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-1">NOVEDADES OPERATIVAS</p>
                        <p className="text-xl font-black text-primary font-mono tracking-tighter leading-none">{data.totalNovedades}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
