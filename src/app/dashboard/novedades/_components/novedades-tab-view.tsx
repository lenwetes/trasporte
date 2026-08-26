"use client";

import { NovedadesFiltersAside } from "./novedades-filters-aside";
import { NovedadesTable } from "./novedades-table";
import { Search, Info, TrendingUp } from "lucide-react";

interface Novedad {
    id: string;
    tipo: string;
    fecha: Date | string;
    descripcion: string | null;
    estado: string;
    conductor?: {
        nombres: string;
        apellidos: string | null;
    } | null;
    vehiculo?: {
        placa: string;
    } | null;
}

interface NovedadesTabViewProps {
    novedades: Novedad[];
    userId: string | undefined;
    userRole: string | undefined;
    initialDoc: string;
    initialRevDate: Date | null;
    query: string;
    tipo: string;
}

export function NovedadesTabView({
    novedades,
    query,
    tipo,
    userRole,
}: NovedadesTabViewProps) {
    return (
        <div className="flex flex-col lg:flex-row min-h-full">
            {/* Lateral Filters - Premium Solid Aside */}
            <aside className="w-full lg:w-80 shrink-0 bg-slate-50/50 border-r border-primary/5 p-8 lg:p-10 space-y-10">
                <NovedadesFiltersAside query={query} tipo={tipo} />
                
                {/* Stats Quick Preview */}
                <div className="pt-8 border-t border-primary/5 space-y-4">
                    <div className="flex items-center gap-2 px-1 text-slate-900">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Status Operativo</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight text-primary/60">
                            <span>Total Hallazgos</span>
                            <span>{novedades.length}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1">
                            <div 
                                className="bg-primary h-full transition-all duration-1000" 
                                style={{ width: `${Math.min(100, (novedades.length / 50) * 100)}%` }} 
                            />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area - Table */}
            <div className="flex-1 bg-white p-0 lg:p-10 flex flex-col">
                {/* Information Header for the list */}
                <div className="mb-8 px-6 lg:px-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                        <h3 className="text-xl font-black text-primary uppercase tracking-tighter">Historial de Incidencias</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            <span className="h-1 w-6 bg-accent/20" />
                            <Info className="h-3 w-3 text-accent" /> Registros auditables de flota y vía
                        </p>
                    </div>
                    {query && (
                        <div className="text-[10px] font-black bg-accent text-primary px-3 py-1.5 uppercase tracking-widest shadow-md">
                            Filtrado por: &quot;{query}&quot;
                        </div>
                    )}
                </div>

                <div className="animate-in fade-in duration-500 flex-1">
                    <NovedadesTable 
                        novedades={novedades} 
                        userRole={userRole}
                    />
                </div>
            </div>
        </div>
    );
}
