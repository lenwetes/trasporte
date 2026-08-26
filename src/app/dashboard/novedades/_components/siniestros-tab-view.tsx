"use client";

import Link from "next/link";
import { Search, Filter, History, AlertCircle, ShieldAlert, BadgeInfo, Activity } from "lucide-react";
import type { SiniestroWithRelations } from "@/types";
import { SiniestrosStats } from "./siniestros-stats";
import { SiniestrosList } from "./siniestros-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SiniestrosTabViewProps {
    siniestros: SiniestroWithRelations[];
    viewSiniestros: string;
    query: string;
}

export function SiniestrosTabView({
    siniestros,
    viewSiniestros,
    query,
}: SiniestrosTabViewProps) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header / Stats Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h2 className="text-xl font-black text-primary uppercase tracking-tighter">Auditoría de Siniestralidad</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Activity className="h-3 w-3 text-accent" /> Análisis de Riesgo Operacional v2.4
                    </p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-none border border-primary/5">
                    <Link href="/dashboard/novedades?tab=siniestros&view=activos">
                        <Button
                            variant="ghost"
                            className={cn(
                                "h-9 rounded-none gap-2 px-4 text-[10px] font-black uppercase tracking-widest transition-all",
                                viewSiniestros === "activos" 
                                    ? "bg-white text-primary shadow-sm" 
                                    : "text-muted-foreground hover:bg-white/50"
                            )}
                        >
                            <AlertCircle className="h-3.5 w-3.5" /> Pendientes
                        </Button>
                    </Link>
                    <Link href="/dashboard/novedades?tab=siniestros&view=historial">
                        <Button
                            variant="ghost"
                            className={cn(
                                "h-9 rounded-none gap-2 px-4 text-[10px] font-black uppercase tracking-widest transition-all",
                                viewSiniestros === "historial" 
                                    ? "bg-white text-primary shadow-sm" 
                                    : "text-muted-foreground hover:bg-white/50"
                            )}
                        >
                            <History className="h-3.5 w-3.5" /> Historial
                        </Button>
                    </Link>
                </div>
            </div>

            <SiniestrosStats siniestros={siniestros} />

            {/* Quick Filter Bar */}
            <div className="bg-slate-50 border border-primary/5 p-4 flex items-center gap-4">
                <form action="/dashboard/novedades" method="GET" className="flex-1 flex items-center gap-3 bg-white border border-primary/10 px-4 h-12 focus-within:border-primary/30 transition-all">
                    <Search className="h-4 w-4 text-primary" />
                    <Input
                        name="q"
                        placeholder="Buscar por placa, conductor o lugar del evento..."
                        defaultValue={query}
                        className="border-none shadow-none focus-visible:ring-0 text-xs font-medium uppercase tracking-tight h-full"
                    />
                    <input type="hidden" name="tab" value="siniestros" />
                    <input type="hidden" name="view" value={viewSiniestros} />
                    <button type="submit" className="hidden">Filter</button>
                </form>
                
                <Button variant="outline" className="h-12 border-primary/10 rounded-none px-6 text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-primary/5">
                    <Filter className="h-3.5 w-3.5" /> Parámetros
                </Button>
            </div>

            <div className="animate-in slide-in-from-bottom-4 duration-500">
                <SiniestrosList siniestros={siniestros} />
            </div>
        </div>
    );
}
