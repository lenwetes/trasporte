"use client";

import { useState } from "react";
import { logoutAction } from "@/actions/auth-client";
import Link from "next/link";

interface UserMenuProps {
    user: {
        id?: string;
        name?: string | null;
        email?: string | null;
        rol?: string;
        image?: string | null;
    };
}

export function UserMenu({ user }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ position: 'relative', display: 'inline-block'  }}>
            <button onClick={() => setIsOpen(!isOpen)}>
                {user.name || 'Usuario'} ▼
            </button>

            {isOpen && (
                <div style={{ position: 'absolute', right: 0, top: '100%', width: '200px', background: '#fff', border: '1px solid #ccc', zIndex: 1000, padding: '10px'  }}>
                    <div style={{ paddingBottom: '10px', borderBottom: '1px solid #eee'  }}>
                        <strong>{user.name}</strong><br />
                        <small>{user.email}</small>
                    </div>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px'  }}>
                        <Link href="/dashboard/perfil" onClick={() => setIsOpen(false)}>Mi Expediente</Link>
                        {user.rol === "ADMIN" && (
                            <Link href="/dashboard/configuracion" onClick={() => setIsOpen(false)}>Consola Maestra</Link>
                        )}
                        <hr />
                        <button onClick={() => logoutAction()} style={{ border: 'none', background: 'none', color: 'red', textAlign: 'left', cursor: 'pointer'  }}>
                            Cerrar Sesión
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
}
