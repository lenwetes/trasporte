"use client";

import { useState, useEffect } from "react";
import {
    getFinanceMetadata,
    createManualTransaction,
} from "@/actions/finance/transactions";
import { toast } from "sonner";

export interface ManualTransactionFormData {
    descripcion: string;
    tipo: "INGRESO" | "EGRESO" | "NOTA_CONTABLE";
    terceroId: string;
    proveedorId: string;
    metaVehiculoId: string;
    asientos: { cuentaId: string; debito: number; credito: number }[];
}

export interface FinanceMetadata {
    usuarios: {
        id: string;
        nombres: string;
        apellidos: string;
        numeroDocumento: string | null;
    }[];
    proveedores: {
        id: string;
        nombres: string;
        apellidos: string;
        numeroDocumento: string | null;
    }[];
    vehiculos: { id: string; placa: string; clase?: string }[];
    cuentas: { id: string; codigo: string; nombre: string }[];
    conceptos: { id: string; nombre: string; cuentaId: string }[];
}

export function useTransactionForm(
    open: boolean,
    setOpen: (open: boolean) => void,
    defaultType: "INGRESO" | "EGRESO" | "NOTA_CONTABLE" = "NOTA_CONTABLE",
) {
    const [loading, setLoading] = useState(false);
    const [metadata, setMetadata] = useState<FinanceMetadata | null>(null);
    const [mode, setMode] = useState<"simple" | "advanced">("simple");
    const [terceroType, setTerceroType] = useState<"user" | "provider">("user");
    const [providerDialogOpen, setProviderDialogOpen] = useState(false);

    const [simpleData, setSimpleData] = useState({
        conceptoId: "",
        monto: 0,
        metodoPago: "",
    });

    const [formData, setFormData] = useState<ManualTransactionFormData>({
        descripcion: "",
        tipo: defaultType,
        terceroId: "",
        proveedorId: "",
        metaVehiculoId: "",
        asientos: [
            { cuentaId: "", debito: 0, credito: 0 },
            { cuentaId: "", debito: 0, credito: 0 },
        ],
    });

    const loadMetadata = async () => {
        try {
            const res = await getFinanceMetadata();
            if (res.success && res.data) {
                setMetadata(res.data as unknown as FinanceMetadata);
            }
        } catch (error) {
            console.error("Error loading metadata:", error);
        }
    };

    useEffect(() => {
        if (open) loadMetadata();
    }, [open]);

    useEffect(() => {
        if (
            mode === "simple" &&
            simpleData.conceptoId &&
            simpleData.metodoPago &&
            simpleData.monto > 0
        ) {
            const concepto = metadata?.conceptos.find(
                (c) => c.id === simpleData.conceptoId,
            );
            const cuentaPago = metadata?.cuentas.find(
                (c) => c.id === simpleData.metodoPago,
            );

            if (concepto && cuentaPago) {
                const isIngreso = formData.tipo === "INGRESO";
                const nuevosAsientos = [
                    {
                        cuentaId: simpleData.metodoPago,
                        debito: isIngreso ? simpleData.monto : 0,
                        credito: isIngreso ? 0 : simpleData.monto,
                    },
                    {
                        cuentaId: concepto.cuentaId,
                        debito: isIngreso ? 0 : simpleData.monto,
                        credito: isIngreso ? simpleData.monto : 0,
                    },
                ];
                setFormData((prev) => ({ ...prev, asientos: nuevosAsientos }));
            }
        }
    }, [simpleData, mode, formData.tipo, metadata]);

    const handleAddAsiento = () => {
        setFormData({
            ...formData,
            asientos: [
                ...formData.asientos,
                { cuentaId: "", debito: 0, credito: 0 },
            ],
        });
    };

    const handleRemoveAsiento = (index: number) => {
        const newAsientos = [...formData.asientos];
        newAsientos.splice(index, 1);
        setFormData({ ...formData, asientos: newAsientos });
    };

    const updateAsiento = (
        index: number,
        field: string,
        value: string | number,
    ) => {
        const newAsientos = [...formData.asientos];
        newAsientos[index] = { ...newAsientos[index], [field]: value };
        setFormData({ ...formData, asientos: newAsientos });
    };

    const totalDebito = formData.asientos.reduce(
        (sum, a) => sum + Number(a.debito),
        0,
    );
    const totalCredito = formData.asientos.reduce(
        (sum, a) => sum + Number(a.credito),
        0,
    );
    const isBalanced =
        Math.abs(totalDebito - totalCredito) < 0.01 && totalDebito > 0;

    const handleSubmit = async () => {
        if (!formData.descripcion)
            return toast.error("La descripción es obligatoria");
        if (!isBalanced)
            return toast.error(
                "La transacción debe estar balanceada y con valor mayor a 0",
            );
        if (formData.asientos.some((a) => !a.cuentaId))
            return toast.error(
                "Todas las filas deben tener una cuenta seleccionada",
            );

        setLoading(true);
        try {
            const res = await createManualTransaction(formData);
            if (res.success) {
                toast.success("Transacción registrada correctamente");
                setOpen(false);
                setFormData({
                    descripcion: "",
                    tipo: defaultType,
                    terceroId: "",
                    proveedorId: "",
                    metaVehiculoId: "",
                    asientos: [
                        { cuentaId: "", debito: 0, credito: 0 },
                        { cuentaId: "", debito: 0, credito: 0 },
                    ],
                });
                setSimpleData({ conceptoId: "", monto: 0, metodoPago: "" });
            } else {
                toast.error(res.error || "Error al registrar");
            }
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("Error al procesar la transacción");
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        metadata,
        loadMetadata,
        mode,
        setMode,
        terceroType,
        setTerceroType,
        providerDialogOpen,
        setProviderDialogOpen,
        simpleData,
        setSimpleData,
        formData,
        setFormData,
        handleAddAsiento,
        handleRemoveAsiento,
        updateAsiento,
        totalDebito,
        totalCredito,
        isBalanced,
        handleSubmit,
    };
}
