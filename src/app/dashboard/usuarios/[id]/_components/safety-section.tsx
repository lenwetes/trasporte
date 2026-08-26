import { auth } from "@/auth";
import {
    getExamenesConductor,
    getEntregasConductor,
    getConfiguracionGlobal,
} from "@/actions";
import {
    SafetySectionClient,
    ExamenMedicoDisplay,
    EntregaDotacionDisplay,
} from "./safety-section-client";
import { ShieldAlert, CheckCircle } from "lucide-react";

interface SafetySectionProps {
    conductorId: string;
    conductorNombre: string;
}

export async function SafetySection({
    conductorId,
    conductorNombre,
}: SafetySectionProps) {
    const session = await auth();
    const isAdmin =
        session?.user?.rol === "ADMIN" || session?.user?.rol === "SECRETARIA";

    const [examenesRes, entregasRes, configRes] = await Promise.all([
        getExamenesConductor(conductorId),
        getEntregasConductor(conductorId),
        getConfiguracionGlobal(),
    ]);

    const examenes = examenesRes.success
        ? (examenesRes.data as ExamenMedicoDisplay[])
        : [];
    const entregas = entregasRes.success
        ? (entregasRes.data as EntregaDotacionDisplay[])
        : [];
    const companyConfig = configRes.success
        ? (configRes.data as import("@prisma/client").ConfiguracionGlobal)
        : null;

    return (
        <div style={{ marginTop: "48px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9" }}>
                <h3 style={{ margin: 0, fontSize: "22px", fontWeight: "900", color: "#0f172a", display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: "#fef2f2", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ShieldAlert size={24} />
                    </div>
                    SG-SST & Seguridad Vial
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "20px", backgroundColor: "#f0fdf4", color: "#16a34a", fontSize: "12px", fontWeight: "800", textTransform: "uppercase" }}>
                    <CheckCircle size={14} />
                    <span>Cumplimiento Legal</span>
                </div>
            </div>

            <div style={{ marginTop: "24px" }}>
                <SafetySectionClient
                    conductorId={conductorId}
                    conductorNombre={conductorNombre}
                    initialExamenes={examenes}
                    initialEntregas={entregas}
                    isAdmin={isAdmin}
                    companyConfig={companyConfig}
                />
            </div>
        </div>
    );
}
