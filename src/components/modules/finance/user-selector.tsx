"use client";

import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Search, User } from "lucide-react";
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
import { searchUsers } from "@/actions/users/search";

interface MinimalUser {
  id: string;
  nombres: string;
  apellidos: string;
  numeroDocumento: string | null;
  rol: string;
}

interface UserSelectorProps {
  onSelect: (userId: string) => void;
  selectedId?: string;
}

export function UserSelector({ onSelect, selectedId }: UserSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<MinimalUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<MinimalUser | null>(null);

  useEffect(() => {
    const loadSelectedUser = async () => {
      if (selectedId && (!selectedUser || selectedUser.id !== selectedId)) {
        try {
          // Usamos la misma lógica de búsqueda pero filtrando por ID si fuera necesario, 
          // o una acción específica de búsqueda por ID.
          // Por simplicidad, si ya tenemos el ID, podemos buscarlo para tener la info completa (nombres, etc)
          const res = await searchUsers(selectedId); 
          if (res?.success && res.data && res.data.length > 0) {
            const found = (res.data as MinimalUser[]).find(u => u.id === selectedId);
            if (found) setSelectedUser(found);
          }
        } catch (error) {
          console.error("Error cargando usuario seleccionado", error);
        }
      }
    };
    loadSelectedUser();
  }, [selectedId]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (query.length < 2) {
        setUsers([]);
        return;
      }
      setLoading(true);
      try {
        const res = await searchUsers(query);
        if (res.success) {
          setUsers(res.data as MinimalUser[]);
        }
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between rounded-none border-primary/10 bg-slate-50 h-10 text-[10px] font-black uppercase tracking-widest"
        >
          {selectedUser ? (
            <div className="flex items-center gap-2">
               <User className="h-3 w-3 text-accent" />
               {selectedUser.nombres} {selectedUser.apellidos} ({selectedUser.numeroDocumento})
            </div>
          ) : (
            "Seleccionar Beneficiario..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 rounded-none border-primary/20 shadow-2xl">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="BUSCAR POR NOMBRE O CC..." 
            className="h-9 text-[10px] font-black uppercase"
            onValueChange={setQuery}
          />
          <CommandList className="max-h-[300px]">
            <CommandEmpty className="py-6 text-center text-[10px] font-black text-slate-900 uppercase">
              {loading ? "Buscando..." : "No se encontraron resultados"}
            </CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.id}
                  onSelect={() => {
                    setSelectedUser(user);
                    onSelect(user.id);
                    setOpen(false);
                  }}
                  className="p-3 cursor-pointer hover:bg-primary hover:text-white group border-b border-primary/5 last:border-none"
                >
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black uppercase tracking-tight group-hover:text-white">
                      {user.nombres} {user.apellidos}
                    </span>
                    <span className="text-[9px] font-medium text-slate-900 group-hover:text-white/60">
                      CC: {user.numeroDocumento} — ROL: {user.rol}
                    </span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4 text-accent",
                      selectedId === user.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
