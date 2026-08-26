"use client";

import Link from "next/link";
import { SearchInput } from "@/components/search-input";
import { Pagination } from "@/components/ui/pagination";
import { ConductorCard } from "./conductor-card";
import { 
    Plus, 
    Activity,
    LayoutGrid,
    Search,
    ShieldCheck,
    Users,
    UserCheck,
    Scale,
    FileSpreadsheet,
    FileText,
    Settings,
    MoreHorizontal
} from "lucide-react";
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
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";
import { ConductorWithRelations } from "@/types/conductor";

interface ConductoresListadoViewProps {
    conductores: ConductorWithRelations[];
    metadata: {
        total: number;
        page: number;
        totalPages: number;
    };
}

export function ConductoresListadoView({
    conductores,
    metadata,
}: ConductoresListadoViewProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleExportExcel = async () => {
        const tId = toast.loading("Preparando exportación de nómina...");
        try {
            const ExcelJS = (await import("exceljs")).default;
            const { saveAs } = await import("file-saver");
            
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Conductores");

            worksheet.columns = [
                { header: "IDENTIFICACION", key: "doc", width: 20 },
                { header: "NOMBRES", key: "nombres", width: 25 },
                { header: "APELLIDOS", key: "apellidos", width: 25 },
                { header: "ROL", key: "rol", width: 15 },
                { header: "ESTADO", key: "estado", width: 12 },
                { header: "FECHA CREACIÓN", key: "creacion", width: 20 },
            ];

            conductores.forEach((c) => {
                worksheet.addRow({
                    doc: c.numeroDocumento,
                    nombres: c.nombres,
                    apellidos: c.apellidos,
                    rol: c.rol,
                    estado: c.activo ? "ACTIVO" : "INACTIVO",
                    creacion: c.creadoEn ? new Date(c.creadoEn).toLocaleDateString() : "N/A",
                });
            });

            // Estilos técnicos
            worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFF" } };
            worksheet.getRow(1).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "1e293b" },
            };

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(blob, `Listado_Conductores_${new Date().toISOString().split("T")[0]}.xlsx`);

            toast.success("Listado exportado correctamente", { id: tId });
        } catch (error) {
            toast.error("Error al exportar listado", { id: tId });
        }
    };

    return (
        <div className="space-y-10">
            {/* Standard Toolbar (Sharp & Industrial) */}
            <div className="bg-white border border-slate-200 flex flex-col xl:flex-row items-center justify-between p-4 px-6 gap-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
                <div className="flex items-center gap-6 w-full xl:w-auto">
                    {/* Master Module Icon Box */}
                    <div className="hidden sm:flex h-14 w-14 items-center justify-center border border-slate-100 bg-slate-50 text-slate-900">
                        <Users className="h-6 w-6 stroke-[1.5]" />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex items-center justify-center text-primary bg-primary/5 rounded-full border border-primary/10 shadow-inner">
                            <UserCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-[20px] font-black uppercase tracking-tight text-slate-800 leading-none">
                                Talento Operativo
                            </h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-900 mt-2 flex items-center gap-2">
                                <span className="h-[1px] w-6 bg-slate-200" />
                                Gesti&oacute;n de Perfiles & PESV
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-end">
                    {/* Universal Scanner Input */}
                    <div className="relative w-full sm:w-80">
                        <SearchInput 
                            placeholder="ESCANEANDO DIRECTORIO CONDUCTORES..."
                        />
                    </div>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="premium-outline" className="h-11 w-11 sm:w-auto px-0 sm:px-6">
                                <Settings className="h-4 w-4" />
                                <span className="hidden sm:inline">Opciones</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[240px] rounded-none border-slate-200 p-2 shadow-2xl">
                             <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 py-3 px-3">
                                Control de Archivo
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-100" />
                            <DropdownMenuItem 
                                onClick={handleExportExcel}
                                className="rounded-none py-3 text-[10px] font-black uppercase tracking-widest gap-3 cursor-pointer"
                            >
                                <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Exportar Nomina (.xlsx)
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="rounded-none py-3 text-[10px] font-black uppercase tracking-widest gap-3 cursor-pointer"
                            >
                                <FileText className="h-4 w-4 text-red-600" /> Certificado Maestro (PDF)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link href="/dashboard/usuarios/nuevo" passHref className="w-full sm:w-auto">
                        <Button variant="premium" className="h-11 w-full">
                            <Plus className="h-4 w-4 text-accent" /> NUEVO CONDUCTOR
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats - Driver Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-1">
                <div className="bg-white border-l-4 border-primary p-4 shadow-sm space-y-1 flex flex-col justify-center">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Personal Total</p>
                    <p className="text-2xl font-black text-slate-800">{metadata.total}</p>
                </div>
                <div className="bg-white border-l-4 border-emerald-500 p-4 shadow-sm space-y-1 flex flex-col justify-center">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Aptitud Plena</p>
                    <p className="text-2xl font-black text-emerald-600">85%</p>
                </div>
                <div className="bg-white border-l-4 border-amber-500 p-4 shadow-sm space-y-1 flex flex-col justify-center">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Doc. Pr&oacute;ximo</p>
                    <p className="text-2xl font-black text-amber-600">3</p>
                </div>
                <div className="bg-white border-l-4 border-blue-500 p-4 shadow-sm space-y-1 flex flex-col justify-center">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Carga Laboral</p>
                    <p className="text-2xl font-black text-slate-800">NORMAL</p>
                </div>
            </div>

            {/* List Overview */}
            {conductores.length === 0 ? (
                <div className="py-24 border border-primary/5 bg-slate-50 flex flex-col items-center justify-center space-y-4">
                    <div className="h-20 w-20 bg-white border border-primary/5 flex items-center justify-center text-primary/10">
                        <LayoutGrid className="h-10 w-10" />
                    </div>
                    <div className="text-center space-y-1">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest">Frecuencia Silenciosa</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase max-w-xs leading-relaxed">NO SE ENCONTRARON CONDUCTORES OPERATIVOS EN EL DIRECTORIO ACTUAL.</p>
                    </div>
                    <Button variant="premium-outline" className="px-8">ACTUALIZAR SENSORES</Button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {conductores
                            .map((conductor) => (
                                <ConductorCard 
                                    key={conductor.id} 
                                    conductor={conductor} 
                                />
                            ))}
                    </div>

                    {/* Technical Footer */}
                    <div className="bg-slate-50 border border-primary/5 flex flex-col sm:flex-row items-center justify-between p-6 gap-6">
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="rounded-none bg-white border-primary/10 text-slate-900 font-black px-2 py-1 text-[10px]">C-CORE V2.0</Badge>
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                                Listando <span className="text-primary">{conductores.length}</span> entradas de <span className="text-primary">{metadata.total}</span> autorizadas
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-6">
                             <Pagination
                                currentPage={metadata?.page || 1}
                                totalPages={metadata?.totalPages || 1}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
