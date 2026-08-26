"use client";

/**
 * @component ReglasAlertaManager
 * @description Gestor de reglas de alerta de vencimiento por tipo de documento.
 * Permite configurar los días de anticipación para cada tipo (SOAT, RTM, etc.)
 * con persistencia en base de datos a través del AlertsService.
 */
import { useState, useTransition } from "react";
import { upsertReglaAlerta, triggerAlertasUpdate } from "@/actions/alerts";
import type { ReglaAlertaData } from "@/services/alerts.service";
import { toast } from "sonner";
import { Save, RefreshCw, Bell, Zap } from "lucide-react";

interface ReglasAlertaManagerProps {
    initialReglas: ReglaAlertaData[];
    onClose?: () => void;
}

const TIPOS_DOCUMENTO_DEFAULTS = [
    { tipo: "SOAT", label: "SOAT (Seguro Obligatorio)" },
    { tipo: "RTM", label: "RTM (Revisión Técnico Mecánica)" },
    { tipo: "TARJETA_OPERACION", label: "Tarjeta de Operación" },
    { tipo: "LICENCIA_TRANSITO", label: "Licencia de Tránsito" },
    { tipo: "POLIZA_RESPONSABILIDAD_CIVIL", label: "Póliza de Responsabilidad Civil Contractual y Extra Contractual" },
];

export function ReglasAlertaManager({ initialReglas, onClose }: ReglasAlertaManagerProps) {
    const [isPending, startTransition] = useTransition();
    const [isTriggerPending, startTriggerTransition] = useTransition();

    // Inicializar con las reglas existentes o defaults de 30 días
    const [reglas, setReglas] = useState<Map<string, { dias: number; activo: boolean }>>(() => {
        const map = new Map<string, { dias: number; activo: boolean }>();
        
        // Cargar reglas existentes en BD
        for (const r of initialReglas) {
            map.set(r.tipoDocumento, { dias: r.diasAnticipacion, activo: r.activo });
        }
        
        // Completar con defaults para tipos no configurados
        for (const tipo of TIPOS_DOCUMENTO_DEFAULTS) {
            if (!map.has(tipo.tipo)) {
                map.set(tipo.tipo, { dias: 30, activo: true });
            }
        }
        return map;
    });

    const handleSave = () => {
        startTransition(async () => {
            const promises = Array.from(reglas.entries()).map(([tipoDocumento, config]) =>
                upsertReglaAlerta({ tipoDocumento, diasAnticipacion: config.dias, activo: config.activo })
            );

            const results = await Promise.all(promises);
            const hasErrors = results.some((r) => !r?.success);

            if (hasErrors) {
                toast.error("Algunas reglas no pudieron guardarse");
            } else {
                toast.success("✅ Reglas de alerta guardadas correctamente");
                onClose?.();
            }
        });
    };

    const handleTrigger = () => {
        startTriggerTransition(async () => {
            const result = await triggerAlertasUpdate();
            if (result?.success && result.data) {
                toast.success(
                    `Motor ejecutado: ${result.data.vencidos} vencidos, ${result.data.porVencer} por vencer`,
                    { id: "trigger-alert" }
                );
            } else {
                toast.error("Error al ejecutar el motor de alertas");
            }
        });
    };

    const updateRegla = (tipo: string, field: "dias" | "activo", value: number | boolean) => {
        setReglas((prev) => {
            const next = new Map(prev);
            const current = next.get(tipo) ?? { dias: 30, activo: true };
            next.set(tipo, { ...current, [field]: value });
            return next;
        });
    };

    return (
        <div className="flex flex-col gap-0">
            {/* Header */}
            <div className="bg-slate-900 p-6 text-white">
                <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                    <Bell className="h-5 w-5 text-amber-400 animate-pulse" />
                    Reglas de Alerta
                </h3>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-2">
                    Configuración de umbrales por tipo de documento
                </p>
            </div>

            {/* Rules List */}
            <div className="p-6 space-y-4 max-h-[420px] overflow-y-auto">
                {TIPOS_DOCUMENTO_DEFAULTS.map(({ tipo, label }) => {
                    const config = reglas.get(tipo) ?? { dias: 30, activo: true };
                    return (
                        <div
                            key={tipo}
                            className={`flex items-center gap-4 p-4 border transition-all ${
                                config.activo
                                    ? "border-slate-200 bg-white hover:border-amber-200"
                                    : "border-slate-100 bg-slate-50 opacity-60"
                            }`}
                        >
                            {/* Active Toggle */}
                            <button
                                onClick={() => updateRegla(tipo, "activo", !config.activo)}
                                className={`w-10 h-5 rounded-full transition-colors flex-shrink-0 relative ${
                                    config.activo ? "bg-amber-500" : "bg-slate-300"
                                }`}
                            >
                                <span
                                    className={`absolute top-0.5 h-4 w-4 bg-white rounded-full shadow transition-transform ${
                                        config.activo ? "translate-x-5" : "translate-x-0.5"
                                    }`}
                                />
                            </button>

                            {/* Label */}
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-black uppercase tracking-widest text-slate-800 truncate">
                                    {label}
                                </p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase">{tipo}</p>
                            </div>

                            {/* Days Input */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <input
                                    type="number"
                                    min={1}
                                    max={365}
                                    value={config.dias}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (!isNaN(val) && val > 0) updateRegla(tipo, "dias", val);
                                    }}
                                    disabled={!config.activo}
                                    className="w-16 h-9 border border-slate-200 text-center text-[13px] font-black text-slate-900 focus:outline-none focus:border-amber-400 disabled:bg-slate-50 disabled:text-slate-400"
                                />
                                <span className="text-[9px] font-black text-slate-400 uppercase">días</span>
                            </div>
                        </div>
                    );
                })}

                <div className="p-3 bg-amber-50 border-l-4 border-amber-500 text-[10px] font-bold text-amber-800 leading-relaxed">
                    Los documentos se marcarán como &quot;Por Vencer&quot; X días antes de su fecha límite. 
                    Pasada la fecha, se marcarán como &quot;Vencido&quot; automáticamente.
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center gap-3 justify-between">
                <button
                    onClick={handleTrigger}
                    disabled={isTriggerPending}
                    className="flex items-center gap-2 px-4 py-2.5 text-[9px] font-black uppercase tracking-widest border border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 transition-all disabled:opacity-50"
                >
                    <Zap className={`h-3 w-3 ${isTriggerPending ? "animate-bounce" : ""}`} />
                    {isTriggerPending ? "Ejecutando..." : "Ejecutar Motor"}
                </button>

                <div className="flex gap-2">
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all"
                        >
                            Cancelar
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isPending}
                        className="flex items-center gap-2 px-6 py-2.5 text-[9px] font-black uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                        <Save className={`h-3 w-3 ${isPending ? "animate-pulse" : ""}`} />
                        {isPending ? "Guardando..." : "Guardar Reglas"}
                    </button>
                </div>
            </div>
        </div>
    );
}
