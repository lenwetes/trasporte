"use client";

import Image from "next/image";
import { LoginForm } from "@/components/forms/login-form";

export function LoginPanel() {
    return (
        <div style={{ backgroundColor: "#f0f4f0" }}>
            {/* Fondo sutil con patrón de puntos */}
            <div
                style={{
                    backgroundImage: `radial-gradient(circle, rgba(22,163,74,0.08) 1px, transparent 1px)`,
                    backgroundSize: "28px 28px",
                }}
            />

            {/* Logo mobile */}
            <div style={{
                    animation: "fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both",
                }}
            >
                <div>
                    <Image
                        src="/logo-empresa.png"
                        alt="COOPETRAES"
                        width={180}
                        height={48}
                        priority
                    />
                </div>
            </div>

            {/* Tarjeta del formulario */}
            <div style={{ animation:
                        "formSlideIn 0.75s 0.1s cubic-bezier(0.22,1,0.36,1) both", }}
            >
                {/* Cabecera */}
                <div>
                    <div style={{ backgroundColor: "#dcfce7", color: "#15803d" }}>
                        <span />
                        SGIT PRO · Acceso Autorizado
                    </div>
                    <h2>
                        Bienvenido de
                        <br />
                        vuelta
                    </h2>
                    <p>
                        Ingresa tus credenciales institucionales para continuar.
                    </p>
                </div>

                {/* Card blanca con el form */}
                <div style={{
                        border: "1px solid #e2e8f0",
                        boxShadow:
                            "0 4px 6px rgba(0,0,0,0.04), 0 12px 40px rgba(22,163,74,0.08)",
                    }}
                >
                    <LoginForm />
                </div>

                {/* Nota de seguridad */}
                <div>
                    <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <p>
                        Conexión cifrada · Datos protegidos
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes formSlideIn {
                    from { opacity: 0; transform: translateX(30px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
}
