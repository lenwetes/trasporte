"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createCashMovement } from "@/actions/finance/cash-movements";
import { getFinanceMetadata } from "@/actions/finance/transactions";
import { getFinanceSettings } from "@/actions/finance/settings";
import { toast } from "sonner";
import { MetodoPago } from "@prisma/client";
import type {
    TerceroData,
    FinanceMetadata,
    CashMovementFormProps,
    FinanceSettingsData
} from "./types";
import { TransaccionWithRelations, ActionResult } from "@/types";
import { 
    ConfiguracionGlobal, 
    TipoTransaccion, 
    MetodoPago as PrismaMetodoPago,
    Prisma 
} from "@prisma/client";

export const cashMovementSchema = z.object({
    tipo: z.enum(["INGRESO", "EGRESO", "SALDO_INICIAL"]),
    conceptoId: z.string().min(1, "Selecciona un concepto"),
    monto: z.string().min(1, "Ingresa el monto total"),
    fechaOperacion: z.date().optional(),
    pagos: z.array(z.object({
        metodo: z.nativeEnum(MetodoPago),
        monto: z.string(), // Dejamos que sea opcional para evitar errores mientras escriben
    })).min(1, "Debe agregar al menos un método de pago"),
    descripcion: z.string().optional(),
});

export type CashMovementFormData = z.infer<typeof cashMovementSchema>;

/**
 * Hook que encapsula toda la lógica para pagos mixtos en caja.
 */
