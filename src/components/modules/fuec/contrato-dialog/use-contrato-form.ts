"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { contratoEmpresaSchema } from "@/lib/validations/fuec";
import { 
    createContrato, 
    updateContrato, 
    getClientesFrecuentes, 
    getResponsablesFrecuentes, 
    createClienteFrecuente, 
    createResponsableFrecuente 
} from "@/actions/fuec";
import { toast } from "sonner";
import { FuecContrato } from "../fuec-form/types";
import { FastClient, FastResponsable, ContratoDialogProps } from "./types";

export function useContratoForm({ onCreated, onUpdated, initialData, open, setOpen }: ContratoDialogProps & { open: boolean, setOpen: (open: boolean) => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [fastClients, setFastClients] = useState<FastClient[]>([]);
    const [fastResponsables, setFastResponsables] = useState<FastResponsable[]>([]);

    const form = useForm<z.infer<typeof contratoEmpresaSchema>>({
        resolver: zodResolver(contratoEmpresaSchema),
        defaultValues: {
            numeroContrato: initialData?.numeroContrato || "",
            consecutivoNumerico: initialData?.consecutivoNumerico ? Number(initialData.consecutivoNumerico) : undefined,
            cliente: initialData?.cliente || "",
            nitCliente: initialData?.nitCliente || "",
            objeto: initialData?.objeto || "",
            fechaInicio: initialData?.fechaInicio ? new Date(initialData.fechaInicio as string | Date) : new Date(),
            fechaFin: initialData?.fechaFin ? new Date(initialData.fechaFin as string | Date) : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            responsableNombre: initialData?.responsableNombre || "",
            responsableCedula: initialData?.responsableCedula || "",
            esInterno: (initialData?.esInterno as boolean) || false,
        },
    });

    useEffect(() => {
        if (open) {
            getClientesFrecuentes().then(r => { if (r.success) setFastClients(r.data as FastClient[]); });
            getResponsablesFrecuentes().then(r => { if (r.success) setFastResponsables(r.data as FastResponsable[]); });
        }
    }, [open]);

    async function onSubmit(data: z.infer<typeof contratoEmpresaSchema>) {
        setIsLoading(true);
        try {
            const payload = {
                ...data,
                fechaInicio: data.fechaInicio || new Date(),
                fechaFin: data.fechaFin || new Date(new Date().setFullYear(new Date().getFullYear() + 20)),
            };
            
            if (initialData) {
                const result = await updateContrato({ id: initialData.id, data: payload as unknown as FuecContrato });
                if (result.success) {
                    toast.success("Contrato actualizado con éxito");
                    setOpen(false);
                    if (onUpdated) onUpdated({ ...initialData, ...payload } as FuecContrato);
                } else {
                    toast.error(result.error || "Error al actualizar");
                }
            } else {
                const result = await createContrato(payload as unknown as FuecContrato);
                if (result.success) {
                    toast.success("Contrato creado con éxito");
                    
                    // Auto-guardar diccionario (Creación rápida)
                    await createClienteFrecuente({ nombre: data.cliente, nit: data.nitCliente });
                    if (data.responsableNombre) {
                        await createResponsableFrecuente({ 
                            nombre: data.responsableNombre, 
                            cedula: data.responsableCedula, 
                            telefono: data.responsableTelefono, 
                            direccion: data.responsableDireccion 
                        });
                    }

                    setOpen(false);
                    form.reset();
                    if (onCreated) onCreated(result.data as FuecContrato);
                } else {
                    toast.error(result.error || "Error al crear");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al guardar el contrato");
        } finally {
            setIsLoading(false);
        }
    }

    return {
        form,
        isLoading,
        fastClients,
        fastResponsables,
        onSubmit: form.handleSubmit(onSubmit)
    };
}
