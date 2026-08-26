"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ConfiguracionGlobalSchema,
    ConfiguracionGlobal,
} from "@/lib/validations";
import { updateConfiguracionGlobal } from "@/actions";

interface ConfiguracionSeguridadFormProps {
    defaultValues: Partial<ConfiguracionGlobal>;
}

export function ConfiguracionSeguridadForm({
    defaultValues,
}: ConfiguracionSeguridadFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<ConfiguracionGlobal>({
        resolver: zodResolver(ConfiguracionGlobalSchema),
        defaultValues: {
            ...defaultValues,
            modoMantenimiento: defaultValues.modoMantenimiento ?? false,
            sessionTimeout: defaultValues.sessionTimeout ?? 480,
        } as ConfiguracionGlobal,
    });

    const modoMantenimiento = watch("modoMantenimiento");

    const onSubmit = async (data: ConfiguracionGlobal) => {
        setIsSubmitting(true);
        try {
            const result = await updateConfiguracionGlobal(data);
            if (result.success) {
                alert("Configuración de seguridad actualizada");
            } else {
                alert(result.error || "Error al actualizar");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error de comunicación");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: "20px" }}>
            <div style={{ backgroundColor: "#fff", border: "1px solid #eee", borderRadius: "8px", padding: "20px" }}>
                <div style={{ marginBottom: "15px" }}>
                    <h3 style={{ margin: "0 0 5px 0" }}>Acceso y Sesiones</h3>
                    <p style={{ margin: 0, color: "#666", fontSize: "13px" }}>Controla la duración de las sesiones.</p>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", border: "1px solid #f9f9f9" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: "bold" }}>Tiempo de Expiración (minutos)</label>
                        <p style={{ margin: 0, fontSize: "11px", color: "#999" }}>Tiempo antes de cerrar sesión automáticamente.</p>
                    </div>
                    <input 
                        type="number" 
                        {...register("sessionTimeout", { valueAsNumber: true })}
                        style={{ width: "80px", padding: "8px" }}
                    />
                </div>
                {errors.sessionTimeout && <p style={{ color: "red", fontSize: "11px" }}>{errors.sessionTimeout.message}</p>}
            </div>

            <div style={{ backgroundColor: "#fff", border: "1px solid #eee", borderRadius: "8px", padding: "20px" }}>
                <div style={{ marginBottom: "15px" }}>
                    <h3 style={{ margin: "0 0 5px 0" }}>Disponibilidad del Sistema</h3>
                    <p style={{ margin: 0, color: "#666", fontSize: "13px" }}>Mantenimiento y actualizaciones críticas.</p>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", border: "1px solid #f9f9f9" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: "bold" }}>MODO MANTENIMIENTO</label>
                        <p style={{ margin: 0, fontSize: "11px", color: "#999" }}>Si se activa, solo los administradores podrán acceder.</p>
                    </div>
                    <input 
                        type="checkbox" 
                        checked={modoMantenimiento}
                        onChange={(e) => setValue("modoMantenimiento", e.target.checked)}
                        style={{ width: "20px", height: "20px" }}
                    />
                </div>

                {modoMantenimiento && (
                    <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#fff3cd", border: "1px solid #ffeeba", borderRadius: "4px", fontSize: "12px", color: "#856404" }}>
                        <strong>Aviso:</strong> El modo mantenimiento está activado. Asegúrate de desactivarlo al terminar.
                    </div>
                )}
            </div>

            <div style={{ textAlign: "right" }}>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    style={{
                        padding: "10px 25px",
                        backgroundColor: "#000",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        fontWeight: "bold"
                    }}
                >
                    {isSubmitting ? "Guardando..." : "Guardar Seguridad"}
                </button>
            </div>
        </form>
    );
}
