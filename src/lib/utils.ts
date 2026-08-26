import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string) {
    if (value === undefined || value === null) return "$0";
    const amount = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function serializeDecimal<T>(obj: T): T {
    if (obj === null || obj === undefined) return obj;

    // Handle Date objects
    if (obj instanceof Date) {
        return obj.toISOString() as unknown as T;
    }

    // Handle array
    if (Array.isArray(obj)) {
        return obj.map((item) => serializeDecimal(item)) as unknown as T;
    }

    if (typeof obj === "object") {
        const anyObj = obj as Record<string, unknown>;

        // Check for Decimal (Prisma/Decimal.js)
        if (
            anyObj.constructor?.name === "Decimal" ||
            anyObj.constructor?.name === "Decimal2" ||
            ("d" in anyObj && "s" in anyObj && "e" in anyObj) ||
            "_isDecimal" in anyObj
        ) {
            const val = Number(anyObj);
            return (isNaN(val) ? String(anyObj) : val) as unknown as T;
        }

        // Handle plain objects
        const serialized: Record<string, unknown> = {};
        for (const key in anyObj) {
            if (Object.prototype.hasOwnProperty.call(anyObj, key)) {
                serialized[key] = serializeDecimal(anyObj[key]);
            }
        }

        // Final safety check: if it still has non-serializable stuff, stringify/parse
        // But only if we are at the top level or a significant object
        return serialized as unknown as T;
    }

    return obj;
}

export function hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? [
              parseInt(result[1], 16),
              parseInt(result[2], 16),
              parseInt(result[3], 16),
          ]
        : [0, 0, 0];
}

export function formatPlaca(placa: string | null | undefined): string {
    if (!placa) return "N/A";
    return placa.toUpperCase().trim();
}

export function formatDate(date: Date | string | undefined | null): string {
    if (!date) return "N/A";
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "Invalid Date";
    return new Intl.DateTimeFormat("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).format(d);
}

export function formatNumber(value: number | string | undefined | null): string {
    if (value === undefined || value === null) return "0";
    const n = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("es-CO").format(n);
}
