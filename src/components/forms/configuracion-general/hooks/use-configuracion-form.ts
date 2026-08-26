"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    ConfiguracionGlobalSchema,
    ConfiguracionGlobal,
} from "@/lib/validations";
import { updateConfiguracionGlobal, uploadFile } from "@/actions";
import { RepositorioArchivo } from "@prisma/client";

interface UseConfiguracionFormProps {
    defaultValues: Partial<ConfiguracionGlobal>;
}

export function useConfiguracionForm({
    defaultValues,
}: UseConfiguracionFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const form = useForm<ConfiguracionGlobal>({
        resolver: zodResolver(ConfiguracionGlobalSchema),
        defaultValues: {
            nombreEmpresa: defaultValues.nombreEmpresa || "COOPETRAES",
            logoUrl: defaultValues.logoUrl || "",
            logoLocalPath: defaultValues.logoLocalPath || "",
            colorPrimario: defaultValues.colorPrimario || "#10b981",
            representanteLegal: defaultValues.representanteLegal || "",
            telefono: defaultValues.telefono || "",
            email: defaultValues.email || "",
            direccion: defaultValues.direccion || "",
            moduloSiniestros: defaultValues.moduloSiniestros ?? true,
            moduloReportes: defaultValues.moduloReportes ?? true,
            moduloConductores: defaultValues.moduloConductores ?? true,
            
            // Parámetros Financieros
            montoCuotaAdministracion: Number(defaultValues.montoCuotaAdministracion || 80000),
            diaCorteMensual: Number(defaultValues.diaCorteMensual || 5),
            umbralBloqueoMora: Number(defaultValues.umbralBloqueoMora || 200000),
            porcentajeMoraDiaria: Number(defaultValues.porcentajeMoraDiaria || 0),
            costoBaseFuec: Number(defaultValues.costoBaseFuec || 30000),
        },
    });

    const { setValue, handleSubmit } = form;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const result = await uploadFile(formData);
            if (result.success && result.data) {
                const uploadData = result.data as RepositorioArchivo;
                setValue("logoLocalPath", uploadData.nombreUnico);
                toast.success("Logo cargado exitosamente");
            } else {
                toast.error(`Error al subir logo: ${result.error}`);
            }
        } catch (error) {
            console.error("Error al subir logo:", error);
            toast.error("Error en la carga del logo");
        } finally {
            setIsUploading(false);
        }
    };

    const onSubmit = async (data: ConfiguracionGlobal) => {
        setIsSubmitting(true);
        try {
            const result = await updateConfiguracionGlobal(data);
            if (result.success) {
                toast.success("Configuración actualizada correctamente");
            } else {
                toast.error(
                    result.error || "Error al actualizar configuración",
                );
            }
        } catch (error) {
            console.error("Error al guardar:", error);
            toast.error("Error de comunicación con el servidor");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        form,
        isSubmitting,
        isUploading,
        handleFileUpload,
        onSubmit: handleSubmit(onSubmit),
    };
}
