"use client";

import * as React from "react";
import { Truck, Search, Check, ChevronsUpDown, ShieldCheck, Hash, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { FuecVehiculo } from "./fuec-form/types";

interface VehicleSelectorProps {
    vehicles: FuecVehiculo[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function VehicleSelector({
    vehicles,
    value,
    onChange,
    disabled = false,
}: VehicleSelectorProps) {
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");

    const selectedVehicle = vehicles.find((v) => v.id === value);

    const filteredVehicles = React.useMemo(() => {
        let result = vehicles;
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = vehicles.filter(
                (v) =>
                    v.placa.toLowerCase().includes(lowerSearch) ||
                    v.marca.toLowerCase().includes(lowerSearch) ||
                    v.modelo.toLowerCase().includes(lowerSearch)
            );
        }
        return result.slice(0, 4);
    }, [vehicles, searchTerm]);

    const handleSelect = (id: string) => {
        onChange(id);
        setOpen(false);
        setSearchTerm("");
    };

    return (
        <div className="w-full">
            <Popover open={open} onOpenChange={!disabled ? setOpen : undefined}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn(
                            "w-full justify-between radius-0 border-slate-200 h-16 px-6 transition-all shadow-sm group",
                            disabled ? "bg-slate-100 text-slate-900 cursor-not-allowed border-transparent opacity-50" : "bg-white hover:bg-slate-50 hover:border-brand"
                        )}
                    >
                        {selectedVehicle ? (
                            <div className="flex items-center gap-6 text-left overflow-hidden">
                                <div className="h-10 w-10 bg-slate-100 flex items-center justify-center text-slate-800 shrink-0 radius-0 border border-slate-200 group-hover:bg-brand group-hover:text-white transition-colors">
                                    <Truck className="h-5 w-5" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-black text-slate-900 text-[14px] lg:text-[15px] uppercase leading-none truncate tracking-tight mb-1">
                                        PLACA: {selectedVehicle.placa}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="h-2.5 w-2.5 text-[var(--primary)] opacity-50" />
                                        <p className="text-[9px] text-slate-900 font-black uppercase tracking-widest italic leading-none">
                                            {selectedVehicle.marca} — {selectedVehicle.modelo}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Search className="h-4 w-4 text-slate-900" />
                                <span className="text-slate-900 text-xs font-black uppercase tracking-[0.3em]">SELECCIONAR VEHÍCULO...</span>
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
                                placeholder="ESCRIBA PLACA, MARCA O MODELO..."
                                className="flex h-16 w-full border-none bg-transparent py-4 text-xs font-black uppercase outline-none focus-visible:ring-0 tracking-widest placeholder:text-slate-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                                autoFocus
                            />
                        </div>
                        <div className="max-h-[300px] overflow-y-auto p-2 custom-scrollbar bg-white">
                            {filteredVehicles.length === 0 ? (
                                <div className="py-16 flex flex-col items-center justify-center gap-4 text-red-500/50 grayscale">
                                    <Hash className="h-8 w-8 opacity-20" />
                                    <p className="text-[10px] font-black uppercase tracking-widest italic px-10 text-center leading-loose">Activo no registrado en flota</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <div className="px-4 py-2 text-[8px] font-black text-slate-900 uppercase tracking-[0.3em] border-b border-slate-50 mb-2 italic">
                                        FILTRO_ACTIVOS_FLOTA ({vehicles.length})
                                    </div>
                                    {filteredVehicles.map((vehicle) => (
                                        <button
                                            key={vehicle.id}
                                            type="button"
                                            className={cn(
                                                "flex w-full items-center justify-between px-4 py-3 text-sm transition-all hover:bg-slate-50 radius-0 group",
                                                value === vehicle.id ? "bg-slate-50" : "bg-transparent"
                                            )}
                                            onClick={() => handleSelect(vehicle.id)}
                                        >
                                            <div className="flex items-center gap-6 overflow-hidden text-left">
                                                <div className={cn(
                                                    "h-12 w-12 flex items-center justify-center transition-all shrink-0 radius-0 border",
                                                    value === vehicle.id ? "bg-brand text-white border-brand shadow-lg" : "bg-slate-50 text-slate-900 border-slate-100 group-hover:bg-brand group-hover:text-white"
                                                )}>
                                                    <Truck className="h-6 w-6" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <FileText className="h-3 w-3 text-slate-900" />
                                                        <p className="font-black text-slate-900 text-[13px] leading-none uppercase truncate tracking-tight group-hover:text-brand transition-colors">{vehicle.placa}</p>
                                                    </div>
                                                    <p className="text-[10px] text-slate-900 font-black uppercase tracking-[0.2em] italic opacity-70">{vehicle.marca} — {vehicle.modelo}</p>
                                                </div>
                                            </div>
                                            {value === vehicle.id && (
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
