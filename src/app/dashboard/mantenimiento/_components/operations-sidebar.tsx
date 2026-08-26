import React from "react";
import { cn } from "@/lib/utils";
import { ShieldAlert, Wrench, ChevronRight } from "lucide-react";
import { VehicleOperation } from "./operations.types";

export interface OperationsSidebarProps {
    operations: VehicleOperation[];
    selectedVehicle: VehicleOperation | null;
    onSelectVehicle: (v: VehicleOperation) => void;
}

export function OperationsSidebar({ operations, selectedVehicle, onSelectVehicle }: OperationsSidebarProps) {
    return (
        <div className="lg:col-span-4 bg-white border border-primary/10 flex flex-col shadow-2xl">
            <div className="p-8 border-b border-primary/5 bg-slate-50/50">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Cola de Operaciones</h3>
                    <span className="bg-primary text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-widest">{operations.length} Unidades</span>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {operations.map((operation) => (
                    <button
                        key={operation.id}
                        onClick={() => onSelectVehicle(operation)}
                        className={cn(
                            "w-full p-6 border-2 transition-all flex items-center gap-6 group text-left",
                            selectedVehicle?.id === operation.id 
                                ? "bg-slate-900 border-primary text-white shadow-xl" 
                                : "bg-white border-primary/5 text-primary hover:border-primary/20 hover:bg-slate-50"
                        )}
                    >
                        <div className={cn(
                            "h-12 w-12 flex items-center justify-center border-2 transition-transform group-hover:scale-110",
                            selectedVehicle?.id === operation.id 
                                ? "bg-white/10 border-white/20 text-accent" 
                                : operation.tipo === "alerta" ? "bg-red-50 border-red-100 text-red-600" : "bg-blue-50 border-blue-100 text-blue-600"
                        )}>
                            {operation.tipo === "alerta" ? <ShieldAlert size={20} /> : <Wrench size={20} />}
                        </div>
                        
                        <div className="flex-1">
                            <h4 className="text-xl font-black tracking-tighter uppercase italic leading-none mb-1 group-hover:translate-x-1 transition-transform">{operation.placa}</h4>
                            <p className={cn(
                                "text-[9px] font-black uppercase tracking-widest opacity-40",
                                selectedVehicle?.id === operation.id ? "text-white/60" : "text-primary/60"
                            )}>
                                {operation.tipo === "alerta" ? "Falla Preventiva" : "Mto. en Curso"}
                            </p>
                        </div>
                        
                        <ChevronRight size={16} className={cn(
                            "transition-all",
                            selectedVehicle?.id === operation.id ? "text-accent translate-x-2" : "text-primary/10"
                        )} />
                    </button>
                ))}
            </div>
        </div>
    );
}
