import { Metadata } from "next";
import { BillingGenerator } from "@/components/finance/billing-generator";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Zap, Activity, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
    title: "Operaciones Financieras | Coopetraes",
    description:
        "Centro de control para operaciones financieras masivas y cierres.",
};

export default function FinanceOperationsPage() {
    return (
        <div>
            <DashboardHeader
                title="Centro de Operaciones"
                tagline="Automatización Contable"
                subtitle="Ejecución de procesos masivos, generación de carteras y cierres de periodo"
                icon={Zap}
                iconGradient="from-yellow-400 to-slate-900"
            />

            <div style={{ padding: "24px" }}>
                <div style={{ 
                    backgroundColor: "#f8fafc", 
                    padding: "20px", 
                    borderRadius: "16px", 
                    border: "1px solid #e2e8f0",
                    marginBottom: "24px"
                }}>
                    <div style={{ display: "flex", gap: "24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#10b981", fontWeight: "700" }}>
                            <Activity size={18} />
                            <span style={{ fontSize: "14px" }}>
                                Estado Sistemas: <span style={{ textTransform: "uppercase" }}>Óptimo</span>
                            </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#64748b", fontWeight: "700" }}>
                            <ShieldCheck size={18} />
                            <span style={{ fontSize: "14px" }}>
                                Seguridad Nivel 2
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                    {/* Generador de Facturación */}
                    <BillingGenerator />

                    {/* Placeholder for future operations */}
                    <div style={{ 
                        border: "2px dashed #e2e8f0", 
                        padding: "40px", 
                        borderRadius: "24px", 
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#fcfcfc"
                    }}>
                        <div style={{ 
                            width: "56px", 
                            height: "56px", 
                            borderRadius: "50%", 
                            backgroundColor: "#f1f5f9", 
                            color: "#94a3b8",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "16px"
                        }}>
                            <Activity size={24} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#1e293b" }}>
                            Módulos en Desarrollo
                        </h3>
                        <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#64748b", maxWidth: "260px" }}>
                            Cierres de periodo NIIF y ajustes automáticos de cartera
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
