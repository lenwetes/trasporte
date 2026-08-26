"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
    getFinanceSettings,
    updateFinanceConfig,
    triggerMonthlyObligations,
} from "@/actions/finance/settings";
import { toast } from "sonner";
import { 
    Settings, 
    FileText, 
    PiggyBank, 
    ArrowRightLeft,
    Wallet,
    ChevronRight,
    Activity,
    Database,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ConceptoDialog, Concepto } from "@/components/modules/finance/concepto-dialog";
import { ResolucionDialog, Resolucion } from "@/components/modules/finance/resolucion-dialog";
import type { ConfigForm } from "./_components/types";

// Componentes de Pestañas
import { CarteraTab } from "./_components/cartera-tab";
import { LiquidezTab } from "./_components/liquidez-tab";
import { FondoTab } from "./_components/fondo-tab";
import { ConceptosTab } from "./_components/conceptos-tab";
import { ResolucionesTab } from "./_components/resoluciones-tab";
import { SaldosInicialesTab } from "./_components/saldos-iniciales-tab";

interface FinanceSettingsData {
    configuracionGlobal: {
        montoCuotaAdministracion: number;
        umbralBloqueoMora: number;
        porcentajeMoraDiaria: number;
        cuentaPrestamosId: string | null;
        cuentaCajaId: string | null;
        cuentaBancosId: string | null;
    };
    conceptos: Concepto[];
    resoluciones: Resolucion[];
}

