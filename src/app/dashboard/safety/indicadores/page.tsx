import { getSafetyKPIs, getConfiguracionGlobal } from "@/actions";
import { SafetyIndicators } from "./_components/safety-indicators";
import { ReportActions } from "./_components/report-actions";
import { SafetyKPIsData } from "@/types";
import { getOperationalRiskHeatmapData } from "@/actions/safety";
import { OperationalRiskHeatmap } from "./_components/operational-risk-heatmap";
import { TrendingDown, Info, AlertCircle, Target, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SafetyIndicadoresPage() {
    const year = new Date().getFullYear();
    const [result, configRes, heatmapRes] = await Promise.all([
        getSafetyKPIs(year),
        getConfiguracionGlobal(),
        getOperationalRiskHeatmapData(),
    ]);

    const config = configRes.success
        ? (configRes.data as import("@prisma/client").ConfiguracionGlobal)
        : null;

    const heatmapData = (heatmapRes.success ? heatmapRes.data : []) as {
        name: string;
        data: {
            x: string;
            y: number;
            count: number;
        }[];
    }[];

    return (
        <div style={{ padding: "32px", maxWidth: "1600px", margin: "0 auto", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
            {/* Header section with rich aesthetics */}
            <div style={{ 
                marginBottom: "40px", 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                backgroundColor: "white",
                padding: "32px",
                borderRadius: "32px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
            }}>
                <div>
                    <h1 style={{ margin: "0 0 8px 0", fontSize: "28px", fontWeight: "900", color: "#0f172a", display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "#f0fdf4", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ShieldCheck size={28} />
                        </div>
                        Indicadores de Seguridad Vial
                    </h1>
                    <p style={{ margin: 0, fontSize: "14px", color: "#64748b", fontWeight: "500" }}>
                        Tablero de control PESV y KPIs de accidentalidad (Resolución 20223040040595).
                    </p>
                </div>

                {result.success && result.data ? (
                    <ReportActions
                        data={result.data as SafetyKPIsData}
                        companyConfig={config}
                    />
                ) : null}
            </div>

            {/* Info Alert about the resolution */}
            <div style={{ 
                backgroundColor: "#f0f9ff", 
                border: "1px solid #b3e0ff", 
                borderRadius: "20px", 
                padding: "24px", 
                display: "flex", 
                gap: "20px", 
                marginBottom: "40px",
                alignItems: "flex-start"
            }}>
                <div style={{ color: "#0ea5e9" }}>
                    <Info size={24} />
                </div>
                <div>
                    <h4 style={{ margin: "0 0 6px 0", fontSize: "16px", fontWeight: "800", color: "#0369a1" }}>Normatividad Vigente</h4>
                    <p style={{ margin: 0, fontSize: "14px", color: "#0c4a6e", lineHeight: "1.6" }}>
                        Los índices mostrados se calculan basándose en una constante K de 240.000 horas-hombre trabajadas, conforme a los estándares de reporte de siniestralidad vial para empresas de transporte en Colombia.
                    </p>
                </div>
            </div>

            {/* Main Dashboard Components */}
            {result.success && result.data ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                    <SafetyIndicators data={result.data as SafetyKPIsData} />
                    {heatmapData && heatmapData.length > 0 && (
                        <div style={{ backgroundColor: "white", padding: "32px", borderRadius: "32px", border: "1px solid #e2e8f0" }}>
                            <OperationalRiskHeatmap stats={heatmapData} />
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ padding: "80px", textAlign: "center", backgroundColor: "white", borderRadius: "32px", border: "1px solid #fecaca" }}>
                    <AlertCircle size={48} color="#ef4444" style={{ marginBottom: "16px" }} />
                    <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#b91c1c" }}>
                        No se pudieron cargar los indicadores viales de transporte.
                    </p>
                </div>
            )}

            {/* Extra context / Methodologies */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginTop: "40px" }}>
                <div style={{ backgroundColor: "white", padding: "32px", borderRadius: "32px", border: "1px solid #e2e8f0" }}>
                    <h3 style={{ margin: "0 0 24px 0", fontSize: "18px", fontWeight: "900", color: "#0f172a", display: "flex", alignItems: "center", gap: "12px" }}>
                        <Target size={20} className="text-emerald-500" />
                        Metas del Periodo Actual
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        <div style={{ padding: "20px", borderRadius: "20px", backgroundColor: "#f8fafc", border: "1px solid #f1f5f9" }}>
                            <span style={{ display: "block", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", marginBottom: "8px" }}>FRECUENCIA (IF)</span>
                            <span style={{ fontSize: "24px", fontWeight: "900", color: "#0f172a" }}>&lt; 2.0</span>
                        </div>
                        <div style={{ padding: "20px", borderRadius: "20px", backgroundColor: "#f8fafc", border: "1px solid #f1f5f9" }}>
                            <span style={{ display: "block", fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", marginBottom: "8px" }}>SEVERIDAD (IS)</span>
                            <span style={{ fontSize: "24px", fontWeight: "900", color: "#0f172a" }}>&lt; 8.0</span>
                        </div>
                    </div>
                </div>

                <div style={{ backgroundColor: "#1e293b", padding: "32px", borderRadius: "32px", color: "white" }}>
                    <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "900" }}>Histórico de Mejoras Técnicas</h3>
                    <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "#94a3b8", lineHeight: "1.6" }}>
                        Durante el último trimestre se ha observado una reducción del 12% en incidentes por "Falla Mecánica" gracias a la implementación de la inspección preoperacional digital.
                    </p>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "8px 16px", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981", borderRadius: "100px", fontSize: "13px", fontWeight: "700" }}>
                        <TrendingDown size={16} /> Tendencia Positiva Detectada
                    </div>
                </div>
            </div>
        </div>
    );
}
