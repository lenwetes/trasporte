import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Play, 
    ShieldCheck, 
    Loader2, 
    Settings2, 
    Coins, 
    Calendar, 
    AlertCircle, 
    Percent 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CurrencyInput } from "@/components/ui/currency-input";

interface GeneralSettingsTabProps {
    configForm: {
        montoCuotaAdministracion: string;
        diaCorteMensual: string;
        umbralBloqueoMora: string;
        porcentajeMoraDiaria: string;
    };
    setConfigForm: (form: GeneralSettingsTabProps["configForm"]) => void;
    handleSaveConfig: () => void;
    handleGenerateObligations: () => void;
    loading: boolean;
}

export function GeneralSettingsTab({
    configForm,
    setConfigForm,
    handleSaveConfig,
    handleGenerateObligations,
    loading,
}: GeneralSettingsTabProps) {
    return (
        <div className="max-w-4xl space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">Control Paramétrico</h3>
                    <p className="text-xs text-slate-900">Reglas de negocio y facturación automática</p>
                </div>
                <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-900">
                    <Settings2 size={20} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Cuota Administración */}
                <div className="space-y-3">
                    <label className="text-xs font-black uppercase text-slate-900 tracking-widest flex items-center gap-2">
                        <Coins size={14} className="text-emerald-500" />
                        Cuota Administración Base
                    </label>
                    <div className="relative">
                        <CurrencyInput
                            className="bg-white border-slate-200"
                            value={Number(configForm.montoCuotaAdministracion)}
                            onChange={(val) => setConfigForm({
                                    ...configForm,
                                    montoCuotaAdministracion: val.toString(),
                                })
                            }
                        />
                    </div>
                    <p className="text-[10px] text-slate-900 leading-relaxed italic">
                        Referencia base para la facturación masiva mensual a asociados.
                    </p>
                </div>

                {/* Día de Corte */}
                <div className="space-y-3">
                    <label className="text-xs font-black uppercase text-slate-900 tracking-widest flex items-center gap-2">
                        <Calendar size={14} className="text-blue-500" />
                        Día de Facturación Mensual
                    </label>
                    <Input
                        type="number"
                        max={30}
                        min={1}
                        className="h-12 bg-white border-slate-200 focus:ring-blue-500/10 focus:border-blue-500 font-bold"
                        value={configForm.diaCorteMensual}
                        onChange={(e) => setConfigForm({
                                ...configForm,
                                diaCorteMensual: e.target.value,
                            })
                        }
                    />
                    <p className="text-[10px] text-slate-900 leading-relaxed italic">
                        Día del mes en que el sistema genera automáticamente la cartera.
                    </p>
                </div>

                {/* Umbral de Bloqueo */}
                <div className="space-y-3">
                    <label className="text-xs font-black uppercase text-slate-900 tracking-widest flex items-center gap-2">
                        <AlertCircle size={14} className="text-rose-500" />
                        Umbral de Bloqueo Mora
                    </label>
                    <div className="relative">
                        <CurrencyInput
                            className="bg-white border-slate-200"
                            value={Number(configForm.umbralBloqueoMora)}
                            onChange={(val) => setConfigForm({
                                    ...configForm,
                                    umbralBloqueoMora: val.toString(),
                                })
                            }
                        />
                    </div>
                    <p className="text-[10px] text-slate-900 leading-relaxed italic">
                        Monto máximo de deuda permitido antes de suspender servicios.
                    </p>
                </div>

                {/* Porcentaje Mora */}
                <div className="space-y-3">
                    <label className="text-xs font-black uppercase text-slate-900 tracking-widest flex items-center gap-2">
                        <Percent size={14} className="text-amber-500" />
                        Interés de Mora Diario
                    </label>
                    <div className="relative">
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-900 font-bold">%</span>
                        <Input
                            type="number"
                            step="0.01"
                            className="pr-8 h-12 bg-white border-slate-200 focus:ring-amber-500/10 focus:border-amber-500"
                            value={configForm.porcentajeMoraDiaria}
                            onChange={(e) => setConfigForm({
                                    ...configForm,
                                    porcentajeMoraDiaria: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4">
                <Button
                    onClick={handleSaveConfig}
                    disabled={loading}
                    className="w-full sm:w-auto px-8 h-12 bg-slate-900 border-none rounded-lg font-bold text-xs uppercase tracking-[0.1em] gap-2 shadow-lg shadow-slate-900/10"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                    Guardar Cambios
                </Button>

                <Button
                    variant="outline"
                    onClick={handleGenerateObligations}
                    disabled={loading}
                    className="w-full sm:w-auto px-8 h-12 border-slate-200 text-slate-600 rounded-lg font-bold text-xs uppercase tracking-[0.1em] gap-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all font-mono"
                >
                    <Play size={16} />
                    Ejecutar Lote Mensual
                </Button>
            </div>
        </div>
    );
}
