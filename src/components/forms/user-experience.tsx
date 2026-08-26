"use client";

import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

// Internal parts
import {
    useExperience,
    ExperienciaLaboral,
} from "./user-experience/hooks/use-experience";
import { ExperienceItem } from "./user-experience/components/experience-item";
import { ExperienceForm } from "./user-experience/components/experience-form";

interface UserExperienceProps {
    usuarioId: string;
    initialExperiencias: ExperienciaLaboral[];
}

export function UserExperience({
    usuarioId,
    initialExperiencias,
}: UserExperienceProps) {
    const {
        experiencias,
        isAdding,
        setIsAdding,
        isLoading,
        newExp,
        setNewExp,
        handleAdd,
        handleDelete,
    } = useExperience({
        usuarioId,
        initialExperiencias,
    });

    return (
        <div>
            <div>
                <h3>
                    <Briefcase />
                    Experiencia Laboral
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
                <ExperienceForm
                    newExp={newExp}
                    setNewExp={setNewExp}
                    onAdd={handleAdd}
                    isLoading={isLoading}
                />
            )}

            <div>
                {experiencias.length === 0 ? (
                    <div>
                        <Briefcase />
                        <p>
                            No hay experiencia laboral registrada
                        </p>
                    </div>
                ) : (
                    experiencias.map((exp) => (
                        <ExperienceItem
                            key={exp.id}
                            exp={exp}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
