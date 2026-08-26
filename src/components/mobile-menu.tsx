"use client";

import { useState } from "react";
import Link from "next/link";

export function MobileMenu({ userRole }: { userRole?: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ display: 'inline-block'  }}>
            <button onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? 'Cerrar Menú' : 'Menú'}
            </button>

            {isOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '250px', height: '100%', background: '#fff', borderRight: '1px solid #ccc', zIndex: 1000, padding: '20px'  }}>
                    <button onClick={() => setIsOpen(false)}>Cerrar [X]</button>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px'  }}>
                        <Link href="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                        <Link href="/dashboard/vehiculos" onClick={() => setIsOpen(false)}>Vehículos</Link>
                        <Link href="/dashboard/conductores" onClick={() => setIsOpen(false)}>Conductores</Link>
                        <Link href="/dashboard/siniestros" onClick={() => setIsOpen(false)}>Siniestros</Link>
                        <Link href="/dashboard/novedades" onClick={() => setIsOpen(false)}>Novedades</Link>
                        <Link href="/dashboard/reportes" onClick={() => setIsOpen(false)}>Reportes</Link>
                        <Link href="/dashboard/configuracion" onClick={() => setIsOpen(false)}>Configuración</Link>
                    </nav>
                </div>
            )}
        </div>
    );
}
