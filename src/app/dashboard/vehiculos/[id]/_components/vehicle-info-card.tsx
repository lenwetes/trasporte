"use client";

import { useState } from "react";
import { VehiculoWithRelations } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MaintenanceHistoryModal } from "./maintenance-history-modal";
import { SiniestrosHistoryModal } from "./siniestros-history-modal";
import { 
    CheckCircle2, 
    History, 
    ArrowRight, 
    ShieldAlert, 
    User, 
    Briefcase, 
    FileText, 
    Calendar, 
    Users,
    Gauge,
    DownloadCloud
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { pdf } from "@react-pdf/renderer";
import { VehicleCVReportPDF } from "@/lib/pdf/reports/vehicle-cv-report-view";
import { mergeVehicleDocuments } from "@/lib/pdf/cv-merger";
import { toast } from "sonner";

interface VehicleInfoCardProps {
    vehiculo: VehiculoWithRelations;
}

export function VehicleInfoCard({ vehiculo }: VehicleInfoCardProps) {
    const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
    const [isSiniestrosModalOpen, setIsSiniestrosModalOpen] = useState(false);

    return (
        <div className="bg-white border border-slate-200 divide-y divide-slate-200 shadow-sm animate-in fade-in slide-in-from-right-2 duration-700">
            {/* Ownership Section */}
            <div className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-slate-900 flex items-center justify-center text-white text-lg font-black shrink-0">
                        {(vehiculo.propietario || "P")[0].toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-900">Titularidad Registrada</h3>
                        <p className="text-sm font-black uppercase tracking-tight text-slate-900 leading-tight">
                            {vehiculo.propietario || "S/N ASIGNADO"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 border-dashed">
                    <Briefcase className="h-3 w-3 text-slate-900" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-900">Gestión de Activos</span>
                </div>
            </div>

            {/* Technical Parameters (KPIs) */}
            <div className="p-8 space-y-4">
                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Parámetros Técnicos</h3>
                <div className="space-y-3">
                    {[
                        { label: "Documentación", value: `${vehiculo.documentos.length} EXPEDIENTES`, icon: FileText },
                        { label: "Operadores", value: `${vehiculo.vinculaciones.filter((v: any) => v.activo).length} ACTIVOS`, icon: Users },
                        { label: "Odómetro", value: `${vehiculo.kilometrajeActual?.toLocaleString() || 0} KM`, icon: Gauge },
                        { label: "Año Modelo", value: vehiculo.anho?.toString() || "N/D", icon: Calendar },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-100 group transition-all hover:border-slate-300">
                            <div className="flex items-center gap-3">
                                <item.icon className="h-4 w-4 text-slate-900 group-hover:text-slate-900 transition-colors" />
                                <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{item.label}</span>
                            </div>
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 grid grid-cols-2 gap-2 bg-slate-100/50">
                <Button
                    variant="ghost"
                    onClick={() => setIsMaintenanceModalOpen(true)}
                    className="h-14 rounded-none border border-slate-200 bg-white hover:bg-slate-50 flex flex-col items-center justify-center gap-1 group transition-all"
                >
                    <History className="h-4 w-4 text-slate-900 group-hover:text-cyan-600" />
                    <span className="text-[7px] font-black uppercase tracking-widest">Mantenimientos</span>
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => setIsSiniestrosModalOpen(true)}
                    className="h-14 rounded-none border border-slate-200 bg-white hover:bg-slate-50 flex flex-col items-center justify-center gap-1 group transition-all"
                >
                    <ShieldAlert className="h-4 w-4 text-slate-900 group-hover:text-red-600" />
                    <span className="text-[7px] font-black uppercase tracking-widest">Incidentes</span>
                </Button>
            </div>

            <div className="p-4 bg-white border-t border-slate-200">
                <Button
                    onClick={async () => {
                        const tId = toast.loading("Generando Hoja de Vida Técnica...");
                        try {
                            const docBlobObj = await pdf(<VehicleCVReportPDF vehiculo={vehiculo} />).toBlob();
                            const docBytes = await docBlobObj.arrayBuffer();
                            const mergedBytes = await mergeVehicleDocuments(docBytes, vehiculo);
                            const finalBlob = new Blob([mergedBytes as unknown as BlobPart], { type: "application/pdf" });

                            const url = URL.createObjectURL(finalBlob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `HOJA_VIDA_${vehiculo.placa}_${new Date().getFullYear()}.pdf`;
                            a.click();
                            URL.revokeObjectURL(url);
                            toast.success("Documento generado exitosamente", { id: tId });
                        } catch (e) {
                            console.error(e);
                            toast.error("Fallo al compilar expediente PDF", { id: tId });
                        }
                    }}
                    className="w-full h-12 rounded-none bg-slate-900 hover:bg-black text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3"
                >
                    <DownloadCloud className="h-4 w-4" />
                    Descargar Hoja de Vida
                </Button>
            </div>

            <MaintenanceHistoryModal
                open={isMaintenanceModalOpen}
                onOpenChange={setIsMaintenanceModalOpen}
                vehiculo={vehiculo}
            />

            <SiniestrosHistoryModal
                open={isSiniestrosModalOpen}
                onOpenChange={setIsSiniestrosModalOpen}
                vehiculo={vehiculo}
            />
        </div>
    );
}
