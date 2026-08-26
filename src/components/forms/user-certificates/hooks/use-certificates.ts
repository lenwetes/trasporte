"use client";

import { useState } from "react";
import { createCertificado, deleteCertificado, uploadFile } from "@/actions";
import { RepositorioArchivo } from "@prisma/client";
import { toast } from "sonner";

export interface Certificado {
    id: string;
    nombre: string;
    institucion?: string | null;
    fechaEmision?: Date | null;
    fechaVencimiento?: Date | null;
    categoria?: string | null;
    archivo?: {
        nombreUnico: string;
    } | null;
}

interface UseCertificatesProps {
    usuarioId: string;
    initialCertificados: Certificado[];
    defaultCategory: string;
}

export function useCertificates({
    usuarioId,
    initialCertificados,
    defaultCategory,
}: UseCertificatesProps) {
    const [certificados, setCertificados] =
        useState<Certificado[]>(initialCertificados);
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [newCert, setNewCert] = useState({
        nombre: "",
        institucion: "",
        fechaEmision: "",
        fechaVencimiento: "",
        categoria: defaultCategory,
    });

    const handleAdd = async () => {
        if (!newCert.nombre) {
            toast.error("El nombre del certificado es requerido");
            return;
        }

        setIsLoading(true);
        try {
            let archivoId = undefined;

            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                const uploadResult = await uploadFile(formData);
                if (uploadResult.success && uploadResult.data) {
                    const uploadData = uploadResult.data as RepositorioArchivo;
                    archivoId = uploadData.id;
                } else {
                    toast.error("Error al subir el archivo");
                    setIsLoading(false);
                    return;
                }
            }

            const result = await createCertificado({
                ...newCert,
                fechaEmision: newCert.fechaEmision
                    ? new Date(newCert.fechaEmision)
                    : undefined,
                fechaVencimiento: newCert.fechaVencimiento
                    ? new Date(newCert.fechaVencimiento)
                    : undefined,
                usuarioId,
                archivoId,
                categoria: newCert.categoria,
            });

            if (result.success && result.data) {
                toast.success("Certificado añadido");
                setCertificados([
                    ...certificados,
                    result.data as unknown as Certificado,
                ]);
                setNewCert({
                    nombre: "",
                    institucion: "",
                    fechaEmision: "",
                    fechaVencimiento: "",
                    categoria: defaultCategory,
                });
                setSelectedFile(null);
                setIsAdding(false);
            } else {
                toast.error(result.error || "Error al añadir certificado");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ocurrió un error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Está seguro de eliminar este certificado?")) return;

        try {
            const result = await deleteCertificado({ id, usuarioId });
            if (result.success) {
                toast.success("Certificado eliminado");
                setCertificados(certificados.filter((c) => c.id !== id));
            }
        } catch (err) {
            console.error(err);
            toast.error("Error al eliminar");
        }
    };

    return {
        certificados,
        isAdding,
        setIsAdding,
        isLoading,
        newCert,
        setNewCert,
        setSelectedFile,
        handleAdd,
        handleDelete,
    };
}
