"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Landmark, Wallet } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { Textarea } from "@/components/ui/textarea";
import { AccountCombobox } from "./account-combobox";
import { UserCombobox } from "@/components/usuarios/user-combobox";
import { createPrestamo } from "@/actions/finance/loans.actions";

const loanSchema = z.object({
    usuarioId: z.string().uuid("Seleccione un usuario"),
    monto: z.coerce.number().min(1000, "El monto mínimo es $1,000"),
    cuentaOrigenId: z.string().uuid("Seleccione la cuenta de origen"),
    cuentaCobrarId: z.string().uuid("Seleccione la cuenta por cobrar"),
    fechaDesembolso: z.string(),
    observaciones: z.string().optional(),
    plazoMeses: z.coerce.number().int().min(1).default(1),
});

type LoanFormValues = z.infer<typeof loanSchema>;

export function LoanFormDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<LoanFormValues>({
        resolver: zodResolver(loanSchema),
        defaultValues: {
            monto: 0,
            fechaDesembolso: new Date().toISOString().split("T")[0],
            plazoMeses: 1,
            observaciones: "",
        },
    });

    async function onSubmit(values: LoanFormValues) {
        try {
            setLoading(true);
            const result = await createPrestamo({
                ...values,
                fechaDesembolso: new Date(values.fechaDesembolso),
            });

            if (result.success) {
                toast.success("Préstamo registrado exitosamente");
                setOpen(false);
                form.reset();
            } else {
                toast.error(result.error || "Error al registrar el préstamo");
            }
        } catch (error) {
            toast.error("Ocurrió un error inesperado");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}> <DialogTrigger asChild>
                <Button>
                    <span>[PLUS]</span>
                    Nueva Liquidación
                </Button>
            </DialogTrigger>
            <DialogContent>
                <div>
                    <div />
                    <div>
                        <DialogTitle>
                            Originación de Crédito
                        </DialogTitle>
                        <DialogDescription>
                            Registro de desembolsos y obligaciones financieras
                            internas
                        </DialogDescription>
                    </div>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}>
 <FormField
                            control={form.control}
                            name="usuarioId"
                            render={({ field }: any) => (
                                <FormItem>
                                    <div>
                                        <FormLabel>
                                            Beneficiario Final
                                        </FormLabel>
                                        <span>
                                            Requerido
                                        </span>
                                    </div>
                                    <FormControl>
                                        <span>[USER]</span>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div>
                            <FormField
                                control={form.control}
                                name="monto"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Capital a Desembolsar
                                        </FormLabel>
                                        <FormControl>
                                            <div>
                                                <div>
                                                    $
                                                </div>
                                                <Input
                                                    type="number"
                                                    
                                                    placeholder="0.00"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fechaDesembolso"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Fecha de Operación
                                        </FormLabel>
                                        <FormControl>
                                            <div>
                                                <span>[CALENDAR]</span>
                                                <Input
                                                    type="date"
                                                    
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div>
                            <FormField
                                control={form.control}
                                name="cuentaOrigenId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <Landmark />
                                            Fondeo (Caja / Bancos)
                                        </FormLabel>
                                        <FormControl>
                                            <AccountCombobox
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="cuentaCobrarId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <Wallet />
                                            Asignación Contable (Activo)
                                        </FormLabel>
                                        <FormControl>
                                            <AccountCombobox
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="observaciones"
                            render={({ field }: any) => (
                                <FormItem>
                                    <FormLabel>
                                        Memoria Justificativa
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Detallar el propósito institucional del crédito..."
                                            
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setOpen(false)}
                                disabled={loading}
                            >
                                Abortar
                            </Button>
                            <Button type="submit"
                                disabled={loading }>{loading ? (
                                    <>
                                        <span>[LOADER2]</span>
                                        Validando...
                                    </>
                                ) : (
                                    "Autorizar Desembolso"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
