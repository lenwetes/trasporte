"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AccountSelector } from "@/components/modules/finance/account-selector";
import { 
    PiggyBank, 
    Scale, 
    Info, 
    LayoutDashboard,
    Save,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConfigForm } from "./types";

interface FondoTabProps {
    configForm: ConfigForm;
    setConfigForm: React.Dispatch<React.SetStateAction<ConfigForm>>;
    loading: boolean;
    handleSaveConfig: () => void;
}

export function FondoTab({
    configForm,
    setConfigForm,
    loading,
    handleSaveConfig,
}: FondoTabProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <DashboardHeader 
                title="Cartera del Fondo Mutuo"
                tagline="Cartera de Préstamos"
                subtitle="Configure la cuenta contable donde se reservan los fondos de capital crédito interno."
                icon={PiggyBank}
            />

            <Card className="rounded-none border-none shadow-2xl overflow-hidden ring-1 ring-slate-200">
                <CardContent className="p-0 flex flex-col xl:flex-row min-h-[auto] xl:min-h-[400px] bg-white">
                    <div className="xl:w-1/3 p-10 md:p-12 space-y-8 bg-slate-50/50 border-b xl:border-b-0 xl:border-r border-slate-100 relative">
                        {/* Background Decoration */}
                        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-primary/5 translate-x-12 translate-y-12 pointer-events-none" />

                        <div className="flex items-center gap-4 border-b border-primary/10 pb-6 mb-8">
                            <div className="h-10 w-10 flex items-center justify-center bg-primary text-secondary rounded-none shadow-lg">
                                <Scale size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase text-primary tracking-[0.4em]">Control de Activo</span>
                        </div>
                        
                        <div className="space-y-6">
                            <h4 className="text-xl font-black text-primary leading-tight uppercase italic tracking-tighter">ESTRUCTURA DE ORIGINACIÓN</h4>
                            <p className="text-[11px] font-bold text-slate-900 leading-relaxed uppercase italic">Seleccione el auxiliar 1305 / 1380 para préstamos personales. Esta cuenta registrará los débitos al desembolsar y créditos al recaudar.</p>
                            
                            <div className="pt-6 space-y-4">
                                {[
                                    "Seguimiento de amortización quincenal",
                                    "Impacto inmediato en Balance General",
                                    "Integración con nómina administrativa"
                                ].map((text, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="h-1 w-1 bg-secondary rounded-none"></div>
                                        <span className="text-[9px] font-black uppercase text-primary/60 tracking-widest">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 p-10 md:p-14 lg:p-20 space-y-12">
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase text-primary tracking-[0.4em] block mb-3">Asignación P.U.C Maestra</span>
                                    <p className="text-[11px] font-bold text-primary uppercase tracking-[0.2em] italic max-w-lg leading-relaxed">Vincule el asiento deudora principal del fondo mutuo para la contabilización automática de cuotas.</p>
                                </div>
                                <div className="hidden sm:block h-10 w-10 border border-slate-200 p-2 text-slate-900">
                                    <Info size={24} />
                                </div>
                            </div>

                            <div className="space-y-4 max-w-2xl">
                                <AccountSelector 
                                    selectedId={configForm.cuentaPrestamosId}
                                    onSelect={(id) => setConfigForm({ ...configForm, cuentaPrestamosId: id })}
                                    placeholder="BUSCAR CUENTA DE CARTERA..."
                                />
                                {configForm.cuentaPrestamosId && (
                                    <div className="flex items-center gap-4 px-6 py-4 bg-emerald-50/50 border-l-4 border-emerald-500 animate-in slide-in-from-top-2">
                                        <LayoutDashboard size={14} className="text-emerald-600" />
                                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.3em]">Cartera Operativa Vinculada Correctamente</span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-8 flex justify-end">
                                <button 
                                    onClick={handleSaveConfig}
                                    disabled={loading}
                                    className="h-14 px-12 bg-primary text-white font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-3 hover:-translate-y-1 transition-all shadow-xl disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" />
                                    Sincronizar Fondo
                                </button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
