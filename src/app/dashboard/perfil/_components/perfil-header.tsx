import Image from "next/image";
import { UsuarioWithRelations } from "@/types";
import { Shield } from "lucide-react";

export function PerfilHeader({ usuario }: { usuario: UsuarioWithRelations }) {
    const initials = (usuario.nombres?.[0] || "") + (usuario.apellidos?.[0] || "");
    
    return (
        <div style={{ position: "relative", marginBottom: "40px" }}>
            {/* Cover Background */}
            <div style={{ 
                height: "180px", 
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                borderRadius: "32px",
                position: "relative",
                overflow: "hidden",
                margin: "32px",
                display: "flex",
                alignItems: "center",
                padding: "0 40px"
            }}>
                <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "250px", height: "250px", background: "rgba(16, 185, 129, 0.05)", borderRadius: "50%" }}></div>
                <div style={{ position: "absolute", bottom: "-30px", left: "20%", width: "150px", height: "150px", background: "rgba(59, 130, 246, 0.05)", borderRadius: "50%" }}></div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "15px", position: "relative" }}>
                    <div style={{ 
                        width: "48px", 
                        height: "48px", 
                        backgroundColor: "rgba(255,255,255,0.1)", 
                        borderRadius: "12px",
                        backdropFilter: "blur(4px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#10b981",
                        fontWeight: "900",
                        fontSize: "20px"
                    }}>
                        C
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "2px" }}>
                            Portal Corporativo
                        </p>
                        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "900", color: "white", letterSpacing: "1px" }}>
                            COOPETRAES
                        </h2>
                    </div>
                </div>
            </div>

            {/* Profile Info Overlay */}
            <div style={{ 
                marginTop: "-80px", 
                padding: "0 80px",
                display: "flex",
                alignItems: "flex-end",
                gap: "24px"
            }}>
                <div style={{ 
                    position: "relative",
                    width: "140px",
                    height: "140px",
                    borderRadius: "40px",
                    border: "6px solid white",
                    backgroundColor: "#f8fafc",
                    overflow: "hidden",
                    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    {usuario.fotoPerfil ? (
                        <Image
                            src={`/api/files/${usuario.fotoPerfil.nombreUnico}`}
                            alt={`${usuario.nombres} ${usuario.apellidos}`}
                            fill
                            style={{ objectFit: "cover" }}
                            unoptimized
                        />
                    ) : (
                        <div style={{ fontSize: "48px", fontWeight: "900", color: "#cbd5e1" }}>
                            {initials || "?"}
                        </div>
                    )}
                </div>

                <div style={{ paddingBottom: "15px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                        <span style={{ 
                            padding: "4px 12px", 
                            backgroundColor: "#f0fdf4", 
                            color: "#10b981", 
                            borderRadius: "100px", 
                            fontSize: "11px", 
                            fontWeight: "800",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            border: "1px solid #d1fae5"
                        }}>
                            <Shield size={12} />
                            {usuario.rol}
                        </span>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981" }}></div>
                        <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b" }}>ACTIVO</span>
                    </div>
                    <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "900", color: "#0f172a" }}>
                        {usuario.nombres}{" "}
                        <span style={{ color: "#64748b", fontWeight: "400" }}>
                            {usuario.apellidos}
                        </span>
                    </h1>
                </div>
            </div>
        </div>
    );
}
