"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    InvestigacionSiniestroSchema,
    InvestigacionSiniestroCreate,
} from "@/lib/validations/safety";
import { createInvestigacionSiniestro } from "@/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertCircle, HelpCircle, Save, Loader2, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface InvestigacionSiniestroFormProps {
    siniestroId: string;
}

export function InvestigacionSiniestroForm({
    siniestroId,
}: InvestigacionSiniestroFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const form = useForm<InvestigacionSiniestroCreate>({
        resolver: zodResolver(InvestigacionSiniestroSchema),
        defaultValues: {
            siniestroId,
            participantes: "",
            analisisCausas:
                "1. ¿Por qué ocurrió? \n2. ¿Por qué...? \n3. ¿Por qué...? \n4. ¿Por qué...? \n5. ¿Por qué...?",
            planAccion: "",
            conclusiones: "",
            diasPerdidos: 0,
            costoEstimado: 0,
        },
    });

    const onSubmit = async (data: InvestigacionSiniestroCreate) => {
        setIsSubmitting(true);
        try {
            const result = await createInvestigacionSiniestro(data);
            if (result.success) {
                toast.success("Investigación registrada exitosamente");
                router.refresh();
            } else {
                toast.error(result.error || "Error al registrar");
            }
        } catch {
            toast.error("Error de comunicación con el servidor");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column", gap: "32px" }}
        >
            <div style={{ backgroundColor: "#fef2f2", padding: "24px", borderRadius: "20px", border: "1px solid #fecaca", display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "white", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <AlertCircle size={24} />
                </div>
                <div>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "900", color: "#991b1b" }}>
                        Análisis de Causa Raíz (RCA)
                    </h3>
                    <p style={{ margin: 0, fontSize: "14px", color: "#b91c1c", fontWeight: "500" }}>
                        Metodología técnica obligatoria de los 5 Porqués según PESV.
                    </p>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Label style={{ fontSize: "12px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>
                        Participantes / Investigadores
                    </Label>
                    <div style={{ position: "relative" }}>
                        <Users size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                        <Input
                            {...form.register("participantes")}
                            placeholder="Nombres de los investigadores técnicos..."
                            style={{ paddingLeft: "40px", borderRadius: "12px" }}
                        />
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <Label style={{ fontSize: "12px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>
                            Días Perdidos (IS)
                        </Label>
                        <Input
                            type="number"
                            {...form.register("diasPerdidos", { valueAsNumber: true })}
                            style={{ borderRadius: "12px" }}
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <Label style={{ fontSize: "12px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>
                            Costo Estimado ($)
                        </Label>
                        <Input
                            type="number"
                            {...form.register("costoEstimado", { valueAsNumber: true })}
                            style={{ borderRadius: "12px" }}
                        />
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#0f172a" }}>
                    <HelpCircle size={18} />
                    <Label style={{ fontSize: "13px", fontWeight: "900" }}>
                        Desarrollo del Análisis (Los 5 Porqués)
                    </Label>
                </div>
                <Textarea
                    {...form.register("analisisCausas")}
                    style={{ borderRadius: "16px", minHeight: "150px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
                />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Label style={{ fontSize: "12px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>
                        Plan de Acción / Medidas Preventivas
                    </Label>
                    <Textarea
                        {...form.register("planAccion")}
                        placeholder="Acciones correctivas inmediatas..."
                        style={{ borderRadius: "16px", minHeight: "100px" }}
                    />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Label style={{ fontSize: "12px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>
                        Conclusiones Finales
                    </Label>
                    <Textarea
                        {...form.register("conclusiones")}
                        placeholder="Resumen del hallazgo principal del siniestro..."
                        style={{ borderRadius: "16px", minHeight: "100px" }}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                style={{
                    backgroundColor: "#0f172a",
                    color: "white",
                    border: "none",
                    padding: "16px",
                    borderRadius: "16px",
                    fontSize: "13px",
                    fontWeight: "900",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.7 : 1,
                    transition: "all 0.2s",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)"
                }}
            >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (
                    <>
                        <Save size={18} />
                        GUARDAR INVESTIGACIÓN TÉCNICA
                    </>
                )}
            </button>
        </form>
    );
}
