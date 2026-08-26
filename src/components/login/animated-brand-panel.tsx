"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
}

export function AnimatedBrandPanel() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Crear partículas flotantes
        const particles: Particle[] = Array.from({ length: 55 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.35,
            speedY: (Math.random() - 0.5) * 0.35,
            opacity: Math.random() * 0.4 + 0.05,
        }));

        let animationId: number;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Dibujar líneas de conexión entre partículas cercanas
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255,255,255,${0.06 * (1 - dist / 110)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Dibujar partículas
            particles.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
                ctx.fill();

                // Mover
                p.x += p.speedX;
                p.y += p.speedY;

                // Rebotar en bordes
                if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
                if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
            });

            animationId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    const stats = [
        { value: "100%", label: "Digital"  },
        { value: "Seguro", label: "Certificado"  },
        { value: "24/7", label: "Disponible"  },
    ];

    return (
        <div
            style={{ background:
                    "linear-gradient(145deg, #0f3d20 0%, #145228 30%, #166534 65%, #16a34a 100%)", }}
        >
            {/* Canvas de partículas animadas */}
            <canvas
                ref={canvasRef}
                style={{ zIndex: 1 }}
            />

            {/* Orbs flotantes animados con CSS */}
            <div style={{ zIndex: 2 }}>
                <div
                    style={{
                        width: "420px",
                        height: "420px",
                        top: "-80px",
                        right: "-100px",
                        background:
                            "radial-gradient(circle, rgba(74,222,128,0.15), transparent 70%)",
                        animation: "floatA 12s ease-in-out infinite",
                    }}
                />
                <div
                    style={{
                        width: "350px",
                        height: "350px",
                        bottom: "-60px",
                        left: "-80px",
                        background:
                            "radial-gradient(circle, rgba(134,239,172,0.12), transparent 70%)",
                        animation: "floatB 15s ease-in-out infinite",
                    }}
                />
                <div
                    style={{
                        width: "200px",
                        height: "200px",
                        top: "45%",
                        left: "60%",
                        background:
                            "radial-gradient(circle, rgba(187,247,208,0.08), transparent 70%)",
                        animation: "floatC 10s ease-in-out infinite",
                    }}
                />
            </div>

            {/* Contenido principal */}
            <div style={{ zIndex: 10 }}>
                {/* Logo oficial con entrada animada (Ahora como Header Blanco de Ancho Completo) */}
                <div
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.98)",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
                        animation:
                            "slideDown 0.8s cubic-bezier(0.22,1,0.36,1) both", }}
                >
                    {/* Brillo sutil interno y adorno */}
                    <div />
                    <div />

                    <Image
                        src="/logo-empresa.png"
                        alt="COOPETRAES - Cooperativa de Transporte Especial de Sucre"
                        width={340}
                        height={85}
                        priority
                    />
                </div>

                {/* Mensaje central */}
                <div>
                    {/* Badge de estado */}
                    <div
                        style={{
                            background: "rgba(255,255,255,0.10)",
                            border: "1px solid rgba(255,255,255,0.18)",
                            backdropFilter: "blur(8px)",
                            animation:
                                "fadeUp 0.7s 0.2s cubic-bezier(0.22,1,0.36,1) both",
                        }}
                    >
                        <span
                            style={{
                                animation: "pulse 2s ease-in-out infinite",
                            }}
                        />
                        <span>
                            Sistema Activo 24/7
                        </span>
                    </div>

                    {/* Título principal */}
                    <h1
                        style={{
                            fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                            animation:
                                "fadeUp 0.7s 0.35s cubic-bezier(0.22,1,0.36,1) both",
                        }}
                    >
                        Gestión
                        <br />
                        <span style={{ color: "#86efac" }}>Integral</span>
                        <br />
                        de Transporte
                    </h1>

                    <p
                        style={{
                            color: "rgba(187,247,208,0.75)",
                            animation:
                                "fadeUp 0.7s 0.5s cubic-bezier(0.22,1,0.36,1) both",
                        }}
                    >
                        Plataforma oficial SGIT PRO · Control total de flotas,
                        conductores, documentos y cumplimiento normativo.
                    </p>

                    {/* Estadísticas */}
                    <div
                        style={{ animation:
                                "fadeUp 0.7s 0.65s cubic-bezier(0.22,1,0.36,1) both" }}
                    >
                        {stats.map((stat, i) => (
                            <div
                                key={stat.label}
                                style={{ transitionDelay: `${i * 60}ms` }}
                            >
                                <div
                                    style={{
                                        background: "rgba(255,255,255,0.06)",
                                        border: "1px solid rgba(255,255,255,0.10)",
                                    }}
                                >
                                    <p>
                                        {stat.value}
                                    </p>
                                    <p style={{ color: "rgba(187,247,208,0.6)" }}>
                                        {stat.label}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pie del panel */}
                <div
                    style={{
                        borderTop: "1px solid rgba(255,255,255,0.10)",
                        animation:
                            "fadeUp 0.7s 0.8s cubic-bezier(0.22,1,0.36,1) both",
                    }}
                >
                    <p style={{ color: "rgba(187,247,208,0.4)", fontSize: "11px" }}>
                        &copy; 2026 COOPETRAES S.A. — Todos los derechos
                        reservados.
                    </p>
                    <p style={{ color: "rgba(187,247,208,0.4)", fontSize: "11px" }}>
                        v 5.2.0
                    </p>
                </div>
            </div>

            {/* Keyframes via style tag */}
            <style>{`
                @keyframes floatA {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33%      { transform: translate(-30px, 20px) scale(1.05); }
                    66%      { transform: translate(20px, -15px) scale(0.97); }
                }
                @keyframes floatB {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    40%      { transform: translate(25px, -20px) scale(1.08); }
                    70%      { transform: translate(-15px, 15px) scale(0.95); }
                }
                @keyframes floatC {
                    0%, 100% { transform: translate(0, 0); }
                    50%      { transform: translate(-20px, 20px); }
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%      { opacity: 0.5; transform: scale(0.75); }
                }
            `}</style>
        </div>
    );
}
