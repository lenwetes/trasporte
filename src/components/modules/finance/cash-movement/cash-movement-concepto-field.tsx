"use client";

import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { NewConceptForm } from "../new-concept-form";
import type { ConceptoWithCuenta, TipoMovimiento } from "./types";
import { UseFormReturn } from "react-hook-form";
import type { CashMovementFormData } from "./use-cash-movement-form";
import { Plus, BookOpen, Tag, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ConceptoFieldProps {
    field: {
        value: string;
        onChange: (value: string) => void;
    };
    form: UseFormReturn<CashMovementFormData>;
    tipoSeleccionado: TipoMovimiento;
    conceptosDisponibles: ConceptoWithCuenta[];
    showNewConceptDialog: boolean;
    setShowNewConceptDialog: (open: boolean) => void;
}

/**
 * Campo de selección de concepto financiero con diálogo para crear nuevos.
 */
export function CashMovementConceptoField({
    field,
    form,
    tipoSeleccionado,
    conceptosDisponibles,
    showNewConceptDialog,
    setShowNewConceptDialog,
}: ConceptoFieldProps) {
    return (
        <FormItem className="space-y-4">
            <div className="flex items-center justify-between">
                <FormLabel className="text-[10px] font-black uppercase text-slate-900 tracking-widest flex items-center gap-2">
                    <Tag size={14} className="text-slate-900" />
                    Asignación Presupuestal
                </FormLabel>
                
                <Dialog
                    open={showNewConceptDialog}
                    onOpenChange={setShowNewConceptDialog}
                >
                    <DialogTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 text-[10px] font-bold uppercase tracking-tight text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-2"
                        >
                            <Plus size={12} className="mr-1" /> Nuevo Concepto
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] border-none rounded-2xl shadow-2xl p-0 overflow-hidden">
                        <DialogHeader className="p-6 bg-slate-900 text-white">
                            <DialogTitle className="flex items-center gap-3 text-base font-black uppercase tracking-widest">
                                <BookOpen className="text-emerald-400" />
                                Parametrización Contable
                            </DialogTitle>
                        </DialogHeader>
                        <div className="p-8">
                            <p className="text-xs text-slate-900 mb-6 border-l-2 border-emerald-500 pl-4 py-1">
                                Creación de Categoría para <span className="font-bold text-slate-900 underline decoration-slate-200">{tipoSeleccionado === "INGRESO" ? "Entradas Directas de Tesorería" : "Gastos / Egresos Autorizados"}</span>
                            </p>
                            <NewConceptForm
                                tipo={tipoSeleccionado === "SALDO_INICIAL" ? "INGRESO" : tipoSeleccionado}
                                onSuccess={(conceptoId) => {
                                    form.setValue("conceptoId", conceptoId);
                                    setShowNewConceptDialog(false);
                                    toast.success("Categoría vinculada al sistema central correctamente");
                                }}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Select
                onValueChange={field.onChange}
                value={field.value}
                name="conceptoId"
            >
                <FormControl>
                    <SelectTrigger className="h-11 bg-white border-slate-200 font-bold text-xs uppercase tracking-tight focus:ring-emerald-500/10 focus:border-emerald-500">
                        <SelectValue placeholder="Selecciona la categoría maestra del movimiento..." />
                    </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[300px]">
                    {conceptosDisponibles.map((concepto) => (
                        <SelectItem
                            key={concepto.id}
                            value={concepto.id}
                            className="text-xs py-3 border-b border-slate-50 last:border-0"
                        >
                            <div className="space-y-1">
                                <p className="font-bold uppercase tracking-tight text-slate-900">{concepto.nombre}</p>
                                <div className="flex items-center gap-2 text-[10px] font-medium text-slate-900">
                                    <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">PUC {concepto.cuenta.codigo}</span>
                                    <span>{concepto.cuenta.nombre.toLowerCase()}</span>
                                </div>
                            </div>
                        </SelectItem>
                    ))}
                    {conceptosDisponibles.length === 0 && (
                        <div className="py-8 text-center space-y-2 opacity-50">
                            <Info size={24} className="mx-auto text-slate-900" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
                                No se han parametrizado conceptos de {tipoSeleccionado.toLowerCase()}
                            </p>
                        </div>
                    )}
                </SelectContent>
            </Select>
            <FormMessage className="text-[10px]" />
        </FormItem>
    );
}
