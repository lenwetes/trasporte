import { ReportFilterState } from "../types";
import { Settings, AlertTriangle, RotateCcw } from "lucide-react";

interface ReportFiltersProps {
    filters: ReportFilterState;
    setFilters: (filters: ReportFilterState) => void;
    conductores: { id: string; nombre: string }[];
    vehiculos: { id: string; placa: string }[];
    isAdminOrSecretary: boolean;
    onReset: () => void;
}

export function ReportFilters({
    filters,
    setFilters,
    conductores,
    vehiculos,
    isAdminOrSecretary,
    onReset,
}: ReportFiltersProps) {
    return (
        <div className="bg-white border border-primary/10 p-6 mb-8">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-primary/5">
                <div className="h-10 w-10 bg-slate-50 border border-primary/5 flex items-center justify-center text-slate-900">
                    <Settings className="h-4 w-4" />
                </div>
                <div>
                    <h2 className="text-sm font-black text-primary uppercase tracking-widest">
                        Filtros de Indexación Operativa
                    </h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">
                        Parámetros de Cruce de Bases de Datos
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Corte Inicial</label>
                    <input
                        type="date"
                        className="w-full h-12 bg-slate-50 border border-primary/10 px-4 text-xs font-bold text-primary focus:outline-none focus:border-accent uppercase"
                        value={filters.fechaInicio}
                        onChange={(e) => setFilters({ ...filters, fechaInicio: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Corte Final</label>
                    <input
                        type="date"
                        className="w-full h-12 bg-slate-50 border border-primary/10 px-4 text-xs font-bold text-primary focus:outline-none focus:border-accent uppercase"
                        value={filters.fechaFin}
                        onChange={(e) => setFilters({ ...filters, fechaFin: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Sujeto (Conductor)</label>
                    <select
                        className="w-full h-12 bg-slate-50 border border-primary/10 px-4 text-xs font-bold text-primary focus:outline-none focus:border-accent uppercase appearance-none"
                        value={filters.conductorId}
                        onChange={(e) => setFilters({ ...filters, conductorId: e.target.value })}
                        disabled={!isAdminOrSecretary || conductores.length <= 1}
                    >
                        {!isAdminOrSecretary && conductores.length === 0 && (
                            <option value="">SIN VINCULACIONES</option>
                        )}
                        {isAdminOrSecretary && (
                            <option value="">TODOS LOS SUJETOS</option>
                        )}
                        {conductores.map((c) => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Activo (Vehículo)</label>
                    <select
                        className="w-full h-12 bg-slate-50 border border-primary/10 px-4 text-xs font-bold text-primary focus:outline-none focus:border-accent uppercase appearance-none"
                        value={filters.vehiculoId}
                        onChange={(e) => setFilters({ ...filters, vehiculoId: e.target.value })}
                        disabled={!isAdminOrSecretary || vehiculos.length <= 1}
                    >
                        {!isAdminOrSecretary && vehiculos.length === 0 && (
                            <option value="">SIN ACTIVOS</option>
                        )}
                        {isAdminOrSecretary && (
                            <option value="">TODA LA FLOTA</option>
                        )}
                        {vehiculos.map((v) => (
                            <option key={v.id} value={v.id}>{v.placa}</option>
                        ))}
                    </select>
                </div>
            </div>

            {!isAdminOrSecretary && vehiculos.length === 0 && (
                <div className="mt-6 p-4 border border-amber-500/20 bg-amber-50/50 flex items-center gap-4">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                    <p className="text-[10px] font-black uppercase text-amber-700 tracking-widest leading-relaxed">
                        Sistema no detecta activos en su jurisdicción operacional. Los cruces de bases de datos pueden carecer de métricas vinculantes.
                    </p>
                </div>
            )}

            <div className="mt-6 flex justify-end pb-2 pt-4 border-t border-primary/5">
                <button
                    type="button"
                    onClick={onReset}
                    className="h-10 px-6 bg-slate-50 border border-primary/10 text-[10px] font-black uppercase text-primary tracking-widest hover:bg-slate-100 transition-colors flex items-center gap-2"
                >
                    <RotateCcw className="h-3 w-3" /> RESTABLECER PARÁMETROS
                </button>
            </div>
        </div>
    );
}
