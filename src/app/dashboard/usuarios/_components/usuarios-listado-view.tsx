"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Pagination } from "@/components/ui/pagination";
import { UsuarioCard } from "./usuario-card";
import { UsuarioWithRelations } from "@/types";
import { 
    Plus, 
    ShieldBan,
    LayoutGrid,
    Search,
    Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface UsuariosListadoViewProps {
    usuarios: UsuarioWithRelations[];
    metadata: {
        total: number;
        page: number;
        totalPages: number;
    };
    isAdmin: boolean;
    isSecretaria: boolean;
}

export function UsuariosListadoView({
    usuarios,
    metadata,
    isAdmin,
    isSecretaria,
}: UsuariosListadoViewProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsuarios = usuarios.filter(u => {
        if (!searchTerm) return true;
        const lower = searchTerm.toLowerCase();
        return (
            u.nombres.toLowerCase().includes(lower) ||
            u.apellidos.toLowerCase().includes(lower) ||
            u.numeroDocumento?.includes(searchTerm) ||
            u.rol.toLowerCase().includes(lower)
        );
    });

    if (!isAdmin && !isSecretaria) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] border border-red-500/10 bg-red-50/30 p-8 text-center space-y-6">
                <div className="h-20 w-20 bg-white border border-red-100 flex items-center justify-center text-red-500">
                    <ShieldBan className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-lg font-black text-red-700 uppercase tracking-[0.2em]">Acceso Restringido</h2>
                    <p className="text-[10px] font-bold text-red-600/70 uppercase max-w-md leading-relaxed">
                        SUS CREDENCIALES ACTUALES NO POSEEN LOS PRIVILEGIOS DE AUDITORÍA NECESARIOS PARA VISUALIZAR ESTE DIRECTORIO MAESTRO.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Intel Bar: Directorate Status */}
            <div className="bg-white border border-primary/10 flex flex-col md:flex-row items-center justify-between p-6 gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-8 w-full md:w-auto text-center sm:text-left">
                    <div className="space-y-1 py-1 px-4 border-l-2 border-accent">
                        <div className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-1">Nivel Autorizado</div>
                        <div className="flex items-center gap-2">
                           <Shield className="h-4 w-4 text-accent" />
                           <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">
                                CLEARANCE ACTIVO
                           </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 sm:min-w-[400px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-900" />
                        <Input 
                            placeholder="FILTRAR POR IDENTIFICADOR, NOMBRES O ROL OPERATIVO..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-14 pl-12 rounded-none border-primary/10 bg-slate-50 text-[11px] font-black uppercase tracking-widest focus-visible:ring-primary/20 focus-visible:border-accent transition-all text-slate-900"
                        />
                    </div>
                    
                    {isAdmin && (
                        <Link href="/dashboard/usuarios/crear-wizard" passHref className="w-full sm:w-auto">
                            <Button variant="premium" className="h-14 w-full">
                                <Plus className="h-5 w-5 text-accent" /> EXPEDIR CREDENCIALES
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* List Overview */}
            {filteredUsuarios.length === 0 ? (
                <div className="py-24 border border-primary/5 bg-slate-50 flex flex-col items-center justify-center space-y-4">
                    <div className="h-20 w-20 bg-white border border-primary/5 flex items-center justify-center text-slate-400">
                        <LayoutGrid className="h-10 w-10" />
                    </div>
                    <div className="text-center space-y-1">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Base de Datos Vacía</h3>
                        <p className="text-[10px] font-bold text-slate-700 uppercase max-w-xs leading-relaxed">NO SE IDENTIFICARON PERFILES QUE COINCIDAN CON LOS CRITERIOS.</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredUsuarios.map((usuario) => (
                            <UsuarioCard 
                                key={usuario.id} 
                                usuario={usuario} 
                                isAdmin={isAdmin}
                                isSecretaria={isSecretaria}
                            />
                        ))}
                    </div>

                    {/* Technical Footer */}
                    <div className="bg-slate-50 border border-primary/5 flex flex-col sm:flex-row items-center justify-between p-6 gap-6">
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="rounded-none bg-white border-primary/10 text-slate-900 font-black px-2 py-1 text-[10px]">AUTH V3.1</Badge>
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                                Mostrando <span className="text-primary">{filteredUsuarios.length}</span> perfiles de acceso
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-6">
                             <Pagination
                                currentPage={metadata.page || 1}
                                totalPages={metadata.totalPages || 1}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
