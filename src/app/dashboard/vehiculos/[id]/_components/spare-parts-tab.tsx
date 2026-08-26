"use client";

import { VehiculoWithRelations } from "@/types";
import {
    Package,
    TrendingUp,
    DollarSign,
    Wrench,
    Calendar,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Gauge,
    FileCheck,
    FileWarning,
    History as HistoryIcon
} from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface SparePartsTabProps {
    mantenimientos: VehiculoWithRelations["mantenimientos"];
    kilometrajeActual: number | null;
}

interface KardexEntrada {
    id: string;
    fecha: Date;
    concepto: string;
    plan: string;
    kilometraje: number;
    costo: number;
    observaciones: string | null;
    tieneFactura: boolean;
}

interface ResumenPlan {
    nombre: string;
    cantidad: number;
    costoTotal: number;
    ultimaFecha: Date | null;
    ultimoKm: number | null;
}

export function SparePartsTab({
    mantenimientos,
    kilometrajeActual,
}: SparePartsTabProps) {
    /** Transforma los mantenimientos en entradas de kardex ordenadas desc */
    const entradas: KardexEntrada[] = useMemo(
        () =>
            [...mantenimientos]
                .sort(
                    (a, b) =>
                        new Date(b.fecha).getTime() -
                        new Date(a.fecha).getTime(),
                )
                .map((m) => ({
                    id: m.id,
                    fecha: new Date(m.fecha),
                    concepto: m.plan.nombre,
                    plan: m.plan.nombre,
                    kilometraje: m.kilometraje,
                    costo: m.costo ?? 0,
                    observaciones: m.observaciones ?? null,
                    tieneFactura: !!m.factura?.id,
                })),
        [mantenimientos],
    );

    /** Agrupa y resume por plan de mantenimiento */
    const resumenPorPlan: ResumenPlan[] = useMemo(() => {
        const mapa = new Map<string, ResumenPlan>();
        for (const e of entradas) {
            const existing = mapa.get(e.plan);
            if (existing) {
                existing.cantidad += 1;
                existing.costoTotal += e.costo;
                if (!existing.ultimaFecha || e.fecha > existing.ultimaFecha) {
                    existing.ultimaFecha = e.fecha;
                    existing.ultimoKm = e.kilometraje;
                }
            } else {
                mapa.set(e.plan, {
                    nombre: e.plan,
                    cantidad: 1,
                    costoTotal: e.costo,
                    ultimaFecha: e.fecha,
                    ultimoKm: e.kilometraje,
                });
            }
        }
        return Array.from(mapa.values()).sort(
            (a, b) => b.costoTotal - a.costoTotal,
        );
    }, [entradas]);

    const costoTotal = useMemo(
        () => entradas.reduce((sum, e) => sum + e.costo, 0),
        [entradas],
    );

    const costoPromedio =
        entradas.length > 0 ? costoTotal / entradas.length : 0;

    const formatCOP = (valor: number): string =>
        new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(valor);

    const formatFecha = (fecha: Date): string =>
        fecha.toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    if (entradas.length === 0) {
        return (
            <div className="border border-slate-200 border-dashed p-16 text-center bg-slate-50/50 space-y-4 animate-in fade-in duration-700">
                <Package className="h-12 w-12 text-slate-200 mx-auto" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Sin registros de intervenciones</p>
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2">El kardex se generará automáticamente al registrar mantenimientos</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* KPIs de cabecera */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { label: "Costo Total Histórico", value: formatCOP(costoTotal), icon: DollarSign, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                  { label: "Total Entradas", value: `${entradas.length} INTERVENCIONES`, icon: Wrench, color: "text-blue-600 bg-blue-50 border-blue-100" },
                  { label: "Costo Promedio / Op.", value: formatCOP(costoPromedio), icon: TrendingUp, color: "text-cyan-600 bg-cyan-50 border-cyan-100" },
                  { label: "Odómetro Actual", value: `${(kilometrajeActual ?? 0).toLocaleString("es-CO")} KM`, icon: Gauge, color: "text-slate-600 bg-slate-50 border-slate-200" },
                ].map((kpi, i) => (
                  <div key={i} className={cn("p-6 border flex items-center justify-between group hover:shadow-md transition-all", kpi.color)}>
                    <div className="space-y-1">
                      <span className="text-[8px] font-black uppercase tracking-widest block opacity-60">{kpi.label}</span>
                      <span className="text-sm font-black uppercase tracking-tight block">{kpi.value}</span>
                    </div>
                    <kpi.icon className="h-6 w-6 opacity-20 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
            </div>

            {/* Resumen por tipo de operación */}
            {resumenPorPlan.length > 1 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                            <BarChart3 className="h-4 w-4" />
                            Distribución de Costos por Operación
                        </h3>
                        <div className="h-px flex-1 bg-slate-100" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {resumenPorPlan.map((plan, idx) => {
                            const porcentaje = costoTotal > 0 ? Math.round((plan.costoTotal / costoTotal) * 100) : 0;
                            return (
                                <div key={plan.nombre} className="bg-slate-50/50 border border-slate-200 p-6 space-y-4 hover:bg-white transition-colors group">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                              <span className="text-[9px] font-black text-slate-300">{(idx + 1).toString().padStart(2, '0')}</span>
                                              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 group-hover:text-cyan-600 transition-colors">{plan.nombre}</h4>
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{plan.cantidad} Intervenciones</p>
                                        </div>
                                        <Badge variant="outline" className="rounded-none font-black text-[8px] border-slate-200">{porcentaje}%</Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <Progress value={porcentaje} className="h-1 rounded-none bg-slate-200" />
                                        <div className="flex justify-between items-end">
                                            <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{formatCOP(plan.costoTotal)}</p>
                                            <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                                <Calendar className="h-3 w-3" />
                                                {plan.ultimaFecha ? formatFecha(plan.ultimaFecha) : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Tabla kardex cronológica */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                            <HistoryIcon className="h-4 w-4" />
                            Kardex Histórico Maestro
                        </h3>
                        <div className="h-px w-32 bg-slate-100 hidden sm:block" />
                    </div>
                    <Badge variant="outline" className="rounded-none border-slate-200 text-[9px] font-black uppercase px-3 py-1 bg-slate-50 text-slate-500">
                        {entradas.length} REGISTROS TOTALES
                    </Badge>
                </div>

                <div className="overflow-x-auto border border-slate-200">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                {["Concepto / Plan", "Fecha", "Odómetro", "Costo", "Soporte"].map((col) => (
                                    <th key={col} className="text-[10px] font-black text-slate-500 uppercase tracking-widest p-4 text-left">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {entradas.map((entrada, idx) => {
                                const anterior = entradas[idx + 1];
                                const diferenciaCosto = anterior ? entrada.costo - anterior.costo : null;
                                const esAlza = diferenciaCosto !== null && diferenciaCosto > 0;

                                return (
                                    <tr key={entrada.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-4">
                                            <div className="space-y-1">
                                                <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight group-hover:text-cyan-600 transition-colors">{entrada.concepto}</div>
                                                {entrada.observaciones && (
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate max-w-xs leading-none">
                                                        {entrada.observaciones}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-[11px] font-black text-slate-600 uppercase">
                                                <Calendar className="h-3 w-3 text-slate-300" />
                                                {formatFecha(entrada.fecha)}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-[11px] font-black text-slate-600">
                                                <Gauge className="h-3 w-3 text-slate-300" />
                                                {entrada.kilometraje.toLocaleString("es-CO")} KM
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[12px] font-black text-slate-900">{formatCOP(entrada.costo)}</span>
                                                {diferenciaCosto !== null && diferenciaCosto !== 0 && (
                                                    <div className={cn(
                                                        "h-5 w-5 flex items-center justify-center",
                                                        esAlza ? "text-red-500" : "text-emerald-500"
                                                    )}>
                                                        {esAlza ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {entrada.tieneFactura ? (
                                                <Badge variant="outline" className="rounded-none border-emerald-100 bg-emerald-50 text-emerald-600 text-[8px] font-black px-1.5 py-0.5 uppercase flex items-center gap-2 w-fit">
                                                    <FileCheck className="h-3 w-3" />
                                                    SOPORTE OK
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="rounded-none border-amber-100 bg-amber-50 text-amber-600 text-[8px] font-black px-1.5 py-0.5 uppercase flex items-center gap-2 w-fit">
                                                    <FileWarning className="h-3 w-3" />
                                                    SIN SOPORTE
                                                </Badge>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
