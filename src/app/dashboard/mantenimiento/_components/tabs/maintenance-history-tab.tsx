"use client";

import React, { useState } from "react";
import type { GlobalHistoryItem } from "../../types";
import { Search, Calendar, Activity, ChevronRight, FileDown, Truck, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MaintenanceHistoryTabProps {
    historial: GlobalHistoryItem[];
    searchTerm: string;
}

export function MaintenanceHistoryTab({
    historial,
    searchTerm,
}: MaintenanceHistoryTabProps) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const filteredHistory = historial.filter((item) => {
        const matchesSearch =
            item.vehiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.plan.nombre.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesDate = true;
        if (startDate && endDate) {
            const itemDate = new Date(item.fecha);
            matchesDate = itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
        }

        return matchesSearch && matchesDate;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Filtros de Historial Premium */}
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-slate-50 border border-primary/5">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 flex items-center justify-center border border-primary/10 bg-white">
                        <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Filtros de Auditoría</span>
                </div>
                
                <div className="flex items-center gap-2">
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        className="h-12 px-4 bg-white border border-primary/10 rounded-none text-[11px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-secondary outline-none transition-all"
                    />
                    <ArrowUpDown className="h-4 w-4 text-primary/20 mx-2" />
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        className="h-12 px-4 bg-white border border-primary/10 rounded-none text-[11px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-secondary outline-none transition-all"
                    />
                </div>

                <div className="md:ml-auto">
                    <Button variant="outline" className="h-12 rounded-none border-primary/10 px-6 text-[10px] font-black uppercase tracking-widest gap-2 bg-white">
                        <FileDown className="h-4 w-4 text-secondary" />
                        Exportar Reporte
                    </Button>
                </div>
            </div>

            <div className="overflow-hidden border border-primary/5 shadow-sm">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-primary border-b border-primary/10">
                            <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em]">Registro / Vehículo</th>
                            <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em]">Plan Ejecutado</th>
                            <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em]">Fecha Auditoría</th>
                            <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em]">KM Alcanzado</th>
                            <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em]">Inversión (COP)</th>
                            <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em]">Observaciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/5">
                        {filteredHistory.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 flex items-center justify-center border border-primary/5 bg-white text-primary/20 group-hover:text-secondary group-hover:border-secondary/20 transition-colors">
                                            <Truck className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="font-mono text-sm font-black tracking-tight text-primary uppercase">
                                            {item.vehiculo.placa}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-xs font-bold text-primary uppercase tracking-tight">{item.plan.nombre}</span>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">
                                        {new Date(item.fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: '2-digit' })}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right font-mono text-xs font-black text-secondary tracking-tighter tabular-nums">
                                    {item.kilometraje.toLocaleString()} KM
                                </td>
                                <td className="px-6 py-5 text-right font-mono text-xs font-black text-primary tracking-tighter tabular-nums">
                                    {item.costo ? `$${item.costo.toLocaleString()}` : "---"}
                                </td>
                                <td className="px-6 py-5 max-w-xs">
                                    <p className="truncate text-[10px] font-bold text-slate-900 uppercase italic tracking-tight" title={item.observaciones ?? ""}>
                                        {item.observaciones || "SIN NOVEDADES REPORTADAS"}
                                    </p>
                                </td>
                            </tr>
                        ))}
                        {filteredHistory.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-24 text-center">
                                    <div className="flex flex-col items-center gap-2 opacity-20">
                                        <Search className="h-10 w-10 text-primary" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">No se encontraron registros históricos</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
