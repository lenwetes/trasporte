"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CertificadoCreateSchema, CertificadoCreate } from "@/lib/validations";
import { createCertificado, updateCertificado, uploadFile } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RepositorioArchivo } from "@prisma/client";
import { Award, Save } from "lucide-react";
import { toast } from "sonner";

interface CertificadoFormProps {
    usuarioId: string;
    initialData?: {
        id?: string;
        nombre: string;
        institucion?: string | null;
        fechaEmision?: Date | null;
        fechaVencimiento?: Date | null;
        archivoId?: string | null;
    };
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function CertificadoForm({
    usuarioId,
    initialData,
    onSuccess,
    onCancel,
}: CertificadoFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const isEditing = !!initialData?.id;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CertificadoCreate>({
        resolver: zodResolver(CertificadoCreateSchema),
        defaultValues: {
            nombre: initialData?.nombre || "",
            institucion: initialData?.institucion || "",
            fechaEmision: initialData?.fechaEmision
                ? new Date(initialData.fechaEmision)
                : undefined,
            fechaVencimiento: initialData?.fechaVencimiento
                ? new Date(initialData.fechaVencimiento)
                : undefined,
            usuarioId,
            archivoId: initialData?.archivoId || undefined,
        },
    });

    const onSubmit = async (data: CertificadoCreate) => {
        setIsSubmitting(true);
        try {
            let archivoId = initialData?.archivoId || undefined;

            // Si hay un archivo seleccionado, subirlo primero
            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                const uploadResult = await uploadFile(formData);

                if (uploadResult.success && uploadResult.data) {
                    const uploadData = uploadResult.data as RepositorioArchivo;
                    archivoId = uploadData.id;
                } else {
                    toast.error("Error al subir el archivo");
                    setIsSubmitting(false);
                    return;
                }
            }

            const submitData = { ...data, archivoId };

            const result =
                isEditing && initialData?.id
                    ? await updateCertificado({
                          id: initialData.id,
                          ...submitData,
                      })
                    : await createCertificado(submitData);

            if (result.success) {
                toast.success(
                    isEditing
                        ? "Certificado actualizado"
                        : "Certificado agregado correctamente",
                );
                onSuccess?.();
            } else {
                toast.error(result.error || "Error al guardar certificado");
            }
        } catch (error) {
            console.error("Error submitting certificado:", error);
            toast.error("Error de servidor");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}> <Card>
                <CardHeader>
                    <CardTitle>
                        <Award />
                        {isEditing ? "Editar Certificado" : "Nuevo Certificado"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <Label htmlFor="nombre">Nombre del Certificado *</Label>
                        <Input
                            id="nombre"
                            {...register("nombre")}
                            placeholder="Ej: Curso de Conducción Defensiva"
                        />
                        {errors.nombre && (
                            <span>
                                {errors.nombre.message}
                            </span>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="institucion">Institución</Label>
                        <Input
                            id="institucion"
                            {...register("institucion")}
                            placeholder="Ej: SENA, Universidad, etc."
                        />
                        {errors.institucion && (
                            <span>
                                {errors.institucion.message}
                            </span>
                        )}
                    </div>

                    <div>
                        <div>
                            <Label htmlFor="fechaEmision">
                                Fecha de Emisión
                            </Label>
                            <Input
                                id="fechaEmision"
                                type="date"
                                {...register("fechaEmision")}
                            />
                        </div>
                        <div>
                            <Label htmlFor="fechaVencimiento">
                                Fecha de Vencimiento
                            </Label>
                            <Input
                                id="fechaVencimiento"
                                type="date"
                                {...register("fechaVencimiento")}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="archivo">
                            Archivo PDF del Certificado
                        </Label>
                        <Input
                            id="archivo"
                            type="file"
                            accept="application/pdf,image/*"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)
                            }
                            
                        />
                        {selectedFile && (
                            <p>
                                ✓ {selectedFile.name} seleccionado
                            </p>
                        )}
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
