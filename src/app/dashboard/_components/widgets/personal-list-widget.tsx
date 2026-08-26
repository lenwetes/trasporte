import Link from "next/link";
import { Users, ChevronRight } from "lucide-react";
import { getRecentActivity } from "@/actions/dashboard-overview";
import { cn } from "@/lib/utils";

/**
 * @module PersonalListWidget
 * @description Widget de servidor que muestra la lista reciente de conductores activos.
 * Diseñado para ocupar el 50% del ancho en el grid bicolumna del dashboard.
 */

// Paleta de colores para los avatares iniciales (varía según índice para diversidad visual)
const AVATAR_PALETTE = [
    "bg-[#005461]",
    "bg-[#007a8a]",
    "bg-slate-700",
    "bg-[#005461]",
    "bg-teal-700",
    "bg-[#005461]",
] as const;

export async function PersonalListWidget() {
    const result = await getRecentActivity();
    const conductores = result.success && result.data ? result.data.recentConductores : [];

    return (
        <div className="bg-white border border-slate-200 flex flex-col overflow-hidden h-full">
            {/* Encabezado */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 border border-slate-100 flex items-center justify-center bg-slate-50">
                        <Users className="h-5 w-5 text-[#00b7b5]" />
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black text-[#005461] uppercase tracking-[0.25em] leading-none">
                            Personal Vinculado
                        </h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                            {conductores.length} conductores activos
                        </p>
                    </div>
                </div>
                <Link href="/dashboard/usuarios">
                    <div className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:border-[#005461] text-[#005461] text-[8.5px] font-black uppercase tracking-widest transition-all whitespace-nowrap">
                        Ver Personal <ChevronRight className="h-3 w-3" />
                    </div>
                </Link>
            </div>

            {/* Lista */}
            <div className="flex-1 divide-y divide-slate-50">
                {conductores.length > 0 ? conductores.map((c, idx) => {
                    const initials = `${c.nombres.charAt(0)}${c.apellidos.charAt(0)}`.toUpperCase();
                    const bgColor = AVATAR_PALETTE[idx % AVATAR_PALETTE.length];
                    return (
                        <Link key={c.id} href={`/dashboard/usuarios/${c.id}`}>
                            <div className="flex items-center gap-5 px-6 py-4 hover:bg-slate-50/70 transition-colors group cursor-pointer">
                                <span className="text-[9px] font-mono font-bold text-slate-200 w-5 shrink-0">
                                    {String(idx + 1).padStart(2, "0")}
                                </span>
                                <div className={cn(
                                    "h-10 w-10 text-white flex items-center justify-center text-[11px] font-black shrink-0 group-hover:brightness-110 transition-all",
                                    bgColor
                                )}>
                                    {initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight truncate">
                                        {c.nombres} {c.apellidos}
                                    </p>
                                    <p className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                        CC {c.numeroDocumento}
                                    </p>
                                </div>
                                <ChevronRight className="h-3.5 w-3.5 text-slate-200 group-hover:text-[#005461] transition-colors shrink-0" />
                            </div>
                        </Link>
                    );
                }) : (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Users className="h-8 w-8 text-slate-100 mb-3" />
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Sin conductores activos</p>
                    </div>
                )}
            </div>
        </div>
    );
}
