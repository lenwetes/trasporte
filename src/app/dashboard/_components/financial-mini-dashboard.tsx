"use client";

import React, { useEffect, useState } from "react";
import { getFinancialMiniDashboardAction } from "@/actions/finance/stats.actions";
import { formatCurrency } from "@/lib/utils";
import { 
    TrendingUp, 
    AlertCircle, 
    CalendarClock, 
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export function FinancialMiniDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFinancialMiniDashboardAction().then((res) => {
            if (res.success) {
                setStats(res.data);
            }
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 bg-slate-100 rounded-none border border-slate-200" />
                ))}
            </div>
        );
    }

    if (!stats) return null;

    const cards = [
        {
            label: "Recaudo Hoy",
            value: stats.recaudoHoy,
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            trend: "Entrada Directa",
            trendIcon: ArrowUpRight
        },
        {
            label: "Cartera en Mora",
            value: stats.carteraMora,
            icon: AlertCircle,
            color: "text-rose-600",
            bg: "bg-rose-50",
            trend: "Pendiente Cobro",
            trendIcon: ArrowDownRight
        },
        {
            label: "Proyección Semana",
            value: stats.proyeccionProxSemana,
            icon: CalendarClock,
            color: "text-blue-600",
            bg: "bg-blue-50",
            trend: "Vence Pronto",
            trendIcon: Clock
        },
        {
            label: "Liquidez Disponible",
            value: stats.balanceDisponible,
            icon: Wallet,
            color: "text-slate-700",
            bg: "bg-slate-100",
            trend: "Caja & Bancos",
            trendIcon: ShieldCheck
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {cards.map((card, i) => (
                <div key={i} className="bg-white border border-slate-50 p-5 flex flex-col justify-between group hover:shadow-premium-hover transition-all duration-500 shadow-premium">
                    <div className="flex items-center justify-between mb-2">
                        <div className={cn("h-10 w-10 flex items-center justify-center rounded-none shadow-inner", card.bg, card.color)}>
                            <card.icon size={20} />
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">{card.label}</p>
                            <p className={cn("text-xl font-black font-mono tracking-tighter mt-0.5", card.color)}>
                                {formatCurrency(card.value)}
                            </p>
                        </div>
                    </div>

                    {/* Simple SVG Sparkline for visual impact */}
                    <div className="h-8 w-full my-2 opacity-60">
                        <svg viewBox="0 0 100 20" className="w-full h-full preserve-3d">
                            <defs>
                                <linearGradient id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
                                </linearGradient>
                            </defs>
                            <path 
                                d={`M 0 ${15 + Math.random() * 5} Q 25 ${5 + Math.random() * 10}, 50 ${12 + Math.random() * 5} T 100 ${10}`} 
                                fill="none" 
                                stroke={`url(#grad-${i})`}
                                strokeWidth="2"
                                strokeLinecap="round"
                                className={card.color}
                            />
                        </svg>
                    </div>

                    <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-slate-900">
                        <span className="flex items-center gap-1.5 font-bold">
                             {card.trend}
                        </span>
                        <span>ACTUALIZADO</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Icon fallbacks for safety
function Clock(props: any) { return <CalendarClock {...props} />; }
function ShieldCheck(props: any) { return <Wallet {...props} />; }
