"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ExperienciaLaboralCreateSchema,
    ExperienciaLaboralCreate,
} from "@/lib/validations";
import { createExperienciaLaboral, updateExperienciaLaboral } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Save } from "lucide-react";
import { toast } from "sonner";

interface ExperienciaLaboralFormProps {
    usuarioId: string;
    initialData?: {
        id?: string;
        empresa: string;
        cargo: string;
        jefeInmediato?: string | null;
        telefonoJefe?: string | null;
        fechaInicio?: Date | null;
        fechaFin?: Date | null;
        tiempoLaborado?: string | null;
    };
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function ExperienciaLaboralForm({
    usuarioId,
    initialData,
    onSuccess,
    onCancel,
}: ExperienciaLaboralFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditing = !!initialData?.id;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ExperienciaLaboralCreate>({
        resolver: zodResolver(ExperienciaLaboralCreateSchema),
        defaultValues: {
            empresa: initialData?.empresa || "",
            cargo: initialData?.cargo || "",
            jefeInmediato: initialData?.jefeInmediato || "",
            telefonoJefe: initialData?.telefonoJefe || "",
            fechaInicio: initialData?.fechaInicio
                ? new Date(initialData.fechaInicio)
                : undefined,
            fechaFin: initialData?.fechaFin
                ? new Date(initialData.fechaFin)
                : undefined,
            tiempoLaborado: initialData?.tiempoLaborado || "",
            usuarioId,
        },
    });

    const onSubmit = async (data: ExperienciaLaboralCreate) => {
        setIsSubmitting(true);
        try {
            const result =
                isEditing && initialData?.id
                    ? await updateExperienciaLaboral({
                          id: initialData.id,
                          ...data,
                      })
                    : await createExperienciaLaboral(data);

            if (result.success) {
                toast.success(
                    isEditing
                        ? "Experiencia actualizada"
                        : "Experiencia agregada correctamente",
                );
                onSuccess?.();
            } else {
                toast.error(result.error || "Error al guardar experiencia");
            }
        } catch (error) {
            console.error("Error submitting experiencia:", error);
            toast.error("Error de servidor");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}> <Card>
                <CardHeader>
                    <CardTitle>
                        <Briefcase />
                        {isEditing
                            ? "Editar Experiencia Laboral"
                            : "Nueva Experiencia Laboral"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <div>
                            <Label htmlFor="empresa">Empresa *</Label>
                            <Input
                                id="empresa"
                                {...register("empresa")}
                                placeholder="Nombre de la empresa"
                            />
                            {errors.empresa && (
                                <span>
                                    {errors.empresa.message}
                                </span>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="cargo">Cargo *</Label>
                            <Input
                                id="cargo"
                                {...register("cargo")}
                                placeholder="Cargo desempeñado"
                            />
                            {errors.cargo && (
                                <span>
                                    {errors.cargo.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div>
                        <div>
                            <Label htmlFor="jefeInmediato">
                                Jefe Inmediato
                            </Label>
                            <Input
                                id="jefeInmediato"
                                {...register("jefeInmediato")}
                                placeholder="Nombre del jefe"
                            />
                        </div>

                        <div>
                            <Label htmlFor="telefonoJefe">
                                Teléfono del Jefe
                            </Label>
                            <Input
                                id="telefonoJefe"
                                {...register("telefonoJefe")}
                                placeholder="Teléfono de contacto"
                            />
                        </div>
                    </div>

                    <div>
                        <div>
                            <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                            <Input
                                id="fechaInicio"
                                type="date"
                                {...register("fechaInicio")}
                            />
                        </div>

                        <div>
                            <Label htmlFor="fechaFin">Fecha de Fin</Label>
                            <Input
                                id="fechaFin"
                                type="date"
                                {...register("fechaFin")}
                            />
                        </div>

                        <div>
                            <Label htmlFor="tiempoLaborado">
                                Tiempo Laborado
                            </Label>
                            <Input
                                id="tiempoLaborado"
                                {...register("tiempoLaborado")}
                                placeholder="Ej: 2 años"
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <span>[LOADER2]</span> : (
                                <Save />
                            )}
                            {isEditing ? "Actualizar" : "Guardar"}
                        </Button>
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={isSubmitting}
                            >
                                <span>[X]</span>
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
