"use client";

import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTransition } from "react";
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
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { updateFinanceConfigAction } from "@/actions/finance";
import { toast } from "sonner";
import { Building2, Save, Ticket, Loader2 } from "lucide-react";

const schema = z.object({
    nombreEmpresa: z.string().min(2, "Nombre de empresa requerido"),
    nit: z.string().min(5, "NIT requerido"),
    direccion: z.string().optional(),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    telefono: z.string().optional(),
    representanteLegal: z.string().optional(),
    nombrePresidente: z.string().optional(),
    montoCuotaAdministracion: z.number().min(0, "Monto inválido"),
    diaCorteMensual: z.number().min(1).max(31, "Día inválido"),
    porcentajeMoraDiaria: z.number().min(0).max(100, "Porcentaje inválido"),
});

type ConfigFormValues = z.infer<typeof schema>;

interface ConfigFormProps {
    initialData: {
        nombreEmpresa: string;
        nit?: string;
        direccion?: string;
        email?: string;
        telefono?: string;
        representanteLegal?: string;
        nombrePresidente?: string;
        montoCuotaAdministracion: number;
        diaCorteMensual: number;
        porcentajeMoraDiaria: number;
    };
}

export function FinanceConfigForm({ initialData }: ConfigFormProps) {
    const [isPending, startTransition] = useTransition();

    const form = useForm<ConfigFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            nombreEmpresa: initialData.nombreEmpresa ?? "",
            nit: initialData.nit ?? "",
            direccion: initialData.direccion ?? "",
            email: initialData.email ?? "",
            telefono: initialData.telefono ?? "",
            representanteLegal: initialData.representanteLegal ?? "",
            nombrePresidente: initialData.nombrePresidente ?? "",
            montoCuotaAdministracion: initialData.montoCuotaAdministracion ?? 0,
            diaCorteMensual: initialData.diaCorteMensual ?? 1,
            porcentajeMoraDiaria: initialData.porcentajeMoraDiaria ?? 0,
        },
    });

    const onSubmit = (data: ConfigFormValues) => {
        startTransition(async () => {
            const result = await updateFinanceConfigAction(data);

            if (result.success) {
                toast.success("Configuración actualizada", {
                    description: "Los parámetros globales han sido guardados.",
                });
            } else {
                toast.error("Error al guardar", {
                    description: result.error || "Ocurrió un error inesperado.",
                });
            }
        });
    };

    return (
        <Card className="">
            <CardHeader className="">
                <div className="">
                    <div className="">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <CardTitle className="">Parámetros Institucionales</CardTitle>
                        <CardDescription>Configuración global de facturación y tesorería</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="">
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                    <div className="">
                        <FormField
                            control={form.control}
                            name="nombreEmpresa"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre Legal / Razón Social</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} placeholder="Ej: COOPETRAES" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="nit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>NIT / ID Tributario</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} placeholder="800.000.000-1" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="direccion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dirección</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo Electrónico</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="">
                        <div className="">
                            <Ticket size={20} />
                            <h3>Parámetros de Facturación</h3>
                        </div>
                        
                        <div className="">
                            <FormField
                                control={form.control}
                                name="montoCuotaAdministracion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cuota Administración ($)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                {...field} 
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                disabled={isPending} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="diaCorteMensual"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Día de Corte</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                {...field} 
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                disabled={isPending} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="porcentajeMoraDiaria"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mora Diaria (%)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                step="0.01"
                                                {...field} 
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                disabled={isPending} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="">
                        <Button type="submit" disabled={isPending} className="">
                            {isPending ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    <span>Guardando...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    <span>Guardar Cambios</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
