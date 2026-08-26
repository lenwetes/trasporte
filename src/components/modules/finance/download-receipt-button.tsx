"use client";

import { useState } from "react";
import { getReceiptData } from "@/actions/finance/payments";
import { generatePaymentReceiptPDF } from "@/lib/pdf/finance-pdf";
import { TransaccionWithRelations } from "@/types";
import { ConfiguracionGlobal } from "@prisma/client";
import { toast } from "sonner";
import { Download } from "lucide-react";

interface DownloadReceiptButtonProps {
    transaccionId: string;
    variant?: "outline" | "ghost" | "default";
    size?: "default" | "sm" | "icon";
    showLabel?: boolean;
}

export function DownloadReceiptButton({
    transaccionId,
    showLabel = true,
}: DownloadReceiptButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const result = await getReceiptData(transaccionId);
            if (result.success && result.data) {
                const { transaccion, config } = result.data as {
                    transaccion: TransaccionWithRelations & {
                        archivos: { nombreUnico: string; tipoMime: string }[];
                    };
                    config: ConfiguracionGlobal | null;
                };

                const isEgreso = transaccion.tipo === "EGRESO";
                const principalArchivo = transaccion.archivos?.[0];

                interface ReceiptItem {
                    description: string;
                    amount: number;
                }
                let items: ReceiptItem[] = [];
                if (isEgreso) {
                    items = transaccion.asientos
                        .filter((as) => Number(as.debito) > 0 && as.cuenta.codigo !== "110505")
                        .map((as) => ({ description: as.cuenta.nombre, amount: Number(as.debito) }));
                } else {
                    items = transaccion.asientos
                        .filter((as) => Number(as.credito) > 0 && as.cuenta.codigo !== "110505")
                        .map((as) => ({ description: as.cuenta.nombre, amount: Number(as.credito) }));
                }

                await generatePaymentReceiptPDF({
                    numero: transaccion.numeroComprobante || String(transaccion.consecutivo),
                    fecha: new Date(transaccion.fecha),
                    payer: {
                        nombre: transaccion.proveedor ? transaccion.proveedor.nombres.toUpperCase() : `${transaccion.tercero?.nombres || "Varios"} ${transaccion.tercero?.apellidos || ""}`.trim(),
                        documento: transaccion.proveedor?.numeroDocumento || transaccion.tercero?.numeroDocumento || "N/A",
                    },
                    items: items.length > 0 ? items : [{ description: transaccion.descripcion, amount: Number(transaccion.asientos[0].debito || transaccion.asientos[0].credito) }],
                    total: items.reduce((sum: number, i) => sum + i.amount, 0) || Number(transaccion.asientos[0].debito || transaccion.asientos[0].credito),
                    metodoPago: transaccion.asientos.some((as) => as.cuenta.codigo.startsWith("1110")) ? "BANCO" : "CAJA",
                    elaboradoPor: `${transaccion.creadoPor?.nombres || "Sistema"}`,
                    config: config,
                    title: isEgreso ? "COMPROBANTE DE EGRESO" : "RECIBO DE CAJA",
                    anexoUrl: principalArchivo ? `/api/files/${principalArchivo.nombreUnico}` : undefined,
                    anexoType: principalArchivo?.tipoMime,
                    uniqueId: transaccion.id.slice(0, 8),
                });

                toast.success(`${isEgreso ? "Comprobante" : "Recibo"} generado con éxito`);
            } else {
                toast.error(result.error || "No se pudo obtener la información del recibo");
            }
        } catch (error) {
            toast.error("Error al generar el PDF");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handleDownload} 
            disabled={loading}
            style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "8px", 
                padding: "6px 12px", 
                fontSize: "12px", 
                backgroundColor: "#fff", 
                border: "1px solid #ccc", 
                borderRadius: "4px",
                cursor: loading ? "wait" : "pointer"
            }}
        >
            <Download size={14} />
            {showLabel && (loading ? "Generando..." : "Descargar")}
        </button>
    );
}
