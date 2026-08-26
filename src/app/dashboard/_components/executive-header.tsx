"use client";

import React from "react";
import { Shield } from "lucide-react";

export function ExecutiveHeader() {
    const [currentTime, setCurrentTime] = React.useState<Date | null>(null);

    React.useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const dateStr = currentTime
        ? currentTime.toLocaleDateString("es-CO", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
        }).toUpperCase()
        : "-- -- --";

    const timeStr = currentTime
        ? currentTime.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
        : "00:00";

    return (
        <div className="relative bg-slate-900 text-white overflow-hidden p-10 flex flex-col md:flex-row items-center justify-between gap-8 border-b-4 border-accent shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,128,128,0.1),transparent)] pointer-events-none" />

            <div className="flex items-center gap-8 relative z-10">
                <div className="h-16 w-16 bg-accent/20 border border-accent/40 flex items-center justify-center rotate-45 group hover:rotate-90 transition-transform duration-700">
                    <Shield className="h-8 w-8 text-accent -rotate-45 group-hover:-rotate-90 transition-transform duration-700" />
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <span className="h-px w-8 bg-accent" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Terminal de Control Maestro</span>
                    </div>
                    <h1 className="text-5xl font-black uppercase tracking-tighter leading-none italic">CENTRO DE COMANDO</h1>
                </div>
            </div>

            <div className="flex items-center gap-10 relative z-10">
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Vector de Tiempo</p>
                    <div className="flex items-baseline gap-4 justify-end">
                        <span className="text-3xl font-black font-mono tracking-tighter text-white">{timeStr}</span>
                        <span className="text-[10px] font-bold uppercase text-slate-500 border-l border-slate-700 pl-4">{dateStr}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