export function useCashMovementForm({
    conceptosIngreso,
    conceptosEgreso,
}: CashMovementFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showProviderDialog, setShowProviderDialog] = useState(false);
    const [terceroData, setTerceroData] = useState<TerceroData | null>(null);
    const [archivoId, setArchivoId] = useState<string | null>(null);
    const [metadata, setMetadata] = useState<FinanceMetadata | null>(null);
    const [loadingMetadata, setLoadingMetadata] = useState(true);
    const [globalConfig, setGlobalConfig] = useState<ConfiguracionGlobal | null>(null);
    const [previewTransaction, setPreviewTransaction] = useState<TransaccionWithRelations | null>(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [isSplitMode, setIsSplitMode] = useState(false);

    const form = useForm<CashMovementFormData>({
        resolver: zodResolver(cashMovementSchema),
        defaultValues: {
            tipo: "INGRESO",
            conceptoId: "",
            monto: "",
            fechaOperacion: new Date(),
            pagos: [{ metodo: MetodoPago.EFECTIVO, monto: "" }],
            descripcion: "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "pagos",
    });

    const tipoSeleccionado = form.watch("tipo");
    const montoTotal = form.watch("monto");
    const conceptosDisponibles =
        tipoSeleccionado === "INGRESO" ? conceptosIngreso : conceptosEgreso;

    const loadMetadata = async (): Promise<void> => {
        setLoadingMetadata(true);
        try {
            const [metaRes, configRes] = await Promise.all([
                getFinanceMetadata(),
                getFinanceSettings()
            ]);

            if (metaRes.success && metaRes.data) {
                setMetadata(metaRes.data as unknown as FinanceMetadata);
            }
            if (configRes.success && configRes.data) {
                setGlobalConfig(configRes.data.configuracionGlobal);
            }
        } catch (error) {
            console.error("Error loading finance metadata:", error);
        } finally {
            setLoadingMetadata(false);
        }
    };

    useEffect(() => {
        loadMetadata();
    }, []);

    // Sincronización Inteligente de Montos (Lógica del Péndulo)
    const watchPagos = form.watch("pagos");
    const watchMontoTotal = form.watch("monto");

    // Lógica Derivada: En vez de forzar setValues que causan bugs de renderizado, 
    // calculamos el balance dinámicamente.
    const getPenduloValue = () => {
        const total = parseFloat(watchMontoTotal) || 0;
        if (!isSplitMode) return total.toString();
        
        const otherPayments = watchPagos.slice(1).reduce((acc, p) => acc + (parseFloat(p.monto) || 0), 0);
        return Math.max(0, total - otherPayments).toString();
    };

    /**
     * Genera transacción mock para PDF
     */
    const preparePreview = () => {
        const data = form.getValues();
        const monto = parseFloat(data.monto) || 0;
        const payments = data.pagos.map((p) => ({ ...p, val: parseFloat(p.monto) || 0 }));
        
        if (monto <= 0) {
            toast.error("El monto total debe ser superior a cero.");
            return;
        }

        // Apply derived Pendulo logic for preview to match what backend will receive
        if (payments.length > 0) {
            if (isSplitMode) {
                const otherSum = payments.slice(1).reduce((acc, p) => acc + p.val, 0);
                payments[0].val = Math.max(0, monto - otherSum);
            } else {
                payments[0].val = monto;
                payments.splice(1);
            }
        }

        const baseConcepto = conceptosDisponibles.find(c => c.id === data.conceptoId);

        // Correction Layer: Si el concepto seleccionado es "Otros Ingresos" pero tiene la cuenta de multas, lo corregimos
        const isMiscellaneous = baseConcepto?.nombre.toLowerCase().includes("otros ingresos");
        const isSaldoInicial = data.tipo === "SALDO_INICIAL";
        
        const mockConcepto = baseConcepto ? {
            ...baseConcepto,
            cuenta: {
                ...baseConcepto.cuenta,
                codigo: isMiscellaneous ? "429595" : baseConcepto.cuenta.codigo,
                nombre: isMiscellaneous ? "Otros Ingresos" : baseConcepto.cuenta.nombre,
                id: baseConcepto.cuenta.id
            }
        } : (isSaldoInicial ? {
            id: "SALDO_INICIAL",
            nombre: "SALDO INICIAL / APERTURA",
            cuenta: { id: "311505-ID", codigo: "311505", nombre: "Aportes Sociales (Apertura)" } // Cuenta de Capital para Saldo Inicial
        } : {
            id: "GENERICO",
            nombre: "Otros Ingresos",
            cuenta: { 
                id: "GENERICO-ID",
                codigo: data.tipo === "INGRESO" ? "429595" : "519595", 
                nombre: data.tipo === "INGRESO" ? "Otros Ingresos" : "Gastos Diversos" 
            }
        });
        
        // 1. Asiento de Contrapartida (El Concepto / Ingreso o Gasto principal)
        const mockAsientos = [
            {
                cuenta: mockConcepto.cuenta,
                debito: data.tipo === "EGRESO" ? monto : 0,
                credito: data.tipo === "INGRESO" ? monto : 0,
            }
        ];

        // 2. Asientos de Distribución de Fondos
        // Fila 0 (Canal Péndulo)
        const firstMetodo = payments[0]?.metodo;
        mockAsientos.push({
            cuenta: { 
                id: firstMetodo === MetodoPago.EFECTIVO ? "110505-ID" : "111005-ID",
                nombre: firstMetodo === MetodoPago.EFECTIVO ? "Caja General" : "Bancos", 
                codigo: firstMetodo === MetodoPago.EFECTIVO ? "110505" : "111005" 
            },
            debito: data.tipo === "INGRESO" ? payments[0].val : 0,
            credito: data.tipo === "EGRESO" ? payments[0].val : 0,
        });

        // Filas Secundarias
        payments.slice(1).forEach((p) => {
            const isBanco = p.metodo === MetodoPago.TRANSFERENCIA || p.metodo === MetodoPago.CHEQUE;
            mockAsientos.push({
                cuenta: { 
                    id: isBanco ? "111005-ID" : "110505-ID",
                    nombre: isBanco ? "Bancos" : "Caja General", 
                    codigo: isBanco ? "111005" : "110505" 
                },
                debito: data.tipo === "INGRESO" ? p.val : 0,
                credito: data.tipo === "EGRESO" ? p.val : 0,
            });
        });

        const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const serialNum = `${data.tipo === "INGRESO" ? "RC" : "CE"}-${dateStr}-0X`;

        const mockTx: TransaccionWithRelations = {
            id: `PREVIEW-${serialNum}`,
            numeroComprobante: `${serialNum} (DOCUMENTO PRELIMINAR)`,
            descripcion: data.descripcion || mockConcepto.nombre,
            tipo: data.tipo === "SALDO_INICIAL" ? TipoTransaccion.INGRESO : (data.tipo as TipoTransaccion),
            fecha: new Date(),
            fechaOperacion: new Date(),
            creadoPorId: "current",
            terceroId: terceroData?.id || null,
            proveedorId: null,
            metaVehiculoId: null,
            soporteUrl: null,
            cufe: null,
            esElectronica: false,
            resolucionId: null,
            metodoPago: data.pagos[0].metodo as PrismaMetodoPago,
            creadoEn: new Date(),
            actualizadoEn: new Date(),
            consecutivo: 0,
            documentoNumero: serialNum,
            asientos: mockAsientos.map((a, i) => ({
                id: `mock-${i}`,
                transaccionId: `PREVIEW-${serialNum}`,
                cuentaId: (a.cuenta as any).id || "mock",
                debito: new Prisma.Decimal(a.debito),
                credito: new Prisma.Decimal(a.credito),
                creadoEn: new Date(),
                cuenta: a.cuenta as any // Mocking account relation
            })),
            tercero: terceroData ? { 
                id: terceroData.id,
                nombres: terceroData.nombres, 
                apellidos: terceroData.apellidos || "", 
                numeroDocumento: terceroData.documento || "",
                email: null,
                telefono: null,
                direccion: null,
                activo: true,
                creadoEn: new Date(),
                actualizadoEn: new Date(),
                tipoDocumento: "CC",
                fechaNacimiento: null,
                lugarNacimiento: null,
                estadoCivil: null,
                municipio: null,
                passwordHash: "",
                rol: "CONDUCTOR",
                idFotoPerfil: null,
                eliminadoEn: null,
                numeroLicencia: null,
                ultimoLogin: null,
                ultimaRevisionSIMIT: null,
                version: 0,
                idDocumentoIdentidad: null,
                margenConfianza: new Prisma.Decimal(0)
            } as any : null,
            proveedor: null,
            archivos: [],
            creadoPor: { 
                id: "current", 
                nombres: "Usuario", 
                apellidos: "Actual",
                rol: "ADMIN",
                creadoEn: new Date(),
                actualizadoEn: new Date(),
                email: "",
                passwordHash: "",
                activo: true,
                tipoDocumento: "CC"
            } as any,
        };

        setPreviewTransaction(mockTx);
        setShowPreviewModal(true);
    };

    const onSubmit = async (data: CashMovementFormData): Promise<void> => {
        setIsSubmitting(true);
        try {
            const monto = parseFloat(data.monto) || 0;
            const detox = data.pagos.map(p => ({
                metodo: p.metodo,
                monto: parseFloat(p.monto) || 0
            }));

            // Enforce pendulo logic exactly as derived
            if (detox.length > 0) {
                if (isSplitMode) {
                    const otherSum = detox.slice(1).reduce((acc, p) => acc + p.monto, 0);
                    detox[0].monto = Math.max(0, monto - otherSum);
                } else {
                    detox[0].monto = monto;
                    detox.splice(1); // Drop any extra elements if not in split mode
                }
            }

            const result = await createCashMovement({
                tipo: data.tipo,
                conceptoId: data.conceptoId,
                monto: monto,
                detallesPago: detox,
                descripcion: data.descripcion ?? undefined,
                fechaOperacion: data.fechaOperacion,
                terceroId: terceroData?.id,
                proveedorId: terceroData?.type === "provider" ? terceroData.id : undefined,
                archivoId: archivoId ?? undefined,
            });

            if (result.success) {
                toast.success("✅ Operación consolidada y registrada en el libro mayor");
                form.reset({
                    tipo: data.tipo,
                    conceptoId: "",
                    monto: "",
                    pagos: [{ metodo: MetodoPago.EFECTIVO, monto: "" }],
                    descripcion: "",
                });
                setTerceroData(null);
                setArchivoId(null);
                setIsSplitMode(false);
            } else {
                toast.error(result.error ?? "Fallo en la validación");
            }
        } catch {
            toast.error("Error en la conexión con tesorería");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleSplitMode = () => {
        const currentMonto = form.getValues("monto");
        if (!isSplitMode && currentMonto) {
            form.setValue("pagos.0.monto", currentMonto);
        }
        setIsSplitMode(!isSplitMode);
    };

    return {
        form,
        fields,
        append,
        remove,
        tipoSeleccionado,
        conceptosDisponibles,
        isSubmitting,
        showProviderDialog,
        setShowProviderDialog,
        terceroData,
        setTerceroData,
        metadata,
        loadingMetadata,
        loadMetadata,
        globalConfig,
        previewTransaction,
        showPreviewModal,
        setShowPreviewModal,
        preparePreview,
        onSubmit,
        isSplitMode,
        toggleSplitMode,
        getPenduloValue
    };
}
