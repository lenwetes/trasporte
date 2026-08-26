"use client";

import { SearchInput } from "@/components/search-input";
import { Pagination } from "@/components/ui/pagination";
import { VehiculoCard } from "./vehiculo-card";
import type { VehiculoWithRelations } from "@/types";
import Link from "next/link";
import { Plus, Zap, Activity, Filter, LayoutGrid, Search, Settings, Truck, Notebook, FileSpreadsheet, FileText, Bell, Layers, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { GenericReportPDF } from "@/lib/pdf/reports/generic-report-view";

import { AlertasVencimientoPanel } from "@/components/modules/alerts/alertas-vencimiento-panel";
import { ReglasAlertaManager } from "@/components/modules/alerts/reglas-alerta-manager";
import type { ReglaAlertaData, ResumenAlertas } from "@/services/alerts.service";
import { triggerAlertSync } from "@/actions/alertas/mutations";

interface VehiculosListadoViewProps {
    vehiculos: VehiculoWithRelations[];
    metadata: {
        total: number;
        page: number;
        totalPages: number;
        totalBlocked: number;
    };
    alertasResumen: ResumenAlertas;
    reglasInitial: ReglaAlertaData[];
}

export function VehiculosListadoView({
    vehiculos,
    metadata,
    alertasResumen,
    reglasInitial,
}: VehiculosListadoViewProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showAlertsModal, setShowAlertsModal] = useState(false);
    const [showTypesModal, setShowTypesModal] = useState(false);
    const [showBodyModal, setShowBodyModal] = useState(false);
    const [showServiceModal, setShowServiceModal] = useState(false);
    
    // Interactive States
    const [alertDays, setAlertDays] = useState(30);
    const [activeModalidades, setActiveModalidades] = useState({
        PROPIA: true,
        EXTERNA: true
    });
    const [activeClases, setActiveClases] = useState<Record<string, boolean>>({
        'MICROBUS': true,
        'BUSETA': true,
        'BUS': true,
        'CAMIONETA': true,
        'OTRO': false
    });
    const [activeBodyTypes, setActiveBodyTypes] = useState<Record<string, boolean>>({
        'ESTACAS': true,
        'FURGON': true,
        'TANQUE': false,
        'CERRADO': true,
        'ESTRIBOS': true
    });

    const handleExportExcel = async () => {
        try {
            const ExcelJS = (await import("exceljs")).default;
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet("Inventario Flota");

            sheet.columns = [
                { header: "PLACA", key: "placa", width: 12 },
                { header: "MARCA", key: "marca", width: 18 },
                { header: "MODELO", key: "modelo", width: 10 },
                { header: "CLASE", key: "clase", width: 14 },
                { header: "MODALIDAD", key: "modalidad", width: 14 },
                { header: "PROPIETARIO", key: "propietario", width: 30 },
                { header: "ESTADO", key: "estado", width: 12 },
                { header: "OPERATIVIDAD", key: "operatividad", width: 18 },
            ];

            vehiculos.forEach((v: VehiculoWithRelations) => {
                sheet.addRow({
                    placa: v.placa,
                    marca: v.marca,
                    modelo: v.modelo,
                    clase: v.clase,
                    modalidad: v.modalidad,
                    propietario: v.propietarioUser ? `${v.propietarioUser.nombres} ${v.propietarioUser.apellidos}` : v.propietario,
                    estado: v.activo ? "ACTIVO" : "INACTIVO",
                    operatividad: v.estadoOperativo,
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Inventario_Flota_${new Date().toISOString().split("T")[0]}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Excel generado correctamente");
        } catch {
            toast.error("Error al exportar a Excel");
        }
    };

    const handleExportPDF = async () => {
        try {
            const data = vehiculos.map((v: VehiculoWithRelations) => ({
                placa: v.placa,
                vehiculo: `${v.marca ?? ""} ${v.modelo ?? ""}`.trim(),
                clase: v.clase ?? "N/A",
                propietario: v.propietario ?? "N/A",
                estado: v.estadoOperativo ?? "N/A",
            }));

            const docBlob = await pdf(
                <GenericReportPDF
                    title="Inventario Técnico de Flota"
                    subtitle="COOPETRAES — Sistema de Gestión Operativa"
                    columns={[
                        { header: "Placa", dataKey: "placa" },
                        { header: "Vehículo", dataKey: "vehiculo" },
                        { header: "Clase", dataKey: "clase" },
                        { header: "Propietario", dataKey: "propietario" },
                        { header: "Estado", dataKey: "estado" },
                    ]}
                    data={data}
                />
            ).toBlob();

            const url = URL.createObjectURL(docBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Reporte_Flota_${new Date().toISOString().split("T")[0]}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("PDF generado correctamente");
        } catch {
            toast.error("Error al generar PDF");
        }
    };

    return (
        <div className="space-y-10">
            {/* Professional Standard Toolbar (Based on Operaciones FUEC) */}
            <div className="bg-white border border-slate-200 flex flex-col xl:flex-row items-center justify-between p-4 px-6 gap-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
                <div className="flex items-center gap-6 w-full xl:w-auto">
                    {/* Master Module Icon Box */}
                    <div className="hidden sm:flex h-14 w-14 items-center justify-center border border-slate-100 bg-slate-50 text-slate-900">
                        <Notebook className="h-6 w-6 stroke-[1.5]" />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex items-center justify-center text-cyan-700 bg-cyan-50/50 rounded-full border border-cyan-100 shadow-inner">
                            <Truck className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-[20px] font-black uppercase tracking-tight text-slate-800 leading-none">
                                Gestión de Activos
                            </h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-900 mt-2 flex items-center gap-2">
                                <span className="h-[1px] w-6 bg-slate-200" />
                                Control de Flota & PESV Integral
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-end">
                    {/* Universal Scanner Input */}
                    <div className="relative w-full sm:w-80">
                        <SearchInput 
                            placeholder="ESCANEANDO PLACA O MODELO..."
                        />
                    </div>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="premium-outline" className="h-11 w-11 sm:w-auto px-0 sm:px-6">
                                <Settings className="h-4 w-4" />
                                <span className="hidden sm:inline">Configuración</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[280px] rounded-none border-slate-200 p-2 shadow-2xl">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 py-3 px-3">
                                Control de Módulo
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-100" />
                            
                            <DropdownMenuGroup>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="rounded-none py-3 px-3 text-[11px] font-black uppercase tracking-widest gap-3 focus:bg-slate-50">
                                        <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                                        Exportación de Datos
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent className="rounded-none border-slate-200 shadow-xl p-1">
                                            <DropdownMenuItem 
                                                onClick={handleExportExcel}
                                                className="rounded-none py-3 text-[10px] font-black uppercase tracking-widest gap-3 cursor-pointer focus:bg-emerald-50 focus:text-emerald-700"
                                            >
                                                <FileSpreadsheet className="h-4 w-4" /> Exportar a Excel (.xlsx)
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                onClick={handleExportPDF}
                                                className="rounded-none py-3 text-[10px] font-black uppercase tracking-widest gap-3 cursor-pointer focus:bg-red-50 focus:text-red-700"
                                            >
                                                <FileText className="h-4 w-4" /> Reporte Técnico (PDF)
                                            </DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>

                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="rounded-none py-3 px-3 text-[11px] font-black uppercase tracking-widest gap-3 focus:bg-slate-50">
                                        <Layers className="h-4 w-4 text-cyan-700" />
                                        Gestión de Tipos
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent className="rounded-none border-slate-200 shadow-xl p-1">
                                            <DropdownMenuItem 
                                                onClick={() => setShowTypesModal(true)}
                                                className="rounded-none py-3 text-[10px] font-black uppercase tracking-widest cursor-pointer"
                                            >
                                                Clases de Vehículo
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                onClick={() => setShowBodyModal(true)}
                                                className="rounded-none py-3 text-[10px] font-black uppercase tracking-widest cursor-pointer"
                                            >
                                                Tipos de Carrocería
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                onClick={() => setShowServiceModal(true)}
                                                className="rounded-none py-3 text-[10px] font-black uppercase tracking-widest cursor-pointer"
                                            >
                                                Modalidades de Servicio
                                            </DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator className="bg-slate-100" />
                            
                            <DropdownMenuItem 
                                onClick={() => setShowAlertsModal(true)}
                                className="rounded-none py-3 px-3 text-[11px] font-black uppercase tracking-widest gap-3 cursor-pointer focus:bg-amber-50 focus:text-amber-700"
                            >
                                <Bell className="h-4 w-4" />
                                Alertas Globales
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Global Alerts Configuration Modal */}
                    <Dialog open={showAlertsModal} onOpenChange={setShowAlertsModal}>
                        <DialogContent className="max-w-2xl rounded-none border border-primary/10 shadow-2xl p-0 overflow-hidden">
                            <DialogHeader className="hidden">
                                <DialogTitle>Configuración de Alertas Globales</DialogTitle>
                            </DialogHeader>
                            <ReglasAlertaManager 
                                initialReglas={reglasInitial} 
                                onClose={() => setShowAlertsModal(false)}
                            />
                        </DialogContent>
                    </Dialog>

                    {/* Management Modals */}
                    <Dialog open={showTypesModal} onOpenChange={setShowTypesModal}>
                        <DialogContent className="max-w-md rounded-none border border-primary/10 p-0 shadow-2xl overflow-hidden">
                            <DialogHeader className="hidden"><DialogTitle>Clases de Vehículo</DialogTitle></DialogHeader>
                            <div className="bg-primary p-6 text-white">
                                <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3 italic">
                                    <Truck className="h-5 w-5 text-accent" />
                                    Clases de Vehículo
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-2">Diccionario de Tipologías del Sistema</p>
                            </div>
                            <div className="p-8 space-y-3">
                                {Object.entries(activeClases).map(([clase, active]) => (
                                    <div key={clase} className="flex items-center justify-between p-4 border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors group cursor-default">
                                        <span className={`text-[11px] font-black uppercase tracking-widest ${active ? 'text-slate-700' : 'text-slate-900'}`}>{clase}</span>
                                        <Switch 
                                            checked={active}
                                            onCheckedChange={(checked) => setActiveClases(prev => ({ ...prev, [clase]: checked }))}
                                        />
                                    </div>
                                ))}
                                <p className="text-[9px] font-bold text-slate-900 uppercase tracking-tight mt-6 bg-slate-100 p-3 border-l-2 border-slate-300">
                                    ⚠️ Estas categorías están protegidas por el núcleo del sistema y no pueden ser modificadas manualmente sin auditoría técnica.
                                </p>
                            </div>
                            <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100">
                                <Button variant="premium" onClick={() => setShowTypesModal(false)} className="px-10">Cerrar Visor</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={showBodyModal} onOpenChange={setShowBodyModal}>
                        <DialogContent className="max-w-md rounded-none border border-primary/10 p-0 shadow-2xl overflow-hidden">
                            <DialogHeader className="hidden"><DialogTitle>Tipos de Carrocería</DialogTitle></DialogHeader>
                            <div className="bg-primary p-6 text-white">
                                <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                                    <Layers className="h-5 w-5 text-accent" />
                                    Tipos de Carrocería
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-2">Configuración de Estructuras</p>
                            </div>
                            <div className="p-8 space-y-3">
                                {Object.entries(activeBodyTypes).map(([body, active]) => (
                                    <div key={body} className="flex items-center justify-between p-4 border border-slate-100 bg-white hover:border-brand/40 transition-all cursor-pointer group">
                                        <span className={`text-[11px] font-black uppercase tracking-widest ${active ? 'text-slate-700' : 'text-slate-900'}`}>{body}</span>
                                        <Switch 
                                            checked={active}
                                            onCheckedChange={(checked) => setActiveBodyTypes(prev => ({ ...prev, [body]: checked }))}
                                        />
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full h-12 rounded-none border-dashed border-2 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:border-brand hover:text-brand transition-all gap-3 bg-slate-50/50">
                                    <Plus className="h-3 w-3" /> Añadir Nueva Estructura
                                </Button>
                            </div>
                            <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100">
                                <Button variant="premium" onClick={() => setShowBodyModal(false)} className="px-10">Guardar Cambios</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={showServiceModal} onOpenChange={setShowServiceModal}>
                        <DialogContent className="max-w-md rounded-none border border-primary/10 p-0 shadow-2xl overflow-hidden">
                            <DialogHeader className="hidden"><DialogTitle>Modalidades de Servicio</DialogTitle></DialogHeader>
                            <div className="bg-primary p-6 text-white">
                                <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3 italic">
                                    <Zap className="h-5 w-5 text-accent" />
                                    Modalidades
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-2">Gestión de Vinculación Operativa</p>
                            </div>
                            <div className="p-8 space-y-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-slate-100 bg-slate-50/50">
                                        <div className="flex flex-col">
                                            <span className={`text-[11px] font-black uppercase tracking-widest ${activeModalidades.PROPIA ? 'text-primary' : 'text-slate-900'}`}>Flota Propia</span>
                                            <span className="text-[9px] font-bold text-slate-900 uppercase">Gestión Administrativa Directa</span>
                                        </div>
                                        <Switch 
                                            checked={activeModalidades.PROPIA}
                                            onCheckedChange={(checked) => setActiveModalidades(prev => ({ ...prev, PROPIA: checked }))}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-4 border border-slate-100 bg-slate-50/50">
                                        <div className="flex flex-col">
                                            <span className={`text-[11px] font-black uppercase tracking-widest ${activeModalidades.EXTERNA ? 'text-secondary' : 'text-slate-900'}`}>Convenio Externo</span>
                                            <span className="text-[9px] font-bold text-slate-900 uppercase">Vinculación de Aliados Terceros</span>
                                        </div>
                                        <Switch 
                                            checked={activeModalidades.EXTERNA}
                                            onCheckedChange={(checked) => setActiveModalidades(prev => ({ ...prev, EXTERNA: checked }))}
                                        />
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 text-[10px] font-bold text-slate-900 italic leading-relaxed">
                                    * La modalidad de "Convenio Externo" ahora puede ser activada mediante el interruptor para permitir auditoría de terceros.
                                </div>
                            </div>
                            <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100">
                                <Button variant="premium" onClick={() => setShowServiceModal(false)} className="px-10">Cerrar</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Link href="/dashboard/vehiculos/nuevo" passHref className="w-full sm:w-auto">
                        <Button variant="premium" className="h-11 w-full">
                            <Plus className="h-4 w-4 text-accent" /> NUEVO VEHÍCULO
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats Grid - Minimalist */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-1">
                <div className="bg-white border-l-4 border-primary p-4 shadow-sm space-y-1">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Activos Totales</p>
                    <p className="text-2xl font-black text-slate-800">{metadata.total}</p>
                </div>
                <div className="bg-white border-l-4 border-emerald-500 p-4 shadow-sm space-y-1">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Disponibles</p>
                    <p className="text-2xl font-black text-emerald-600">{metadata.total - metadata.totalBlocked}</p>
                </div>
                <div className="bg-white border-l-4 border-red-500 p-4 shadow-sm space-y-1">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Fuera de Servicio</p>
                    <p className="text-2xl font-black text-red-600">{metadata.totalBlocked}</p>
                </div>
                <div className="bg-white border-l-4 border-amber-500 p-4 shadow-sm space-y-1">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Eficiencia</p>
                    <p className="text-2xl font-black text-slate-800">
                        {Math.round(((metadata.total - metadata.totalBlocked) / Math.max(metadata.total, 1)) * 100)}%
                    </p>
                </div>
            </div>

            {/* List Overview */}
            {vehiculos.length === 0 ? (
                <div className="py-24 border border-primary/5 bg-slate-50 flex flex-col items-center justify-center space-y-4">
                    <div className="h-20 w-20 bg-white border border-primary/5 flex items-center justify-center text-primary/10">
                        <LayoutGrid className="h-10 w-10" />
                    </div>
                    <div className="text-center space-y-1">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest">Canal sin Señal</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase max-w-xs leading-relaxed">No se han detectado activos operativos que coincidan con los parámetros de escaneo actuales.</p>
                    </div>
                    <Button variant="premium-outline" className="px-8">LIMPIAR SCANNER</Button>
                </div>
            ) : (
                <>
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* List Area */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {vehiculos
                                .map((vehiculo) => (
                                    <VehiculoCard key={vehiculo.id} vehiculo={vehiculo} />
                                ))}
                        </div>

                        {/* Sidebar Alerts */}
                        <aside className="w-full lg:w-[350px] shrink-0">
                            <AlertasVencimientoPanel resumen={alertasResumen} />
                        </aside>
                    </div>

                    {/* Technical Footer: Pagination & Stats */}
                    <div className="bg-slate-50 border border-primary/5 flex flex-col sm:flex-row items-center justify-between p-6 gap-6">
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="rounded-none bg-white border-primary/10 text-slate-900 font-black px-2 py-1 text-[10px]">VERSIÓN 1.0.4</Badge>
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                                Monitoreando <span className="text-primary">{vehiculos.length}</span> activos de <span className="text-primary">{metadata.total}</span> en la base de datos central
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
