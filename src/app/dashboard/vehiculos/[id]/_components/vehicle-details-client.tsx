"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { DocumentsTab } from "./documents-tab";
import { DriversTab } from "./drivers-tab";
import { MaintenanceHistory } from "./maintenance-history";
import { SiniestrosHistory } from "./siniestros-history";
import { PreoperacionalHistory } from "./preoperacional-history";
import { GeneralTab } from "./general-tab";
import { SparePartsTab } from "./spare-parts-tab";
import { VehiculoWithRelations, PreoperacionalWithRelations } from "@/types";
import { formatPlaca, cn } from "@/lib/utils";
import { DeleteVehicleButton } from "@/components/delete-vehicle-button";
import {
    Truck,
    ArrowLeft,
    Settings,
    ChevronRight,
    User,
    FileText,
    Users,
    Wrench,
    Package,
    AlertTriangle,
    BarChart3,
    Database,
    Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


interface VehicleDetailsClientProps {
    vehiculo: VehiculoWithRelations;
    preoperacionales: PreoperacionalWithRelations[];
}

export function VehicleDetailsClient({
    vehiculo,
    preoperacionales,
}: VehicleDetailsClientProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const activeTab = searchParams.get("tab") || "general";

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", value);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const activeVinculacion = vehiculo.vinculaciones?.find((v) => v.activo);
    const activeConductor = activeVinculacion?.conductor;

    const tabs = [
        { id: "general", label: "Ficha Técnica", icon: FileText },
        { id: "documentos", label: "Documentación", icon: Shield },
        { id: "conductores", label: "Historial Personal", icon: Users },
        { id: "mantenimiento", label: "Servicios Técnicos", icon: Wrench },
        { id: "kardex", label: "Kardex Taller", icon: Package },
        { id: "siniestros", label: "Incidencias Viales", icon: AlertTriangle },
        { id: "preoperacional", label: "Analytics PESV", icon: BarChart3 },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-1000">
            {/* Professional Toolbar Header */}
            <header className="bg-white border border-slate-200 p-4 px-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
                <div className="flex items-center gap-6 w-full md:w-auto">
                    {/* Back Action */}
                    <Link href="/dashboard/vehiculos">
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-none hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                            <ArrowLeft className="h-5 w-5 text-slate-900" />
                        </Button>
                    </Link>

                    <div className="flex items-center gap-5">
                        {/* Status Icon */}
                        <div className="h-12 w-12 flex items-center justify-center bg-cyan-950 text-white shadow-xl">
                            <Truck className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none">
                                    {formatPlaca(vehiculo.placa)}
                                </h1>
                                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none rounded-none text-[9px] font-black tracking-widest px-2 uppercase">
                                    ACTIVO
                                </Badge>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mt-2 flex items-center gap-2">
                                <span className="h-[1px] w-5 bg-slate-300" />
                                {vehiculo.marca} {vehiculo.modelo} · {vehiculo.clase?.replace("_", " ")}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                    {activeConductor && (
                        <Link href={`/dashboard/conductores/${activeConductor?.id}`} className="hidden lg:block">
                            <div className="flex items-center gap-4 p-2 px-4 bg-slate-50 border border-slate-100 hover:border-cyan-200 transition-all group">
                                <div className="h-10 w-10 bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-cyan-600 group-hover:border-cyan-100 transition-all font-black text-xs">
                                    {(activeConductor?.nombres || "")[0]}{(activeConductor?.apellidos || "")[0]}
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] font-black text-slate-950 uppercase tracking-widest">Operador Asignado</p>
                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">
                                        {(activeConductor?.nombres || "").split(" ")[0]} {(activeConductor?.apellidos || "").split(" ")[0]}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    )}

                    <div className="flex items-center gap-2">
                        <Link href={`/dashboard/vehiculos/${vehiculo.id}/editar`}>
                            <Button variant="outline" className="h-11 rounded-none border-slate-200 text-slate-900 gap-3 px-6 hover:bg-slate-50">
                                <Settings className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Configurar</span>
                            </Button>
                        </Link>
                        <DeleteVehicleButton vehicleId={vehiculo.id} placa={vehiculo.placa} />
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="bg-white border border-slate-200 shadow-2xl min-h-[700px] flex flex-col">
                {/* Section Selectors (Tabs) */}
                <nav className="flex items-center border-b border-slate-100 bg-slate-50/30 overflow-x-auto scrollbar-none gap-1 p-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={cn(
                                    "px-8 py-4 flex items-center gap-3 transition-all relative whitespace-nowrap group",
                                    activeTab === tab.id 
                                        ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
                                        : "text-slate-700 hover:text-slate-900 hover:bg-white/50"
                                )}
                            >
                                <Icon className={cn(
                                    "h-4 w-4 transition-transform group-hover:scale-110",
                                    activeTab === tab.id ? "text-cyan-700" : "text-slate-900"
                                )} />
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-widest",
                                    activeTab === tab.id ? "opacity-100" : "opacity-100 text-slate-900"
                                )}>
                                    {tab.label}
                                </span>
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-700" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="flex-1 p-8 lg:p-12">
                    {activeTab === "general" && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <GeneralTab vehiculo={vehiculo} preoperacionales={preoperacionales} />
                        </div>
                    )}
                    {activeTab === "documentos" && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
                             <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter text-slate-800 flex items-center gap-3">
                                        <Database className="h-5 w-5 text-cyan-700" />
                                        Bóveda de Documentos
                                    </h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 mt-2 italic">Control de cumplimiento legal y técnico v1.0</p>
                                </div>
                                <Link href={`/dashboard/vehiculos/${vehiculo.id}/documentos/nuevo`}>
                                    <Button className="h-11 rounded-none bg-slate-900 hover:bg-black text-[10px] font-black uppercase tracking-widest px-8 gap-3">
                                        CARGAR SOPORTE
                                    </Button>
                                </Link>
                            </div>
                            <DocumentsTab documentos={vehiculo.documentos} vehiculoId={vehiculo.id} />
                        </div>
                    )}
                    {activeTab === "conductores" && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <DriversTab vinculaciones={vehiculo.vinculaciones} vehiculoId={vehiculo.id} />
                        </div>
                    )}
                    {activeTab === "mantenimiento" && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter text-slate-800">Servicios Mecánicos</h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 mt-2 flex items-center gap-2">
                                        <span className="h-1 w-5 bg-cyan-600" />
                                        Trazabilidad técnica basada en kilometraje
                                    </p>
                                </div>
                                <Link href={`/dashboard/mantenimiento`}>
                                    <Button variant="outline" className="h-11 rounded-none border-slate-200 text-[10px] font-black uppercase tracking-widest px-8">
                                        Panel de Taller
                                    </Button>
                                </Link>
                            </div>
                            <MaintenanceHistory
                                mantenimientos={vehiculo.mantenimientos}
                                ordenesPendientes={vehiculo.ordenesServicio}
                            />
                        </div>
                    )}
                    {activeTab === "kardex" && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                             <SparePartsTab
                                mantenimientos={vehiculo.mantenimientos}
                                kilometrajeActual={vehiculo.kilometrajeActual ?? 0}
                            />
                        </div>
                    )}
                    {activeTab === "siniestros" && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter text-slate-800">Historial de Siniestralidad</h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 mt-2 text-red-700 font-bold">Registro crítico de incidencias operativas</p>
                                </div>
                                <Link href={`/dashboard/siniestros`}>
                                    <Button className="h-11 rounded-none bg-red-600 hover:bg-red-700 text-[10px] font-black uppercase tracking-widest px-8 shadow-lg shadow-red-200">
                                        REPORTAR INCIDENTE
                                    </Button>
                                </Link>
                            </div>
                            <SiniestrosHistory siniestros={vehiculo.siniestros} />
                        </div>
                    )}
                    {activeTab === "preoperacional" && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
                             <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter text-slate-800 flex items-center gap-3">
                                        <BarChart3 className="h-5 w-5 text-emerald-600" />
                                        Analytics PESV
                                    </h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 mt-2">Monitoreo dinámico de alistamiento diario</p>
                                </div>
                                <Link href="/dashboard/preoperacional">
                                    <Button className="h-11 rounded-none bg-emerald-600 hover:bg-emerald-700 text-[10px] font-black uppercase tracking-widest px-8">
                                        Ver Bitácora Diaria
                                    </Button>
                                </Link>
                            </div>
                            <PreoperacionalHistory preoperacionales={preoperacionales} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
