"use client";

import * as React from "react";
import { cn, formatNumber } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface CurrencyInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

/**
 * Input especializado para moneda con separadores de miles en tiempo real.
 * Mantiene el valor crudo en el state pero muestra el valor formateado.
 */
export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
    ({ value, onChange, placeholder, className, ...props }, ref) => {
        const [displayValue, setDisplayValue] = React.useState("");

        // Sincronizar valor inicial o externo
        React.useEffect(() => {
            if (value === undefined || value === null || value === "") {
                setDisplayValue("");
                return;
            }
            const numericValue = typeof value === "string" ? value.replace(/\D/g, "") : value.toString();
            if (numericValue) {
                setDisplayValue(formatNumber(numericValue));
            }
        }, [value]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = e.target.value.replace(/\D/g, "");
            
            // Emitir valor crudo para el formulario/backend
            onChange(rawValue);

            // Formatear valor visual para el usuario
            if (rawValue === "") {
                setDisplayValue("");
            } else {
                setDisplayValue(formatNumber(rawValue));
            }
        };

        return (
            <Input
                {...props}
                ref={ref}
                type="text"
                value={displayValue}
                onChange={handleChange}
                placeholder={placeholder || "0"}
                className={cn("font-mono", className)}
                inputMode="numeric"
            />
        );
    }
);

CurrencyInput.displayName = "CurrencyInput";
