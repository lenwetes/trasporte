"use client";

import { useMaintenance } from "../hooks/use-maintenance";
import { MaintenanceModals } from "./maintenance-modals";
import { OperationsTab } from "./tabs/operations-tab";
import { MaintenancePredictionsTab } from "./tabs/maintenance-predictions-tab";
import { MaintenancePlansTab } from "./tabs/maintenance-plans-tab";
import { MaintenanceHistoryTab } from "./tabs/maintenance-history-tab";
import { MaintenanceReviewTab } from "./tabs/maintenance-review-tab";
import { 
    Wrench, 
    Search, 
    AlertCircle, 
    Calendar, 
    History, 
    FileText, 
    BrainCircuit, 
    Plus, 
    Settings,
    ArrowLeft,
    ShieldAlert,
    Sparkles,
    Activity,
    Save,
    LayoutDashboard
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MantenimientoView() {
    const maintenance = useMaintenance();
    const {
        activeTab,
        setActiveTab,
        alertas,
        ordenesRevision,
        searchTerm,
        setSearchTerm,
        planes,
        vehiculos,
        isRegisterModalOpen,
        setIsRegisterModalOpen,
        isPlanModalOpen,
        setIsPlanModalOpen,
        loadData
    } = maintenance;

    const tabs = [
        { id: "operaciones", label: "Operaciones", icon: Wrench },
        { id: "inteligencia", label: "Predicciones IA", icon: BrainCircuit },
        { id: "planes", label: "Planes Preventivos", icon: Calendar },
        { id: "historial", label: "Historial de Servicio", icon: History },
        { id: "reportes", label: "Inspecciones", icon: FileText },
    ] as const;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-1000">
            <DashboardHeader 
                title="Mantenimiento & Diagnóstico"
                tagline="CENTRO DE GESTIÓN TÉCNICA"
                subtitle="Control de flota operativa preventiva bajo protocolos de auditoría"
                icon={Wrench}
                actions={
                    <div className="flex flex-wrap gap-4 relative z-10">
                        <Button 
                            onClick={() => setIsRegisterModalOpen(true)}
                            className="h-14 border-primary/10 rounded-none px-8 text-[11px] font-black uppercase tracking-[0.2em] gap-3 bg-primary text-white hover:bg-primary/90 transition-all hover:shadow-premium hover:-translate-y-0.5 shadow-xl"
                        >
                            <Plus className="h-4 w-4 text-accent" />
                            Nuevo Registro
                        </Button>
                        <Button 
                            onClick={() => setIsPlanModalOpen(true)}
                            variant="outline"
                            className="h-14 border-primary/10 rounded-none px-8 text-[11px] font-black uppercase tracking-[0.2em] gap-3 bg-white hover:bg-slate-50 transition-all hover:shadow-premium hover:-translate-y-0.5 shadow-sm"
                        >
                            <Settings className="h-4 w-4 text-primary opacity-40" />
                            Configurar Planes
                        </Button>
                    </div>
                }
            />

            {/* Intel Bar: Navigation and Search */}
            <div className="bg-white border border-primary/10 flex flex-col md:flex-row items-stretch justify-between shadow-sm">
                <div className="flex bg-slate-50 border-r border-primary/10 overflow-x-auto scrollbar-hide">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "px-8 py-5 flex items-center gap-3 transition-colors border-r border-primary/10 last:border-0 relative",
                                    isActive ? "bg-white" : "hover:bg-primary/5 text-primary/60"
                                )}
                            >
                                {isActive && <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary" />}
                                <Icon className={cn("h-4 w-4", isActive ? "text-secondary" : "text-slate-900")} />
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-widest whitespace-nowrap",
                                    isActive ? "text-primary" : "text-primary/70"
                                )}>
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex-1 flex items-center px-6 py-4 md:py-0 md:min-w-[400px] border-t md:border-t-0 border-primary/10 bg-white">
                    <div className="relative w-full group">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20 group-focus-within:text-secondary transition-colors" />
                        <Input 
                            placeholder="FILTRAR POR PLACA O IDENTIFICADOR DE FLOTA..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-12 pl-10 rounded-none border-none bg-transparent text-[11px] font-black uppercase tracking-widest focus-visible:ring-0 w-full placeholder:text-primary/20"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white border border-primary/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-10 lg:p-14">
                {activeTab === "operaciones" && (
                    <div className="space-y-12">
                        {/* Status Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white border border-slate-200 radius-0 shadow-sm overflow-hidden group">
                                <div className="bg-red-50/50 border-b border-red-500/10 px-6 py-4 flex items-center gap-3">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <h3 className="text-[10px] font-black text-red-900 uppercase tracking-[0.2em]">Sistemas con Alertas Críticas</h3>
                                </div>
                                <div className="p-8 flex items-baseline gap-4">
                                    <span className="text-6xl font-black text-red-600 font-mono tracking-tighter tabular-nums leading-none">
                                        {alertas.length}
                                    </span>
                                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest italic">Eventos reportados</span>
                                </div>
                                <div className="h-1 w-full bg-slate-50 relative">
                                    <div 
                                        className="absolute inset-y-0 left-0 bg-red-600 transition-all duration-1000" 
                                        style={{ width: alertas.length > 0 ? "100%" : "0%" }} 
                                    />
                                </div>
                            </div>
                            
                            <div className="bg-white border border-slate-200 radius-0 shadow-sm overflow-hidden group">
                                <div className="bg-slate-50 border-b border-primary/5 px-6 py-4 flex items-center gap-3">
                                    <Activity className="h-4 w-4 text-secondary" />
                                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Órdenes en Taller / Revisión</h3>
                                </div>
                                <div className="p-8 flex items-baseline gap-4">
                                    <span className="text-6xl font-black text-primary font-mono tracking-tighter tabular-nums leading-none">
                                        {ordenesRevision.length}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest italic">Flujo activo de servicio</span>
                                </div>
                                <div className="h-1 w-full bg-slate-50 relative">
                                    <div 
                                        className="absolute inset-y-0 left-0 bg-secondary transition-all duration-1000" 
                                        style={{ width: ordenesRevision.length > 0 ? "100%" : "0%" }} 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* actual Tab Content */}
                        <div className="pt-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                            <OperationsTab 
                                alertas={alertas}
                                ordenesRevision={ordenesRevision}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                onIssueOrder={maintenance.handleIssueOrder}
                                onDirectRegister={(a) => {
                                    maintenance.setSelectedAlerta(a);
                                    maintenance.setIsValidationModalOpen(true);
                                }}
                                onApprove={(id) => {
                                    maintenance.setSelectedOrdenId(id);
                                    maintenance.setIsCompleteModalOpen(true);
                                }}
                                onViewProof={maintenance.handlePrintOrder}
                            />
                        </div>
                    </div>
                )}
                
                {activeTab === "inteligencia" && (
                    <MaintenancePredictionsTab 
                        predictions={maintenance.predictions}
                        searchTerm={searchTerm}
                    />
                )}

                {activeTab === "planes" && (
                    <MaintenancePlansTab 
                        planes={planes}
                        searchTerm={searchTerm}
                    />
                )}

                {activeTab === "historial" && (
                    <MaintenanceHistoryTab 
                        historial={maintenance.historial}
                        searchTerm={searchTerm}
                    />
                )}

                {activeTab === "reportes" && (
                    <MaintenanceReviewTab 
                        ordenes={ordenesRevision}
                        onRefresh={loadData}
                    />
                )}
            </div>

            {/* Modals Container */}
            <MaintenanceModals 
                {...maintenance}
            />
        </div>
    );
}
