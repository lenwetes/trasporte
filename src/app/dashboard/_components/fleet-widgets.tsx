"use client";

import Link from "next/link";
import { AlertTriangle, Shield, Activity } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardVehicle, ExpiryProjection } from "@/lib/types";

// ─── Fleet Status Strip ──────────────────────────────────────────────────────
interface FleetStatusStripProps {
    vehicles: DashboardVehicle[];
}

export function FleetStatusStrip({ vehicles }: FleetStatusStripProps) {
    const criticalVehicles = vehicles.filter((v) => v.alertLevel === "red").slice(0, 5);

    if (criticalVehicles.length === 0) {
        return (
            <div className="bg-emerald-50 border border-emerald-500/20 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-white border border-emerald-500/20 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-emerald-800 uppercase tracking-widest">Flota En Estado Óptimo</h3>
                        <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-[0.2em] mt-0.5">Sin alertas rojas detectadas en el vectorizador documental</p>
                    </div>
                </div>
                <Activity className="h-6 w-6 text-emerald-400" />
            </div>
        );
    }

    return (
        <div className="bg-red-50/30 border border-red-500/20 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <h3 className="text-[10px] font-black text-red-800 uppercase tracking-[0.2em]">Vehículos Con Alertas Críticas</h3>
                </div>
                <Link href="/dashboard/safety/flota">
                    <span className="text-[8px] font-black text-red-600 uppercase tracking-widest cursor-pointer hover:underline">RESOLVER &gt;</span>
                </Link>
            </div>
            <div className="flex flex-wrap gap-3">
                {criticalVehicles.map((v) => (
                    <Link key={v.id} href={`/dashboard/vehiculos/${v.id}`}>
                        <div className="px-4 py-2 bg-white border border-red-500/20 flex items-center gap-3 hover:border-red-500/40 transition-all cursor-pointer">
                            <div className="h-2 w-2 bg-red-500 animate-pulse" />
                            <span className="text-[10px] font-black text-red-700 uppercase tracking-wider">{v.placa}</span>
                            <span className="text-[8px] font-bold text-red-600/50 uppercase">{v.alerts.length} alertas</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

// ─── Expiry Projection Chart ─────────────────────────────────────────────────
interface ExpiryProjectionChartProps {
    projections: ExpiryProjection[];
}

export function ExpiryProjectionChart({ projections }: ExpiryProjectionChartProps) {
    const maxCount = Math.max(...projections.map((p) => p.count), 1);

    return (
        <div className="bg-white border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-4 px-6 py-5 border-b border-slate-100">
                <div className="h-10 w-10 bg-slate-50 border border-slate-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-[#00b7b5]" />
                </div>
                <div>
                    <h3 className="text-[11px] font-black text-[#005461] uppercase tracking-[0.25em]">Proyección Documental</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Vencimientos próximos 6 meses</p>
                </div>
            </div>
            <div className="p-5 pt-4">
                <div className="flex items-end gap-2 h-32">
                    {projections.map((p, i) => {
                        const height = Math.max((p.count / maxCount) * 100, 6);
                        const isCurrentMonth = i === 0;
                        return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                                <span className={cn("text-[10px] font-black font-mono transition-colors", isCurrentMonth ? "text-accent" : "text-slate-400 group-hover:text-primary")}>
                                    {p.count}
                                </span>
                                <div
                                    className={cn("w-full transition-all duration-700 ease-out relative overflow-hidden", isCurrentMonth ? "bg-primary" : "bg-slate-100 group-hover:bg-primary/30")}
                                    style={{ height: `${height}%` }}
                                >
                                    {isCurrentMonth && <div className="absolute top-0 inset-x-0 h-0.5 bg-accent" />}
                                </div>
                                <span className={cn("text-[8px] font-black uppercase tracking-widest transition-colors", isCurrentMonth ? "text-primary" : "text-slate-400 group-hover:text-slate-600")}>
                                    {p.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <div className="h-px bg-slate-100 mt-2" />
            </div>
        </div>
    );
}
