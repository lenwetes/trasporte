/**
 * SG-SST Header - Refactored with Tailwind CSS
 */
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ShieldAlert, Activity, Users } from "lucide-react";

interface SGSSTHeaderProps {
    totalUsers: number;
}

export function SGSSTHeader({ totalUsers }: SGSSTHeaderProps) {
    return (
        <DashboardHeader
            title="SG-SST & Seguridad Vial"
            tagline="Cumplimiento Normativo"
            subtitle="Salud, Dotación y Compromisos de Seguridad Institucional"
            icon={ShieldAlert}
            actions={
                <div className="flex gap-6 items-center">
                    <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
                        <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 shadow-sm">
                            <Users size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">
                                Directorio
                            </p>
                            <p className="text-lg font-black text-slate-900 uppercase tracking-tight">
                                {totalUsers} Usuarios
                            </p>
                        </div>
                    </div>

                    <div className="hidden sm:flex px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full items-center gap-2">
                        <Activity size={12} className="text-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.1em]">
                            Sincronizado
                        </span>
                    </div>
                </div>
            }
        />
    );
}

