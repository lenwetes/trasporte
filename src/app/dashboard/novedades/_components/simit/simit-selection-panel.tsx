import * as React from "react";
import { User, Truck, Loader2, Search, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SimitUpdateModuleProps } from "../simit-update-module.types";

interface SimitSelectionPanelProps extends SimitUpdateModuleProps {
    selectedType: 'CONDUCTOR' | 'VEHICULO';
    setSelectedType: (type: 'CONDUCTOR' | 'VEHICULO') => void;
    selectedId: string;
    setSelectedId: (id: string) => void;
    handleCheck: () => Promise<void>;
    isLoading: boolean;
    showHistory: boolean;
    toggleHistory: () => void;
    setResult: (res: null) => void;
}

export function SimitSelectionPanel({
    conductores,
    vehiculos,
    selectedType,
    setSelectedType,
    selectedId,
    setSelectedId,
    handleCheck,
    isLoading,
    showHistory,
    toggleHistory,
    setResult
}: SimitSelectionPanelProps) {
    return (
        <Card className="xl:col-span-5 p-8 border-primary/10 rounded-none shadow-xl bg-white space-y-8">
            <div className="space-y-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary italic">Motor de Vigilancia SIMIT</h3>
                <p className="text-[11px] font-bold text-slate-900 uppercase leading-relaxed">
                    Sincronización automatizada con la Federación Colombiana de Municipios.
                </p>
            </div>

            <div className="flex gap-2 p-1 bg-slate-100 border border-slate-200">
                <button
                    onClick={() => { setSelectedType('CONDUCTOR'); setSelectedId(""); setResult(null); }}
                    className={cn(
                        "flex-1 h-10 text-[10px] font-black uppercase tracking-tighter transition-all flex items-center justify-center gap-2",
                        selectedType === 'CONDUCTOR' ? "bg-primary text-white shadow-lg" : "text-slate-900 hover:text-primary"
                    )}
                >
                    <User className="h-3 w-3" /> Conductores
                </button>
                <button
                    onClick={() => { setSelectedType('VEHICULO'); setSelectedId(""); setResult(null); }}
                    className={cn(
                        "flex-1 h-10 text-[10px] font-black uppercase tracking-tighter transition-all flex items-center justify-center gap-2",
                        selectedType === 'VEHICULO' ? "bg-primary text-white shadow-lg" : "text-slate-900 hover:text-primary"
                    )}
                >
                    <Truck className="h-3 w-3" /> Vehículos
                </button>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Seleccionar Objetivo</label>
                <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="w-full h-12 bg-slate-50 border-primary/10 text-xs font-bold uppercase px-4 outline-none focus:border-primary transition-all"
                >
                    <option value="">-- SELECCIONAR --</option>
                    {selectedType === 'CONDUCTOR' ? (
                        conductores.map(c => <option key={c.id} value={c.id}>{c.nombre} ({c.documento})</option>)
                    ) : (
                        vehiculos.map(v => <option key={v.id} value={v.id}>{v.placa}</option>)
                    )}
                </select>
            </div>

            <Button
                onClick={handleCheck}
                disabled={isLoading || !selectedId}
                className="w-full h-14 bg-primary text-white rounded-none font-black uppercase tracking-[0.2em] text-[11px] gap-3 shadow-xl group overflow-hidden relative"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin text-accent" />
                        Escaneando SIMIT...
                    </>
                ) : (
                    <>
                        <Search className="h-4 w-4 text-accent transition-transform group-hover:scale-125" />
                        Ejecutar Auditoría Express
                    </>
                )}
                {isLoading && <div className="absolute inset-0 bg-white/10 animate-pulse" />}
            </Button>

            <button 
                onClick={toggleHistory}
                disabled={!selectedId}
                className="w-full text-center text-[10px] font-black uppercase text-slate-900 hover:text-primary transition-colors flex items-center justify-center gap-2"
            >
                <History className="h-3 w-3" />
                {showHistory ? "Ocultar Historial" : "Ver Historial de Consultas"}
            </button>
        </Card>
    );
}
