"use client";

import Link from "next/link";
import { Zap, Car, FilePlus, Users, BarChart3, Wrench, Settings, FolderOpen, BookOpen } from "lucide-react";

/**
 * @module QuickActionsWidget
 * @description Barra de acceso rápido institucional.
 * Layout (imagen de referencia):
 *   ┌─────────────────────────────────────────────────────────┐
 *   │ [⚡] ACTION HUB / Acceso Rápido Operativo               │
 *   ├────────┬────────┬────────┬────────┬────────┬────────────┤
 *   │ [Veh]  │ [FUEC] │[Users] │[Report]│[Mant.] │ ...        │
 *   │NUEVO   │NUEVO   │USUAR.  │REPORT. │MANTEN. │            │
 *   │VEHÍCULO│FUEC    │IOS     │        │        │            │
 *   └────────┴────────┴────────┴────────┴────────┴────────────┘
 */

interface QuickAction {
    readonly label: string;
    readonly href: string;
    readonly icon: React.ElementType;
}

const QUICK_ACTIONS: QuickAction[] = [
    { label: "Nuevo Vehículo", href: "/dashboard/vehiculos", icon: Car },
    { label: "Nuevo FUEC", href: "/dashboard/fuec/nueva", icon: FilePlus },
    { label: "Usuarios", href: "/dashboard/usuarios", icon: Users },
    { label: "Reportes", href: "/dashboard/reportes", icon: BarChart3 },
    { label: "Mantenimiento", href: "/dashboard/mantenimiento", icon: Wrench },
    { label: "Configuración", href: "/dashboard/configuracion", icon: Settings },
    { label: "Documentos", href: "/dashboard/gestion-documental", icon: FolderOpen },
    { label: "Auditoría", href: "/dashboard/auditoria", icon: BookOpen },
];

export function QuickActionsWidget() {
    return (
        <div className="w-full bg-white">
            {/* Fila 1: Cabecera del Hub */}
            <div className="flex items-center gap-4 px-8 py-5 border-b border-slate-100">
                <div className="h-9 w-9 bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Zap className="h-4 w-4 text-[#00b7b5]" />
                </div>
                <div>
                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.35em] leading-none">
                        Action Hub
                    </h3>
                    <p className="text-[8.5px] font-bold text-[#00b7b5] uppercase tracking-widest mt-1.5">
                        Acceso Rápido Operativo
                    </p>
                </div>
            </div>

            {/* Fila 2: Botones de acceso en una sola fila horizontal */}
            <div className="grid grid-cols-4 lg:grid-cols-8 divide-x divide-slate-100">
                {QUICK_ACTIONS.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link
                            key={action.href}
                            href={action.href}
                            className="group flex flex-col items-center justify-center gap-3 py-7 px-4 hover:bg-slate-50 transition-colors duration-200 border-b lg:border-b-0 border-slate-100"
                        >
                            <Icon className="h-6 w-6 text-slate-400 group-hover:text-[#005461] transition-colors stroke-[1.5]" />
                            <span className="text-[8.5px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-900 transition-colors text-center leading-tight">
                                {action.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
