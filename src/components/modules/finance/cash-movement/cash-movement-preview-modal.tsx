"use client";

import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PDFViewer } from "@react-pdf/renderer";
import { VoucherDocument } from "@/app/dashboard/finance/_components/voucher-document";
import { TransaccionWithRelations } from "@/types";

interface CashMovementPreviewModalProps {
    showPreviewModal: boolean;
    setShowPreviewModal: (val: boolean) => void;
    previewTransaction: TransaccionWithRelations | null;
    tipoSeleccionado: string;
}

export function CashMovementPreviewModal({
    showPreviewModal,
    setShowPreviewModal,
    previewTransaction,
    tipoSeleccionado
}: CashMovementPreviewModalProps) {
    return (
        <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
            <DialogContent className="max-w-5xl h-[85vh] p-0 flex flex-col bg-white border-2 border-primary shadow-2xl rounded-none gap-0">
                <DialogHeader className="p-4 bg-slate-50 border-b border-primary/10 flex flex-row items-center gap-4 shrink-0 pointer-events-none">
                    <div className="h-10 w-10 bg-primary text-white flex items-center justify-center shrink-0">
                        <Eye size={20} />
                    </div>
                    <div className="flex flex-col text-left">
                        <DialogTitle className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">
                            Visor de Auditoría: {tipoSeleccionado === "INGRESO" ? "Recibo de Caja (RC)" : "Comprobante de Egreso (CE)"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-900 text-[9px] uppercase tracking-widest font-black">
                            Pre-validación de asientos y numeración serial de borrador
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <div className="flex-1 w-full bg-slate-100 p-4 overflow-hidden relative">
                    <div className="w-full h-full bg-white shadow-2xl border border-primary/10">
                        {previewTransaction && (
                            <PDFViewer width="100%" height="100%" className="border-none" showToolbar={true}>
                                <VoucherDocument 
                                    transaction={previewTransaction} 
                                    config={{ 
                                        nombreEmpresa: "COOPETRAES", 
                                        nit: "900.543.210-8", 
                                        direccion: "CALLE 25 # 14 - 32, EDIFICIO BOLIVAR",
                                        telefono: "(605) 282 4455",
                                        logoUrl: `${process.env.NEXT_PUBLIC_APP_URL || ""}/logo-empresa.png`
                                    }} 
                                    actor={{ nombres: "ADMINISTADOR", apellidos: "SISTEMA" }} 
                                />
                            </PDFViewer>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
