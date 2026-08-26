"use client";

import { Button } from "./ui/button";
import { toast } from "sonner";

import { generatePDFReport } from "@/lib/pdf-generator";

import { SiniestroWithRelations } from "@/types";

export function ExportSiniestrosButton({
    siniestros,
    companyConfig,
}: {
    siniestros: SiniestroWithRelations[];
    companyConfig?: import("@prisma/client").ConfiguracionGlobal | null;
}) {
    const handleExport = async () => {
        try {
            await generatePDFReport({
                title: "Reporte de Siniestros y Accidentes",
                subtitle: `Generado el ${new Date().toLocaleDateString()}`,
                filename: `siniestros-reporte-${new Date().toISOString().split("T")[0]}`,
                columns: [
                    { header: "Fecha", dataKey: "fechaFmt"  },
                    { header: "Lugar", dataKey: "lugar"  },
                    { header: "Conductor", dataKey: "conductoresFmt"  },
                    { header: "Placa", dataKey: "placa"  },
                    { header: "Resumen Hechos", dataKey: "reporteHechosFmt"  },
                ],
                data: siniestros.map((item) => ({
                    fechaFmt: new Date(item.fecha).toLocaleDateString(),
                    lugar: item.lugar,
                    conductoresFmt: `${item.conductor.nombres} ${item.conductor.apellidos}`,
                    placa: item.vehiculo.placa,
                    reporteHechosFmt:
                        item.reporteHechos.substring(0, 100) + "...",
                })),
                config: companyConfig,
            });
            toast.success("Reporte generado con éxito.");
        } catch (error) {
            console.error(error);
            toast.error("Error al generar el reporte PDF.");
        }
    };

    return (
        <Button
            variant="outline"
            
            onClick={handleExport}
            disabled={siniestros.length === 0}>
 <span>[DOWNLOAD]</span>
            Exportar PDF
        </Button>
    );
}
