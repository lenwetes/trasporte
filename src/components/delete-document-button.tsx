"use client";

import { useState } from "react";
import { deleteDocumentoVehiculo } from "@/actions";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface DeleteDocumentButtonProps {
    documentId: string;
    tipo: string;
}

export function DeleteDocumentButton({
    documentId,
    tipo,
}: DeleteDocumentButtonProps) {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const result = await deleteDocumentoVehiculo(documentId);
            if (result.success) {
                toast.success(`Documento ${tipo} eliminado correctamente`);
                setShowConfirm(false);
            } else {
                toast.error(result.error || "No se pudo eliminar el documento");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al eliminar el documento");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ConfirmDialog
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleDelete}
                loading={loading}
                title="Eliminar Documento"
                description={`¿Estás seguro de que deseas eliminar el documento ${tipo}? Esta acción no se puede deshacer.`}
            />

            <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowConfirm(true)}
                disabled={loading}
            >
                {loading ? (
                    <span>[LOADER2]</span>
                ) : (
                    <Trash2 />
                )}
            </Button>
        </>
    );
}
