"use client";

import { useState, useEffect } from "react";
import { ActionResult } from "@/types";
import { getFinanceMetadata } from "@/actions/finance/transactions";
import { createManualObligation } from "@/actions/finance/obligations";
import { toast } from "sonner";

interface ObligationDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function ObligationDialog({ open, setOpen }: ObligationDialogProps) {
    const [loading, setLoading] = useState(false);
    const [metadata, setMetadata] = useState<{
        usuarios: { id: string; nombres: string; apellidos: string }[];
    } | null>(null);
    
    const [formData, setFormData] = useState({
        usuarioId: "",
        vehiculoId: "",
        tipo: "CUOTA_ADMINISTRACION" as string,
        monto: "",
        periodo: new Date().toISOString().slice(0, 7),
        fechaVence: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString().slice(0, 10),
        descripcion: "",
    });

    useEffect(() => {
        if (open) {
            async function load() {
                const res = await getFinanceMetadata() as ActionResult<{
                    usuarios: { id: string; nombres: string; apellidos: string }[];
                }>;
                if (res.success && res.data) setMetadata(res.data);
            }
            load();
        }
    }, [open]);

    const handleSubmit = async () => {
        if (!formData.usuarioId) return toast.error("Seleccione un tercero");
        if (!formData.monto || Number(formData.monto) <= 0) return toast.error("Monto inválido");

        setLoading(true);
        try {
            const res = await createManualObligation({
                ...formData,
                monto: Number(formData.monto),
                periodo: new Date(formData.periodo + "-01T05:00:00.000Z"),
                fechaVence: new Date(formData.fechaVence + "T05:00:00.000Z"),
            });

            if (res.success) {
                toast.success("Obligación creada");
                setOpen(false);
                setFormData({
                    usuarioId: "",
                    vehiculoId: "",
                    tipo: "CUOTA_ADMINISTRACION",
                    monto: "",
                    periodo: new Date().toISOString().slice(0, 7),
                    fechaVence: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString().slice(0, 10),
                    descripcion: "",
                });
            } else {
                toast.error(res.error || "Error al crear");
            }
        } catch {
            toast.error("Error en el servidor");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
            <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", maxWidth: "500px", width: "90%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                    <h2>Nueva Obligación</h2>
                    <button onClick={() => setOpen(false)}>X</button>
                </div>

                <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "12px" }}>Tipo:</label>
                        <select 
                            value={formData.tipo} 
                            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                            style={{ width: "100%" }}
                        >
                            <option value="CUOTA_ADMINISTRACION">CUOTA ADMINISTRACIÓN</option>
                            <option value="MULTA">MULTA / SANCIÓN</option>
                            <option value="APORTE">APORTE FONDO</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "12px" }}>Tercero:</label>
                        <select 
                            value={formData.usuarioId} 
                            onChange={(e) => setFormData({ ...formData, usuarioId: e.target.value })}
                            style={{ width: "100%" }}
                        >
                            <option value="">Seleccionar tercero...</option>
                            {metadata?.usuarios.map(u => (
                                <option key={u.id} value={u.id}>{u.nombres} {u.apellidos}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "12px" }}>Monto ($):</label>
                        <input 
                            type="number" 
                            value={formData.monto} 
                            onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                            style={{ width: "100%" }}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "12px" }}>Periodo (Mes):</label>
                            <input 
                                type="month" 
                                value={formData.periodo} 
                                onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
                                style={{ width: "100%" }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "12px" }}>Vence:</label>
                            <input 
                                type="date" 
                                value={formData.fechaVence} 
                                onChange={(e) => setFormData({ ...formData, fechaVence: e.target.value })}
                                style={{ width: "100%" }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "12px" }}>Descripción:</label>
                        <input 
                            type="text" 
                            value={formData.descripcion} 
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            style={{ width: "100%" }}
                        />
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button onClick={() => setOpen(false)}>Cancelar</button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={loading}
                        style={{ backgroundColor: "black", color: "white", padding: "10px 20px" }}
                    >
                        {loading ? "Procesando..." : "Causar Obligación"}
                    </button>
                </div>
            </div>
        </div>
    );
}
