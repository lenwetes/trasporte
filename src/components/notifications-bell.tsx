"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertNotification } from "@/lib/alerts";

interface NotificationsBellProps {
    initialAlerts: AlertNotification[];
    userRole?: string;
}

export function NotificationsBell({ initialAlerts }: NotificationsBellProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ position: 'relative', display: 'inline-block'  }}>
            <button onClick={() => setIsOpen(!isOpen)}>
                Alertas ({initialAlerts?.length || 0})
            </button>

            {isOpen && (
                <div style={{ position: 'absolute', right: 0, top: '100%', width: '300px', background: '#fff', border: '1px solid #ccc', zIndex: 1000, padding: '15px'  }}>
                    <h3 style={{ margin: '0 0 10px 0'  }}>Notificaciones</h3>
                    <div style={{ maxHeight: '400px', overflowY: 'auto'  }}>
                        {initialAlerts?.length > 0 ? (
                            initialAlerts.map((alert, idx) => (
                                <div key={idx} style={{ marginBottom: '10px', paddingBottom: '5px', borderBottom: '1px solid #eee'  }}>
                                    <Link href={`/dashboard/vehiculos/${alert.vehiculoId}`} onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: '#333'  }}>
                                        <strong>{alert.vehiculoPlaca}</strong>: {alert.tipo.replace(/_/g, ' ')}
                                        <br />
                                        <small>{alert.daysUntilExpiry} días para vencer</small>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p>No hay alertas pendientes.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
