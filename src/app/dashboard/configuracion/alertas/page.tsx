import { getReglasAlerta } from "@/actions/alertas/get";
export const dynamic = "force-dynamic";
import { ReglasAlertaForm } from "@/components/forms/reglas-alerta-form";
import Link from "next/link";
import { ChevronLeft, Bell, ShieldAlert } from "lucide-react";

import { ReglaAlerta } from "@prisma/client";

export default async function AlertasConfigPage() {
    const result = await getReglasAlerta();
    const reglas = result.success ? (result.data as ReglaAlerta[]) || [] : [];

    return (
        <div style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
                <Link href="/dashboard">
                    <button
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            border: "1px solid #e2e8f0",
                            backgroundColor: "white",
                            cursor: "pointer",
                            color: "#64748b"
                        }}
                    >
                        <ChevronLeft size={20} />
                    </button>
                </Link>
                <div>
                    <h1 style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "24px", fontWeight: "700", margin: 0 }}>
                        <Bell size={24} style={{ color: "#10b981" }} />
                        Configuración de Alertas
                    </h1>
                    <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>
                        Define los tiempos de anticipación para las advertencias
                        de vencimiento
                    </p>
                </div>
            </div>

            <div style={{ 
                display: "flex", 
                gap: "16px", 
                padding: "20px", 
                backgroundColor: "#f8fafc", 
                borderRadius: "12px", 
                border: "1px solid #e2e8f0",
                marginBottom: "32px"
            }}>
                <div style={{ 
                    width: "48px", 
                    height: "48px", 
                    borderRadius: "12px", 
                    backgroundColor: "#fef2f2", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    color: "#ef4444"
                }}>
                    <ShieldAlert size={24} />
                </div>
                <div>
                    <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "600" }}>
                        Nota sobre el Motor de Alertas
                    </h3>
                    <p style={{ margin: 0, fontSize: "14px", color: "#475569", lineHeight: "1.6" }}>
                        Las alertas se calculan en tiempo real basándose en
                        estas reglas. Una alerta{" "}
                        <span style={{ fontWeight: "bold", color: "#ef4444" }}>ROJA</span>{" "}
                        significa un documento ya vencido. Una alerta{" "}
                        <span style={{ fontWeight: "bold", color: "#f59e0b" }}>
                            AMARILLA
                        </span>{" "}
                        significa que el documento vencerá dentro del rango de
                        días configurado aquí.
                    </p>
                </div>
            </div>

            <div>
                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>
                    Documentos de Vehículos
                </h3>
                <ReglasAlertaForm initialReglas={reglas} />
            </div>
        </div>
    );
}
