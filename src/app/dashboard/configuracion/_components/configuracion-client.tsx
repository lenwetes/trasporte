"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ConfiguracionGeneralForm } from "@/components/forms/configuracion-general-form";
import { ConfiguracionSeguridadForm } from "@/components/forms/configuracion-seguridad-form";
import { ReglasAlertaForm } from "@/components/forms/reglas-alerta-form";
import { ExportBackupButton } from "@/components/export-backup-button";
import { MaintenanceActionsClient } from "@/components/maintenance-actions-client";

import { ReglaAlerta, ConfiguracionGlobal as DBConfig } from "@prisma/client";
import { ConfiguracionGlobal as SchemaConfig } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { 
    Settings, 
    Bell, 
    PackageOpen, 
    Mail, 
    Shield, 
    Database,
    Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ConfiguracionClientProps {
    config: DBConfig | null;
    reglas: ReglaAlerta[];
}

export function ConfiguracionClient({
    config,
    reglas,
}: ConfiguracionClientProps) {
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
        { id: "general", label: "General", icon: Settings },
        { id: "alertas", label: "Alertas", icon: Bell },
        { id: "modulos", label: "Módulos", icon: PackageOpen },
        { id: "smtp", label: "Correo", icon: Mail },
        { id: "seguridad", label: "Seguridad", icon: Shield },
        { id: "mantenimiento", label: "Base de Datos", icon: Database },
    ] as const;

    return (
        <div className="space-y-8">
            {/* Intel Bar: Navigation */}
            <div className="bg-white border border-primary/10 flex flex-col md:flex-row items-stretch justify-between">
                <div className="flex bg-slate-50 border-r border-primary/10 overflow-x-auto scroolbar-hide flex-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={cn(
                                    "px-6 py-4 flex items-center gap-3 transition-colors border-r border-primary/10 last:border-0",
                                    isActive ? "bg-primary text-white" : "hover:bg-primary/5 text-primary/60"
                                )}
                            >
                                <Icon className={cn("h-4 w-4", isActive ? "text-accent" : "text-slate-900")} />
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-widest whitespace-nowrap",
                                    isActive ? "text-white" : "text-primary/70"
                                )}>
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white border border-primary/10 min-h-[500px] p-8">
                {activeTab === "general" && (
                    <div className="max-w-4xl space-y-6">
                        <div className="pb-6 border-b border-primary/5 flex items-center gap-4">
                            <div className="h-12 w-12 bg-slate-50 border border-primary/5 flex items-center justify-center text-slate-900">
                                <Settings className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-primary uppercase tracking-widest">
                                    Configuración General
                                </h3>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mt-1">
                                    Atributos y variables maestras del sistema
                                </p>
                            </div>
                        </div>
                        <ConfiguracionGeneralForm
                            defaultValues={config as unknown as SchemaConfig}
                        />
                    </div>
                )}

                {activeTab === "alertas" && (
                    <div className="max-w-4xl space-y-6">
                        <div className="pb-6 border-b border-primary/5 flex items-center gap-4">
                            <div className="h-12 w-12 bg-slate-50 border border-primary/5 flex items-center justify-center text-slate-900">
                                <Bell className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-primary uppercase tracking-widest">
                                    Umbrales de Alerta
                                </h3>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mt-1">
                                    Anticipación automatizada para notificaciones preventivas
                                </p>
                            </div>
                        </div>
                        <ReglasAlertaForm initialReglas={reglas} />
                    </div>
                )}

                {activeTab === "modulos" && (
                    <div className="max-w-4xl space-y-6">
                        <div className="pb-6 border-b border-primary/5 flex items-center gap-4">
                            <div className="h-12 w-12 bg-slate-50 border border-primary/5 flex items-center justify-center text-slate-900">
                                <PackageOpen className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-primary uppercase tracking-widest">
                                    Control de Módulos Operativos
                                </h3>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mt-1">
                                    Habilitación y restricción de funcionalidades del core
                                </p>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            {[
                                { key: "moduloSiniestros", label: "Módulo de Siniestros Operacionales", checked: config?.moduloSiniestros },
                                { key: "moduloReportes", label: "Inteligencia de Negocios y Reportes", checked: config?.moduloReportes },
                                { key: "moduloConductores", label: "Gestión de Conductores y Personal", checked: config?.moduloConductores },
                            ].map((mod) => (
                                <div key={mod.key} className="border border-primary/10 bg-slate-50 flex items-center justify-between p-6">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-primary">{mod.label}</span>
                                    {mod.checked ? (
                                        <Badge className="bg-primary hover:bg-primary text-white font-black uppercase tracking-widest rounded-none">HABILITADO</Badge>
                                    ) : (
                                        <Badge className="bg-slate-300 text-slate-800 font-black uppercase tracking-widest rounded-none">DESHABILITADO</Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "smtp" && (
                    <div className="max-w-4xl space-y-6">
                        <div className="pb-6 border-b border-primary/5 flex items-center gap-4">
                            <div className="h-12 w-12 bg-slate-50 border border-primary/5 flex items-center justify-center text-slate-900">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-primary uppercase tracking-widest">
                                    Protocolo de Correspondencia (SMTP)
                                </h3>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mt-1">
                                    Configuraciones del Servidor de Correo Electrónico Saliente
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 border border-primary/5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Host SMTP</label>
                                <input defaultValue={config?.smtpHost || ""} className="w-full h-12 bg-white border border-primary/10 px-4 text-xs font-bold text-primary focus:outline-none focus:border-accent" disabled />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Puerto de Transmisión</label>
                                <input defaultValue={config?.smtpPort || ""} type="number" className="w-full h-12 bg-white border border-primary/10 px-4 text-xs font-bold text-primary focus:outline-none focus:border-accent" disabled />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Credencial Principal</label>
                                <input defaultValue={config?.smtpUser || ""} className="w-full h-12 bg-white border border-primary/10 px-4 text-xs font-bold text-primary focus:outline-none focus:border-accent" disabled />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Llave de Acceso</label>
                                <input type="password" placeholder="••••••••" className="w-full h-12 bg-white border border-primary/10 px-4 text-xs font-bold text-primary focus:outline-none focus:border-accent" disabled />
                            </div>
                        </div>
                        <div className="flex gap-4 pt-4 border-t border-primary/5">
                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Aviso: Modificadores bloqueados en entorno de producción. Contacte soporte IT.</span>
                        </div>
                    </div>
                )}

                {activeTab === "seguridad" && (
                    <div className="max-w-4xl space-y-6">
                        <div className="pb-6 border-b border-primary/5 flex items-center gap-4">
                            <div className="h-12 w-12 bg-slate-50 border border-primary/5 flex items-center justify-center text-slate-900">
                                <Shield className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-primary uppercase tracking-widest">
                                    Políticas de Seguridad
                                </h3>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mt-1">
                                    Restricciones e Integridad de Accesos
                                </p>
                            </div>
                        </div>
                        <ConfiguracionSeguridadForm
                            defaultValues={config as unknown as SchemaConfig}
                        />
                    </div>
                )}

                {activeTab === "mantenimiento" && (
                    <div className="max-w-4xl space-y-8">
                        {/* Respaldos */}
                        <div className="space-y-6 border border-primary/10 p-8 bg-slate-50/50">
                            <div className="flex items-center gap-4 border-b border-primary/5 pb-4">
                                <Database className="h-5 w-5 text-primary" />
                                <div>
                                    <h3 className="text-sm font-black text-primary uppercase tracking-widest">
                                        Arquitectura de Respaldo
                                    </h3>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] mt-1">
                                        Copias de seguridad maestras
                                    </p>
                                </div>
                            </div>
                            <ExportBackupButton />
                        </div>

                        {/* Herramientas Críticas */}
                        <div className="space-y-6 border border-red-500/20 p-8 bg-red-50/10">
                            <div className="flex items-center gap-4 border-b border-red-500/10 pb-4">
                                <Zap className="h-5 w-5 text-red-600" />
                                <div>
                                    <h3 className="text-sm font-black text-red-700 uppercase tracking-widest">
                                        Comandos Críticos ROOT
                                    </h3>
                                    <p className="text-[10px] text-red-600/60 uppercase font-bold tracking-[0.2em] mt-1">
                                        Operaciones destructivas y de bajo nivel
                                    </p>
                                </div>
                            </div>
                            <MaintenanceActionsClient />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
