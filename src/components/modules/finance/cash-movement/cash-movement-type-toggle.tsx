"use client";

import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CashMovementFormData } from "./use-cash-movement-form";

export function CashMovementTypeToggle() {
    const { control } = useFormContext<CashMovementFormData>();

    return (
        <FormField
            control={control}
            name="tipo"
            render={({ field }) => (
                <FormItem className="space-y-0">
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-0 border-b border-primary/10"
                        >
                            <div className="relative">
                                <RadioGroupItem value="INGRESO" id="r-ingreso" className="peer sr-only" />
                                <label htmlFor="r-ingreso" className={cn(
                                    "flex items-center justify-center h-14 cursor-pointer transition-all uppercase text-[11px] font-black tracking-[0.3em] gap-3",
                                    "peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-white",
                                    "peer-data-[state=unchecked]:hover:bg-slate-50 peer-data-[state=unchecked]:text-primary/60 peer-data-[state=unchecked]:hover:text-primary",
                                    "transition-all duration-500"
                                )}>
                                    <ArrowDownLeft size={16} className={cn("transition-transform duration-500", field.value === 'INGRESO' ? "scale-125" : "opacity-30")} /> 
                                    <span>Ingreso</span>
                                    {field.value === 'INGRESO' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />}
                                </label>
                            </div>
                            <div className="relative border-l border-primary/10">
                                <RadioGroupItem value="EGRESO" id="r-egreso" className="peer sr-only" />
                                <label htmlFor="r-egreso" className={cn(
                                    "flex items-center justify-center h-14 cursor-pointer transition-all uppercase text-[11px] font-black tracking-[0.3em] gap-3",
                                    "peer-data-[state=checked]:bg-red-600 peer-data-[state=checked]:text-white",
                                    "peer-data-[state=unchecked]:hover:bg-red-50 peer-data-[state=unchecked]:text-red-600/60 peer-data-[state=unchecked]:hover:text-red-700",
                                    "transition-all duration-500"
                                )}>
                                    <ArrowUpRight size={16} className={cn("transition-transform duration-500", field.value === 'EGRESO' ? "scale-125" : "opacity-30")} /> 
                                    <span>Egreso</span>
                                    {field.value === 'EGRESO' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30" />}
                                </label>
                            </div>
                        </RadioGroup>
                    </FormControl>
                </FormItem>
            )}
        />
    );
}
