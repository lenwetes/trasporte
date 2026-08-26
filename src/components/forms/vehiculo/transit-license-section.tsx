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

interface TransitLicenseSectionProps {
    ownerDisplayName?: string;
}

export function TransitLicenseSection({ ownerDisplayName }: TransitLicenseSectionProps) {
    const {
        register,
        formState: { errors },
    } = useFormContext<VehiculoCreate>();

    return (
        <section style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ fontSize: "20px" }}>📄</div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "bold", color: "#0f172a" }}>Tarjeta de Operación</h3>
                        <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>Identificación Legal y Registro</p>
                    </div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
                <FieldWrapper label="Color Dominante" icon="🎨">
                    <input {...register("color")} placeholder="Ej: Blanco" style={inputStyle} />
                </FieldWrapper>

                <FieldWrapper label="Cilindraje (CC)" icon="⚙️">
                    <input {...register("cilindraje")} placeholder="Ej: 2.400" style={inputStyle} />
                </FieldWrapper>

                <FieldWrapper label="Peso Bruto (Kg)" icon="⚖️">
                    <input {...register("peso")} placeholder="Ej: 2.500" style={inputStyle} />
                </FieldWrapper>

                <FieldWrapper label="Puestos Habilitados" icon="👥">
                    <input type="number" {...register("capacidadPuestos")} placeholder="5" style={inputStyle} />
                </FieldWrapper>

                <FieldWrapper label="Número Serie Motor" icon="🔢">
                    <input {...register("numeroMotor")} placeholder="Motor Serial" style={inputStyle} />
                </FieldWrapper>

                <FieldWrapper label="Identificador Chasis" icon="🔢">
                    <input {...register("numeroChasis")} placeholder="VIN / Chasis" style={inputStyle} />
                </FieldWrapper>

                <FieldWrapper label="Puerto de Expedición" icon="📍">
                    <input {...register("lugarExpedicion")} placeholder="Ej: Secretaría de Tránsito Sincelejo" style={inputStyle} />
                </FieldWrapper>

                <FieldWrapper label="Titular / Propietario" icon="👤" error={errors.propietarioId}>
                    {ownerDisplayName ? (
                        <div style={{
                            ...inputStyle,
                            backgroundColor: "#f8fafc",
                            color: "#0f172a",
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}>
                            <span style={{ fontSize: "16px" }}>👤</span>
                            {ownerDisplayName}
                        </div>
                    ) : (
                        <input {...register("propietario")} placeholder="Sin propietario asignado" style={{ ...inputStyle, backgroundColor: "#fefce8" }} />
                    )}
                </FieldWrapper>
            </div>
        </section>
    );
}
