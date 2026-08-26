"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClientCreateSchema, type ClientCreate } from "@/lib/validations/fuec";
import { createClient } from "@/actions/fuec";
import {
    Dialog,
    DialogContent,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserPlus, User, Mail, Phone, MapPin, Loader2, Fingerprint, Building2 } from "lucide-react";
import { COLOMBIA_REGIONS } from "@/lib/constants/regions";

interface ClientDialogProps {
    onCreated?: (client: any) => void;
    trigger?: React.ReactNode;
}

export function ClientDialog({ onCreated, trigger }: ClientDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ClientCreate>({
        resolver: zodResolver(ClientCreateSchema),
        defaultValues: {
            nombres: "",
            apellidos: "",
            tipoDocumento: "CC",
            numeroDocumento: "",
            email: "",
            telefono: "",
            direccion: "",
            departamento: "",
            municipio: "",
        },
    });

    const selectedDepto = form.watch("departamento");
    const cities = useMemo(() => {
        return selectedDepto ? COLOMBIA_REGIONS[selectedDepto] || [] : [];
    }, [selectedDepto]);

    async function onSubmit(data: ClientCreate) {
        setIsLoading(true);
        try {
            const result = await createClient(data);
            if (result.success) {
                setOpen(false);
                form.reset();
                if (onCreated) onCreated(result.data);
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
                {trigger || (
                    <Button variant="outline" className="gap-2 rounded-none border-primary/20 text-primary font-bold uppercase transition-all hover:bg-primary hover:text-white">
                        <UserPlus className="h-4 w-4" /> Registrar Cliente
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl p-0 border-none rounded-none overflow-hidden shadow-2xl">
                <div className="bg-accent p-8 text-primary relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -translate-y-1/2 translate-x-1/2 rotate-45" />
                    <DialogHeader className="relative">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-primary flex items-center justify-center border border-primary/20 shadow-xl">
                                <UserPlus className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black uppercase tracking-tighter leading-none">Nuevo Cliente</DialogTitle>
                                <p className="text-primary/60 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Registro de Tercero Contratante</p>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <div className="p-8 bg-white max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="nombres"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Nombres</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                                    <Input {...field} placeholder="PABLO" className="h-12 pl-12 rounded-none bg-slate-50/50 border-primary/10 font-bold text-xs uppercase focus:bg-white transition-all" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[9px]" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="apellidos"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Apellidos</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                                    <Input {...field} placeholder="PÉREZ" className="h-12 pl-12 rounded-none bg-slate-50/50 border-primary/10 font-bold text-xs uppercase focus:bg-white transition-all" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[9px]" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="tipoDocumento"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Tipo</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-12 rounded-none bg-slate-50/50 border-primary/10 font-bold text-xs uppercase">
                                                        <SelectValue placeholder="CC" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-none border-primary/10">
                                                    <SelectItem value="CC" className="text-xs font-bold uppercase">CC</SelectItem>
                                                    <SelectItem value="NIT" className="text-xs font-bold uppercase">NIT</SelectItem>
                                                    <SelectItem value="CE" className="text-xs font-bold uppercase">CE</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="numeroDocumento"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2 space-y-1">
                                            <FormLabel className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Nro. Documento / Identidad</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                                    <Input {...field} placeholder="1.234.567.890" className="h-12 pl-12 rounded-none bg-slate-50/50 border-primary/10 font-mono font-bold text-xs uppercase focus:bg-white transition-all" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[9px]" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Email</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                                    <Input {...field} type="email" placeholder="CLIENTE@CORREO.COM" className="h-12 pl-12 rounded-none bg-slate-50/50 border-primary/10 font-bold text-xs uppercase focus:bg-white transition-all" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[9px]" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="telefono"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Teléfono</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                                    <Input {...field} placeholder="300 000 0000" className="h-12 pl-12 rounded-none bg-slate-50/50 border-primary/10 font-bold text-xs uppercase focus:bg-white transition-all" />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Separator className="bg-primary/5" />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="departamento"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Departamento</FormLabel>
                                            <Select onValueChange={(val) => { field.onChange(val); form.setValue("municipio", ""); }}>
                                                <FormControl>
                                                    <SelectTrigger className="h-12 rounded-none bg-slate-50/50 border-primary/10 font-bold text-xs uppercase">
                                                        <SelectValue placeholder="SELECCIONE..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="max-h-60 rounded-none border-primary/10">
                                                    {Object.keys(COLOMBIA_REGIONS).sort().map(d => (
                                                        <SelectItem key={d} value={d} className="text-xs font-bold uppercase">{d}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="municipio"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Municipio</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={!selectedDepto}>
                                                <FormControl>
                                                    <SelectTrigger className="h-12 rounded-none bg-slate-50/50 border-primary/10 font-bold text-xs uppercase">
                                                        <SelectValue placeholder="SELECCIONE..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="max-h-60 rounded-none border-primary/10">
                                                    {cities.map(c => (
                                                        <SelectItem key={c} value={c} className="text-xs font-bold uppercase">{c}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="direccion"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Dirección Física</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                                <Input {...field} placeholder="CRA 1 # 2 - 3" className="h-12 pl-12 rounded-none bg-slate-50/50 border-primary/10 font-bold text-xs uppercase focus:bg-white transition-all" />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="pt-4">
                                <Button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] rounded-none gap-3 shadow-xl transition-all active:scale-[0.98]"
                                >
                                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><UserPlus className="h-5 w-5 text-accent" /> CREAR PERFIL DE CLIENTE</>}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

import { Separator } from "@/components/ui/separator";
