"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createReferenciaPersonal, deleteReferenciaPersonal } from "@/actions";
import { toast } from "sonner";
import { Phone, Trash2 } from "lucide-react";

interface ReferenciaPersonal {
    id: string;
    nombre: string;
    ocupacion?: string | null;
    telefono?: string | null;
}

interface UserReferencesProps {
    usuarioId: string;
    initialReferencias: ReferenciaPersonal[];
}

export function UserReferences({
    usuarioId,
    initialReferencias,
}: UserReferencesProps) {
    const [referencias, setReferencias] =
        useState<ReferenciaPersonal[]>(initialReferencias);
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [newRef, setNewRef] = useState({
        nombre: "",
        ocupacion: "",
        telefono: "",
    });

    const handleAdd = async () => {
        if (!newRef.nombre) {
            toast.error("El nombre es requerido");
            return;
        }

        setIsLoading(true);
        try {
            const result = await createReferenciaPersonal({
                ...newRef,
                usuarioId,
            });

            if (result.success && result.data) {
                toast.success("Referencia añadida");
                setReferencias([
                    ...referencias,
                    result.data as unknown as ReferenciaPersonal,
                ]);
                setNewRef({
                    nombre: "",
                    ocupacion: "",
                    telefono: "",
                });
                setIsAdding(false);
            } else {
                toast.error(result.error || "Error al añadir referencia");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ocurrió un error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Está seguro de eliminar esta referencia?")) return;

        try {
            // Reusing a hypothetical deleteReferenciaPersonal if it existed, or just a placeholder since I haven't added it to actions yet.
            // Wait, did I add it? Let me check actions.
            const result = await deleteReferenciaPersonal({ id, usuarioId });
            if (result.success) {
                toast.success("Referencia eliminada");
                setReferencias(referencias.filter((r) => r.id !== id));
            }
        } catch (err) {
            console.error(err);
            toast.error("Error al eliminar");
        }
    };

    return (
        <div>
            <div>
                <h3>
                    <span>[USER]</span>
                    Referencias Personales
                </h3>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAdding(!isAdding)}
                >
                    {isAdding ? (
                        "Cancelar"
                    ) : (
                        <>
                            <span>[PLUS]</span> Añadir
                        </>
                    )}
                </Button>
            </div>

            {isAdding && (
                <div>
                    <div>
                        <div>
                            <label>
                                Nombre Completo
                            </label>
                            <Input
                                value={newRef.nombre}
                                onChange={(e) => setNewRef({
                                        ...newRef,
                                        nombre: e.target.value,
                                    })
                                }
                                placeholder="Ej: Juan Pérez"
                                
                            />
                        </div>
                        <div>
                            <label>
                                Ocupación / Relación
                            </label>
                            <Input
                                value={newRef.ocupacion}
                                onChange={(e) => setNewRef({
                                        ...newRef,
                                        ocupacion: e.target.value,
                                    })
                                }
                                placeholder="Ej: Ingeniero / Colega"
                                
                            />
                        </div>
                        <div>
                            <label>
                                Teléfono
                            </label>
                            <Input
                                value={newRef.telefono}
                                onChange={(e) => setNewRef({
                                        ...newRef,
                                        telefono: e.target.value,
                                    })
                                }
                                placeholder="Ej: 300 123 4567"
                                
                            />
                        </div>
                    </div>
                    <Button
                        onClick={handleAdd}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span>[LOADER2]</span>
                        ) : (
                            "Guardar Referencia"
                        )}
                    </Button>
                </div>
            )}

            <div>
                {referencias.length === 0 ? (
                    <div>
                        <span>[USER]</span>
                        <p>
                            No hay referencias registradas
                        </p>
                    </div>
                ) : (
                    referencias.map((ref) => (
                        <div
                            key={ref.id}>
 <div>
                                <div>
                                    <span>[USER]</span>
                                </div>
                                <div>
                                    <h4>
                                        {ref.nombre}
                                    </h4>
                                    <p>
                                        {ref.ocupacion || "Sin ocupación"}
                                    </p>
                                    {ref.telefono && (
                                        <div>
                                            <Phone />
                                            <span>
                                                {ref.telefono}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(ref.id)}
                            >
                                <Trash2 />
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
