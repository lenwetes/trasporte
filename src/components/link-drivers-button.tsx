"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { getConductoresList, vincularConductoresMasivo } from "@/actions";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { User, Search, Loader2 } from "lucide-react";

interface Conductor {
    id: string;
    nombre: string;
}

interface LinkDriversButtonProps {
    vehiculoId: string;
    alreadyLinkedIds: string[];
}

export function LinkDriversButton({
    vehiculoId,
    alreadyLinkedIds,
}: LinkDriversButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [conductores, setConductores] = useState<Conductor[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async () => {
        setFetching(true);
        try {
            const result = await getConductoresList();
            if (result.success) {
                setConductores(result.data as Conductor[]);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar conductores");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const handleLink = async () => {
        if (selectedIds.length === 0) return;
        setLoading(true);
        try {
            const result = await vincularConductoresMasivo({
                vehiculoId,
                conductorIds: selectedIds,
            });
            if (result.success) {
                toast.success(result.message || "Conductores vinculados");
                setIsOpen(false);
                setSelectedIds([]);
            } else {
                toast.error(result.error || "No se pudo vincular");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al vincular conductores");
        } finally {
            setLoading(false);
        }
    };

    const toggleConductor = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    };

    const filteredConductores = conductores.filter((c) =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 16px",
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600"
                }}
            >
                <User size={18} />
                Vincular Conductor
            </button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}> <DialogContent>
                    <DialogHeader>
                        <DialogTitle style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <User size={20} style={{ color: "#10b981" }} />
                            Vincular Conductores
                        </DialogTitle>
                        <DialogDescription>
                            Selecciona uno o varios conductores para asignar a
                            este vehículo.
                        </DialogDescription>
                    </DialogHeader>

                    <div style={{ marginTop: "16px" }}>
                        <div style={{ position: "relative", marginBottom: "16px" }}>
                            <Search size={18} style={{ 
                                position: "absolute", 
                                left: "12px", 
                                top: "50%", 
                                transform: "translateY(-50%)",
                                color: "#94a3b8"
                            }} />
                            <input
                                placeholder="Buscar conductor por nombre..."
                                style={{
                                    width: "100%",
                                    padding: "10px 12px 10px 40px",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                    fontSize: "14px"
                                }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div style={{ 
                            maxHeight: "300px", 
                            overflowY: "auto", 
                            border: "1px solid #e2e8f0", 
                            borderRadius: "8px" 
                        }}>
                            {fetching ? (
                                <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                                    <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto 12px" }} />
                                    <p style={{ fontSize: "14px" }}>
                                        Cargando conductores...
                                    </p>
                                </div>
                            ) : filteredConductores.length === 0 ? (
                                <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                                    <p style={{ fontSize: "14px" }}>
                                        No se encontraron conductores
                                    </p>
                                </div>
                            ) : (
                                filteredConductores.map((c) => {const isLinked = alreadyLinkedIds.includes(
                                        c.id,
                                    );
                                    return (
                                        <div
                                            key={c.id}
                                            onClick={() => !isLinked && toggleConductor(c.id)}
                                            style={{ 
                                                display: "flex", 
                                                alignItems: "center", 
                                                justifyContent: "space-between",
                                                padding: "12px",
                                                borderBottom: "1px solid #eee",
                                                cursor: isLinked ? "default" : "pointer",
                                                backgroundColor: isLinked ? "#f8fafc" : (selectedIds.includes(c.id) ? "#f0fdf4" : "transparent")
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                <div style={{ 
                                                    width: "36px", 
                                                    height: "36px", 
                                                    borderRadius: "50%", 
                                                    backgroundColor: isLinked ? "#e2e8f0" : "#dcfce7", 
                                                    color: isLinked ? "#64748b" : "#166534",
                                                    display: "flex", 
                                                    alignItems: "center", 
                                                    justifyContent: "center",
                                                    fontSize: "14px",
                                                    fontWeight: "bold"
                                                }}>
                                                    {(c.nombre || "?")[0]}
                                                </div>
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>{c.nombre}</p>
                                                    {isLinked && (
                                                        <Badge variant="outline" style={{ fontSize: "10px" }}>Ya vinculado</Badge>
                                                    )}
                                                </div>
                                            </div>
                                            {!isLinked && (
                                                <Checkbox
                                                    checked={selectedIds.includes(c.id)}
                                                    onCheckedChange={() => toggleConductor(c.id)}
                                                />
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <DialogFooter style={{ marginTop: "24px" }}>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                padding: "10px 20px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                backgroundColor: "white",
                                color: "#64748b",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "600"
                            }}
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleLink}
                            disabled={loading || selectedIds.length === 0}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "10px 24px",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: loading || selectedIds.length === 0 ? "#94a3b8" : "#10b981",
                                color: "white",
                                cursor: loading || selectedIds.length === 0 ? "not-allowed" : "pointer",
                                fontSize: "14px",
                                fontWeight: "600"
                            }}
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                `Vincular ${selectedIds.length > 0 ? `(${selectedIds.length})` : ""}`
                            )}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
