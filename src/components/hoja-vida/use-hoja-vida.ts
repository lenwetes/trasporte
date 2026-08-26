"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    deleteCertificado,
    deleteExperienciaLaboral,
    deleteReferenciaPersonal,
    updateUser,
} from "@/actions";
import { generateCV, CVData } from "@/lib/pdf-generator-cv";

import { ActionResult } from "@/types";

export function useHojaVida(userId: string) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onRefresh = () => {
        router.refresh();
    };

    const handleDeleteCertificado = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este certificado?")) return;
        const result = (await deleteCertificado({
            id,
            usuarioId: userId,
        })) as ActionResult;
        if (result.success) {
            alert("Certificado eliminado");
            onRefresh();
        } else {
            alert(result.error || "Error al eliminar");
        }
    };

    const handleDeleteExperiencia = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar esta experiencia?")) return;
        const result = (await deleteExperienciaLaboral({
            id,
            usuarioId: userId,
        })) as ActionResult;
        if (result.success) {
            alert("Experiencia eliminada");
            onRefresh();
        } else {
            alert(result.error || "Error al eliminar");
        }
    };

    const handleDeleteReferencia = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar esta referencia?")) return;
        const result = (await deleteReferenciaPersonal({
            id,
            usuarioId: userId,
        })) as ActionResult;
        if (result.success) {
            alert("Referencia eliminada");
            onRefresh();
        } else {
            alert(result.error || "Error al eliminar");
        }
    };

    const handleSaveBasicInfo = async (
        basicInfo: Record<string, string | null>,
    ) => {
        setIsSubmitting(true);
        try {
            const result = (await updateUser({
                id: userId,
                ...basicInfo,
            })) as ActionResult;
            if (result.success) {
                alert("Información actualizada");
                onRefresh();
                return true;
            } else {
                alert(result.error || "Error al actualizar");
                return false;
            }
        } catch (error) {
            console.error(error);
            alert("Error de servidor");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownloadPDF = async (data: CVData) => {
        try {
            console.log("Generando PDF...");
            await generateCV(data);
            alert("Hoja de Vida descargada");
        } catch (error) {
            console.error(error);
            alert("Error al generar el PDF");
        }
    };

    return {
        isSubmitting,
        handleDeleteCertificado,
        handleDeleteExperiencia,
        handleDeleteReferencia,
        handleSaveBasicInfo,
        handleDownloadPDF,
        onRefresh,
    };
}
