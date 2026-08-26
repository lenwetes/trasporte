"use client";

import Link from "next/link";
import { generateCV, CVData } from "@/lib/pdf-generator-cv";
import { trackExport } from "@/actions";
import { toast } from "sonner";
import { ChevronLeft, Download, Printer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface HojaVidaControlsProps {
    usuarioId: string;
    data: CVData;
    companyConfig?: import("@prisma/client").ConfiguracionGlobal | null;
}

export function HojaVidaControls({
    usuarioId,
    data,
    companyConfig,
}: HojaVidaControlsProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleDownloadPDF = async () => {
        setIsExporting(true);
        const toastId = toast.loading("Consolidando información y generando documento maestro...");
        try {
            await generateCV({
                ...data,
                config: companyConfig as CVData["config"],
            });
            await trackExport({
                tipo: "Hoja de Vida PDF",
                entidadId: usuarioId,
                detalles: `Usuario: ${data.usuario.nombres} ${data.usuario.apellidos}`,
            });
            toast.success("Expediente de Hoja de Vida exportado con éxito", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Error crítico al procesar el documento PDF", { id: toastId });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 border-b border-slate-200 mb-8 font-sans">
            <Link 
                href={`/dashboard/usuarios/${usuarioId}/editar`} 
                className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
            >
                <div className="p-2 rounded-full group-hover:bg-slate-100 transition-all">
                    <ChevronLeft size={16} />
                </div>
                <span className="text-[12px] font-black uppercase tracking-widest">Volver al Perfil</span>
            </Link>

            <div className="flex flex-wrap items-center gap-3">
                <Button
                    variant="outline"
                    onClick={handleDownloadPDF}
                    disabled={isExporting}
                    className="h-10 px-6 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-bold text-[11px] uppercase tracking-wider group transition-all"
                >
                    {isExporting ? (
                        <>
                            <Loader2 size={16} className="mr-2 animate-spin text-brand" />
                            Procesando...
                        </>
                    ) : (
                        <>
                            <Download size={16} className="mr-2 text-brand group-hover:translate-y-0.5 transition-transform" />
                            Descargar PDF Consolidado
                        </>
                    )}
                </Button>

                <Button
                    variant="ghost"
                    onClick={() => window.print()}
                    className="h-10 px-6 rounded-xl text-slate-500 hover:text-slate-900 font-bold text-[11px] uppercase tracking-wider group"
                >
                    <Printer size={16} className="mr-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                    Imprimir Vista Actual
                </Button>
            </div>
        </div>
    );
}

