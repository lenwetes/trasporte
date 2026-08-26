"use client";

import { useFormContext } from "react-hook-form";
import { PreoperacionalCreate } from "@/lib/validations/safety";
import { Truck, ChevronRight, Hash, Gauge, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface PreoperacionalStepOneProps {
    vehiculoPlaca: string;
    nextStep: () => void;
}

export function PreoperacionalStepOne({
    vehiculoPlaca,
    nextStep,
}: PreoperacionalStepOneProps) {
    const {
        control,
        watch,
    } = useFormContext<PreoperacionalCreate>();

    const kilometraje = watch("kilometraje");

    return (
        <div className="space-y-8">
            <div className="bg-primary/[0.03] border border-primary/5 p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="h-16 w-16 bg-primary/5 flex items-center justify-center text-slate-900 shrink-0">
                    <Truck className="h-8 w-8" />
                </div>
                <div className="text-center sm:text-left space-y-1">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Validación de Unidad</h3>
                    <p className="text-2xl font-black text-primary uppercase tracking-tighter">Verificación Inicial de Flota</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Placa Display */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest pl-1">Identificación de Placa</label>
                    <div className="bg-white border-2 border-primary/10 h-16 flex items-center justify-center px-6 transition-all group hover:border-accent/40">
                        <Hash className="h-4 w-4 text-primary/20 mr-auto" />
                        <span className="text-2xl font-black text-primary font-mono tracking-[0.2em]">{vehiculoPlaca}</span>
                        <div className="ml-auto flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                            <span className="text-[10px] font-bold text-accent tracking-tighter">ACTIVA</span>
                        </div>
                    </div>
                </div>

                {/* Kilometraje Input */}
                <FormField
                    control={control}
                    name="kilometraje"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <div className="flex justify-between items-end pl-1">
                                <FormLabel className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-0">Odómetro Actual (KM)</FormLabel>
                                {kilometraje > 0 && (
                                    <span className="text-[9px] font-bold text-accent bg-accent/5 px-2 border border-accent/10">LECTURA DETECTADA</span>
                                )}
                            </div>
                            <FormControl>
                                <div className="relative">
                                    <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/20" />
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder="0.000"
                                        className="h-16 pl-12 text-2xl font-black font-mono rounded-none border-2 border-primary/10 focus-visible:border-accent transition-all"
                                        onChange={field.onChange}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-primary/20 tracking-widest">UNIT: KM</div>
                                </div>
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold text-red-500 uppercase" />
                        </FormItem>
                    )}
                />
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 flex items-start gap-4">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-800 font-bold leading-relaxed uppercase tracking-tight">
                    ADVERTENCIA: Asegúrese de ingresar el kilometraje exacto del odómetro. 
                    Esta lectura es contractual y afecta los planes de mantenimiento preventivo de la unidad.
                </p>
            </div>

            <div className="pt-6 border-t border-primary/5 flex justify-end">
                <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!kilometraje || kilometraje <= 0}
                    className={cn(
                        "h-14 px-8 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-none gap-3 shadow-xl transition-all",
                        (!kilometraje || kilometraje <= 0) && "opacity-20 cursor-not-allowed grayscale"
                    )}
                >
                    INICIAR PROTOCOLO TÉCNICO <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
