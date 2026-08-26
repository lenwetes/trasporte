"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, User as UserIcon, Check } from "lucide-react";
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
import { searchUsuarios } from "@/actions";
import { UsuarioWithRelations } from "@/types";

interface UserComboboxProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function UserCombobox({value,
    onChange,
    placeholder = "Seleccionar usuario...",
}: UserComboboxProps) {
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState<UsuarioWithRelations[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const selectedUser = users.find((user) => user.id === value);

    useEffect(() => {
        if (open) {
            loadUsers("");
        }
    }, [open]);

    async function loadUsers(query: string) {
        try {
            setLoading(true);
            const result = await searchUsuarios({
                query,
                limit: 20,
            });

            if (result.success && result.data) {
                setUsers(result.data as UsuarioWithRelations[]);
            }
        } catch (error) {
            console.error("Error loading users:", error);
        } finally {
            setLoading(false);
        }
    }

    function handleSearch(query: string) {
        setSearchQuery(query);
        if (query.length >= 2 || query === "") {
            loadUsers(query);
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
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
                    {selectedUser ? (
                        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <UserIcon size={16} />
                            <span>
                                {selectedUser.nombres} {selectedUser.apellidos}
                            </span>
                        </span>
                    ) : (
                        <span style={{ color: "#94a3b8" }}>{placeholder}</span>
                    )}
                    <ChevronsUpDown size={16} style={{ color: "#94a3b8" }} />
                </button>
            </PopoverTrigger>
            <PopoverContent align="start" style={{ width: "300px", padding: "0" }}>
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Buscar por nombre, correo o documento..."
                        value={searchQuery}
                        onValueChange={handleSearch}
                    />
                    <CommandEmpty>
                        {loading ? "Buscando..." : "No se encontraron usuarios"}
                    </CommandEmpty>
                    <CommandGroup>
                        {users.map((user) => (
                            <CommandItem
                                key={user.id}
                                value={user.id}
                                onSelect={(currentValue) => {
                                    onChange(
                                        currentValue === value
                                            ? ""
                                            : currentValue,
                                    );
                                    setOpen(false);
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
                                    {value === user.id ? <Check size={16} /> : <div style={{ width: 16 }} />}
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <span style={{ fontWeight: "600" }}>
                                            {user.nombres} {user.apellidos}
                                        </span>
                                        <span style={{ fontSize: "11px", color: "#64748b" }}>
                                            {user.rol} • {user.email || user.numeroDocumento || "Sin ID"}
                                        </span>
                                    </div>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
