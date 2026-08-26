"use client";

import React from "react";
import { MaintenancePrediction } from "../../types";
import { BrainCircuit, Sparkles, Activity, Clock, Calendar, ChevronRight, Info, AlertTriangle, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MaintenancePredictionsTabProps {
    predictions: MaintenancePrediction[];
    searchTerm: string;
}

export function MaintenancePredictionsTab({
    predictions,
    searchTerm,
}: MaintenancePredictionsTabProps) {
    const filteredPredictions = predictions.filter((pred) =>
        pred.placa.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (filteredPredictions.length === 0) {
        return (
            <div className="py-24 flex flex-col items-center justify-center border border-dashed border-primary/10 bg-slate-50/50 radius-0">
                <BrainCircuit className="h-12 w-12 text-primary/10 mb-4" />
                <h3 className="text-sm font-black text-primary uppercase tracking-widest">Motor de Predicción Inactivo</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Se requiere mayor histórico de telemetría para generar estimaciones precisas</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center gap-4 p-6 bg-slate-900 border border-primary/10 radius-0">
                <div className="h-10 w-10 flex items-center justify-center bg-secondary text-primary">
                    <BrainCircuit className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Análisis Predictivo Centralizado</h3>
                    <p className="text-[9px] font-bold text-white uppercase tracking-[0.2em]">Cálculos de desgaste basados en promedio de desplazamiento diario (DDA)</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">IA Online</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPredictions.map((pred, idx) => {
                    const isUrgent = pred.daysRemaining < 10;
                    const progress = Math.max(0, Math.min(100, 100 - (pred.daysRemaining * 2)));

                    return (
                        <div key={idx} className="bg-white border border-primary/10 shadow-sm group hover:border-secondary/30 transition-all overflow-hidden relative">
                            <div className={cn("absolute top-0 left-0 w-full h-[3px]", isUrgent ? "bg-red-500" : "bg-primary/5")} />
                            
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 flex items-center justify-center border border-primary/10 bg-slate-50 font-mono text-sm font-black text-primary">
                                            {pred.placa}
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">{pred.planNombre}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Gauge className="h-3 w-3 text-secondary" />
                                                <span className="text-[9px] font-bold text-slate-900 uppercase tracking-widest">{Math.round(pred.dailyKmAvg)} KM/D PROMEDIO</span>
                                            </div>
                                        </div>
                                    </div>
                                    {isUrgent && (
                                        <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-px bg-primary/5 border border-primary/5">
                                        <div className="bg-white p-4">
                                            <span className="block text-[8px] font-black text-slate-900 uppercase tracking-widest mb-1 italic">Fecha Estimada</span>
                                            <span className="font-mono text-xs font-black text-primary uppercase tracking-tighter">
                                                {new Date(pred.predictedDate).toLocaleDateString('es-CO', { month: 'short', day: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="bg-white p-4">
                                            <span className="block text-[8px] font-black text-slate-900 uppercase tracking-widest mb-1 italic">Tiempo Crítico</span>
                                            <span className={cn("font-mono text-xs font-black uppercase tracking-tighter", isUrgent ? "text-red-600" : "text-secondary")}>
                                                {pred.daysRemaining} DÍAS
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest">Probabilidad de Desgaste</span>
                                            <span className="text-[10px] font-black font-mono text-primary">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="h-1 bg-slate-100 radius-0 overflow-hidden">
                                            <div 
                                                className={cn("h-full transition-all duration-1000", isUrgent ? "bg-red-600" : "bg-primary")} 
                                                style={{ width: `${progress}%` }} 
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2 bg-slate-50 p-4 border border-primary/5">
                                        <Info className="h-3.5 w-3.5 text-secondary flex-shrink-0" />
                                        <p className="text-[10px] font-bold text-primary/50 uppercase leading-snug tracking-tighter italic">
                                            "{pred.reason.toUpperCase()}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="px-8 py-3 bg-white border-t border-primary/5 flex justify-end">
                                <Button variant="ghost" className="h-6 p-0 text-[9px] font-black uppercase tracking-widest text-secondary hover:text-white hover:bg-slate-900 group-hover:px-4 transition-all radius-0">
                                    Detail Analysis <ChevronRight className="h-3 w-3 ml-1" />
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
