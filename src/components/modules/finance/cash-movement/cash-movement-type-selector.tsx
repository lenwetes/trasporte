"use client";

import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import type { CashMovementFormData } from "./use-cash-movement-form";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface TypeSelectorProps {
    field: {
        value: string;
        onChange: (value: string) => void;
    };
    form: UseFormReturn<CashMovementFormData>;
}

/**
 * Selector de tipo de movimiento: INGRESO / EGRESO
 */
export function CashMovementTypeSelector({ field, form }: TypeSelectorProps) {
    return (
        <FormItem>
            <FormLabel>
                <div />
                Naturaleza del Asiento v4.0
            </FormLabel>
            <FormControl>
                <div
                    role="radiogroup"
                    aria-label="Tipo de movimiento"
                >
                    <button
                        type="button"
                        id="type-ingreso"
                        onClick={() => {
                            field.onChange("INGRESO");
                            form.setValue("conceptoId", "");
                        }}
                    >
                        <div>
                            <ArrowUpRight />
                        </div>
                        Entrada de Capital
                    </button>
                    <button
                        type="button"
                        id="type-egreso"
                        onClick={() => {
                            field.onChange("EGRESO");
                            form.setValue("conceptoId", "");
                        }}
                    >
                        <div>
                            <ArrowDownRight />
                        </div>
                        Egreso / Gasto
                    </button>
                </div>
            </FormControl>
            <FormMessage />
        </FormItem>
    );
}
