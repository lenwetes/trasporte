"use client";

import { toast } from "sonner";
import { pdf } from "@react-pdf/renderer";
import { MaintenancePDFDocument } from "./pdf/maintenance-pdf";
import { saveAs } from "file-saver";
import { 
    OrdenServicio, 
    Vehiculo, 
    PlanMantenimiento, 
    ConfiguracionGlobal, 
    Usuario 
} from "@prisma/client";

interface GenerateOSPDFProps {
    orden: OrdenServicio;
    vehiculo: Vehiculo;
    propietario: Usuario | null;
    plan: PlanMantenimiento;
    config: ConfiguracionGlobal | null;
}

export const generateOSPDF = async (data: GenerateOSPDFProps) => {
    const loadingToast = toast.loading("Generando documento PDF oficial...");
    
    try {
        // @ts-ignore - React PDF types can be tricky with RSC/Client components
        const blob = await pdf(<MaintenancePDFDocument data={data} />).toBlob();
        saveAs(blob, `Orden_Servicio_${data.orden?.codigo || 'OS'}.pdf`);
        toast.success("Documento generado exitosamente", { id: loadingToast });
    } catch (error) {
        console.error("Error generating PDF:", error);
        toast.error("Error al generar el documento PDF", { id: loadingToast });
    }
};
