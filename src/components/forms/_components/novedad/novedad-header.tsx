import * as React from "react";
import { ShieldAlert } from "lucide-react";

export function NovedadHeader() {
    return (
        <div className="bg-slate-900 p-8 border border-primary/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 radius-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-full bg-primary/5 -skew-x-12 translate-x-32" />
            <div className="flex items-center gap-6 relative z-10">
                <div className="h-14 w-14 flex items-center justify-center bg-secondary text-primary border border-secondary/20 shadow-xl">
                    <ShieldAlert className="h-7 w-7" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">Reporte de Novedad</h1>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.4em] mt-1">Sistema de Gestión PESV v2.0</p>
                </div>
            </div>
            <div className="flex gap-4 relative z-10">
                <div className="bg-white/5 border border-white/10 px-6 py-2">
                    <span className="block text-[8px] font-black text-secondary uppercase tracking-[0.2em] mb-1">Estado de Flota</span>
                    <span className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> ACTIVA
                    </span>
                </div>
            </div>
        </div>
    );
}
