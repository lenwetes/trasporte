"use client";

import { useFormContext } from "react-hook-form";
import { VehiculoCreate } from "@/lib/validations";

interface VehiculoFormFieldProps {
    label: string;
    icon?: React.ReactNode;
    error?: any;
    children: React.ReactNode;
}

function FieldWrapper({ label, icon, error, children }: VehiculoFormFieldProps) {
    return (
        <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "bold", color: "#475569", marginBottom: "6px" }}>
                {icon} {label}
            </label>
            {children}
            {error && <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px" }}>{error.message}</p>}
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "14px"
};

export function TechnicalInfoSection() {
    const {
        register,
        formState: { errors },
    } = useFormContext<VehiculoCreate>();

    return (
        <section style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ fontSize: "20px" }}>⚙️</div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "bold", color: "#0f172a" }}>Mecánica y Core</h3>
                        <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>Especificaciones Técnicas Base</p>
                    </div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
                <FieldWrapper label="Placa de Rodamiento" icon="🆔" error={errors.placa}>
                    <input {...register("placa")} placeholder="ABC-123" style={inputStyle} />
                </FieldWrapper>

                <FieldWrapper label="Marca de Fábrica" icon="🏷️" error={errors.marca}>
                    <input {...register("marca")} placeholder="Ej: Toyota" style={inputStyle} />
                </FieldWrapper>

                <FieldWrapper label="Referencia / Modelo" icon="🚘" error={errors.modelo}>
                    <input {...register("modelo")} placeholder="Ej: Hilux" style={inputStyle} />
                </FieldWrapper>

                <FieldWrapper label="Categoría Operativa" error={errors.clase}>
                    <select {...register("clase")} style={inputStyle}>
                        <option value="MICROBUS">Microbus</option>
                        <option value="BUSETA">Buseta</option>
                        <option value="BUS">Bus</option>
                        <option value="CAMIONETA">Camioneta</option>
                        <option value="OTRO">Otro</option>
                    </select>
                </FieldWrapper>

                <FieldWrapper label="Régimen de Modalidad" error={errors.modalidad}>
                    <select {...register("modalidad")} style={inputStyle}>
                        <option value="FLOTA_PROPIA">Flota Propia</option>
                        <option value="CONVENIO_EXTERNO">Convenio Externo</option>
                    </select>
                </FieldWrapper>

                <FieldWrapper label="Año de Producción" icon="📅" error={errors.anho}>
                    <input type="number" {...register("anho")} style={inputStyle} />
                </FieldWrapper>
            </div>
        </section>
    );
}
