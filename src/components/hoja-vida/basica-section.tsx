"use client";

import { useState } from "react";

interface BasicaSectionProps {
    data:
        | {
              rh?: string | null;
              eps?: string | null;
              arl?: string | null;
              fondoPensiones?: string | null;
              fondoCesantias?: string | null;
              contactoEmergenciaNombre?: string | null;
              contactoEmergenciaTelefono?: string | null;
              perfilProfesional?: string | null;
          }
        | null
        | undefined;
    onSave: (info: Record<string, string | null>) => Promise<boolean>;
    isSubmitting: boolean;
}

export function BasicaSection({
    data,
    onSave,
    isSubmitting,
}: BasicaSectionProps) {
    const [editing, setEditing] = useState(false);
    const [info, setInfo] = useState({
        rh: data?.rh || "",
        eps: data?.eps || "",
        arl: data?.arl || "",
        fondoPensiones: data?.fondoPensiones || "",
        fondoCesantias: data?.fondoCesantias || "",
        contactoEmergenciaNombre: data?.contactoEmergenciaNombre || "",
        contactoEmergenciaTelefono: data?.contactoEmergenciaTelefono || "",
        perfilProfesional: data?.perfilProfesional || "",
    });

    const handleSave = async () => {
        const success = await onSave(info);
        if (success) setEditing(false);
    };

    const cardStyle = {
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        fontFamily: "sans-serif"
    };

    const headerStyle = {
        paddingBottom: "15px",
        borderBottom: "1px solid #f1f5f9",
        marginBottom: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    };

    const labelStyle = {
        display: "block",
        fontSize: "11px",
        fontWeight: "bold",
        textTransform: "uppercase" as const,
        color: "#64748b",
        marginBottom: "5px"
    };

    const inputStyle = {
        width: "100%",
        padding: "8px",
        border: "1px solid #cbd5e1",
        borderRadius: "6px",
        fontSize: "13px",
        boxSizing: "border-box" as const,
        marginBottom: "15px"
    };

    const btnStyle = {
        padding: "8px 16px",
        borderRadius: "6px",
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: "13px",
        border: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: "5px"
    };

    const inputGroupStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "15px",
        marginBottom: "15px"
    };

    return (
        <div style={cardStyle}>
            <div style={headerStyle}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>📄</span> Información Básica de Hoja de Vida
                </h3>
                <button
                    onClick={() => setEditing(!editing)}
                    style={{ ...btnStyle, backgroundColor: editing ? "#f1f5f9" : "#fff", border: "1px solid #e2e8f0", color: "#0f172a" }}
                >
                    {editing ? "❌ Cancelar" : "✏️ Editar"}
                </button>
            </div>
            
            <div>
                {editing ? (
                    <div>
                        <div style={inputGroupStyle}>
                            <div>
                                <label style={labelStyle}>RH</label>
                                <input
                                    value={info.rh}
                                    onChange={(e) => setInfo({ ...info, rh: e.target.value })}
                                    placeholder="Ej: O+"
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>EPS</label>
                                <input
                                    value={info.eps}
                                    onChange={(e) => setInfo({ ...info, eps: e.target.value })}
                                    placeholder="Nombre de la EPS"
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>ARL</label>
                                <input
                                    value={info.arl}
                                    onChange={(e) => setInfo({ ...info, arl: e.target.value })}
                                    placeholder="Nombre de la ARL"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={inputGroupStyle}>
                            <div>
                                <label style={labelStyle}>Fondo de Pensiones</label>
                                <input
                                    value={info.fondoPensiones}
                                    onChange={(e) => setInfo({ ...info, fondoPensiones: e.target.value })}
                                    placeholder="Nombre del fondo"
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Fondo de Cesantías</label>
                                <input
                                    value={info.fondoCesantias}
                                    onChange={(e) => setInfo({ ...info, fondoCesantias: e.target.value })}
                                    placeholder="Nombre del fondo"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={inputGroupStyle}>
                            <div>
                                <label style={labelStyle}>Contacto de Emergencia - Nombre</label>
                                <input
                                    value={info.contactoEmergenciaNombre}
                                    onChange={(e) => setInfo({ ...info, contactoEmergenciaNombre: e.target.value })}
                                    placeholder="Nombre completo"
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Contacto de Emergencia - Teléfono</label>
                                <input
                                    value={info.contactoEmergenciaTelefono}
                                    onChange={(e) => setInfo({ ...info, contactoEmergenciaTelefono: e.target.value })}
                                    placeholder="Número de teléfono"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Perfil Profesional</label>
                            <textarea
                                value={info.perfilProfesional}
                                onChange={(e) => setInfo({ ...info, perfilProfesional: e.target.value })}
                                placeholder="Describe tu perfil profesional, habilidades y objetivos..."
                                style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
                            />
                        </div>

                        <div style={{ textAlign: "right", marginTop: "10px" }}>
                            <button
                                onClick={handleSave}
                                disabled={isSubmitting}
                                style={{ ...btnStyle, backgroundColor: "#0f172a", color: "#fff", opacity: isSubmitting ? 0.7 : 1 }}
                            >
                                {isSubmitting ? "⌛ Guardando..." : "✅ Guardar Cambios"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                        <div>
                            <div style={labelStyle}>RH</div>
                            <div style={{ fontSize: "14px", color: "#0f172a" }}>{data?.rh || "No especificado"}</div>
                        </div>
                        <div>
                            <div style={labelStyle}>EPS</div>
                            <div style={{ fontSize: "14px", color: "#0f172a" }}>{data?.eps || "No especificado"}</div>
                        </div>
                        <div>
                            <div style={labelStyle}>ARL</div>
                            <div style={{ fontSize: "14px", color: "#0f172a" }}>{data?.arl || "No especificado"}</div>
                        </div>
                        <div>
                            <div style={labelStyle}>Fondo de Pensiones</div>
                            <div style={{ fontSize: "14px", color: "#0f172a" }}>{data?.fondoPensiones || "No especificado"}</div>
                        </div>
                        <div>
                            <div style={labelStyle}>Fondo de Cesantías</div>
                            <div style={{ fontSize: "14px", color: "#0f172a" }}>{data?.fondoCesantias || "No especificado"}</div>
                        </div>
                        <div>
                            <div style={labelStyle}>Contacto de Emergencia</div>
                            <div style={{ fontSize: "14px", color: "#0f172a" }}>{data?.contactoEmergenciaNombre || "No especificado"}</div>
                        </div>
                        <div>
                            <div style={labelStyle}>Teléfono de Emergencia</div>
                            <div style={{ fontSize: "14px", color: "#0f172a" }}>{data?.contactoEmergenciaTelefono || "No especificado"}</div>
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                            <div style={labelStyle}>Perfil Profesional</div>
                            <div style={{ fontSize: "14px", color: "#0f172a", whiteSpace: "pre-wrap", backgroundColor: "#f8fafc", padding: "15px", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                                {data?.perfilProfesional || "No especificado"}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
