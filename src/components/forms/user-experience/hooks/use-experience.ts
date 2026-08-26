"use client";

import { useState } from "react";
import { createExperienciaLaboral, deleteExperienciaLaboral } from "@/actions";
import { toast } from "sonner";

export interface ExperienciaLaboral {
    id: string;
    empresa: string;
    cargo: string;
    jefeInmediato?: string | null;
    telefonoJefe?: string | null;
    fechaInicio?: Date | null;
    fechaFin?: Date | null;
    tiempoLaborado?: string | null;
}

interface UseExperienceProps {
    usuarioId: string;
    initialExperiencias: ExperienciaLaboral[];
}

export function useExperience({
    usuarioId,
    initialExperiencias,
}: UseExperienceProps) {
    const [experiencias, setExperiencias] =
        useState<ExperienciaLaboral[]>(initialExperiencias);
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [newExp, setNewExp] = useState({
        empresa: "",
        cargo: "",
        jefeInmediato: "",
        telefonoJefe: "",
        fechaInicio: "",
        fechaFin: "",
        tiempoLaborado: "",
    });

    const handleAdd = async () => {
        if (!newExp.empresa || !newExp.cargo) {
            toast.error("Empresa y cargo son requeridos");
            return;
        }

        setIsLoading(true);
        try {
            const result = await createExperienciaLaboral({
                ...newExp,
                fechaInicio: newExp.fechaInicio
                    ? new Date(newExp.fechaInicio)
                    : undefined,
                fechaFin: newExp.fechaFin
                    ? new Date(newExp.fechaFin)
                    : undefined,
                usuarioId,
            });

            if (result.success && result.data) {
                toast.success("Experiencia laboral añadida");
                setExperiencias([
                    ...experiencias,
                    result.data as unknown as ExperienciaLaboral,
                ]);
                setNewExp({
                    empresa: "",
                    cargo: "",
                    jefeInmediato: "",
                    telefonoJefe: "",
                    fechaInicio: "",
                    fechaFin: "",
                    tiempoLaborado: "",
                });
                setIsAdding(false);
            } else {
                toast.error(result.error || "Error al añadir experiencia");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ocurrió un error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Está seguro de eliminar esta experiencia laboral?"))
            return;

        try {
            const result = await deleteExperienciaLaboral({ id, usuarioId });
            if (result.success) {
                toast.success("Experiencia eliminada");
                setExperiencias(experiencias.filter((e) => e.id !== id));
            }
        } catch (err) {
            console.error(err);
            toast.error("Error al eliminar");
        }
    };

    return {
        experiencias,
        isAdding,
        setIsAdding,
        isLoading,
        newExp,
        setNewExp,
        handleAdd,
        handleDelete,
    };
}
