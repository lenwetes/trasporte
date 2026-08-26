"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
    getPlanesMantenimiento,
    getAlertasMantenimiento,
    createPlanMantenimiento,
    createMantenimientoRealizado,
    getHistorialGlobal,
    createOrdenServicio,
    completeOrdenServicio,
    rechazarOrdenServicio,
    getOrdenServicioParaImpresion,
    getOrdenesEnRevision,
    getMaintenanceStats,
    getAllMaintenancePredictions,
} from "@/actions/mantenimiento";
import { getVehiculosList, uploadFile } from "@/actions";
import { toast } from "sonner";
import { generateOSPDF } from "@/lib/pdf-generator-os";
import type {
    PlanMantenimiento,
    Vehiculo,
    OrdenServicio,
    ConfiguracionGlobal,
    Usuario,
} from "@prisma/client";
import {
    MaintenanceAlert,
    GlobalHistoryItem,
    MaintenancePrediction,
    OrdenRevision,
} from "../types";

function extractArrayData<T>(d: unknown): T[] {
    if (Array.isArray(d)) return d;
    if (d && typeof d === "object" && "data" in d) {
        const nestedData = (d as { data: unknown }).data;
        return Array.isArray(nestedData) ? (nestedData as T[]) : [];
    }
    return [];
}

