"use client";

import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { FuecInput } from "@/lib/validations/fuec";
import { FuecContrato } from "../types";
import { CurrencyInput } from "@/components/ui/currency-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Briefcase, Calendar as CalendarIcon, User, Clock, Banknote, CreditCard, Landmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TravelDetailsSectionProps {
    form: UseFormReturn<FuecInput>;
    selectedContrato: FuecContrato | undefined;
}

export function TravelDetailsSection({
    form,
    selectedContrato,
}: TravelDetailsSectionProps) {
    return (
        <Card className="border-primary/10 overflow-hidden">
            <div className="bg-primary/5 px-6 py-3 border-b border-primary/10 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-slate-900" />
                <h3 className="text-xs font-bold text-primary uppercase tracking-widest">Detalles del Servicio</h3>
            </div>
            <CardContent className="p-10 space-y-10">
                {/* OBJETO DEL VIAJE */}
                <FormField
                    control={form.control}
                    name="objetoViaje"
                    render={({ field }: any) => (
                        <FormItem className="space-y-3">
                            <FormLabel className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] pl-1">
                                Objeto del Viaje / Descripción técnica
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="Describa el servicio detalladamente..."
                                    className="min-h-[140px] resize-none rounded-none border-primary/10 bg-slate-50/50 p-4 text-sm font-medium leading-relaxed"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* VIGENCIA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="fechaInicio"
                        render={({ field }) => (
                            <FormItem className="flex flex-col space-y-3">
                                <FormLabel className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] pl-1">
                                    Fecha Salida
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-bold rounded-none border-primary/10 h-12 bg-white hover:bg-slate-50",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-3 h-4 w-4 text-accent" />
                                                {field.value instanceof Date
                                                    ? format(field.value, "d 'de' MMMM, yyyy", { locale: es })
                                                    : <span>Seleccionar fecha</span>}
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 rounded-none border-primary/10 shadow-2xl" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                            locale={es}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="fechaFin"
                        render={({ field }) => (
                            <FormItem className="flex flex-col space-y-3">
                                <FormLabel className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] pl-1">
                                    Fecha Regreso
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-bold rounded-none border-primary/10 h-12 bg-white hover:bg-slate-50",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-3 h-4 w-4 text-accent" />
                                                {field.value instanceof Date
                                                    ? format(field.value, "d 'de' MMMM, yyyy", { locale: es })
                                                    : <span>Seleccionar fecha</span>}
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 rounded-none border-primary/10 shadow-2xl" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date: Date) => date < form.getValues("fechaInicio")}
                                            initialFocus
                                            locale={es}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* FACTURACIÓN Y COBRO (CONTABILIDAD) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-primary/5">
                    <FormField
                        control={form.control}
                        name="modoPago"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
                                    <Banknote className="h-3 w-3 text-accent" />
                                    Método de Cobro (Planilla)
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 rounded-none border-primary/10 bg-white hover:bg-slate-50 font-bold uppercase tracking-widest text-[11px] shadow-sm">
                                            <SelectValue placeholder="Seleccione método" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="rounded-none border-primary/10 shadow-2xl">
                                        <SelectItem value="EFECTIVO" className="font-bold text-[11px] uppercase focus:bg-primary/5 cursor-pointer py-3">
                                            <div className="flex items-center gap-2">
                                                <Landmark className="h-4 w-4 text-emerald-600" />
                                                <span>Pago Inmediato (Caja / Efectivo)</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="CREDITO" className="font-bold text-[11px] uppercase focus:bg-primary/5 cursor-pointer py-3">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="h-4 w-4 text-accent" />
                                                <span>Crédito (Añadir a Deuda Conductor)</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="valorIngreso"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] pl-1">
                                    Valor de la Planilla (COP)
                                </FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <CurrencyInput 
                                            value={field.value}
                                            onChange={(val) => field.onChange(val)}
                                            className="h-12 border-primary/10 bg-white"
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* RESPONSABLE */}
                {selectedContrato && (
                    <div className="p-6 bg-primary/[0.03] border border-primary/5 rounded-none space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-5 w-5 bg-accent/10 flex items-center justify-center text-accent">
                                <User className="h-3 w-3" />
                            </div>
                            <h4 className="text-[10px] font-black text-primary/60 uppercase tracking-widest">Identificación del Responsable</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-[9px] text-primary uppercase font-black tracking-widest">Nombre Completo</p>
                                <p className="text-xs font-black text-primary uppercase truncate">{selectedContrato.responsableNombre || "Sin asignar"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] text-primary uppercase font-black tracking-widest">Documento / NIT</p>
                                <p className="text-xs font-mono font-bold text-primary">{selectedContrato.responsableCedula || "-------"}</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
