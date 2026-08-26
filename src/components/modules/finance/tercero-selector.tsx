"use client";

import { useState, useEffect } from "react";
import {
    Check,
    ChevronsUpDown,
    Plus,
    User,
    Building2,
    Search,
    Loader2,
    UserCircle,
    Building,
    ExternalLink,
    Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { getFinanceMetadata } from "@/actions/finance/transactions";
import { ProviderDialog } from "./provider-dialog";

interface FinanceMetadata {
    usuarios: {
        id: string;
        nombres: string;
        apellidos: string;
        numeroDocumento: string | null;
    }[];
    proveedores: {
        id: string;
        nombres: string;
        numeroDocumento: string | null;
    }[];
}

interface TerceroSelectorProps {
    onSelect: (val: { id: string; type: "user" | "provider" } | null) => void;
    defaultValue?: string;
}

export function TerceroSelector({
    onSelect,
    defaultValue,
}: TerceroSelectorProps) {
    const [open, setOpen] = useState(false);
    const [terceroType, setTerceroType] = useState<"user" | "provider">("user");
    const [metadata, setMetadata] = useState<FinanceMetadata | null>(null);
    const [loading, setLoading] = useState(true);
    const [providerDialogOpen, setProviderDialogOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(defaultValue || "");

    const loadMetadata = async () => {
        setLoading(true);
        try {
            const res = await getFinanceMetadata();
            if (res.success && res.data) {
                setMetadata(res.data as unknown as FinanceMetadata);
            }
        } catch {
            // Error silencioso — el componente queda vacío, sin datos
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMetadata();
    }, []);

    const handleSelect = (id: string, type: "user" | "provider") => {
        setSelectedValue(id);
        setOpen(false);
        onSelect({ id, type });
    };

    const currentItems = (
        terceroType === "user"
            ? metadata?.usuarios || []
            : metadata?.proveedores || []
    ).map(
        (item: { id?: string; nombres?: string; apellidos?: string; razonSocial?: string; numeroDocumento?: string | null }) => ({
            id: item.id || "",
            label: (
                item.nombres ||
                item.razonSocial ||
                `${item.nombres || ''} ${item.apellidos || ''}`.trim() ||
                "Sin Nombre"
            ).toUpperCase(),
            sublabel: item.numeroDocumento || "Sin Documento",
        }),
    );

    const selectedItem = currentItems.find((item) => item.id === selectedValue);

    return (
        <div className="space-y-4">
            <div className="flex bg-slate-100 p-1 border border-primary/5 rounded-none shadow-sm relative group">
                <div 
                    role="radiogroup"
                    aria-label="Tipo de tercero"
                    className="flex flex-1"
                >
                    <button
                        type="button"
                        onClick={() => {
                            setTerceroType("user");
                            setSelectedValue("");
                            onSelect(null);
                        }}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-3 py-3 px-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                            terceroType === "user" ? "bg-primary text-white shadow-xl" : "text-primary hover:text-primary hover:bg-white/50"
                        )}
                    >
                        <UserCircle size={14} className={cn(terceroType === "user" ? "text-accent" : "opacity-40")} />
                        Usuario / Socio
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setTerceroType("provider");
                            setSelectedValue("");
                            onSelect(null);
                        }}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-3 py-3 px-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                            terceroType === "provider" ? "bg-primary text-white shadow-xl" : "text-primary hover:text-primary hover:bg-white/50"
                        )}
                    >
                        <Building size={14} className={cn(terceroType === "provider" ? "text-accent" : "opacity-40")} />
                        Proveedor / Ops
                    </button>
                </div>

                {terceroType === "provider" && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setProviderDialogOpen(true)}
                        className="absolute -right-12 top-0 h-full w-10 p-0 rounded-none bg-primary text-white hover:bg-slate-800 transition-all shadow-lg border-l border-white/10"
                    >
                        <Plus size={16} className="text-accent" />
                    </Button>
                )}
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full h-14 rounded-none border-primary/20 bg-white justify-between px-6 hover:bg-slate-50 hover:border-primary transition-all shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin text-primary/20" />
                            ) : (
                                <Search className="h-4 w-4 text-primary/20" />
                            )}
                            <span className={cn(
                                "text-xs font-black uppercase tracking-widest",
                                selectedItem ? "text-primary" : "text-primary italic"
                            )}>
                                {selectedItem
                                    ? selectedItem.label
                                    : terceroType === "user"
                                      ? "Localizar Usuario en Registro..."
                                      : "Localizar Proveedor en Catálogo..."}
                            </span>
                        </div>
                        <ChevronsUpDown className="h-4 w-4 shrink-0 text-primary/20" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0 rounded-none border-2 border-primary shadow-2xl z-[1200]">
                    <Command className="rounded-none">
                        <CommandInput
                            placeholder="Buscar por nombre o documento..."
                            className="h-14 font-black text-xs uppercase tracking-widest border-b border-primary/5"
                        />
                        <CommandList className="max-h-[300px] overflow-y-auto custom-scrollbar">
                            <CommandEmpty className="p-8 text-center text-[10px] font-black text-primary uppercase tracking-widest">
                                No se detectaron coincidencias.
                            </CommandEmpty>
                            <CommandGroup className="p-2">
                                {currentItems.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        value={item.id}
                                        onSelect={() => handleSelect(item.id, terceroType)}
                                        className="flex items-center justify-between p-4 cursor-pointer aria-selected:bg-primary aria-selected:text-white transition-all group"
                                    >
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[11px] font-black uppercase tracking-[0.1em]">
                                                {item.label}
                                            </span>
                                            <span className="text-[9px] font-mono opacity-50 font-bold group-aria-selected:text-white/60">
                                                ID: {item.sublabel}
                                            </span>
                                        </div>
                                        {selectedValue === item.id ? (
                                            <Check className="h-4 w-4 text-accent" />
                                        ) : (
                                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        )}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <ProviderDialog
                open={providerDialogOpen}
                setOpen={setProviderDialogOpen}
                onSuccess={(newProvider) => {
                    loadMetadata();
                    if (newProvider && newProvider.id) {
                        setTerceroType("provider");
                        handleSelect(newProvider.id, "provider");
                    }
                }}
            />
        </div>
    );
}
