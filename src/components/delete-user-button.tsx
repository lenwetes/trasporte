"use client";

import { useState } from "react";
import { deleteUser } from "@/actions";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DeleteUserButtonProps {
    userId: string;
    userName: string;
    variant?: "icon" | "button";
}

export function DeleteUserButton({
    userId,
    userName,
    variant = "button",
}: DeleteUserButtonProps) {
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        if (!confirm(`¿Estás seguro de que deseas eliminar al usuario ${userName}?`)) {
            return;
        }

        setLoading(true);
        try {
            const result = await deleteUser(userId);
            if (result.success) {
                toast.success(`Usuario ${userName} eliminado correctamente`);
                window.location.reload();
            } else {
                toast.error(result.error || "No se pudo eliminar el usuario");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error al eliminar el usuario");
        } finally {
            setLoading(false);
        }
    }

    if (variant === "icon") {
        return (
            <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={loading}
                className="h-10 w-10 bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-none transition-colors shadow-sm focus-visible:ring-0 focus-visible:border-red-500 group/btn"
                title="Eliminar registro"
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />}
            </Button>
        );
    }

    return (
        <Button 
            onClick={handleDelete} 
            disabled={loading}
            className="h-10 bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-black text-[10px] uppercase tracking-widest rounded-none shadow-sm focus-visible:ring-0 focus-visible:border-red-500 transition-colors"
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />} 
            ELIMINAR USUARIO
        </Button>
    );
}
