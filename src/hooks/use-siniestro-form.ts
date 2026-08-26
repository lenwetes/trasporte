"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiniestroCreateSchema, SiniestroCreate } from "@/lib/validations";
import { createSiniestro, uploadFile } from "@/actions";
import { RepositorioArchivo } from "@prisma/client";
import { toast } from "sonner";

interface FotoSubida {
    id: string;
    nombreUnico: string;
}

export function useSiniestroForm(defaultConductorId?: string) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [fotosSubidas, setFotosSubidas] = useState<FotoSubida[]>([]);

    const form = useForm<SiniestroCreate>({
        resolver: zodResolver(SiniestroCreateSchema),
        defaultValues: {
            fecha: new Date(),
            lugar: "",
            reporteHechos: "",
            gravedad: "SOLO_DANOS",
            fotoIds: [],
            conductorId: defaultConductorId || undefined,
            vehiculoId: undefined,
        },
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        try {
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append("file", files[i]);

                const result = await uploadFile(formData);
                if (result.success && result.data) {
                    const uploadData = result.data as RepositorioArchivo;
                    setFotosSubidas((prev) => [
                        ...prev,
                        {
                            id: uploadData.id,
                            nombreUnico: uploadData.nombreUnico,
                        },
                    ]);
                    const currentIds = form.watch("fotoIds") || [];
                    form.setValue("fotoIds", [...currentIds, uploadData.id]);
                } else {
                    toast.error(
                        `Error al subir ${files[i].name}: ${result.error}`,
                    );
                }
            }
            toast.success("Evidencia cargada");
        } catch (error) {
            console.error("Error al subir archivos:", error);
            toast.error("Error en la carga de archivos");
        } finally {
            setIsUploading(false);
        }
    };

    const removeFoto = (id: string) => {
        setFotosSubidas((prev) => prev.filter((f) => f.id !== id));
        const currentIds = form.watch("fotoIds") || [];
        form.setValue(
            "fotoIds",
            currentIds.filter((fid) => fid !== id),
        );
    };

    const onSubmit = async (data: SiniestroCreate) => {
        setIsSubmitting(true);
        try {
            const result = await createSiniestro(data);
            if (result.success) {
                toast.success("Siniestro registrado exitosamente");
                router.push("/dashboard/siniestros");
                router.refresh();
            } else {
                toast.error(result.error || "Error al registrar siniestro");
            }
        } catch (error) {
            console.error("Error al registrar siniestro:", error);
            toast.error("Error de comunicación con el servidor");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        form,
        isSubmitting,
        isUploading,
        fotosSubidas,
        handleFileUpload,
        removeFoto,
        onSubmit: form.handleSubmit(onSubmit),
    };
}
