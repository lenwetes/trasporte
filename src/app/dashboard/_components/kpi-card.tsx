import React from "react";
import { cn } from "@/lib/utils";

export interface KpiCardProps {
    label: string;
    value: number;
    icon: React.ElementType;
    accent?: boolean;
    danger?: boolean;
}

export function KpiCard({ label, value, icon: Icon, accent, danger }: KpiCardProps) {
    return (
        <div className={cn(
            "bg-white border p-6 flex items-center gap-5 group hover:shadow-lg transition-all duration-300",
            danger ? "border-red-500/20 hover:border-red-500/40" : "border-primary/10 hover:border-primary/30"
        )}>
            <div className={cn(
                "h-14 w-14 flex items-center justify-center transition-colors duration-500 shrink-0",
                danger ? "bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white"
                    : accent ? "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white"
                    : "bg-slate-50 text-slate-900 group-hover:bg-primary group-hover:text-white"
            )}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-3xl font-black text-primary font-mono tracking-tighter leading-none">{value}</p>
                <p className={cn(
                    "text-[9px] font-black uppercase tracking-[0.2em] mt-1",
                    danger ? "text-red-700" : "text-slate-900"
                )}>{label}</p>
            </div>
        </div>
    );
}
