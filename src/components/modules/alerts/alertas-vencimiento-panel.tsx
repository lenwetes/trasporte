"use client";

/**
 * @component AlertasVencimientoPanel
 * @description Panel visual de alertas de vencimiento de documentos vehiculares.
 * Muestra el estado en tiempo real con priorización VENCIDO > POR_VENCER > OK.
 */
import { useState, useTransition } from "react";
import { AlertTriangle, CheckCircle, Clock, RefreshCw, Shield, Bell } from "lucide-react";
import type { ResumenAlertas, AlertaVencimiento } from "@/services/alerts.service";
import { triggerAlertasUpdate } from "@/actions/alerts";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AlertasVencimientoPanelProps {
    resumen: ResumenAlertas;
}

const ESTADO_CONFIG = {
    VENCIDO: {
        color: "bg-red-500",
        textColor: "text-red-700",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: AlertTriangle,
        label: "VENCIDO",
    },
    POR_VENCER: {
        color: "bg-amber-500",
        textColor: "text-amber-700",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        icon: Clock,
        label: "POR VENCER",
    },
    OK: {
        color: "bg-emerald-500",
        textColor: "text-emerald-700",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        icon: CheckCircle,
        label: "VIGENTE",
    },
} as const;

type FilterEstado = "TODOS" | "VENCIDO" | "POR_VENCER";

export function AlertasVencimientoPanel({ resumen }: AlertasVencimientoPanelProps) {
    const [isPending, startTransition] = useTransition();
    const [filter, setFilter] = useState<FilterEstado>("TODOS");

    const handleTrigger = () => {
        startTransition(async () => {
            const result = await triggerAlertasUpdate();
            if (result?.success && result.data) {
                toast.success(
                    `Motor actualizado: ${result.data.vencidos} vencidos, ${result.data.porVencer} por vencer`,
                    { duration: 5000 }
                );
            } else {
                toast.error("Error al actualizar el motor de alertas");
            }
        });
    };

    const alertasFiltradas = resumen.alertas.filter((a: AlertaVencimiento) =>
        filter === "TODOS" ? true : a.estado === filter
    );

    const criticalCount = resumen.totalVencidos + resumen.totalPorVencer;

    return (
        <div className="bg-white border border-slate-200 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 flex items-center justify-center ${criticalCount > 0 ? "bg-red-50" : "bg-emerald-50"}`}>
                        <Bell className={`h-4 w-4 ${criticalCount > 0 ? "text-red-600 animate-pulse" : "text-emerald-600"}`} />
                    </div>
                    <div>
                        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">
                            Monitor de Vencimientos
                        </h2>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            SOAT · RTM · Tarjeta de Operación
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleTrigger}
                    disabled={isPending}
                    className="flex items-center gap-2 px-3 py-2 text-[9px] font-black uppercase tracking-widest border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-wait"
                >
                    <RefreshCw className={`h-3 w-3 ${isPending ? "animate-spin" : ""}`} />
                    {isPending ? "Actualizando..." : "Actualizar"}
                </button>
            </div>

            {/* KPI Summary */}
            <div className="grid grid-cols-3 border-b border-slate-100">
                {[
                    { label: "Vencidos", count: resumen.totalVencidos, color: "text-red-600", bg: "bg-red-50", key: "VENCIDO" as FilterEstado },
                    { label: "Por Vencer", count: resumen.totalPorVencer, color: "text-amber-600", bg: "bg-amber-50", key: "POR_VENCER" as FilterEstado },
                    { label: "Vigentes", count: resumen.totalOk, color: "text-emerald-600", bg: "bg-emerald-50", key: "TODOS" as FilterEstado },
                ].map(({ label, count, color, bg, key }) => (
                    <button
                        key={key}
                        onClick={() => setFilter(filter === key ? "TODOS" : key)}
                        className={`flex flex-col items-center py-4 gap-1 transition-all ${filter === key ? bg : "hover:bg-slate-50"}`}
                    >
                        <span className={`text-2xl font-black ${color}`}>{count}</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{label}</span>
                    </button>
                ))}
            </div>

            {/* Alert List */}
            <div className="divide-y divide-slate-50 max-h-[380px] overflow-y-auto">
                {alertasFiltradas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                        <Shield className="h-8 w-8 text-emerald-300" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Sin alertas críticas activas
                        </p>
                    </div>
                ) : (
                    alertasFiltradas.map((alerta: AlertaVencimiento) => {
                        const cfg = ESTADO_CONFIG[alerta.estado];
                        const Icon = cfg.icon;
                        return (
                            <div
                                key={alerta.id}
                                className={`flex items-center gap-3 p-4 hover:${cfg.bgColor} transition-colors`}
                            >
                                {/* Estado indicator */}
                                <div className={`h-2 w-2 rounded-full flex-shrink-0 ${cfg.color}`} />

                                {/* Vehicle info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-black text-slate-900 uppercase">
                                            {alerta.placa}
                                        </span>
                                        <span className="text-[9px] text-slate-400 uppercase">{alerta.tipo}</span>
                                    </div>
                                    <p className="text-[9px] text-slate-400 mt-0.5 truncate">
                                        {alerta.propietario ?? "Propietario no registrado"} · {alerta.marca ?? ""}
                                    </p>
                                </div>

                                {/* Días restantes */}
                                <div className={`text-right flex-shrink-0 ${cfg.textColor}`}>
                                    <div className="flex items-center gap-1 justify-end">
                                        <Icon className="h-3 w-3" />
                                        <span className="text-[10px] font-black">
                                            {alerta.diasRestantes < 0
                                                ? `${Math.abs(alerta.diasRestantes)}d expirado`
                                                : `${alerta.diasRestantes}d`}
                                        </span>
                                    </div>
                                    <p className="text-[8px] text-slate-400 mt-0.5">
                                        {format(new Date(alerta.fechaVencimiento), "dd MMM yyyy", { locale: es })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest text-center">
                    Actualización automática cada hora · Cron: /api/cron/alerts
                </p>
            </div>
        </div>
    );
}
