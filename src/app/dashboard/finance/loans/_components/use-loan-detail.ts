"use client";

import React, { useState, useEffect, useRef } from "react";
import { getLoanDetail, disburseLoan, payLoanInstallment, radicateLoanDocument, liquidateFullLoan } from "@/actions/finance/loans";
import { getConfiguracionGlobal } from "@/actions/configuracion";
import { uploadFile } from "@/actions/uploads";
import { pdf } from "@react-pdf/renderer";
import { LoanStatementPDF } from "@/components/modules/finance/loan-statement-pdf";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { ConfiguracionGlobal } from "@prisma/client";
import { PrestamoWithRelations } from "@/types";

export interface EmpresaDato {
    nombre: string;
    nit: string;
    direccion: string;
    telefono: string;
    email: string;
    logo: string;
}

export interface PaymentModalState {
    isOpen: boolean;
    cuotaId: string | null;
    monto: number;
    isLiquidation: boolean;
}

export interface HandlePayParams {
    monto: number;
    metodoPago: string;
    soporteUrl?: string;
    soporteId?: string;
}

const DEFAULT_EMPRESA: EmpresaDato = {
    nombre: "COOPETRAES",
    nit: "900.543.210-8",
    direccion: "CALLE 25 # 14 - 32, EDIFICIO BOLÍVAR",
    telefono: "(605) 282 4455",
    email: "cartera@coopetraes.com",
    logo: "/logo-empresa.png",
};

const DEFAULT_PAYMENT_MODAL: PaymentModalState = {
    isOpen: false,
    cuotaId: null,
    monto: 0,
    isLiquidation: false,
};

export function useLoanDetail(loanId: string | null, isOpen: boolean, onUpdated: () => void) {
    const [loading, setLoading] = useState(false);
    const [loan, setLoan] = useState<PrestamoWithRelations | null>(null);
    const [showStatement, setShowStatement] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [config, setConfig] = useState<ConfiguracionGlobal | null>(null);
    const [isConfirmDeleteRadicationOpen, setIsConfirmDeleteRadicationOpen] = useState(false);
    const [paymentModal, setPaymentModal] = useState<PaymentModalState>(DEFAULT_PAYMENT_MODAL);
    const [empresaDato, setEmpresaDato] = useState<EmpresaDato>(DEFAULT_EMPRESA);
    const statementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (loanId && isOpen) fetchDetail();
    }, [loanId, isOpen]);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const [res, configRes] = await Promise.all([
                getLoanDetail(loanId!),
                getConfiguracionGlobal(),
            ]);

            if (res.success && res.data) {
                setLoan(res.data as PrestamoWithRelations);
            }

            if (configRes.success && configRes.data) {
                const c = configRes.data as ConfiguracionGlobal;
                setConfig(c);
                setEmpresaDato({
                    nombre: c.nombreEmpresa || "COOPETRAES",
                    nit: c.nit || "900.543.210-8",
                    direccion: c.direccion || "CALLE 25 # 14 - 32, EDIFICIO BOLÍVAR",
                    telefono: c.telefono || "(605) 282 4455",
                    email: c.email || "cartera@coopetraes.com",
                    logo: c.logoUrl || (c.logoLocalPath ? `/api/files/${c.logoLocalPath}` : "/logo-empresa.png"),
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDisburse = async () => {
        if (!loan) return;
        setLoading(true);
        try {
            const res = await disburseLoan(loan.id);
            if (res.success) {
                toast.success("Préstamo desembolsado y capital reservado");
                fetchDetail();
                onUpdated();
            } else {
                toast.error(res.error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async (params: HandlePayParams) => {
        if (!paymentModal.cuotaId && !paymentModal.isLiquidation) return;
        setLoading(true);
        const tId = toast.loading(paymentModal.isLiquidation ? "Liquidando crédito..." : "Registrando recaudo...");
        try {
            const res = paymentModal.isLiquidation
                ? await liquidateFullLoan({ loanId: loan!.id, ...params })
                : await payLoanInstallment({ cuotaId: paymentModal.cuotaId!, ...params });

            if (res.success) {
                toast.success(res.message ?? "Operación realizada con éxito", { id: tId });
                setPaymentModal(DEFAULT_PAYMENT_MODAL);
                fetchDetail();
                onUpdated();
            } else {
                toast.error(res.error, { id: tId });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUploadContract = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0] || !loan) return;
        setLoading(true);
        const tId = toast.loading("Radicando documento oficial...");
        try {
            const formData = new FormData();
            formData.append("file", e.target.files[0]);
            const uploadRes = await uploadFile(formData);
            if (uploadRes.success && uploadRes.data) {
                const radRes = await radicateLoanDocument({ loanId: loan.id, url: `/api/files/${uploadRes.data.nombreUnico}` });
                if (radRes.success) {
                    toast.success("Contrato radicado correctamente.", { id: tId });
                    fetchDetail();
                } else {
                    toast.error("Error al radicar: " + radRes.error, { id: tId });
                }
            } else {
                toast.error("Error al subir archivo", { id: tId });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLiquidateRequest = () => {
        if (!loan) return;
        setPaymentModal({ isOpen: true, cuotaId: null, monto: Number(loan.saldoActual), isLiquidation: true });
    };

    const handleDeleteRadication = async () => {
        if (!loan) return;
        setIsConfirmDeleteRadicationOpen(false);
        const tId = toast.loading("Eliminando radicación...");
        const res = await radicateLoanDocument({ loanId: loan.id, url: "" });
        if (res.success) {
            toast.success("Radicación eliminada", { id: tId });
            fetchDetail();
        } else {
            toast.error(res.error, { id: tId });
        }
    };

    const handleDownloadPDF = async () => {
        if (!loan) return;
        const tId = toast.loading("Generando Extracto de Alta Fidelidad (Motor Unificado)...");
        try {
            const blob = await pdf(
                (LoanStatementPDF as any)({ 
                    loan, 
                    empresa: empresaDato 
                })
            ).toBlob();
            
            const safeName = `${loan.usuario?.nombres ?? "Cliente"}_${loan.usuario?.apellidos ?? ""}`.replace(/\s+/g, "_").toUpperCase();
            const filename = `COOPETRAES_EXTRACTO_${safeName}_${loan.id.slice(-8).toUpperCase()}.pdf`;
            
            saveAs(blob, filename);
            toast.success("Extracto descargado correctamente", { id: tId });
        } catch (error) {
            console.error("PDF Error:", error);
            toast.error("Error al generar el PDF", { id: tId });
        }
    };

    return {
        loading, loan, showStatement, setShowStatement,
        previewUrl, setPreviewUrl, config,
        isConfirmDeleteRadicationOpen, setIsConfirmDeleteRadicationOpen,
        paymentModal, setPaymentModal,
        empresaDato, statementRef,
        handleDisburse, handlePay, handleUploadContract,
        handleLiquidateRequest, handleDeleteRadication, handleDownloadPDF,
    };
}
