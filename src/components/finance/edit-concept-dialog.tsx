/**
 * Diálogo para editar un concepto existente
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import { AccountCombobox } from "./account-combobox";
import { updateConceptAction } from "@/actions/finance/concepts.actions";

const editConceptSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    cuentaId: z.string().uuid("Debe seleccionar una cuenta"),
    requiereTercero: z.boolean(),
    valorPorDefecto: z.string().optional(),
});

type EditConceptFormValues = z.infer<typeof editConceptSchema>;

interface ConceptoConCuenta {
    id: string;
    nombre: string;
    tipo: TipoTransaccion;
    requiereTercero: boolean;
    valorPorDefecto: number | null;
    activo: boolean;
    cuenta: {
        id: string;
        codigo: string;
        nombre: string;
    };
}

interface EditConceptDialogProps {
    concept: ConceptoConCuenta;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function EditConceptDialog({
    concept,
    open,
    onOpenChange,
    onSuccess,
}: EditConceptDialogProps) {
    const [submitting, setSubmitting] = useState(false);

    const form = useForm<EditConceptFormValues>({
        resolver: zodResolver(editConceptSchema),
        defaultValues: {
            nombre: concept.nombre,
            cuentaId: concept.cuenta.id,
            requiereTercero: concept.requiereTercero,
            valorPorDefecto: concept.valorPorDefecto?.toString() || "",
        },
    });

    async function onSubmit(values: EditConceptFormValues) {
        try {
            setSubmitting(true);

            const result = await updateConceptAction({
                id: concept.id,
                nombre: values.nombre,
                cuentaId: values.cuentaId,
                requiereTercero: values.requiereTercero,
                valorPorDefecto: values.valorPorDefecto
                    ? parseFloat(values.valorPorDefecto)
                    : null,
            });

            if (result.success) {
                alert("Concepto actualizado exitosamente");
                onSuccess();
                onOpenChange(false);
            } else {
                alert(result.error || "Error al actualizar concepto");
            }
        } catch (error) {
            alert("Error al actualizar concepto");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <div>
                    <DialogHeader>
                        <DialogTitle>
                            Edición de Concepto
                        </DialogTitle>
                        <DialogDescription>
                            Actualice los parámetros operativos y contables del
                            rubro.
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
                                            Nombre del Concepto
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="cuentaId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Imputación PUC Asociada
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
                                name="valorPorDefecto"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Valor Sugerido / Base
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                {...field}
                                            />
                                        </FormControl>
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
                                                Vínculo con Tercero
                                            </FormLabel>
                                            <p>
                                                Obliga a identificar un actor
                                                externo en el registro.
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
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting
                                        ? "Sincronizando..."
                                        : "Actualizar Rubro"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