export default function FinanceSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<FinanceSettingsData | null>(null);
    const [activeTab, setActiveTab] = useState("general");

    const [configForm, setConfigForm] = useState<ConfigForm>({
        montoCuotaAdministracion: 0,
        umbralBloqueoMora: 0,
        porcentajeMoraDiaria: 0,
        cuentaPrestamosId: "",
        cuentaCajaId: "",
        cuentaBancosId: ""
    });

    // Dialog State
    const [openConcept, setOpenConcept] = useState(false);
    const [editingConcept, setEditingConcept] = useState<Concepto | null>(null);
    const [openResolucion, setOpenResolucion] = useState(false);
    const [editingResolucion, setEditingResolucion] = useState<Resolucion | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getFinanceSettings();
            if (res.success && res.data) {
                const settingsData = res.data as unknown as FinanceSettingsData;
                setData(settingsData);
                if (settingsData?.configuracionGlobal) {
                    const conf = settingsData.configuracionGlobal;
                    setConfigForm({
                        montoCuotaAdministracion: Number(conf.montoCuotaAdministracion || 0),
                        umbralBloqueoMora: Number(conf.umbralBloqueoMora || 0),
                        porcentajeMoraDiaria: Number(conf.porcentajeMoraDiaria || 0),
                        cuentaPrestamosId: conf.cuentaPrestamosId || "",
                        cuentaCajaId: conf.cuentaCajaId || "",
                        cuentaBancosId: conf.cuentaBancosId || ""
                    });
                }
            }
        } catch (error) {
            toast.error("Error al cargar configuración técnica");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSaveConfig = async () => {
        setLoading(true);
        const res = await updateFinanceConfig({
            montoCuotaAdministracion: configForm.montoCuotaAdministracion,
            umbralBloqueoMora: configForm.umbralBloqueoMora,
            porcentajeMoraDiaria: configForm.porcentajeMoraDiaria,
            cuentaPrestamosId: configForm.cuentaPrestamosId,
            cuentaCajaId: configForm.cuentaCajaId,
            cuentaBancosId: configForm.cuentaBancosId
        });

        if (res.success) {
            toast.success("Parámetros del sistema actualizados correctamente");
            await loadData();
        } else {
            const errorMessage = typeof res === 'object' && res !== null && 'error' in res 
                ? String(res.error) 
                : "Fallo en la sincronización de parámetros";
            toast.error(errorMessage);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleEditConcept = (concept: Concepto) => {
        setEditingConcept(concept);
        setOpenConcept(true);
    };

    const handleNewConcept = () => {
        setEditingConcept(null);
        setOpenConcept(true);
    };

    const handleEditResolucion = (resolucion: Resolucion) => {
        setEditingResolucion(resolucion);
        setOpenResolucion(true);
    };

    const handleNewResolucion = () => {
        setEditingResolucion(null);
        setOpenResolucion(true);
    };

    const navigation = [
        { id: "general", label: "Parámetros Cartera", icon: Settings, desc: "Globales" },
        { id: "liquidez", label: "Flujos de Liquidez", icon: Wallet, desc: "Operación" },
        { id: "fondo", label: "Fondo de Préstamos", icon: PiggyBank, desc: "Créditos" },
        { id: "puc", label: "Mapeo PUC", icon: ArrowRightLeft, desc: "Libro Mayor" },
        { id: "resoluciones", label: "Resoluciones", icon: FileText, desc: "Fiscal" },
        { id: "saldos", label: "Saldos Iniciales", icon: Database, desc: "Migración" },
    ];

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-white/50 w-full max-w-full relative">
            <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab} 
                className="flex flex-col lg:flex-row w-full h-full relative"
            >
                {/* Lateral Navigation */}
                <div className="w-full lg:w-80 bg-white border-b lg:border-r border-slate-200 flex flex-col shrink-0">
                    <div className="p-6 md:p-8 border-b border-slate-100">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-1.5 bg-primary text-white rounded-none font-black italic text-[12px] shadow-lg shadow-primary/20">CPT</div>
                            <h1 className="text-xl font-black text-primary uppercase tracking-tighter italic">CONSOLA_FINANCIERA</h1>
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">Configuración Central del Sistema</p>
                    </div>

                    <TabsList className="flex flex-row lg:flex-col h-auto bg-transparent p-2 md:p-4 gap-1 items-stretch overflow-x-auto lg:overflow-x-visible no-scrollbar">
                        {navigation.map((item) => (
                            <TabsTrigger 
                                key={item.id}
                                value={item.id}
                                className={cn(
                                    "flex items-center justify-between min-w-[160px] lg:min-w-0 w-full h-12 lg:h-14 px-4 rounded-none transition-all duration-300",
                                    "border-b-2 lg:border-b-0 lg:border-l-4 border-transparent hover:bg-slate-50 group shrink-0",
                                    "data-[state=active]:border-primary data-[state=active]:bg-primary/[0.03] data-[state=active]:shadow-sm"
                                )}
                            >
                                <div className="flex items-center gap-3 lg:gap-4">
                                    <div className={cn(
                                        "p-1.5 lg:p-2 rounded-none transition-colors group-hover:bg-white group-hover:shadow-sm",
                                        activeTab === item.id ? "bg-white shadow-md text-primary" : "text-slate-900"
                                    )}>
                                        <item.icon className="h-3.5 w-3.5 lg:h-4 w-4" />
                                    </div>
                                    <div className="text-left">
                                        <p className={cn(
                                            "text-[10px] lg:text-[11px] font-black uppercase tracking-wider leading-none mb-0.5 lg:mb-1",
                                            activeTab === item.id ? "text-primary" : "text-slate-600"
                                        )}>
                                            {item.label}
                                        </p>
                                        <p className="hidden md:block text-[7px] lg:text-[8px] font-bold uppercase text-slate-900 tracking-widest">{item.desc}</p>
                                    </div>
                                </div>
                                <ChevronRight className={cn(
                                    "hidden lg:block h-4 w-4 transition-transform",
                                    activeTab === item.id ? "text-primary opacity-100 translate-x-1" : "text-slate-200 opacity-0"
                                )} />
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="mt-auto p-4 md:p-8 border-t border-slate-100 bg-slate-50/50 hidden lg:block">
                         <div className="flex items-center gap-4 text-slate-900 mb-4">
                            <Activity size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Estado del Servidor</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 bg-emerald-500 rounded-none shadow-[0_0_8_rgba(16,185,129,0.5)]"></div>
                            <span className="text-[9px] font-bold text-slate-900 uppercase tracking-widest leading-none">En Línea (Nodo Maestro)</span>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <main className="flex-1 overflow-x-hidden p-4 md:p-8 lg:p-12 relative bg-slate-50/30">
                    <div className="w-full space-y-8 md:space-y-12">
                        
                        <TabsContent value="general" className="m-0">
                            <CarteraTab 
                                configForm={configForm}
                                setConfigForm={setConfigForm}
                                loading={loading}
                                handleSaveConfig={handleSaveConfig}
                            />
                        </TabsContent>

                         <TabsContent value="liquidez" className="m-0">
                            <LiquidezTab 
                                configForm={configForm}
                                setConfigForm={setConfigForm}
                                loading={loading}
                                handleSaveConfig={handleSaveConfig}
                            />
                        </TabsContent>

                         <TabsContent value="fondo" className="m-0">
                             <FondoTab 
                                 configForm={configForm}
                                 setConfigForm={setConfigForm}
                                 loading={loading}
                                 handleSaveConfig={handleSaveConfig}
                             />
                         </TabsContent>

                        <TabsContent value="puc" className="m-0">
                            <ConceptosTab 
                                conceptos={data?.conceptos || []}
                                handleEditConcept={handleEditConcept}
                                handleNewConcept={handleNewConcept}
                            />
                        </TabsContent>

                        <TabsContent value="resoluciones" className="m-0">
                            <ResolucionesTab 
                                resoluciones={data?.resoluciones || []}
                                handleEditResolucion={handleEditResolucion}
                                handleNewResolucion={handleNewResolucion}
                            />
                        </TabsContent>

                        <TabsContent value="saldos" className="m-0">
                            <SaldosInicialesTab configForm={configForm} />
                        </TabsContent>
                    </div>
                </main>
            </Tabs>

            {/* Catalog & Fiscal Dialogs */}
            <ConceptoDialog 
                open={openConcept}
                setOpen={setOpenConcept}
                initialData={editingConcept}
                onSuccess={loadData}
            />
            <ResolucionDialog 
                open={openResolucion}
                setOpen={setOpenResolucion}
                initialData={editingResolucion}
                onSuccess={loadData}
            />
        </div>
    );
}
