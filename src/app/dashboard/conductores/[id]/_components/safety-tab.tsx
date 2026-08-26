"use client";

import { useState, useEffect } from "react";
import {
    getExamenesConductor,
    getEntregasConductor,
    getConfiguracionGlobal,
} from "@/actions";
import {
    SafetySectionClient,
    ExamenMedicoDisplay,
    EntregaDotacionDisplay,
} from "@/app/dashboard/usuarios/[id]/_components/safety-section-client";
import { ConfiguracionGlobal } from "@prisma/client";
import { 
    ShieldCheck, 
    Stethoscope, 
    Package, 
    ClipboardCheck, 
    Activity,
    AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SafetyTabProps {
    conductor: { id: string; nombres: string; apellidos: string };
    isAdmin: boolean;
}

export function SafetyTab({ conductor, isAdmin }: SafetyTabProps) {
    const [examenes, setExamenes] = useState<ExamenMedicoDisplay[]>([]);
    const [entregas, setEntregas] = useState<EntregaDotacionDisplay[]>([]);
    const [companyConfig, setCompanyConfig] =
        useState<ConfiguracionGlobal | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [examenesRes, entregasRes, configRes] = await Promise.all([
                    getExamenesConductor(conductor.id),
                    getEntregasConductor(conductor.id),
                    getConfiguracionGlobal(),
                ]);

                if (examenesRes.success)
                    setExamenes(examenesRes.data as ExamenMedicoDisplay[]);
                if (entregasRes.success)
                    setEntregas(entregasRes.data as EntregaDotacionDisplay[]);
                if (configRes.success)
                    setCompanyConfig(
                        (configRes.data as ConfiguracionGlobal) || null,
                    );
            } catch (error) {
                console.error("Error fetching safety data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [conductor.id]);

    if (loading) {
        return (
            <div className="p-20 space-y-4 flex flex-col items-center justify-center">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-4 w-64" />
                <p className="text-[10px] font-black uppercase text-primary/30 tracking-widest">Sincronizando Historial de Seguridad...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Intel Bar: Safety Context */}
            <div className="bg-slate-50 border-b border-primary/5 p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="max-w-2xl space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <ShieldCheck className="h-5 w-5 text-accent" />
                        </div>
                        <h3 className="text-xl font-black text-primary uppercase tracking-tight leading-none pt-1">
                            Seguridad Industrial & Salud Ocupacional
                        </h3>
                    </div>
                    <p className="text-[11px] font-medium text-muted-foreground uppercase leading-relaxed tracking-wide">
                        Gestión integral de la salud ocupacional, exámenes médicos de ingreso y entrega periódica de dotación (EPP) para dar cumplimiento al <span className="text-primary font-black">Plan Estratégico de Seguridad Vial (PESV)</span>.
                    </p>
                </div>

                <div className="flex gap-4">
                    <MetricBox 
                        icon={Stethoscope} 
                        label="Exámenes" 
                        value={examenes.length} 
                        active={examenes.length > 0} 
                    />
                    <MetricBox 
                        icon={Package} 
                        label="Entregas" 
                        value={entregas.length} 
                        active={entregas.length > 0} 
                    />
                </div>
            </div>

            <div className="p-0">
                <SafetySectionClient
                    conductorId={conductor.id}
                    conductorNombre={`${conductor.nombres} ${conductor.apellidos}`}
                    initialExamenes={examenes}
                    initialEntregas={entregas}
                    isAdmin={isAdmin}
                    companyConfig={companyConfig}
                />
            </div>
        </div>
    );
}

function MetricBox({ icon: Icon, label, value, active }: { icon: any, label: string, value: number, active: boolean }) {
    return (
        <Card className="rounded-none border-primary/5 shadow-sm min-w-[140px] overflow-hidden group hover:border-accent transition-all duration-300">
            <CardContent className="p-6 flex flex-col items-center justify-center gap-2">
                <Icon className={cn("h-4 w-4 mb-1 transition-colors duration-300", active ? "text-accent" : "text-primary/20")} />
                <span className="text-[9px] font-black text-primary/30 uppercase tracking-[0.2em]">{label}</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-primary tracking-tighter">{value}</span>
                    <Badge variant="outline" className="text-[8px] font-black text-accent p-0 uppercase border-none">TOTAL</Badge>
                </div>
            </CardContent>
        </Card>
    );
}
