"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AccountSelector } from "@/components/modules/finance/account-selector";
import { 
    Wallet, 
    Zap, 
    ShieldCheck, 
    Activity,
    LayoutDashboard,
    Scale,
    Save,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConfigForm } from "./types";

interface LiquidezTabProps {
    configForm: ConfigForm;
    setConfigForm: React.Dispatch<React.SetStateAction<ConfigForm>>;
    loading: boolean;
    handleSaveConfig: () => void;
}

export function LiquidezTab({
    configForm,
    setConfigForm,
    loading,
    handleSaveConfig,
}: LiquidezTabProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <DashboardHeader 
                title="Mapeo de Liquidez"
                tagline="Operación & Liquidez"
                subtitle="Vincule el nodo raíz de tesorería para la canalización de egresos operativos y flujos de caja menor."
                icon={Wallet}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                <Card className="rounded-none border-none shadow-2xl shadow-primary/5 ring-1 ring-slate-200">
                    <CardContent className="p-8 md:p-12 space-y-10">
                        <div className="flex items-center gap-4 border-b border-primary/5 pb-6">
                            <div className="h-10 w-10 flex items-center justify-center border border-primary text-primary bg-white rounded-none shadow-premium">
                                <Wallet size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase text-primary tracking-[0.4em]">Tesorería Central</span>
                        </div>
                        
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 block">Cuenta de Caja General (Efectivo)</label>
                            <AccountSelector 
                                selectedId={configForm.cuentaCajaId}
                                onSelect={(id) => setConfigForm({ ...configForm, cuentaCajaId: id })}
                                placeholder="BUSCAR AUXILIAR DE CAJA..."
                            />
                            <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] leading-relaxed">Origen para pagos y recaudos en EFECTIVO.</p>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 block">Cuenta de Bancos (Transferencias / Cheque)</label>
                            <AccountSelector 
                                selectedId={configForm.cuentaBancosId}
                                onSelect={(id) => setConfigForm({ ...configForm, cuentaBancosId: id })}
                                placeholder="BUSCAR AUXILIAR DE BANCOS..."
                            />
                            <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] leading-relaxed">Origen para transacciones electrónicas y cheques.</p>
                        </div>

                        {(configForm.cuentaCajaId || configForm.cuentaBancosId) && (
                            <div className="flex items-center gap-3 mt-4 animate-in slide-in-from-left-2">
                                <div className="h-4 w-4 rounded-none bg-emerald-500 flex items-center justify-center shadow-md">
                                    <ShieldCheck size={10} className="text-white" />
                                </div>
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest pl-2">Sincronización Crítica Activa</span>
                            </div>
                        )}

                        <div className="pt-10 border-t border-slate-100 grid grid-cols-1 gap-8">
                             <div className="space-y-4">
                                {[
                                    "Sincronización automática con egresos",
                                    "Conciliación bancaria integrada",
                                    "Validación de auxiliares en tiempo real"
                                ].map((text, i) => (
                                    <div key={i} className="flex items-center gap-4 group">
                                        <div className="h-1.5 w-1.5 bg-primary/20 rounded-none group-hover:bg-primary transition-colors"></div>
                                        <span className="text-[9px] md:text-[10px] font-bold uppercase text-primary/60 tracking-widest">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    <Card className="bg-white border-t-4 border-primary rounded-none shadow-xl ring-1 ring-slate-100">
                        <CardContent className="p-8 md:p-10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center bg-primary/10 rounded-none">
                                    <Zap className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                                </div>
                                <span className="text-[10px] font-black uppercase text-primary tracking-[0.4em]">Análisis en Tiempo Real</span>
                            </div>
                            <p className="text-[10px] md:text-[11px] text-primary/50 font-medium uppercase italic leading-relaxed">
                                El balance se mostrará en el Widget de Disponibilidad. Asegúrese de que la cuenta seleccionada sea de naturaleza DEBITO para reflejar saldos positivos en libro auxiliar.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-none rounded-none shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rotate-45 translate-x-12 -translate-y-12 transition-transform duration-700 group-hover:scale-125" />
                        <CardContent className="p-10 relative z-10">
                             <div className="flex items-center gap-4 mb-6">
                                <div className="h-2 w-2 bg-accent rounded-none shadow-[0_0_10px_rgba(0,183,181,0.5)]"></div>
                                <span className="text-[10px] font-black uppercase text-white tracking-[0.4em]">Estado del Sistema</span>
                            </div>
                            <h4 className="text-xl font-black text-white italic tracking-tighter mb-4">FLUJO DE CAJA UNIFICADO</h4>
                            <p className="text-[10px] font-bold text-white uppercase tracking-[0.2em] leading-relaxed mb-8">La vinculación afectará la visualización de reportes de rentabilidad y disponibilidad monetaria inmediata.</p>
                            
                            <div className="h-10 w-full border border-white/10 bg-white/5 flex items-center justify-between px-10">
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Latencia de Red</span>
                                <div className="flex items-center gap-2">
                                    <div className="h-1 w-8 bg-accent/20"></div>
                                    <span className="text-[8px] font-black uppercase text-accent tracking-[0.2em]">Sincronizado</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button 
                                    onClick={handleSaveConfig}
                                    disabled={loading}
                                    className="w-full h-12 bg-accent text-primary font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-accent/90 transition-all disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Save className="h-4 w-4" />}
                                    Sincronizar Tesorería
                                </button>
                                <p className="text-[8px] text-white/40 uppercase font-black tracking-widest mt-3 text-center italic leading-relaxed">
                                    Actualiza los auxiliares de caja y bancos globales.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
