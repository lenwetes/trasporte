"use client";

import { useState, useEffect } from "react";
import { upsertProvider } from "@/actions/finance/providers";
import { toast } from "sonner";

export interface ProviderData {
    id?: string;
    nombres?: string;
    razonSocial?: string | null;
    tipoDocumento?: string;
    numeroDocumento?: string | null;
    celular?: string | null;
    email?: string | null;
    direccion?: string | null;
    ciudad?: string | null;
    contacto?: string | null;
    tipoTercero?: string | null;
    activo?: boolean;
}

export function useProviderForm(
    open: boolean,
    setOpen: (open: boolean) => void,
    provider?: ProviderData,
    onSuccess?: (newProvider?: ProviderData) => void,
) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        nombres: "",
        razonSocial: "",
        tipoDocumento: "NIT",
        numeroDocumento: "",
        celular: "",
        email: "",
        direccion: "",
        ciudad: "Sincelejo",
        contacto: "",
        activo: true,
    });

    useEffect(() => {
        if (provider) {
            setFormData({
                id: provider.id || "",
                nombres: provider.nombres || "",
                razonSocial: provider.razonSocial || "",
                tipoDocumento: provider.tipoDocumento || "NIT",
                numeroDocumento: provider.numeroDocumento || "",
                celular: provider.celular || "",
                email: provider.email || "",
                direccion: provider.direccion || "",
                ciudad: provider.ciudad || "Sincelejo",
                contacto: provider.contacto || "",
                activo: provider.activo ?? true,
            });
        } else {
            setFormData({
                id: "",
                nombres: "",
                razonSocial: "",
                tipoDocumento: "NIT",
                numeroDocumento: "",
                celular: "",
                email: "",
                direccion: "",
                ciudad: "Sincelejo",
                contacto: "",
                activo: true,
            });
        }
    }, [provider, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await upsertProvider(formData);
            if (res.success) {
                toast.success(
                    formData.id ? "Proveedor actualizado" : "Proveedor creado",
                );
                setOpen(false);
                if (onSuccess) onSuccess(res.data as unknown as ProviderData);
            } else {
                toast.error(res.error);
            }
        } catch (error) {
            toast.error("Error al guardar el proveedor");
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        formData,
        setFormData,
        handleSubmit,
    };
}
