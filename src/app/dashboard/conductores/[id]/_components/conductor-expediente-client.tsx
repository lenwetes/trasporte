"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { UsuarioWithRelations } from "@/types";
import { cn } from "@/lib/utils";
import { 
    ChevronLeft, 
    User, 
    ShieldCheck, 
    AlertTriangle, 
    Files, 
    FileText,
    Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateCV, CVData } from "@/lib/pdf-generator-cv";
import { toast } from "sonner";

// Sub-tabs components
import { GeneralTab } from "./general-tab";
import { LicenciaTab } from "./licencia-tab";
import { SafetyTab } from "./safety-tab";
import { SiniestrosTab } from "./siniestros-multas-tab";
import { DocumentsTab } from "./documents-tab";

interface ConductorExpedienteClientProps {
    conductor: UsuarioWithRelations;
    isAdmin: boolean;
}

export function ConductorExpedienteClient({
    conductor,
    isAdmin,
}: ConductorExpedienteClientProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const activeTab = searchParams.get("tab") || "general";

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", value);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const tabs = [
        { id: "general", label: "EXPEDIENTE", icon: User },
        { id: "seguridad", label: "SEGURIDAD VIAL", icon: ShieldCheck },
        { id: "multas", label: "SINIESTRALIDAD", icon: AlertTriangle },
        { id: "documentos", label: "DOCUMENTACIÓN", icon: Files },
    ];

    return (
        <div className="max-w-[1440px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700 bg-slate-50/30 min-h-screen">
            {/* Standard Header Context */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-primary/10 p-8 shadow-sm relative overflow-hidden">
                {/* Accent line top */}
                <div className="absolute top-0 left-0 h-1 w-full bg-accent/20" />
                
                <div className="flex items-center gap-6">
                    <Link href="/dashboard/conductores">
                        <Button variant="outline" className="h-12 w-12 rounded-none border-primary/10 hover:bg-slate-50">
                            <ChevronLeft className="h-5 w-5 text-primary" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-2 w-2 rounded-full bg-accent" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Gestión de Talento Operativo</p>
                        </div>
                        <h1 className="text-3xl font-black uppercase text-primary tracking-tighter leading-none">
                            {conductor.nombres} <span className="text-primary/50">{conductor.apellidos}</span>
                        </h1>
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-2">
                            IDENTIFICACIÓN: <span className="text-primary">{conductor.numeroDocumento}</span> • ESTATUS: <span className="text-accent">CERTIFICADO</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end px-6 border-r border-primary/5">
                        <p className="text-[9px] font-black text-primary/30 uppercase tracking-widest mb-1">Margen de Confianza</p>
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-accent" />
                            <span className="text-xl font-black text-primary tracking-tighter">
                                {conductor.margenConfianza?.toString() || "100"}%
                            </span>
                        </div>
                    </div>
                    <Button 
                        onClick={async () => {
                            const tId = toast.loading("Generando expediente digital...");
                            try {
                                const cvData: CVData = {
                                    usuario: {
                                        ...conductor,
                                        fechaNacimiento: conductor.fechaNacimiento || null,
                                        tipoDocumento: conductor.tipoDocumento || "CC",
                                    },
                                    hojaVida: conductor.hojaVida,
                                    licencias: conductor.licencias.map(l => ({
                                        categoria: l.categoria,
                                        servicio: l.servicio,
                                        fechaVencimiento: l.fechaVencimiento,
                                    })),
                                    certificados: conductor.certificados.map(c => ({
                                        nombre: c.nombre,
                                        institucion: c.institucion,
                                        fechaEmision: c.fechaEmision,
                                    })),
                                    experienciasLaborales: conductor.experienciasLaborales.map(e => ({
                                        cargo: e.cargo,
                                        empresa: e.empresa,
                                        tiempoLaborado: e.tiempoLaborado,
                                        jefeInmediato: e.jefeInmediato,
                                        telefonoJefe: e.telefonoJefe,
                                    })),
                                    referenciasPersonales: conductor.referenciasPersonales.map(r => ({
                                        nombre: r.nombre,
                                        ocupacion: r.ocupacion,
                                        telefono: r.telefono,
                                    })),
                                    config: {
                                        nombreEmpresa: "COOPETRAES",
                                        colorPrimario: "#005461",
                                    }
                                };
                                await generateCV(cvData);
                                toast.success("Expediente generado", { id: tId });
                            } catch (error) {
                                toast.error("Error al generar PDF", { id: tId });
                            }
                        }}
                        className="h-14 px-8 rounded-none bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest gap-2 shadow-xl shadow-primary/10"
                    >
                        <FileText className="h-5 w-5 text-accent" /> DESCARGAR HOJA DE VIDA
                    </Button>
                </div>
            </div>

            {/* Navigation Tabs - Sharp Styling */}
            <div className="space-y-6">
                <div className="flex items-center bg-white border border-primary/10 p-1 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={cn(
                                    "h-14 px-8 flex items-center gap-3 transition-all duration-300 relative group min-w-max",
                                    isActive 
                                        ? "bg-primary text-white" 
                                        : "text-primary/40 hover:text-primary hover:bg-slate-50"
                                )}
                            >
                                <Icon className={cn("h-4 w-4", isActive ? "text-accent" : "text-primary/20")} />
                                <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]")}>
                                    {tab.label}
                                </span>
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-accent" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="bg-white border border-primary/10 shadow-sm min-h-[600px] animate-in slide-in-from-bottom-2 duration-500">
                    {activeTab === "general" && (
                        <GeneralTab conductor={conductor} />
                    )}
                    {activeTab === "seguridad" && (
                        <div className="p-0">
                            <div className="p-8 space-y-12">
                                <SafetyTab
                                    conductor={conductor}
                                    isAdmin={isAdmin}
                                />
                                <div className="border-t border-dashed border-primary/10 pt-12">
                                    <LicenciaTab conductor={conductor} />
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === "multas" && (
                        <div className="p-8">
                            <SiniestrosTab conductor={conductor} />
                        </div>
                    )}
                    {activeTab === "documentos" && (
                        <div className="p-8">
                            <DocumentsTab conductor={conductor} isAdmin={isAdmin} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
