import type { SiniestroWithRelations } from "@/types";
import { AlertCircle, Skull, Car, Activity, ShieldOff, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

interface SiniestrosStatsProps {
    siniestros: SiniestroWithRelations[];
}

export function SiniestrosStats({ siniestros }: SiniestrosStatsProps) {
    const total = siniestros.length;
    const critical = siniestros.filter(s => s.gravedad === "MORTAL").length;
    const withInjuries = siniestros.filter(s => s.gravedad === "CON_HERIDOS").length;
    const onlyDamage = siniestros.filter(s => s.gravedad === "SOLO_DANOS").length;

    const stats = [
        {
            label: "Total Registros",
            value: total,
            icon: Activity,
            color: "text-primary",
            bg: "bg-primary/[0.03]",
            border: "border-primary/10"
        },
        {
            label: "Gravedad Crítica",
            value: critical,
            icon: Skull,
            color: "text-red-600",
            bg: "bg-red-50",
            border: "border-red-100"
        },
        {
            label: "Con Heridos",
            value: withInjuries,
            icon: AlertCircle,
            color: "text-amber-600",
            bg: "bg-amber-50",
            border: "border-amber-100"
        },
        {
            label: "Daños Materiales",
            value: onlyDamage,
            icon: Car,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
                <div 
                    key={i} 
                    className={cn(
                        "p-5 border flex items-center justify-between group transition-all duration-300 hover:shadow-lg",
                        stat.bg,
                        stat.border
                    )}
                >
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{stat.label}</p>
                        <p className={cn("text-3xl font-black font-mono tracking-tighter", stat.color)}>
                            {stat.value.toString().padStart(2, '0')}
                        </p>
                    </div>
                    <div className={cn("h-12 w-12 flex items-center justify-center border border-current/10 shrink-0", stat.color)}>
                        <stat.icon className="h-6 w-6 opacity-80" />
                    </div>
                </div>
            ))}
        </div>
    );
}
