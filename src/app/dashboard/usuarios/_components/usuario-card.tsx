"use client";

import Link from "next/link";
import { DeleteUserButton } from "@/components/delete-user-button";
import type { UsuarioWithRelations } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    User, 
    Mail, 
    Phone, 
    ShieldAlert, 
    ShieldCheck, 
    Eye,
    Briefcase
} from "lucide-react";

interface UsuarioCardProps {
    usuario: UsuarioWithRelations;
    isAdmin: boolean;
    isSecretaria: boolean;
}

export function UsuarioCard({ usuario, isAdmin, isSecretaria }: UsuarioCardProps) {
    const isOwnerOrAdmin = usuario.rol === "ADMIN";

    return (
        <div className="group relative bg-white border border-primary/10 transition-all duration-300 hover:border-primary/30 shadow-sm hover:shadow-xl flex flex-col min-h-[340px]">
            {/* Top Status Bar */}
            <div className={cn(
                "h-1.5 w-full",
                !usuario.activo ? "bg-red-600" : isOwnerOrAdmin ? "bg-accent" : "bg-primary/20"
            )} />

            <div className="p-6 flex-1 flex flex-col space-y-6">
                {/* Header: Initial & Role */}
                <div className="flex justify-between items-start">
                    <div className="h-12 w-12 bg-slate-50 border border-primary/5 flex items-center justify-center text-slate-900 group-hover:bg-primary group-hover:text-white transition-colors duration-500 font-extrabold text-xl font-mono">
                        {usuario.nombres?.[0]}{usuario.apellidos?.[0]}
                    </div>
                    
                    <div className="flex flex-col items-end space-y-1.5">
                        <Badge className={cn(
                            "rounded-none text-[9px] font-black uppercase tracking-widest border-none px-2",
                            !usuario.activo ? "bg-red-600 text-white" : isOwnerOrAdmin ? "bg-accent text-white" : "bg-slate-100 text-primary"
                        )}>
                            {!usuario.activo ? "INACTIVO" : isOwnerOrAdmin ? "ADMINISTRADOR" : usuario.rol}
                        </Badge>
                        {isOwnerOrAdmin ? (
                            <ShieldAlert className="h-4 w-4 text-accent" />
                        ) : (
                            <ShieldCheck className="h-4 w-4 text-primary" />
                        )}
                    </div>
                </div>

                {/* Identity */}
                <div className="space-y-1 pb-4 border-b border-primary/5">
                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Identidad Funcional</h3>
                    <p className="text-sm font-black text-slate-950 uppercase tracking-tight truncate">
                        {usuario.nombres} <span className="text-slate-900">{usuario.apellidos}</span>
                    </p>
                    <p className="text-[10px] text-slate-900 uppercase font-black pt-1">
                        CC. {usuario.numeroDocumento || "N/A"}
                    </p>
                </div>

                {/* Contact Data */}
                <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-6 bg-primary/[0.03] border border-primary/5 flex items-center justify-center text-slate-900">
                            <Mail className="h-3 w-3" />
                        </div>
                        <p className="text-[9px] font-bold text-primary/70 truncate flex-1">
                            {usuario.email || "SIN METADATO CORREO"}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="h-6 w-6 bg-primary/[0.03] border border-primary/5 flex items-center justify-center text-slate-900">
                            <Phone className="h-3 w-3" />
                        </div>
                        <p className="text-[9px] font-bold text-primary/70 truncate flex-1">
                            {usuario.telefono || "NO DISPONIBLE"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions Footer */}
            {(isAdmin || isSecretaria) && (
                <div className="p-4 bg-slate-50/50 border-t border-primary/10 flex gap-2">
                    <Link 
                        href={`/dashboard/usuarios/${usuario.id}`} 
                        className="flex-1 h-10 bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-all duration-300 gap-2 shadow-sm shadow-primary/20"
                    >
                        <Eye className="h-4 w-4 text-white/70" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Expediente</span>
                    </Link>
                    {isAdmin && (
                        <div className="flex-shrink-0">
                            <DeleteUserButton
                                userId={usuario.id}
                                userName={`${usuario.nombres} ${usuario.apellidos}`}
                                variant="icon"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
