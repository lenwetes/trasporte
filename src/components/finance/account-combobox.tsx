/**
 * Combobox para seleccionar cuentas contables
 * Permite búsqueda por código o nombre
 */

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Check } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { searchAccountsAction } from "@/actions/finance/accounts.actions";
import type { CuentaContable } from "@prisma/client";

interface AccountComboboxProps {
    value: string;
    onChange: (value: string) => void;
}

export function AccountCombobox({ value, onChange }: AccountComboboxProps) {
    const [open, setOpen] = useState(false);
    const [accounts, setAccounts] = useState<CuentaContable[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const selectedAccount = accounts.find((account) => account.id === value);

    useEffect(() => {
        if (open) {
            loadAccounts("");
        }
    }, [open]);

    async function loadAccounts(query: string) {
        try {
            setLoading(true);
            const result = await searchAccountsAction({
                query: query || "5", // Por defecto buscar cuentas de gastos
                limit: 50,
            });

            if (result.success && result.data) {
                setAccounts(result.data as CuentaContable[]);
            }
        } catch (error) {
            console.error("Error loading accounts:", error);
        } finally {
            setLoading(false);
        }
    }

    function handleSearch(query: string) {
        setSearchQuery(query);
        if (query.length >= 1) {
            loadAccounts(query);
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    role="combobox"
                    aria-expanded={open}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                        backgroundColor: "white",
                        cursor: "pointer",
                        textAlign: "left",
                        fontSize: "14px"
                    }}
                >
                    {selectedAccount ? (
                        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <code style={{ fontSize: "11px", backgroundColor: "#f1f5f9", padding: "2px 4px", borderRadius: "4px" }}>
                                {selectedAccount.codigo}
                            </code>
                            <span>
                                {selectedAccount.nombre}
                            </span>
                        </span>
                    ) : (
                        <span style={{ color: "#94a3b8" }}>
                            Seleccione cuenta del P.U.C
                        </span>
                    )}
                    <ChevronsUpDown size={16} style={{ color: "#94a3b8" }} />
                </button>
            </PopoverTrigger>
            <PopoverContent align="start" style={{ width: "400px", padding: "0" }}>
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Buscar por código contable o nombre..."
                        value={searchQuery}
                        onValueChange={handleSearch}
                    />
                    <CommandEmpty>
                        <div style={{ padding: "8px", textAlign: "center", fontSize: "13px", color: "#64748b" }}>
                            {loading ? "Sincronizando con Maestro PUC..." : "Cuenta no encontrada"}
                        </div>
                    </CommandEmpty>
                    <CommandGroup>
                        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                            {accounts.map((account) => (
                                <CommandItem
                                    key={account.id}
                                    value={account.id}
                                    onSelect={(currentValue) => {
                                        onChange(
                                            currentValue === value
                                                ? ""
                                                : currentValue,
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%" }}>
                                        {value === account.id ? <Check size={16} /> : <div style={{ width: 16 }} />}
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <code style={{ fontSize: "11px", color: "#64748b" }}>
                                                    {account.codigo}
                                                </code>
                                                {!account.permiteMovimiento && (
                                                    <span style={{ fontSize: "9px", backgroundColor: "#fef3c7", color: "#92400e", padding: "1px 4px", borderRadius: "4px", fontWeight: "600" }}>
                                                        Agrupación
                                                    </span>
                                                )}
                                            </div>
                                            <span style={{ fontSize: "13px", fontWeight: "500" }}>
                                                {account.nombre}
                                            </span>
                                        </div>
                                    </div>
                                </CommandItem>
                            ))}
                        </div>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
