"use client";

import { useState } from "react";
import { FileText, Loader2, Download } from "lucide-react";
import { getVehiculoById, getConfiguracionGlobal } from "@/actions";
import { generateVehicleCV } from "@/lib/pdf/vehicle-cv-generator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface VehiclePDFButtonProps {
    vehicleId: string;
    className?: string;
}

export function VehiclePDFButton({ vehicleId, className }: VehiclePDFButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        const toastId = toast.loading("Sincronizando activos y exportando PDF...");
        try {
            const [vehicleRes, configRes] = await Promise.all([
                getVehiculoById(vehicleId),
                getConfiguracionGlobal(),
            ]);

            if (vehicleRes.success && vehicleRes.data) {
                await generateVehicleCV({
                    vehiculo: vehicleRes.data as any,
                    config: (configRes.data as any) || null,
                });
                toast.success("Certificado de Hoja de Vida generado", { id: toastId });
            } else {
                toast.error("Error al obtener información técnica del vehículo", { id: toastId });
            }
        } catch (error) {
            console.error("PDF generation error:", error);
            toast.error("Fallo crítico en el renderizado del documento", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleDownload}
            disabled={loading}
            variant="outline"
            title="Generar Hoja de Vida Técnica (PDF)"
            className={cn(
                "h-14 rounded-none border-primary/10 bg-white hover:bg-slate-50 text-accent transition-all",
                className
            )}
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        </Button>
    );
}
