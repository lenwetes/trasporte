import { useState } from "react";
import { toast } from "sonner";
import { checkSimitAction, getSimitHistory } from "@/actions/simit";
import { SimitUpdateModuleProps, SimitResult, SimitHistory } from "./simit-update-module.types";

export function useSimitUpdate({ conductores, vehiculos }: SimitUpdateModuleProps) {
    const [selectedId, setSelectedId] = useState<string>("");
    const [selectedType, setSelectedType] = useState<'CONDUCTOR' | 'VEHICULO'>('CONDUCTOR');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<SimitResult | null>(null);
    const [history, setHistory] = useState<SimitHistory[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [isServerDown, setIsServerDown] = useState(false);

    const fetchHistory = async () => {
        if (!selectedId) return;
        try {
            const res = await getSimitHistory({ id: selectedId, type: selectedType });
            if (res.success && Array.isArray(res.data)) {
                setHistory(res.data as SimitHistory[]);
            }
        } catch (error) {
            console.error("Error al obtener historial SIMIT:", error);
        }
    };

    const handleCheck = async () => {
        if (!selectedId) {
            toast.error("Seleccione un conductor o vehículo");
            return;
        }

        const conductor = selectedType === 'CONDUCTOR' ? conductores.find(c => c.id === selectedId) : null;
        const vehiculo = selectedType === 'VEHICULO' ? vehiculos.find(v => v.id === selectedId) : null;

        const criterio = selectedType === 'CONDUCTOR' ? conductor?.documento : vehiculo?.placa;

        if (!criterio) {
            toast.error("Datos insuficientes para la consulta");
            return;
        }

        setIsLoading(true);
        setResult(null);
        setIsServerDown(false);
        try {
            const res = await checkSimitAction({ id: selectedId, type: selectedType, criterio });
            if (res.success) {
                const data = res.data as SimitResult & { estado?: string };
                if (data.estado === "EN_COLA") {
                    setResult({
                        estadoCuenta: "PROCESANDO_EN_SEGUNDO_PLANO",
                        valorTotal: 0,
                        numeroComparendos: 0,
                        mensaje: data.mensaje
                    });
                    toast.info(data.mensaje || "Consulta en segundo plano iniciada");
                } else {
                    setResult(data);
                    toast.success("Auditoría SIMIT completada con éxito");
                }
                if (showHistory) fetchHistory();
            } else {
                if (res.error?.includes("SERVIDOR_CAIDO")) {
                    setIsServerDown(true);
                    toast.error("Servidor SIMIT de la FCM fuera de servicio temporalmente");
                } else {
                    toast.error(res.error || "Falla en la consulta del servicio nacional");
                }
            }
        } catch (e: unknown) {
            toast.error("Error crítico de infraestructura en el enlace SIMIT");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleHistory = () => {
        const nextState = !showHistory;
        setShowHistory(nextState);
        if (nextState) fetchHistory();
    };

    return {
        selectedId,
        setSelectedId,
        selectedType,
        setSelectedType,
        isLoading,
        result,
        setResult,
        history,
        showHistory,
        isServerDown,
        handleCheck,
        toggleHistory,
        fetchHistory
    };
}
