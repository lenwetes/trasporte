/**
 * Formulario para crear/editar conceptos financieros
 */

"use client";

import { useState, useEffect } from "react";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TipoTransaccion } from "@prisma/client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AccountCombobox } from "./account-combobox";
import { createConceptAction } from "@/actions/finance/concepts.actions";

const conceptSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    tipo: z.nativeEnum(TipoTransaccion),
    cuentaId: z.string().uuid("Debe seleccionar una cuenta"),
    requiereTercero: z.boolean(),
    valorPorDefecto: z.string().optional(),
});

type ConceptFormValues = z.infer<typeof conceptSchema>;

interface ConceptFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ConceptFormDialog({
    open,
    onOpenChange,
    onSuccess,
}: ConceptFormDialogProps) {
    const [submitting, setSubmitting] = useState(false);

    const form = useForm<ConceptFormValues>({
        resolver: zodResolver(conceptSchema),
        defaultValues: {
            nombre: "",
            tipo: TipoTransaccion.EGRESO,
            cuentaId: "",
            requiereTercero: false,
            valorPorDefecto: "",
        },
    });

    async function onSubmit(values: ConceptFormValues) {
        try {
            setSubmitting(true);

            const result = await createConceptAction({
                nombre: values.nombre,
                tipo: values.tipo,
                cuentaId: values.cuentaId,
                requiereTercero: values.requiereTercero,
                valorPorDefecto: values.valorPorDefecto
                    ? parseFloat(values.valorPorDefecto)
                    : undefined,
            });

            if (result.success) {
                alert("Concepto creado exitosamente");
                form.reset();
                onSuccess();
            } else {
                alert(result.error || "Error al crear concepto");
            }
        } catch (error) {
            alert("Error al crear concepto");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}> <DialogContent>
                <div>
                    <div>
                        <span>[PLUS]</span>
                    </div>
                    <DialogHeader>
                        <DialogTitle>
                            Apertura de Concepto
                        </DialogTitle>
                        <DialogDescription>
                            Defina los parámetros para facilitar el registro
                            contable automatizado.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FormField
                                control={form.control}
                                name="nombre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Nombre Descriptivo
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ej: Mantenimiento Preventivo"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div>
                                <FormField
                                    control={form.control}
                                    name="tipo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Naturaleza
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Tipo" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={TipoTransaccion.INGRESO}>
                                                        INGRESO / ENTRADA
                                                    </SelectItem>
                                                    <SelectItem value={TipoTransaccion.EGRESO}>
                                                        EGRESO / SALIDA
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="valorPorDefecto"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Valor Referencial (Opcional)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="cuentaId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Imputación PUC (Plan Único de
                                            Cuentas)
                                        </FormLabel>
                                        <AccountCombobox
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="requiereTercero"
                                render={({ field }) => (
                                    <FormItem>
                                        <div>
                                            <FormLabel>
                                                Obligatoriedad de Tercero
                                            </FormLabel>
                                            <p>
                                                Exige vincular un colaborador o
                                                proveedor al registro.
                                            </p>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => onOpenChange(false)}
                                    disabled={submitting}
                                >
                                    Descartar
                                </Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting
                                        ? "Procesando..."
                                        : "Consolidar Registro"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
