"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ReferenciaPersonalCreateSchema,
    ReferenciaPersonalCreate,
} from "@/lib/validations";
import { createReferenciaPersonal, updateReferenciaPersonal } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface ReferenciaPersonalFormProps {
    usuarioId: string;
    initialData?: {
        id?: string;
        nombre: string;
        ocupacion?: string | null;
        telefono?: string | null;
    };
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function ReferenciaPersonalForm({
    usuarioId,
    initialData,
    onSuccess,
    onCancel,
}: ReferenciaPersonalFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditing = !!initialData?.id;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ReferenciaPersonalCreate>({
        resolver: zodResolver(ReferenciaPersonalCreateSchema),
        defaultValues: {
            nombre: initialData?.nombre || "",
            ocupacion: initialData?.ocupacion || "",
            telefono: initialData?.telefono || "",
            usuarioId,
        },
    });

    const onSubmit = async (data: ReferenciaPersonalCreate) => {
        setIsSubmitting(true);
        try {
            const result =
                isEditing && initialData?.id
                    ? await updateReferenciaPersonal({
                          id: initialData.id,
                          ...data,
                      })
                    : await createReferenciaPersonal(data);

            if (result.success) {
                toast.success(
                    isEditing
                        ? "Referencia actualizada"
                        : "Referencia agregada correctamente",
                );
                onSuccess?.();
            } else {
                toast.error(result.error || "Error al guardar referencia");
            }
        } catch (error) {
            console.error("Error submitting referencia:", error);
            toast.error("Error de servidor");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}> <Card>
                <CardHeader>
                    <CardTitle>
                        <span>[USER]</span>
                        {isEditing
                            ? "Editar Referencia Personal"
                            : "Nueva Referencia Personal"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <Label htmlFor="nombre">Nombre Completo *</Label>
                        <Input
                            id="nombre"
                            {...register("nombre")}
                            placeholder="Nombre de la persona de referencia"
                        />
                        {errors.nombre && (
                            <span>
                                {errors.nombre.message}
                            </span>
                        )}
                    </div>

                    <div>
                        <div>
                            <Label htmlFor="ocupacion">Ocupación</Label>
                            <Input
                                id="ocupacion"
                                {...register("ocupacion")}
                                placeholder="Profesión u ocupación"
                            />
                        </div>

                        <div>
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input
                                id="telefono"
                                {...register("telefono")}
                                placeholder="Número de contacto"
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
