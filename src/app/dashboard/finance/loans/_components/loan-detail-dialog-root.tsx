"use client";

import React from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { FileText, ChevronLeft, FileCheck, X } from "lucide-react";
import { LoanStatement } from "@/components/modules/finance/loan-statement";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { LoanDetailHeader } from "./loan-detail-header";
import { LoanAmortizationTable } from "./loan-amortization-table";
import { LoanRadicationFooter } from "./loan-radication-footer";
import { PaymentCaptureModal } from "./payment-capture-modal";
import { useLoanDetail } from "./use-loan-detail";
import { CuotaPrestamoItem } from "@/types";

export interface LoanDetailDialogRootProps {
    loanId: string | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdated: () => void;
}

export function LoanDetailDialogRoot({ loanId, isOpen, onClose, onUpdated }: LoanDetailDialogRootProps) {
    const {
        loading, loan, showStatement, setShowStatement,
        previewUrl, setPreviewUrl,
        isConfirmDeleteRadicationOpen, setIsConfirmDeleteRadicationOpen,
        paymentModal, setPaymentModal,
        empresaDato, statementRef,
        handleDisburse, handlePay, handleUploadContract,
        handleLiquidateRequest, handleDeleteRadication, handleDownloadPDF,
    } = useLoanDetail(loanId, isOpen, onUpdated);

    if (loading && !loan) return null;
    if (!loan) return null;

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(o) => { if (!o) { onClose(); setShowStatement(false); } }}>
                <DialogContent className={cn(
                    "rounded-none border-t-8 border-t-slate-900 p-0 overflow-hidden bg-white shadow-2xl transition-all duration-500",
                    showStatement ? "max-w-[900px]" : "max-w-4xl"
                )}>
                    {showStatement ? (
                        <div className="flex flex-col h-[90vh]">
                            <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center shrink-0">
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowStatement(false)}
                                    className="text-[10px] font-black uppercase tracking-widest gap-2"
                                >
                                    <ChevronLeft size={14} /> Volver al Expediente
                                </Button>
                                <Button
                                    onClick={handleDownloadPDF}
                                    className="bg-[#005461] hover:bg-[#018790] text-white rounded-none h-10 px-8 text-[11px] font-black uppercase tracking-widest gap-3 shadow-xl transform active:scale-95 transition-all"
                                >
                                    <FileCheck size={16} /> GENERAR &amp; DESCARGAR PDF
                                </Button>
                            </div>
                            <div className="flex-1 overflow-y-auto bg-slate-200/50 p-6 md:p-12">
                                <div ref={statementRef} className="shadow-2xl">
                                    <LoanStatement loan={loan} empresa={empresaDato} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <LoanDetailHeader loan={loan} />

                            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                {/* Panel lateral izquierdo */}
                                <div className="p-8 bg-slate-50/50 space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] mb-2 italic">Estado de Obligación</p>
                                        <Badge className={cn(
                                            "mt-2 w-full justify-center rounded-none border-none text-[10px] font-black uppercase tracking-widest py-3 shadow-md italic",
                                            loan.estado === "DESEMBOLSADO" ? "bg-emerald-500 text-white" :
                                                loan.estado === "PENDIENTE" ? "bg-amber-500 text-white" : "bg-[#e2e8f0] text-[#94a3b8]"
                                        )}>
                                            {loan.estado}
                                        </Badge>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { label: "Monto Desembolsado", value: formatCurrency(Number(loan.montoCapital ?? 0)) },
                                            { label: "Tasa Aplicada", value: `${(Number(loan.tasaMensual ?? 0) * 100).toFixed(2)}% ${loan.tipo === "FLEXIBLE_DIARIO" ? "DV" : "MV"}` },
                                            { label: "Plazo Original", value: `${loan.numCuotas} ${loan.tipo === "FLEXIBLE_DIARIO" ? "DÍAS" : "MESES"}` },
                                        ].map(({ label, value }) => (
                                            <div key={label} className="bg-white p-4 border border-slate-100 shadow-sm">
                                                <p className="text-[9px] font-black text-[#94a3b8] uppercase tracking-tighter mb-1 italic">{label}</p>
                                                <p className="text-[13px] font-black text-[#0f172a] truncate tracking-tight uppercase italic tabular-nums">{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4 space-y-4">
                                        <Button
                                            onClick={() => setShowStatement(true)}
                                            variant="outline"
                                            className="w-full rounded-none h-12 border-slate-900 text-slate-900 font-black uppercase tracking-widest text-[9px] hover:bg-slate-900 hover:text-white transition-all gap-3"
                                        >
                                            <FileText className="h-4 w-4" />
                                            Generar Contrato / Extracto
                                        </Button>
                                    </div>
                                </div>

                                {/* Tabla de Amortización */}
                                <LoanAmortizationTable
                                    cuotas={(loan.cuotas ?? []) as CuotaPrestamoItem[]}
                                    estadoPrestamo={loan.estado}
                                    tipo={loan.tipo}
                                    onPayClick={(state) => setPaymentModal(state)}
                                    onLiquidateClick={handleLiquidateRequest}
                                />
                            </div>

                            {loan.estado === "PENDIENTE" && (
                                <LoanRadicationFooter
                                    loan={loan}
                                    loading={loading}
                                    onUpload={handleUploadContract}
                                    onPreview={(url) => setPreviewUrl(url)}
                                    onDeleteRadication={() => setIsConfirmDeleteRadicationOpen(true)}
                                    onDisburse={handleDisburse}
                                />
                            )}

                            <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100">
                                <Button onClick={onClose} variant="ghost" className="rounded-none font-black uppercase text-[10px] tracking-widest h-12 hover:bg-white transition-colors">
                                    Cerrar Expediente
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <PaymentCaptureModal
                isOpen={paymentModal.isOpen}
                onClose={() => setPaymentModal({ ...paymentModal, isOpen: false })}
                onConfirm={handlePay}
                initialAmount={paymentModal.monto}
                title={paymentModal.isLiquidation ? "Liquidación de Crédito" : "Captura de Recaudo"}
                isLiquidation={paymentModal.isLiquidation}
            />

            <ConfirmDialog
                isOpen={isConfirmDeleteRadicationOpen}
                onClose={() => setIsConfirmDeleteRadicationOpen(false)}
                onConfirm={handleDeleteRadication}
                title="Eliminar Radicación"
                description="Se eliminará el contrato cargado. Deberá cargar uno nuevo."
                variant="warning"
                loading={loading}
            />

            <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
                <DialogContent className="max-w-4xl h-[85vh] p-0 overflow-hidden bg-slate-900 border-none rounded-none shadow-2xl">
                    <div className="p-4 border-b border-white/5 flex flex-row items-center justify-between bg-slate-900">
                        <span className="text-white text-[12px] font-black uppercase tracking-widest italic">VISUALIZADOR OFICIAL</span>
                        <Button variant="ghost" size="icon" className="text-white/50 hover:text-white" onClick={() => setPreviewUrl(null)}>
                            <X size={20} />
                        </Button>
                    </div>
                    <div className="flex-1 w-full bg-slate-800 flex items-center justify-center">
                        {previewUrl && (
                            previewUrl.toLowerCase().endsWith(".pdf")
                                ? <iframe src={previewUrl} className="w-full h-full border-none bg-white" title="Previsualización PDF" />
                                : <img src={previewUrl} className="max-w-full max-h-full object-contain p-8" alt="Documento" />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
