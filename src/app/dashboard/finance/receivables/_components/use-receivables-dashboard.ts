import { useState, useMemo } from "react";
import { parseISO, differenceInDays } from "date-fns";
import { toast } from "sonner";
import { notifyDeudoresMorosos } from "@/actions/finance/receivables.actions";
import { UnifiedReceivable } from "@/types";

export function useReceivablesDashboard(data: UnifiedReceivable[]) {
    const [filter, setFilter] = useState<"ALL" | "MORA" | "PRESTAMOS" | "OBLIGACIONES">("ALL");
    const [searchTerm, setSearchTerm] = useState("");
    const [isNotifying, setIsNotifying] = useState(false);

    const now = new Date();

    const { morosos, prestamos, obligaciones, totalCartera, totalMora, totalLoans } = useMemo(() => {
        const m: UnifiedReceivable[] = [];
        const p: UnifiedReceivable[] = [];
        const o: UnifiedReceivable[] = [];
        let tC = 0; let tM = 0; let tL = 0;

        data.forEach((item) => {
            const fechaVence = typeof item.fechaVence === 'string' ? parseISO(item.fechaVence) : new Date(item.fechaVence);
            const isMora = fechaVence < now && !["PAGADO", "PAGADA", "CANCELADO"].includes(item.estado);
            const saldo = Number(item.saldoPendiente);
            
            tC += saldo;
            if (isMora) {
                m.push(item);
                tM += saldo;
            }

            if (item.tipoPrincipal === "PRESTAMO") {
                p.push(item);
                tL += saldo;
            } else {
                o.push(item);
            }
        });

        return { morosos: m, prestamos: p, obligaciones: o, totalCartera: tC, totalMora: tM, totalLoans: tL };
    }, [data, now]);

    const filteredList = useMemo(() => {
        let list = data;
        if (filter === "MORA") list = morosos;
        if (filter === "PRESTAMOS") list = prestamos;
        if (filter === "OBLIGACIONES") list = obligaciones;

        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            list = list.filter(ob => 
                ob.usuario.nombres.toLowerCase().includes(lower) || 
                ob.usuario.apellidos.toLowerCase().includes(lower) ||
                ob.usuario.numeroDocumento?.includes(lower) ||
                ob.vehiculo?.placa?.toLowerCase().includes(lower) ||
                ob.consecutivo?.toLowerCase().includes(lower)
            );
        }
        
        return list.sort((a, b) => {
            const dA = new Date(a.fechaVence).getTime();
            const dB = new Date(b.fechaVence).getTime();
            return dA - dB;
        });
    }, [filter, searchTerm, data, morosos, prestamos, obligaciones]);

    const handleNotifyMorosos = async () => {
        if (morosos.length === 0) return;
        setIsNotifying(true);
        try {
            const ids = morosos.map(m => m.id);
            const result = await notifyDeudoresMorosos(ids);
            if (result.success && result.data) {
                toast.success(result.message || `Notificaciones enviadas a ${result.data.notificadosCount} usuarios`);
            } else {
                toast.error(result.error || "No se pudo notificar");
            }
        } catch (error) {
            toast.error("Error inesperado al enviar notificaciones masivas");
        } finally {
            setIsNotifying(false);
        }
    };

    return {
        filter,
        setFilter,
        searchTerm,
        setSearchTerm,
        isNotifying,
        morosos,
        prestamos,
        obligaciones,
        totalCartera,
        totalMora,
        totalLoans,
        filteredList,
        handleNotifyMorosos
    };
}
