"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    User, 
    CreditCard, 
    Phone, 
    CheckCircle2, 
    XCircle, 
    Eye,
    CarFront,
    Activity
} from "lucide-react";

import { ConductorWithRelations } from "@/types/conductor";
 
interface ConductorCardProps {
    conductor: ConductorWithRelations; 
}

export function ConductorCard({ conductor }: ConductorCardProps) {
    // Assuming we have fields like activo, etc.
    const isActive = conductor.activo !== false; 

    return (
        <div className="group relative bg-white border border-primary/10 transition-all duration-300 hover:border-primary/30 shadow-sm hover:shadow-xl flex flex-col min-h-[340px]">
            {/* Top Status Bar */}
            <div className={cn(
                "h-1.5 w-full",
                isActive ? "bg-primary/20" : "bg-red-600"
            )} />

            <div className="p-6 flex-1 flex flex-col space-y-6">
                {/* Header: Initial & Role */}
                <div className="flex justify-between items-start">
                    <div className="h-12 w-12 bg-slate-50 border border-primary/5 flex items-center justify-center text-slate-900 group-hover:bg-primary group-hover:text-white transition-colors duration-500 font-extrabold text-xl font-mono">
                        {conductor.nombres?.[0] || ""}{conductor.apellidos?.[0] || ""}
                    </div>
                    
                    <div className="flex flex-col items-end space-y-1.5">
                        <Badge className={cn(
                            "rounded-none text-[9px] font-black uppercase tracking-widest border-none px-2",
                            isActive ? "bg-slate-100 text-primary" : "bg-red-600 text-white"
                        )}>
                            {isActive ? "HABILITADO" : "INACTIVO"}
                        </Badge>
                        {isActive ? (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                        ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                        )}
                    </div>
                </div>

                {/* Identity */}
                <div className="space-y-1 pb-4 border-b border-primary/5">
                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Sujeto Operativo</h3>
                    <p className="text-sm font-black text-primary uppercase tracking-tight truncate">
                        {conductor.nombres} <span className="text-primary/60">{conductor.apellidos}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold pt-1">
                        ID: {conductor.numeroDocumento || "N/A"}
                    </p>
                </div>

                {/* Contact & Extra Data */}
                <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-6 bg-primary/[0.03] border border-primary/5 flex items-center justify-center text-slate-900">
                            <CreditCard className="h-3 w-3" />
                        </div>
                        <p className="text-[9px] font-bold text-primary/70 uppercase truncate flex-1">
                            L.C: {conductor.numeroLicencia || "NO REPORTADA"}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="h-6 w-6 bg-primary/[0.03] border border-primary/5 flex items-center justify-center text-slate-900">
                            <Phone className="h-3 w-3" />
                        </div>
                        <p className="text-[9px] font-bold text-primary/70 truncate flex-1">
                            {conductor.telefono || "CONTACTO NO DISPONIBLE"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="p-4 bg-slate-50/50 border-t border-primary/10 flex gap-2">
                <Link 
                    href={`/dashboard/conductores/${conductor.id}`} 
                    className="flex-1 h-10 bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-all duration-300 gap-2 shadow-sm shadow-primary/20 group/btn"
                >
                    <Eye className="h-4 w-4 text-white/70 group-hover/btn:text-accent transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Expediente Central</span>
                </Link>
                
                <button 
                    className="h-10 w-10 flex-shrink-0 flex items-center justify-center bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm group/del focus:outline-none focus:ring-1 focus:ring-red-500"
                    onClick={(e) => {
                        e.preventDefault();
                        // Lógica de eliminación o alerta
                    }}
                    title="Eliminar registro"
                >
                    <XCircle className="h-4 w-4 group-hover/del:scale-110 transition-transform" />
                </button>
            </div>
        </div>
    );
}
