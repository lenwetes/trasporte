"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Activity, Shield, FileText, UserCircle } from "lucide-react";
import { UsuarioWithRelations } from "@/types";
import { Session } from "next-auth";

export function PerfilSidebar({
    usuario,
    session,
}: {
    usuario: UsuarioWithRelations;
    session: Session | null;
}) {
    const sectionStyle = {
        backgroundColor: "#fff",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        padding: "20px",
        marginBottom: "20px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
    };

    const titleStyle = {
        margin: "0 0 15px 0",
        fontSize: "14px",
        fontWeight: "bold",
        color: "#0f172a",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        textTransform: "uppercase" as const,
        letterSpacing: "0.5px"
    };

    return (
        <div style={{ fontFamily: "sans-serif" }}>
            <div style={sectionStyle}>
                <h3 style={titleStyle}>
                    <UserCircle size={18} /> Información de Contacto
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <ContactItem
                        icon={<Mail size={16} />}
                        label="Correo Electrónico"
                        text={usuario.email || "Sin registro"}
                    />
                    <ContactItem
                        icon={<Phone size={16} />}
                        label="Teléfono"
                        text={usuario.telefono || "Sin registro"}
                    />
                    <ContactItem
                        icon={<MapPin size={16} />}
                        label="Ubicación"
                        text={`${usuario.municipio}, ${usuario.direccion || "Sin dirección"}`}
                    />
                    <div style={{ display: "flex", gap: "12px", padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                        <Activity size={18} style={{ color: "#3b82f6" }} />
                        <div>
                            <span style={{ display: "block", fontSize: "10px", color: "#64748b", fontWeight: "bold", textTransform: "uppercase" }}>Última conexión</span>
                            <span style={{ fontSize: "12px", color: "#475569" }}>
                                {usuario.ultimoLogin
                                    ? new Date(usuario.ultimoLogin).toLocaleString("es-CO", {
                                          dateStyle: "medium",
                                          timeStyle: "short",
                                      })
                                    : "Activo ahora"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={sectionStyle}>
                <h3 style={titleStyle}>Acciones de Gestión</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <Link href="/dashboard/perfil/editar" style={{ textDecoration: "none" }}>
                        <button style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "#fff",
                            color: "#0f172a",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px"
                        }}>
                            <Shield size={16} /> Editar Perfil
                        </button>
                    </Link>
                    <Link href="/dashboard/perfil/hoja-vida" style={{ textDecoration: "none" }}>
                        <button style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "#0f172a",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px"
                        }}>
                            <FileText size={16} /> Hoja de Vida
                        </button>
                    </Link>
                </div>
            </div>

            <div style={sectionStyle}>
                <h3 style={titleStyle}>
                    <Shield size={18} style={{ color: "#059669" }} /> Seguridad
                </h3>
                <div style={{ display: "flex", gap: "15px" }}>
                    <SecurityBlock
                        label="IP Actual"
                        value={session?.user?.lastIp || "127.0.0.1"}
                    />
                    <SecurityBlock
                        label="Dispositivo"
                        value={session?.user?.lastUserAgent || "Navegador Estándar"}
                    />
                </div>
            </div>

            <div style={{ 
                padding: "15px", 
                backgroundColor: "#eff6ff", 
                borderRadius: "12px", 
                border: "1px solid #dbeafe",
                display: "flex",
                gap: "12px",
                alignItems: "center"
            }}>
                <div style={{ color: "#3b82f6" }}>
                    <Shield size={24} />
                </div>
                <div>
                    <h4 style={{ margin: "0 0 2px 0", fontSize: "14px", fontWeight: "bold", color: "#1e3a8a" }}>Cumplimiento Vial</h4>
                    <p style={{ margin: 0, fontSize: "11px", color: "#3b82f6", lineHeight: "1.4" }}>
                        Este perfil es monitoreado para garantizar la seguridad en la operación.
                    </p>
                </div>
            </div>
        </div>
    );
}

function ContactItem({
    icon,
    label,
    text,
}: {
    icon: React.ReactNode;
    label: string;
    text: string;
}) {
    return (
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ color: "#94a3b8" }}>
                {icon}
            </div>
            <div>
                <span style={{ display: "block", fontSize: "10px", color: "#64748b", fontWeight: "bold" }}>{label}</span>
                <span style={{ fontSize: "13px", color: "#0f172a", fontWeight: "500" }}>{text}</span>
            </div>
        </div>
    );
}

function SecurityBlock({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ flex: 1 }}>
            <p style={{ margin: "0 0 4px 0", fontSize: "10px", color: "#64748b", fontWeight: "bold", textTransform: "uppercase" }}>{label}</p>
            <p style={{ margin: 0, fontSize: "12px", color: "#0f172a", fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</p>
        </div>
    );
}

