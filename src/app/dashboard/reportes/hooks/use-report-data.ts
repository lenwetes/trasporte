import { useState, useEffect } from "react";
import {
    getReportingSession,
    getConductoresList,
    getVehiculosList,
} from "@/actions";
import { ReportFilterState, ReportingSessionData } from "../types";

export function useReportData() {
    const [loading, setLoading] = useState<string | null>(null);
    const [conductores, setConductores] = useState<{id: string, nombre: string}[]>([]);
    const [vehiculos, setVehiculos] = useState<{id: string, placa: string}[]>([]);
    const [userSession, setUserSession] = useState<ReportingSessionData | null>(
        null,
    );

    const [filters, setFilters] = useState<ReportFilterState>({
        fechaInicio: "",
        fechaFin: "",
        conductorId: "",
        vehiculoId: "",
    });

    useEffect(() => {
        async function loadData() {
            const [sessionRes, condRes, vehRes] = await Promise.all([
                getReportingSession(),
                getConductoresList(),
                getVehiculosList(),
            ]);

            if (sessionRes.success && sessionRes.data) {
                const sessionData = sessionRes.data as ReportingSessionData;
                setUserSession(sessionData);
                const role = sessionData.role;
                const userId = sessionData.userId;

                // Handle initial filters for restricted roles
                if (role === "CONDUCTOR") {
                    setFilters((prev) => ({
                        ...prev,
                        conductorId: userId || "",
                    }));
                }
            }

            if (condRes.success)
                setConductores(
                    (condRes.data as { id: string; nombre: string }[]) || [],
                );
            if (vehRes.success)
                setVehiculos(
                    (vehRes.data as { id: string; placa: string }[]) || [],
                );

            // Auto-select if only one option exists (and not admin)
            const sessionData = sessionRes.data as
                | ReportingSessionData
                | undefined;
            if (
                sessionRes.success &&
                sessionData &&
                sessionData.role !== "ADMIN" &&
                sessionData.role !== "SECRETARIA"
            ) {
                const vehData = vehRes.data as
                    | { id: string; placa: string }[]
                    | undefined;
                const condData = condRes.data as
                    | { id: string; nombre: string }[]
                    | undefined;

                if (vehData?.length === 1) {
                    setFilters((prev) => ({
                        ...prev,
                        vehiculoId: vehData[0].id,
                    }));
                }
                if (condData?.length === 1) {
                    setFilters((prev) => ({
                        ...prev,
                        conductorId: condData[0].id,
                    }));
                }
            }
        }
        loadData();
    }, []);

    const resetFilters = () => {
        setFilters({
            fechaInicio: "",
            fechaFin: "",
            conductorId:
                userSession?.role === "CONDUCTOR" ? userSession.userId : "",
            vehiculoId:
                userSession?.role !== "ADMIN" && vehiculos.length === 1
                    ? vehiculos[0].id
                    : "",
        });
    };

    return {
        filters,
        setFilters,
        resetFilters,
        conductores,
        vehiculos,
        userSession,
        loading,
        setLoading,
    };
}
