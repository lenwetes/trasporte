import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NovedadCreateSchema, NovedadCreate } from "@/lib/validations";
import { createNovedad } from "@/actions";
import { toast } from "sonner";
import { NovedadFormProps, MappedVehicle, MappedDriver } from "./novedad-form.types";

export function useNovedadForm({
    conductores,
    vehiculos,
    defaultConductorId,
}: NovedadFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<NovedadCreate>({
        resolver: zodResolver(NovedadCreateSchema),
        defaultValues: {
            fecha: new Date(),
            descripcion: "",
            tipo: "MULTA",
            estado: "PENDIENTE",
            conductorId: defaultConductorId || undefined,
            vehiculoId: undefined,
        },
    });

    const mappedVehiculos: MappedVehicle[] = vehiculos.map(v => ({
        id: v.id,
        placa: v.placa,
        marca: "",
        modelo: ""
    }));

    const mappedConductores: MappedDriver[] = conductores.map(c => ({
        id: c.id,
        nombre: `${c.nombres} ${c.apellidos}`,
        documento: ""
    }));

    const onSubmit = async (data: NovedadCreate) => {
        const toastId = toast.loading("Registrando novedad operativa...");
        setIsSubmitting(true);
        try {
            const result = await createNovedad(data);
            if (result.success) {
                toast.success("Novedad integrada al historial de seguridad vial", { id: toastId });
                router.push("/dashboard/novedades");
                router.refresh();
            } else {
                toast.error(result.error || "Falla en la validación transaccional", { id: toastId });
            }
        } catch (error) {
            console.error("Error submitting novedad:", error);
            toast.error("Error crítico de vinculación", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return { 
        form, 
        isSubmitting, 
        onSubmit, 
        mappedVehiculos, 
        mappedConductores 
    };
}
