"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { resolucionFuecSchema } from "@/lib/validations/fuec";
import { createResolucion } from "@/actions/fuec";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Calendar } from "lucide-react";

export function ResolucionDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(resolucionFuecSchema),
        defaultValues: {
            numeroResolucion: "",
            rangoDesde: 1,
            rangoHasta: 1000,
            fechaExpedicion: new Date(),
            fechaVencimiento: undefined as Date | undefined,
        },
    });

    async function onSubmit(data: z.infer<typeof resolucionFuecSchema>) {
        setIsLoading(true);
        try {
            const result = await createResolucion(data);
            if (result.success) {
                setOpen(false);
                form.reset();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-12 px-6 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[11px] rounded-none shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
                    <Plus className="mr-2 h-4 w-4" /> NUEVA RESOLUCIÓN
                </Button>
            </DialogTrigger>
            <DialogContent className="rounded-none border border-primary/10 shadow-2xl p-0 overflow-hidden max-w-lg">
                <DialogHeader className="p-8 bg-slate-50 border-b border-primary/5">
                    <DialogTitle className="text-xl font-black uppercase tracking-widest text-primary">Nueva Resolución</DialogTitle>
                    <DialogDescription className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] mt-2">
                        Registre una nueva resolución de habilitación para el consecutivo FUEC.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-6">
                        <FormField
                            control={form.control}
                            name="numeroResolucion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Número de Resolución</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Ej: 20244100123" className="rounded-none border-primary/20 bg-slate-50 font-mono focus-visible:ring-primary/20 focus-visible:border-primary uppercase h-12" />
                                    </FormControl>
                                    <FormMessage className="text-[10px] font-bold tracking-widest" />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="rangoDesde"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Desde</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                className="rounded-none border-primary/20 bg-slate-50 font-mono focus-visible:ring-primary/20 focus-visible:border-primary h-12"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-[10px] font-bold tracking-widest" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="rangoHasta"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Hasta</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                className="rounded-none border-primary/20 bg-slate-50 font-mono focus-visible:ring-primary/20 focus-visible:border-primary h-12"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-[10px] font-bold tracking-widest" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="fechaExpedicion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Fecha Expedición</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-900" />
                                            <Input
                                                type="date"
                                                value={
                                                    field.value
                                                        ? new Date(field.value).toISOString().split("T")[0]
                                                        : ""
                                                }
                                                onChange={(e) => field.onChange(new Date(e.target.value))}
                                                className="rounded-none border-primary/20 bg-slate-50 font-mono focus-visible:ring-primary/20 focus-visible:border-primary h-12 pl-12"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-[10px] font-bold tracking-widest" />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4 border-t border-primary/5">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={() => setOpen(false)}
                                className="rounded-none font-black text-[10px] uppercase tracking-widest h-12"
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isLoading}
                                className="bg-primary hover:bg-primary/90 text-white rounded-none font-black text-[10px] uppercase tracking-[0.2em] h-12 px-8 shadow-xl shadow-primary/20"
                            >
                                {isLoading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> PROCESANDO...</>
                                ) : (
                                    "REGISTRAR RESOLUCIÓN"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
