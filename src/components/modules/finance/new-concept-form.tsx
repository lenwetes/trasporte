"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createConcepto } from "../../../actions/finance/concepts";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    cuentaCodigo: z.string().min(1, "Selecciona una cuenta contable"),
    requiereTercero: z.boolean().default(false),
    valorPorDefecto: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface NewConceptFormProps {
    tipo: "INGRESO" | "EGRESO";
    onSuccess?: (conceptoId: string) => void;
}

// Cuentas comunes para caja menor
const CUENTAS_EGRESO = [
    { codigo: "519530", nombre: "Papelería y Útiles"  },
    { codigo: "513530", nombre: "Energía Eléctrica"  },
    { codigo: "513525", nombre: "Acueducto y Alcantarillado"  },
    { codigo: "513535", nombre: "Teléfono e Internet"  },
    { codigo: "514540", nombre: "Mantenimiento Vehicular"  },
    { codigo: "514510", nombre: "Mantenimiento de Oficina"  },
    { codigo: "519535", nombre: "Combustibles y Lubricantes"  },
    { codigo: "510506", nombre: "Sueldos"  },
    { codigo: "136530", nombre: "Préstamos a Empleados"  },
    { codigo: "5195", nombre: "Gastos Diversos"  },
    { codigo: "513540", nombre: "Correo y Mensajería"  },
    { codigo: "530515", nombre: "Comisiones Bancarias"  },
];

const CUENTAS_INGRESO = [
    { codigo: "415505", nombre: "Ingresos por Transporte"  },
    { codigo: "429505", nombre: "Multas y Sanciones"  },
    { codigo: "421005", nombre: "Intereses"  },
    { codigo: "4295", nombre: "Ingresos Diversos"  },
];

export function NewConceptForm({ tipo, onSuccess }: NewConceptFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const cuentasDisponibles =
        tipo === "INGRESO" ? CUENTAS_INGRESO : CUENTAS_EGRESO;

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre: "",
            cuentaCodigo: "",
            requiereTercero: false,
            valorPorDefecto: "",
        },
    });

    async function onSubmit(data: FormData) {
        setIsSubmitting(true);
        try {
            const result = await createConcepto({
                nombre: data.nombre,
                tipo: tipo,
                cuentaCodigo: data.cuentaCodigo,
                requiereTercero: data.requiereTercero,
                valorPorDefecto: data.valorPorDefecto
                    ? parseFloat(data.valorPorDefecto)
                    : undefined,
            });

            if (result.success && result.data) {
                toast.success("Concepto creado exitosamente");
                router.refresh();
                if (onSuccess) {
                    onSuccess((result.data as { id: string }).id);
                }
            } else {
                toast.error(result.error || "Error al crear el concepto");
            }
        } catch (error) {
            toast.error("Error inesperado al crear el concepto");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Nombre del Concepto */}
                <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Nombre del Concepto
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ej: Compra de Tinta para Impresora"
                                    
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Un nombre descriptivo que identifique claramente
                                el tipo de gasto o ingreso
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Cuenta Contable */}
                <FormField
                    control={form.control}
                    name="cuentaCodigo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Cuenta Contable (PUC)
                            </FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una cuenta..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {cuentasDisponibles.map((cuenta) => (
                                        <SelectItem
                                            key={cuenta.codigo}
                                            value={cuenta.codigo}
                                        >
                                            <div>
                                                <span>
                                                    {cuenta.nombre}
                                                </span>
                                                <span>
                                                    {cuenta.codigo}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Cuenta del Plan Único de Cuentas donde se
                                registrará este concepto
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Requiere Tercero */}
                <FormField
                    control={form.control}
                    name="requiereTercero"
                    render={({ field }) => (
                        <FormItem>
                            <div>
                                <FormLabel>
                                    ¿Requiere Tercero?
                                </FormLabel>
                                <FormDescription>
                                    Activar si este concepto siempre requiere
                                    especificar un proveedor o cliente
                                </FormDescription>
                            </div>
                            <FormControl>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={field.value}
                                    onClick={() => field.onChange(!field.value)}
                                >
                                    <span />
                                </button>
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* Valor por Defecto (Opcional) */}
                <FormField
                    control={form.control}
                    name="valorPorDefecto"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Valor por Defecto (Opcional)
                            </FormLabel>
                            <FormControl>
                                <div>
                                    <span>
                                        $
                                    </span>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormDescription>
                                Si este concepto tiene un valor fijo (ej: cuota
                                mensual), ingrésalo aquí
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Botón de Envío */}
                <div>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <span>[LOADER2]</span>
                                Creando...
                            </>
                        ) : (
                            "Crear Concepto"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
