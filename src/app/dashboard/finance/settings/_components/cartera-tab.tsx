"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { 
    Settings, 
    Info, 
    LayoutDashboard,
    Save,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConfigForm } from "./types";

interface CarteraTabProps {
    configForm: ConfigForm;
    setConfigForm: React.Dispatch<React.SetStateAction<ConfigForm>>;
    loading: boolean;
    handleSaveConfig: () => void;
}

export function CarteraTab({
    configForm,
    setConfigForm,
    loading,
    handleSaveConfig,
}: CarteraTabProps) {
    const FormLabel = ({ children }: { children: React.ReactNode }) => (
        <label className="text-[10px] font-black uppercase text-slate-900 tracking-[0.4em] mb-4 block">
            {children}
        </label>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <DashboardHeader 
                title="Parámetros de Cartera"
                tagline="Configuración Maestra"
                subtitle="Defina los pilares financieros para el cobro de cuotas administrativas, gestión de mora y bloqueos preventivos."
                icon={Settings}
                actions={
                    <div className="hidden lg:flex items-center gap-4 text-primary">
                        <Info className="h-4 w-4" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">Cualquier cambio impacta en el motor de facturación</span>
                    </div>
                }
            />

            <Card className="rounded-none border-none shadow-2xl shadow-primary/5 overflow-hidden ring-1 ring-slate-200">
                <CardContent className="p-0 flex flex-col xl:flex-row bg-white">
                    {/* Panel de Inputs */}
                    <div className="p-8 md:p-12 xl:w-2/3 space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                            {/* Input 1 */}
                            <div className="space-y-1">
                                <FormLabel>Cuota de Administración (Global)</FormLabel>
                                <div className="relative group">
                                    <div className="absolute left-0 top-0 h-full w-12 flex items-center justify-center bg-slate-50 border-r border-slate-200 text-xs font-black text-primary/20">$</div>
                                    <CurrencyInput 
                                        value={configForm.montoCuotaAdministracion.toString()}
                                        onChange={(val) => setConfigForm({ ...configForm, montoCuotaAdministracion: Number(val) })}
                                        className="h-14 pl-16 rounded-none border-slate-200 bg-white text-lg font-black tracking-tight text-primary focus:border-primary focus:ring-0 transition-all font-mono shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Input 2 */}
                            <div className="space-y-1">
                                <FormLabel>Margen de Interés x Mora (%)</FormLabel>
                                <div className="relative group">
                                    <div className="absolute right-0 top-0 h-full w-12 flex items-center justify-center bg-slate-50 border-l border-slate-200 text-xs font-black text-primary/20">%</div>
                                    <CurrencyInput 
                                        value={configForm.porcentajeMoraDiaria.toString()}
                                        onChange={(val) => setConfigForm({ ...configForm, porcentajeMoraDiaria: Number(val) })}
                                        className="h-14 pr-16 rounded-none border-slate-200 bg-white text-lg font-black tracking-tight text-primary focus:border-primary focus:ring-0 transition-all font-mono shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Input 3 */}
                            <div className="space-y-1 md:col-span-2">
                                <FormLabel>Umbral de Bloqueo (Días de Mora)</FormLabel>
                                <div className="relative group">
                                    <div className="absolute left-0 top-0 h-full w-12 flex items-center justify-center bg-slate-50 border-r border-slate-200 text-xs font-black text-primary/20">📅</div>
                                    <CurrencyInput 
                                        value={configForm.umbralBloqueoMora.toString()}
                                        onChange={(val) => setConfigForm({ ...configForm, umbralBloqueoMora: Number(val) })}
                                        className="h-14 pl-16 rounded-none border-slate-200 bg-white text-lg font-black tracking-tight text-primary focus:border-primary focus:ring-0 transition-all font-mono shadow-sm"
                                    />
                                </div>
                                <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] mt-3">El sistema restringirá el FUEC automáticamente al superar este umbral.</p>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100 flex justify-end">
                            <Button 
                                onClick={handleSaveConfig}
                                disabled={loading}
                                className="h-14 rounded-none bg-primary text-white font-black uppercase text-[10px] tracking-[0.3em] px-12 shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all flex gap-3 items-center"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Sincronizar Cambios
                            </Button>
                        </div>
                    </div>

                    {/* Guía Técnica Lateral */}
                    <div className="xl:w-1/3 bg-slate-50/50 p-8 md:p-12 border-t xl:border-t-0 xl:border-l border-slate-100 space-y-8">
                         <div className="flex items-center gap-4 border-b border-primary/5 pb-6">
                            <div className="h-10 w-10 flex items-center justify-center bg-primary text-secondary rounded-none shadow-premium">
                                <LayoutDashboard className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase text-primary tracking-[0.4em]">Guía de Auditoría</span>
                        </div>

                        <ul className="space-y-6">
                            {[
                                { title: "Facturación Mensual", desc: "Se ejecuta a las 00:00 del primer día de cada mes." },
                                { title: "Cálculo de Intereses", desc: "Interés compuesto aplicado sobre el saldo vencido." },
                                { title: "Auto-Bloqueo FUEC", desc: "Módulo integrado con seguridad vial para prohibir despacho." }
                            ].map((item, idx) => (
                                <li key={idx} className="space-y-2">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-wider">{item.title}</p>
                                    <p className="text-[10px] font-bold text-slate-900 leading-relaxed uppercase italic">{item.desc}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
