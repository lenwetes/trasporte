"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { FuecList } from "./fuec-list";
import { PlanillaFUEC, ResolucionFUEC } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  Settings, 
  FileStack, 
  CheckCircle, 
  Clock, 
  XCircle,
  FileText,
  ShieldCheck,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface FuecWithRelations extends PlanillaFUEC {
    resolucion?: ResolucionFUEC | null;
}

interface FuecPageClientProps {
    planillas: FuecWithRelations[];
    isAdmin: boolean;
    stats: {
        total: number;
        activo: number;
        vencido: number;
        anulado: number;
    };
}

export function FuecPageClient({ planillas, isAdmin, stats }: FuecPageClientProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPlanillas = useMemo(() => {
        if (!searchTerm) return planillas;
        const term = searchTerm.toLowerCase();
        return planillas.filter((p) => 
            p.consecutivo.toLowerCase().includes(term) ||
            p.vehiculoId?.toLowerCase().includes(term) ||
            (p.ruta as any)?.some?.((r: any) => 
                r.origen?.toLowerCase().includes(term) || 
                r.destino?.toLowerCase().includes(term)
            )
        );
    }, [searchTerm, planillas]);

    const statCards = [
        { 
            label: "Total Planillas", 
            value: stats.total, 
            icon: FileStack, 
            color: "text-primary",
            description: "EXTRACTOS GENERADOS"
        },
        { 
            label: "Vigentes", 
            value: stats.activo, 
            icon: CheckCircle, 
            color: "text-accent",
            description: "OPERACIÓN AUTORIZADA"
        },
        { 
            label: "Vencidas", 
            value: stats.vencido, 
            icon: Clock, 
            color: "text-red-500",
            description: "CADUCIDAD ALCANZADA"
        },
        { 
            label: "Anuladas", 
            value: stats.anulado, 
            icon: XCircle, 
            color: "text-slate-900",
            description: "SIN VALIDEZ JURÍDICA"
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-700 p-6 bg-slate-50/30 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-primary/10 p-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 flex items-center justify-center border border-primary/10 bg-slate-50 text-primary">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight text-primary flex items-center gap-3">
                            <ShieldCheck className="h-6 w-6 text-accent" />
                            Operaciones FUEC
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mt-1">
                            Gestión Jurídica, Contractual y Extractos
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative hidden xl:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-900" />
                        <Input 
                            placeholder="BUSCAR PLANILLA O RUTA..." 
                            className="pl-9 h-10 w-64 rounded-none border-primary/10 text-xs font-black uppercase bg-slate-50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {isAdmin && (
                        <Link href="/dashboard/fuec/configuracion">
                            <Button variant="outline" className="h-10 border-primary/10 text-[10px] font-black uppercase tracking-widest px-6 hover:bg-slate-50">
                                <Settings className="h-3.5 w-3.5 mr-2 opacity-60" />
                                Ajustes
                            </Button>
                        </Link>
                    )}
                    <Link href="/dashboard/fuec/nueva">
                        <Button className="h-10 px-6 rounded-none bg-accent hover:bg-accent/90 text-[10px] font-black uppercase tracking-widest">
                            <Plus className="h-3.5 w-3.5 mr-2" />
                            Generar FUEC
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, i) => (
                        <Card key={i} className="rounded-none border-primary/10 bg-white shadow-sm hover:border-primary/30 transition-all group overflow-hidden border-none shadow-md">
                            <CardContent className="p-6 relative">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/[0.02] -translate-y-1/2 translate-x-1/2 rotate-45 group-hover:scale-110 transition-transform" />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("h-8 w-8 flex items-center justify-center border border-current/10 bg-current/5", stat.color)}>
                                                <stat.icon className="h-4 w-4" />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">
                                                {stat.label}
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className={cn("text-3xl font-black tracking-tighter leading-none", stat.color)}>
                                                {stat.value}
                                            </h3>
                                            <p className="text-[8px] font-bold text-slate-900 uppercase tracking-widest opacity-60">
                                                {stat.description}
                                            </p>
                                        </div>
                                    </div>
                                    <stat.icon className={cn("h-12 w-12 opacity-5 absolute -right-2 top-8", stat.color)} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="rounded-none border-primary/10 bg-white shadow-2xl overflow-hidden border-none shadow-xl">
                    <div className="p-6 border-b border-primary/5 bg-slate-50/50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-slate-950" />
                            <h3 className="text-xs font-black text-slate-950 uppercase tracking-widest italic">Consolidado Nacional de Extractos</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-1.5 w-1.5 bg-accent rounded-full animate-pulse" />
                            <span className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em]">FUEC VIGENTES</span>
                        </div>
                    </div>
                    <div className="p-0">
                        <FuecList planillas={filteredPlanillas} />
                    </div>
                </Card>
            </div>
        </div>
    );
}
