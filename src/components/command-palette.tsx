"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, X, ChevronRight } from "lucide-react";

export function GlobalSearch({ userRole }: { userRole?: string }) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/dashboard/vehiculos?search=${encodeURIComponent(query)}`);
            setOpen(false);
            setQuery("");
        }
    };

    // Close on escape
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div style={{ display: 'inline-block'  }}>
            <button 
                onClick={() => setOpen(!open)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#f8fafc",
                    color: "#64748b",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                }}
            >
                <Search size={16} />
                <span>Buscar...</span>
            </button>

            {open && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: "blur(4px)", zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '10vh'  }}>
                    <div style={{ background: '#fff', borderRadius: '24px', width: '600px', maxWidth: '90%', boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", overflow: "hidden" }}>
                        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', borderBottom: "1px solid #f1f5f9", padding: "16px 24px" }}>
                            <Search size={24} color="#94a3b8" />
                            <input 
                                type="text" 
                                placeholder="Id de vehículo, placa, conductor..." 
                                value={query} 
                                onChange={(e) => setQuery(e.target.value)}
                                style={{ flex: 1, padding: '16px', fontSize: '18px', border: "none", outline: "none", backgroundColor: "transparent", color: "#0f172a" }}
                                autoFocus
                            />
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button type="submit" style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#f0fdf4", color: "#16a34a", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <ChevronRight size={20} />
                                </button>
                                <button type="button" onClick={() => setOpen(false)} style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#f8fafc", color: "#64748b", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <X size={20} />
                                </button>
                            </div>
                        </form>
                        <div style={{ padding: "16px 24px", backgroundColor: "#f8fafc", color: "#64748b", fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                            <span>Búsqueda global del sistema</span>
                            <span>Presiona <kbd style={{ backgroundColor: "#e2e8f0", padding: "2px 6px", borderRadius: "4px", border: "1px solid #cbd5e1" }}>ESC</kbd> para cerrar</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
