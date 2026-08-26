"use client";

import Link from "next/link";
import { Truck, Car, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardVehicleSnapshot, DashboardConductorSnapshot } from "@/actions/dashboard-overview";
import { Users, UserCheck } from "lucide-react";

// ─── Mini Vehicle List ───────────────────────────────────────────────────────
interface MiniVehicleListProps {
    vehicles: DashboardVehicleSnapshot[];
}

export function MiniVehicleList({ vehicles }: MiniVehicleListProps) {
    const displayVehicles = vehicles.slice(0, 6); // Asegurar 6 para simetría

    return (
        <div className="bg-white border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[520px] h-full">
            <div className="flex items-center justify-between p-7 border-b border-slate-100 bg-[#f8fafc]/30">
                <div className="flex items-center gap-5">
                    <div className="h-12 w-12 bg-white border border-slate-100 flex items-center justify-center">
                        <Truck className="h-6 w-6 text-[#00b7b5]" />
                    </div>
                    <div>
                        <h3 className="text-[12px] font-black text-[#005461] uppercase tracking-[0.3em]">Flota Registrada</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{vehicles.length} unidades recientes</p>
                    </div>
                </div>
                <Link href="/dashboard/vehiculos">
                    <div className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-slate-900 text-slate-900 text-[9px] font-black uppercase tracking-widest transition-all">
                        VER FLOTA <ChevronRight className="h-3 w-3" />
                    </div>
                </Link>
            </div>
            <div className="flex-1 divide-y divide-slate-50">
                {displayVehicles.length > 0 ? displayVehicles.map((v, idx) => (
                    <Link key={v.id} href={`/dashboard/vehiculos/${v.id}`}>
                        <div className="flex items-center gap-6 px-7 py-5 hover:bg-slate-50 transition-colors group cursor-pointer">
                            <span className="text-[10px] font-black text-slate-200 w-6 shrink-0 font-mono">
                                {String(idx + 1).padStart(2, "0")}
                            </span>
                            <div className="h-12 w-12 bg-[#005461] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <Car className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{v.placa}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                    {v.marca} {v.modelo}
                                </p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-[#005461] transition-colors shrink-0" />
                        </div>
                    </Link>
                )) : (
                    <div className="flex flex-col items-center justify-center h-full py-20">
                        <Truck className="h-10 w-10 text-slate-100 mb-4" />
                        <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Sin vehículos registrados</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Mini Conductor List ─────────────────────────────────────────────────────
interface MiniConductorListProps {
    conductores: DashboardConductorSnapshot[];
}

export function MiniConductorList({ conductores }: MiniConductorListProps) {
    const displayConductores = conductores.slice(0, 6); // Asegurar 6 para simetría

    return (
        <div className="bg-white border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[520px] h-full">
            <div className="flex items-center justify-between p-7 border-b border-slate-100 bg-[#f8fafc]/30">
                <div className="flex items-center gap-5">
                    <div className="h-12 w-12 bg-white border border-slate-100 flex items-center justify-center">
                        <Users className="h-6 w-6 text-[#00b7b5]" />
                    </div>
                    <div>
                        <h3 className="text-[12px] font-black text-[#005461] uppercase tracking-[0.3em]">Personal Vinculado</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{conductores.length} conductores activos</p>
                    </div>
                </div>
                <Link href="/dashboard/conductores">
                    <div className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-slate-900 text-slate-900 text-[9px] font-black uppercase tracking-widest transition-all">
                        VER PERSONAL <ChevronRight className="h-3 w-3" />
                    </div>
                </Link>
            </div>
            <div className="flex-1 divide-y divide-slate-50">
                {displayConductores.length > 0 ? displayConductores.map((c, idx) => {
                    const initials = `${c.nombres.charAt(0)}${c.apellidos.charAt(0)}`;
                    return (
                        <Link key={c.id} href={`/dashboard/conductores/${c.id}`}>
                            <div className="flex items-center gap-6 px-7 py-5 hover:bg-slate-50 transition-colors group cursor-pointer">
                                <span className="text-[10px] font-black text-slate-200 w-6 shrink-0 font-mono">
                                    {String(idx + 1).padStart(2, "0")}
                                </span>
                                <div className="h-12 w-12 bg-[#005461] text-white flex items-center justify-center text-[13px] font-black shrink-0 group-hover:scale-105 transition-transform">
                                    {initials.toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight truncate">
                                        {c.nombres} {c.apellidos}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">CC {c.numeroDocumento}</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-[#005461] transition-colors shrink-0" />
                            </div>
                        </Link>
                    );
                }) : (
                    <div className="flex flex-col items-center justify-center h-full py-20">
                        <Users className="h-10 w-10 text-slate-100 mb-4" />
                        <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Sin personal activo</p>
                    </div>
                )}
            </div>
        </div>
    );
}
