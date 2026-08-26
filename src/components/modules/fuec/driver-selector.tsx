"use client";

import * as React from "react";
import { getConductoresSearch } from "@/actions/fuec";
import { User, Search, Check, ChevronsUpDown, Loader2, AlertCircle, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface DriverSelectorProps {
    value?: string | null;
    onChange: (value: string | null) => void;
    label: string;
    placeholder?: string;
    description?: string;
    initialDrivers?: { id: string; nombre: string; documento: string }[];
    disabled?: boolean;
}

export function DriverSelector({
    value,
    onChange,
    label,
    placeholder = "SELECCIONAR CONDUCTOR...",
    description,
    initialDrivers = [],
    disabled = false,
}: DriverSelectorProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [drivers, setDrivers] = React.useState<{id: string; nombre: string; documento: string }[]>(initialDrivers);
    const [isLoading, setIsLoading] = React.useState(false);
    const [selectedName, setSelectedName] = React.useState<string>(description || "");
    const searchTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

    // Sincronizar nombre seleccionado si cambia por auto-carga
    React.useEffect(() => {
        if (description && description !== selectedName) {
            setSelectedName(description);
        }
    }, [description, selectedName]);

    // Lógica de búsqueda reactiva / inicial
    React.useEffect(() => {
        if (search.length === 0) {
            setDrivers(initialDrivers.slice(0, 4));
            return;
        }

        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        if (search.length >= 2) {
            searchTimeoutRef.current = setTimeout(async () => {
                setIsLoading(true);
                try {
                    const result = await getConductoresSearch(search);
                    if (result.success && result.data) {
                        setDrivers((result.data as { id: string; nombre: string; documento: string }[]).slice(0, 4));
                    }
                } catch (error) {
                    console.error("Error searching drivers:", error);
                } finally {
                    setIsLoading(false);
                }
            }, 300);
        }
    }, [search, initialDrivers]);

    const handleSelect = (driver: { id: string; nombre: string; documento: string }) => {
        onChange(driver.id);
        setSelectedName(driver.nombre);
        setOpen(false);
        setSearch("");
    };

    return (
        <div className="space-y-2 w-full">
            {label && (
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block pl-1">
                    {label}
                </label>
            )}
            <Popover open={open} onOpenChange={!disabled ? setOpen : undefined}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn(
                            "w-full justify-between radius-0 border-slate-200 h-16 px-6 transition-all shadow-sm",
                            disabled ? "bg-slate-100 text-slate-900 cursor-not-allowed border-transparent opacity-50" : "bg-white hover:bg-slate-50 hover:border-brand"
                        )}
                    >
                        {value ? (
                            <div className="flex items-center gap-6 text-left overflow-hidden">
                                <div className="h-10 w-10 bg-slate-100 flex items-center justify-center text-slate-800 shrink-0 radius-0 border border-slate-200 group-hover:bg-brand group-hover:text-white transition-colors">
                                    <User className="h-5 w-5" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-black text-slate-900 text-[14px] lg:text-[15px] uppercase leading-none truncate tracking-tight">{selectedName}</p>
                                    <p className="text-[9px] text-[var(--primary)] font-black uppercase tracking-[0.2em] mt-1 italic">Conductor Registrado_SGIT</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Search className="h-4 w-4 text-slate-900" />
                                <span className="text-slate-900 text-xs font-black uppercase tracking-[0.3em]">{placeholder}</span>
                            </div>
                        )}
                        <ChevronsUpDown className="ml-4 h-4 w-4 shrink-0 opacity-20" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 radius-0 border border-slate-200 shadow-2xl overflow-hidden" align="start" sideOffset={8}>
                    <div className="flex flex-col">
                        <div className="flex items-center border-b border-slate-100 px-6 bg-slate-50 gap-4">
                            <Search className="h-4 w-4 shrink-0 text-slate-900" />
                            <Input
                                placeholder="ESCRIBA NOMBRE O DOCUMENTO..."
                                className="flex h-16 w-full border-none bg-transparent py-4 text-xs font-black uppercase outline-none focus-visible:ring-0 tracking-widest placeholder:text-slate-900"
                                value={search}
                                onChange={(e) => setSearch(e.target.value.toUpperCase())}
                                autoFocus
                            />
                        </div>
                        <div className="max-h-[300px] overflow-y-auto p-2 custom-scrollbar bg-white">
                            {isLoading ? (
                                <div className="py-16 flex flex-col items-center justify-center gap-4 text-slate-900">
                                    <Loader2 className="h-8 w-8 animate-spin text-brand" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic opacity-50">Sincronizando Base de Datos...</span>
                                </div>
                            ) : drivers.length === 0 ? (
                                <div className="py-16 flex flex-col items-center justify-center gap-4 text-red-400/50 grayscale">
                                    <AlertCircle className="h-8 w-8" />
                                    <p className="text-[10px] font-black uppercase tracking-widest px-10 text-center leading-loose">No se detectaron registros compatibles</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <div className="px-4 py-2 text-[8px] font-black text-slate-900 uppercase tracking-[0.3em] border-b border-slate-50 mb-2 italic">
                                        VISTA_OPERADORES_ACTIVOS ({drivers.length})
                                    </div>
                                    {drivers.map((driver) => (
                                        <button
                                            key={driver.id}
                                            type="button"
                                            className={cn(
                                                "flex w-full items-center justify-between px-4 py-3 text-sm transition-all hover:bg-slate-50 radius-0 group",
                                                value === driver.id ? "bg-slate-50" : "bg-transparent"
                                            )}
                                            onClick={() => handleSelect(driver)}
                                        >
                                            <div className="flex items-center gap-6 overflow-hidden text-left">
                                                <div className={cn(
                                                    "h-12 w-12 flex items-center justify-center transition-all shrink-0 radius-0 border",
                                                    value === driver.id ? "bg-brand text-white border-brand shadow-lg" : "bg-slate-50 text-slate-900 border-slate-100 group-hover:bg-brand group-hover:text-white"
                                                )}>
                                                    <User className="h-6 w-6" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="font-black text-slate-900 text-[13px] leading-tight mb-1 uppercase truncate tracking-tight group-hover:text-brand transition-colors">{driver.nombre}</p>
                                                    <div className="flex items-center gap-2 opacity-50">
                                                        <Fingerprint className="h-3 w-3" />
                                                        <p className="text-[10px] font-mono font-bold uppercase tracking-widest">{driver.documento || "PENDIENTE_DOC"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {value === driver.id && (
                                                <div className="h-6 w-6 bg-brand flex items-center justify-center radius-0 shadow-lg">
                                                    <Check className="h-3 w-3 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
