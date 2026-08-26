"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { VinculacionCreateSchema, VinculacionCreate } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { createVinculacion, getConductores } from "@/actions";
import { useRouter } from "next/navigation";
import { FormErrorModal } from "@/components/ui/form-error-modal";

interface VinculacionFormProps {
    vehiculoId: string;
    onSuccess?: () => void;
}

interface ConductorOption {
    id: string;
    nombres: string;
    apellidos: string;
    numeroDocumento: string;
    [key: string]: unknown;
}

export function VinculacionForm({
    vehiculoId,
    onSuccess,
}: VinculacionFormProps) {
    const [conductores, setConductores] = useState<ConductorOption[]>([]);

    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingConductores, setLoadingConductores] = useState(true);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function fetchConductores() {
            const result = await getConductores();
            if (result.success) {
                setConductores((result.data as ConductorOption[]) || []);
            }
            setLoadingConductores(false);
        }
        fetchConductores();
    }, []);

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<VinculacionCreate>({
        defaultValues: {
            vehiculoId,
            fechaInicio: new Date(),
        },
    });

    const onSubmit = async (values: VinculacionCreate) => {
        setLoading(true);
        setErrorMsg(null);
        clearErrors();

        // Manual validation
        const validation = VinculacionCreateSchema.safeParse(values);

        if (!validation.success) {
            validation.error.issues.forEach((issue) => {
                const path = issue.path[0] as keyof VinculacionCreate;
                setError(path, {
                    type: "manual",
                    message: issue.message,
                });
            });
            setShowErrorModal(true);
            setLoading(false);
            return;
        }

        try {
            const result = await createVinculacion(validation.data);

            if (result.success) {
                if (onSuccess) {
                    onSuccess();
                } else {
                    router.push(`/dashboard/vehiculos/${vehiculoId}`);
                    router.refresh();
                }
            } else {
                setErrorMsg(result.error || "Error al crear la vinculación");
                setShowErrorModal(true);
            }
        } catch (err) {
            console.error(err);
            setErrorMsg("Ocurrió un error inesperado");
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <FormErrorModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                errors={
                    errorMsg
                        ? { server: { message: errorMsg }, ...errors }
                        : errors
                }
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <div>
                        <label>
                            <span>[USER]</span> Conductor
                        </label>
                        <select
                            {...register("conductorId")}
                            disabled={loadingConductores}>
                            <option value="">
                                {loadingConductores
                                    ? "Cargando conductores..."
                                    : "Seleccione un conductor..."}
                            </option>
                            {conductores.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.nombres} {c.apellidos} ({c.numeroDocumento})
                                </option>
                            ))}
                        </select>
                        {errors.conductorId && (
                            <p>{errors.conductorId.message as string}</p>
                        )}
                    </div>

                    <div>
                        <label>
                            <span>[CALENDAR]</span> Fecha de Inicio
                        </label>
                        <input
                            type="date"
                            {...register("fechaInicio", { valueAsDate: true })}
                        />
                        {errors.fechaInicio && (
                            <p>{errors.fechaInicio.message as string}</p>
                        )}
                    </div>
                </div>

                <div>
                    <p>
                        Nota: Al crear una nueva vinculación, cualquier
                        vinculación activa previa para este vehículo será
                        finalizada automáticamente.
                    </p>
                </div>

                <div>
                    <Button type="submit" disabled={loading || loadingConductores}>
                        {loading ? (
                            <>
                                <span>[LOADER2]</span>
                                Vinculando...
                            </>
                        ) : (
                            <>
                                <span>[PLUS]</span>
                                Crear Vinculación
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </>
    );
}