export function useMaintenance() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const activeTab = searchParams.get("tab") || "operaciones";

    const setActiveTab = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", value);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const [planes, setPlanes] = useState<PlanMantenimiento[]>([]);
    const [alertas, setAlertas] = useState<MaintenanceAlert[]>([]);
    const [predictions, setPredictions] = useState<MaintenancePrediction[]>([]);
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [historial, setHistorial] = useState<GlobalHistoryItem[]>([]);
    const [ordenesRevision, setOrdenesRevision] = useState<OrdenRevision[]>([]);
    const [stats, setStats] = useState<{ placa: string; total: number }[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal states
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [selectedAlerta, setSelectedAlerta] =
        useState<MaintenanceAlert | null>(null);
    const [selectedOrdenId, setSelectedOrdenId] = useState<string | null>(null);
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadData = useCallback(async () => {
        router.refresh();
        try {
            const [
                planesRes,
                alertasRes,
                predRes,
                vehRes,
                historyRes,
                statsRes,
                revRes,
            ] = await Promise.all([
                getPlanesMantenimiento(),
                getAlertasMantenimiento(),
                getAllMaintenancePredictions(),
                getVehiculosList(),
                getHistorialGlobal(),
                getMaintenanceStats(),
                getOrdenesEnRevision(),
            ]);

            if (planesRes.success && planesRes.data) {
                setPlanes(extractArrayData<PlanMantenimiento>(planesRes.data));
            }
            if (alertasRes.success && alertasRes.data) {
                setAlertas(extractArrayData<MaintenanceAlert>(alertasRes.data));
            }
            if (predRes.success && predRes.data) {
                setPredictions(
                    extractArrayData<MaintenancePrediction>(predRes.data),
                );
            }
            if (vehRes.success && vehRes.data) {
                setVehiculos(extractArrayData<Vehiculo>(vehRes.data));
            }
            if (historyRes.success && historyRes.data) {
                setHistorial(
                    extractArrayData<GlobalHistoryItem>(historyRes.data),
                );
            }
            if (statsRes.success && statsRes.data) {
                setStats(
                    extractArrayData<{ placa: string; total: number }>(statsRes.data),
                );
            }
            if (revRes.success && revRes.data) {
                setOrdenesRevision(
                    extractArrayData<OrdenRevision>(revRes.data),
                );
            }
        } catch (error) {
            console.error("Error loading maintenance data:", error);
            toast.error("Error al refrescar los datos");
        }
    }, [router]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleCreatePlan = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.target as HTMLFormElement);

        const data = {
            nombre: formData.get("nombre") as string,
            descripcion: formData.get("descripcion") as string,
            frecuencia: formData.get("frecuencia") as
                | "KILOMETROS"
                | "TIEMPO"
                | "AMBOS",
            kmIntervalo: formData.get("kmIntervalo")
                ? Number(formData.get("kmIntervalo"))
                : null,
            mesesIntervalo: formData.get("mesesIntervalo")
                ? Number(formData.get("mesesIntervalo"))
                : null,
        };

        const res = await createPlanMantenimiento(data);
        setIsSubmitting(false);
        if (res.success) {
            toast.success("Plan creado exitosamente");
            setIsPlanModalOpen(false);
            loadData();
        } else {
            toast.error(res.error || "Error al crear el plan");
        }
    };

    const handleRegisterMaintenance = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.target as HTMLFormElement);

        const data = {
            vehiculoId: formData.get("vehiculoId") as string,
            planId: formData.get("planId") as string,
            fecha: new Date(formData.get("fecha") as string),
            kilometraje: Number(formData.get("kilometraje")),
            costo: formData.get("costo") ? Number(formData.get("costo")) : null,
            observaciones: formData.get("observaciones") as string,
        };

        const res = await createMantenimientoRealizado(data);
        setIsSubmitting(false);
        if (res.success) {
            toast.success("Mantenimiento registrado");
            setIsRegisterModalOpen(false);
            loadData();
        } else {
            toast.error(res.error || "Error al registrar");
        }
    };

    const handleIssueOrder = async (vehiculoId: string, planId: string) => {
        const promise = createOrdenServicio({ vehiculoId, planId });

        toast.promise(promise, {
            loading: "Emitiendo orden de servicio...",
            success: (res: { success: boolean; data?: any; error?: string }) => {
                if (res.success && res.data) {
                    loadData();
                    const data = res.data as { codigo: string };
                    return `Orden de servicio ${data.codigo} emitida correctamente.`;
                }
                throw new Error(res.error || "Error al emitir orden");
            },
            error: (err: { message?: string }) => err.message || "Error al emitir orden",
        });
    };

    const handleValidateAlert = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.target as HTMLFormElement);

        try {
            const file = formData.get("comprobante") as File;
            if (!file || file.size === 0) {
                toast.error(
                    "Debes subir un comprobante o foto de la evidencia",
                );
                setIsSubmitting(false);
                return;
            }

            const uploadFormData = new FormData();
            uploadFormData.append("file", file);
            const uploadRes = await uploadFile(uploadFormData);

            if (!uploadRes.success || !uploadRes.data) {
                toast.error("Error al subir el comprobante");
                setIsSubmitting(false);
                return;
            }

            const data = {
                vehiculoId: selectedAlerta!.vehiculoId,
                planId: selectedAlerta!.planId,
                kilometraje: Number(formData.get("kilometraje")),
                costo: Number(formData.get("costo") || 0),
                observaciones: formData.get("observaciones") as string,
                archivoId: uploadRes.data.id,
            };

            const { solicitarRevisionMantenimiento } =
                await import("@/actions/maintenance/orders");
            const res = await solicitarRevisionMantenimiento(data);

            if (res.success) {
                toast.success("Solicitud enviada a revisión correctamente");
                setIsValidationModalOpen(false);
                setSelectedAlerta(null);
                loadData();
            } else {
                toast.error(res.error || "Error al solicitar revisión");
            }
        } catch (error) {
            console.error("Error validating alert:", error);
            toast.error("Error inesperado");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCompleteOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.target as HTMLFormElement);

        try {
            const file = formData.get("certificado") as File;
            let archivoId = undefined;

            if (file && file.size > 0) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", file);
                const uploadRes = await uploadFile(uploadFormData);
                if (uploadRes.success && uploadRes.data) {
                    archivoId = uploadRes.data.id;
                } else {
                    toast.error("Error al subir certificado");
                    setIsSubmitting(false);
                    return;
                }
            }

            const data = {
                ordenId: selectedOrdenId!,
                kilometraje: Number(formData.get("kilometraje")),
                costo: Number(formData.get("costo")),
                observaciones: formData.get("observaciones") as string,
                archivoId,
            };

            const res = await completeOrdenServicio(data);
            if (res.success) {
                toast.success("Orden completada exitosamente");
                setIsCompleteModalOpen(false);
                setSelectedOrdenId(null);
                await loadData();
            } else {
                toast.error(res.error || "Error al completar orden");
            }
        } catch (error) {
            console.error("Error in handleCompleteOrder:", error);
            toast.error("Ocurrió un error inesperado");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRejectOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.target as HTMLFormElement);

        try {
            const motivo = formData.get("motivoRechazo") as string;
            
            const res = await rechazarOrdenServicio({
                id: selectedOrdenId!,
                motivo,
            });

            if (res.success) {
                toast.success("Orden rechazada exitosamente");
                setIsCompleteModalOpen(false);
                setSelectedOrdenId(null);
                await loadData();
            } else {
                toast.error(res.error || "Error al rechazar orden");
            }
        } catch (error) {
            console.error("Error in handleRejectOrder:", error);
            toast.error("Ocurrió un error inesperado");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePrintOrder = async (ordenId: string) => {
        const res = await getOrdenServicioParaImpresion(ordenId);
        if (res.success && res.data) {
            const { orden, config } = res.data as {
                orden: OrdenServicio & {
                    vehiculo: Vehiculo;
                    plan: PlanMantenimiento;
                };
                config: ConfiguracionGlobal | null;
            };
            await generateOSPDF({
                orden,
                vehiculo: orden.vehiculo,
                propietario: (orden.vehiculo as unknown as { propietarioUser: Usuario | null }).propietarioUser,
                plan: orden.plan,
                config,
            });
        } else {
            toast.error(res.error || "Error al obtener datos para el PDF");
        }
    };

    return {
        activeTab,
        setActiveTab,
        planes,
        alertas,
        predictions,
        vehiculos,
        historial,
        ordenesRevision,
        stats,
        searchTerm,
        setSearchTerm,
        isRegisterModalOpen,
        setIsRegisterModalOpen,
        isPlanModalOpen,
        setIsPlanModalOpen,
        isCompleteModalOpen,
        setIsCompleteModalOpen,
        selectedAlerta,
        setSelectedAlerta,
        selectedOrdenId,
        setSelectedOrdenId,
        selectedOrden: ordenesRevision.find((o) => o.id === selectedOrdenId) || null,
        isValidationModalOpen,
        setIsValidationModalOpen,
        isSubmitting,
        handleCreatePlan,
        handleRegisterMaintenance,
        handleIssueOrder,
        handleValidateAlert,
        handleCompleteOrder,
        handleRejectOrder,
        handlePrintOrder,
        loadData,
    };
}
