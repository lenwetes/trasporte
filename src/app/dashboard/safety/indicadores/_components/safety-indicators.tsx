"use client";

import {
    Activity,
    AlertTriangle,
    Target,
    BarChart3,
    Trophy,
    TrendingDown,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SafetyIndicatorsProps {
    data: {
        periodo: number;
        totalSiniestros: number;
        totalDiasPerdidos: number;
        frecuencia: number;
        severidad: number;
        porGravedad: {
            soloDanos: number;
            conHeridos: number;
            mortal: number;
        };
    };
}

export function SafetyIndicators({ data }: SafetyIndicatorsProps) {
    // Calculamos el total para los porcentajes
    const totalGravedad = data.porGravedad.soloDanos + data.porGravedad.conHeridos + data.porGravedad.mortal;
    
    const getPercentage = (value: number) => {
        if (totalGravedad === 0) return 0;
        return (value / totalGravedad) * 100;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* KPIs Principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-400 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-blue-50 p-2 rounded-xl text-blue-500 border border-blue-100 shadow-sm">
                            <Activity size={20} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Frecuencia (IF)</span>
                    </div>
                    <div className="text-3xl font-black text-slate-900 tracking-tight">{data.frecuencia.toFixed(2)}</div>
                    <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                        <Trophy size={12} />
                        Meta: &lt; 2.50
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-400 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-amber-50 p-2 rounded-xl text-amber-500 border border-amber-100 shadow-sm">
                            <AlertTriangle size={20} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Severidad (IS)</span>
                    </div>
                    <div className="text-3xl font-black text-slate-900 tracking-tight">{data.severidad.toFixed(2)}</div>
                    <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        <TrendingDown size={12} />
                        Días perdidos: {data.totalDiasPerdidos}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-red-400 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-red-50 p-2 rounded-xl text-red-500 border border-red-100 shadow-sm">
                            <Target size={20} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vialidad Crítica</span>
                    </div>
                    <div className="text-3xl font-black text-slate-900 tracking-tight">{data.totalSiniestros}</div>
                    <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        <TrendingDown size={12} />
                        Accidentalidad Periodo
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visualización de Gravedad */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                            <BarChart3 className="h-5 w-5 text-secondary" />
                            Distribución por Gravedad
                        </h4>
                        <div className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global: {totalGravedad}</span>
                        </div>
                    </div>
                    
                    <div className="h-4 w-full flex rounded-full overflow-hidden bg-slate-100 mb-10 shadow-inner">
                        <div className="bg-slate-500 h-full transition-all duration-1000" style={{ width: `${getPercentage(data.porGravedad.soloDanos)}%` }} />
                        <div className="bg-amber-500 h-full transition-all duration-1000" style={{ width: `${getPercentage(data.porGravedad.conHeridos)}%` }} />
                        <div className="bg-red-500 h-full transition-all duration-1000" style={{ width: `${getPercentage(data.porGravedad.mortal)}%` }} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <LegendItem color="bg-slate-400" label="Solo Daños" value={data.porGravedad.soloDanos} percentage={getPercentage(data.porGravedad.soloDanos)} />
                        <LegendItem color="bg-amber-500" label="Con Heridos" value={data.porGravedad.conHeridos} percentage={getPercentage(data.porGravedad.conHeridos)} />
                        <LegendItem color="bg-red-500" label="Siniestro Mortal" value={data.porGravedad.mortal} percentage={getPercentage(data.porGravedad.mortal)} />
                    </div>
                </div>

                {/* Cumplimiento de Objetivos */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-emerald-500" />
                        Cumplimiento de Objetivos
                    </h4>
                    
                    <div className="space-y-8">
                        <GoalBar label="Frecuencia (IF)" current={data.frecuencia} goal={2.5} unit="" color="bg-blue-600" inverse />
                        <GoalBar label="Severidad (IS)" current={data.severidad} goal={50} unit="" color="bg-amber-600" inverse />
                    </div>
                </div>
            </div>
        </div>
    );
}

function LegendItem({ color, label, value, percentage }: { color: string, label: string, value: number, percentage: number }) {
    return (
        <div className="flex gap-4 items-center group">
            <div className={cn("w-2 h-10 rounded-full shrink-0 group-hover:scale-y-110 transition-transform", color)} />
            <div className="overflow-hidden">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{label}</div>
                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-slate-900">{value}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">({percentage.toFixed(1)}%)</span>
                </div>
            </div>
        </div>
    );
}

function GoalBar({ label, current, goal, unit, color, inverse = false }: { label: string, current: number, goal: number, unit: string, color: string, inverse?: boolean }) {
    const ratio = Math.min((current / goal) * 100, 100);
    const isOk = inverse ? current <= goal : current >= goal;

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                <div className="flex flex-col items-end">
                    <span className={cn("text-sm font-black uppercase tracking-tight", isOk ? "text-emerald-600" : "text-red-600")}>
                        {current}{unit} / Meta: {goal}{unit}
                    </span>
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{isOk ? "DENTRO DE RANGO" : "RANGO CRÍTICO"}</span>
                </div>
            </div>
            <div className="h-2 w-full bg-slate-50 rounded-full border border-slate-100 overflow-hidden shadow-inner p-[1px]">
                <div 
                    className={cn(
                        "h-full rounded-full transition-all duration-1000 shadow-sm",
                        isOk ? color : "bg-red-500"
                    )} 
                    style={{ width: `${ratio}%` }} 
                />
            </div>
        </div>
    );
}

