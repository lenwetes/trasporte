"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ObligacionFinanciera } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { registerPaymentSchema } from "@/lib/validations/finance.schema";
import {
    registerPaymentAction,
    getUserPendingObligationsAction,
} from "@/actions/finance";

// Tipo para usuarios que recibe el componente
type UsuarioSimple = {
    id: string;
    nombres: string;
    apellidos: string;
    numeroDocumento: string;
    rol: string;
};

interface NewPaymentFormProps {
    usuarios: UsuarioSimple[];
    defaultUsuarioId?: string;
    defaultObligacionId?: string;
}

// Extendemos el schema base
const formSchema = registerPaymentSchema
    .extend({
        usuarioId: z.string().min(1, "Seleccione un usuario"),
    })
    .omit({ obligacionId: true })
    .extend({
        obligacionId: z.string().min(1, "Seleccione una obligación"),
    });

type FormValues = z.infer<typeof formSchema>;

export function NewPaymentForm({
    usuarios,
    defaultUsuarioId,
    defaultObligacionId,
}: NewPaymentFormProps) {
    const router = useRouter();
    const [isLoadingObligations, setIsLoadingObligations] = useState(false);
    const [obligaciones, setObligaciones] = useState<ObligacionFinanciera[]>(
        [],
    );
    const [selectedObligacion, setSelectedObligacion] =
        useState<ObligacionFinanciera | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [successTransactionId, setSuccessTransactionId] = useState<
        string | null
    >(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            usuarioId: defaultUsuarioId || "",
            obligacionId: defaultObligacionId || "",
            metodoPago: "EFECTIVO",
            monto: 0,
        },
    });

    const loadObligaciones = useCallback(
        async (userId: string, targetObligacionId?: string) => {
            setIsLoadingObligations(true);
            try {
                const result = await getUserPendingObligationsAction(userId);
                if (result.success && Array.isArray(result.data)) {
                    const obs = result.data as ObligacionFinanciera[];
                    setObligaciones(obs);

                    if (obs.length === 0) {
                        toast.info(
                            "El usuario no tiene obligaciones pendientes.",
                        );
                    }

                    // Si hay una obligación objetivo, seleccionarla y setear monto
                    if (targetObligacionId) {
                        const target = obs.find(
                            (o) => o.id === targetObligacionId,
                        );
                        if (target) {
                            setSelectedObligacion(target);
                            setValue("obligacionId", target.id);
                            setValue("monto", Number(target.saldoPendiente));
                        }
                    }
                } else {
                    toast.error("Error al cargar obligaciones del usuario.");
                }
            } catch {
                toast.error("Error de conexión.");
            } finally {
                setIsLoadingObligations(false);
            }
        },
        [setValue],
    );

    // Cargar obligaciones si hay un usuario preseleccionado al montar
    useEffect(() => {
        if (defaultUsuarioId) {
            loadObligaciones(defaultUsuarioId, defaultObligacionId);
        }
    }, [defaultUsuarioId, defaultObligacionId, loadObligaciones]);

    const watchedUsuarioId = watch("usuarioId");

    const handleUsuarioChange = async (
        e: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        const userId = e.target.value;
        setValue("usuarioId", userId);
        setValue("obligacionId", "");
        setSelectedObligacion(null);
        setObligaciones([]);
        setSuccessTransactionId(null);

        if (!userId) return;

        await loadObligaciones(userId);
    };

    const handleObligacionChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        const obligacionId = e.target.value;
        setValue("obligacionId", obligacionId);
        const obligacion = obligaciones.find((o) => o.id === obligacionId);
        if (obligacion) {
            setSelectedObligacion(obligacion);
            setValue("monto", Number(obligacion.saldoPendiente));
        }
    };

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        try {
            const result = await registerPaymentAction({
                obligacionId: data.obligacionId,
                monto: data.monto,
                metodoPago: data.metodoPago,
            });

            if (result.success) {
                toast.success("Pago registrado exitosamente");
                const transaction = result.data as { id: string };
                if (transaction?.id) {
                    setSuccessTransactionId(transaction.id);
                }
                // No reseteamos formulario aquí para mostrar el estado de éxito
                router.refresh();
            } else {
                toast.error(result.error || "Error al registrar el pago");
            }
        } catch {
            toast.error("Ocurrió un error inesperado");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNewPayment = () => {
        setSuccessTransactionId(null);
        reset();
        setObligaciones([]);
        setSelectedObligacion(null);
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
        }).format(val);
    };

    if (successTransactionId) {
        return (
            <div>
                <div>
                    <span>[CHECK]</span>
                </div>
                <h3>
                    ¡Pago Exitoso!
                </h3>
                <p>
                    El pago ha sido registrado correctamente y la obligación
                    actualizada.
                </p>

                <div>
                    <a
                        href={`/api/finance/pdf/receipt/${successTransactionId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        
                    >
                        <Button
                            variant="outline"
                            
                        >
                            📄 Descargar Recibo
                        </Button>
                    </a>
                    <Button onClick={handleNewPayment}>
                        Nuevo Pago
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Selector de Usuario */}
            <div>
                <Label htmlFor="usuario">Conductor / Propietario</Label>
                <NativeSelect
                    id="usuario"
                    onChange={handleUsuarioChange}
                    defaultValue="">
 <option value="" disabled>
                        Buscar usuario...
                    </option>
                    {usuarios.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.apellidos} {u.nombres} - {u.numeroDocumento}
                        </option>
                    ))}
                </NativeSelect>
                {errors.usuarioId && (
                    <p>
                        {errors.usuarioId.message}
                    </p>
                )}
            </div>

            {/* Selector de Obligación */}
            {watchedUsuarioId && (
                <div>
                    <Label htmlFor="obligacion">Obligación a Pagar</Label>
                    {isLoadingObligations ? (
                        <div>
                            <span>[LOADER2]</span>
                            Cargando cartera...
                        </div>
                    ) : obligaciones.length > 0 ? (
                        <NativeSelect
                            id="obligacion"
                            onChange={handleObligacionChange}
                            defaultValue="">
 <option value="" disabled>
                                Seleccione una obligación
                            </option>
                            {obligaciones.map((ob) => (
                                <option key={ob.id} value={ob.id}>
                                    {ob.tipo} - Vence:{" "}
                                    {new Date(
                                        ob.fechaVence,
                                    ).toLocaleDateString()}{" "}
                                    - Saldo:{" "}
                                    {formatCurrency(Number(ob.saldoPendiente))}
                                </option>
                            ))}
                        </NativeSelect>
                    ) : (
                        <div>
                            <span>[CHECK]</span>
                            Este usuario está al día. No tiene pagos pendientes.
                        </div>
                    )}
                    {errors.obligacionId && (
                        <p>
                            {errors.obligacionId.message}
                        </p>
                    )}
                </div>
            )}

            {/* Detalles del Pago */}
            {watchedUsuarioId && selectedObligacion && (
                <div>
                    <div>
                        <div>
                            <Label htmlFor="monto">Monto a Pagar</Label>
                            <div>
                                <span>
                                    $
                                </span>
                                <Input
                                    id="monto"
                                    type="number"
                                    
                                    placeholder="0"
                                    {...register("monto", {
                                        valueAsNumber: true,
                                    })}
                                />
                            </div>
                            {errors.monto && (
                                <p>
                                    {errors.monto.message}
                                </p>
                            )}
                            <p>
                                Saldo pendiente:{" "}
                                {formatCurrency(
                                    Number(selectedObligacion.saldoPendiente),
                                )}
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="metodoPago">Método de Pago</Label>
                            <NativeSelect
                                id="metodoPago"
                                {...register("metodoPago")}
                                defaultValue="EFECTIVO">
 <option value="EFECTIVO">Efectivo</option>
                                <option value="TRANSFERENCIA">
                                    Transferencia Bancaria
                                </option>
                                <option value="DATAFONO">
                                    Datafono / Tarjeta
                                </option>
                            </NativeSelect>
                            {errors.metodoPago && (
                                <p>
                                    {errors.metodoPago.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="notas">Observaciones (Opcional)</Label>
                        <Textarea
                            placeholder="Detalles adicionales del recaudo..."
                            
                        />
                    </div>
                </div>
            )}

            <Button type="submit"
                
                disabled={isSubmitting || !watch("obligacionId") }>{isSubmitting ? (
                    <>
                        <span>[LOADER2]</span>
                        Registrando...
                    </>
                ) : (
                    "Registrar Pago"
                )}
            </Button>
        </form>
    );
}
