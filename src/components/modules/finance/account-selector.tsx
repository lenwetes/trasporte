"use client";

import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown, BookOpen } from "lucide-react";
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

interface CuentaContable {
  id: string;
  codigo: string;
  nombre: string;
  naturaleza: string;
}

interface AccountSelectorProps {
  onSelect: (accountId: string) => void;
  selectedId?: string;
  placeholder?: string;
}

export function AccountSelector({ onSelect, selectedId, placeholder = "Seleccionar Cuenta PUC..." }: AccountSelectorProps) {
  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState<CuentaContable[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<CuentaContable[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<CuentaContable | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const res = await getFinanceMetadata();
        if (res.success && res.data) {
          const data = res.data as { cuentas: CuentaContable[] };
          const list = data.cuentas || [];
          setAccounts(list);
          setFilteredAccounts(list);
          if (selectedId) {
             const found = list.find((a) => a.id === selectedId);
             if (found) setSelectedAccount(found);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, [selectedId]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredAccounts(accounts);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredAccounts(
        accounts.filter(a => 
          a.codigo.toLowerCase().includes(lower) || 
          a.nombre.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchTerm, accounts]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between rounded-none border-primary/10 bg-slate-50 h-10 text-[10px] font-black uppercase tracking-widest"
        >
          {selectedAccount ? (
            <div className="flex items-center gap-2 truncate">
               <BookOpen className="h-3 w-3 text-accent shrink-0" />
               <span className="truncate">{selectedAccount.codigo} - {selectedAccount.nombre}</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-none border-primary/20 shadow-2xl z-[9999]">
        <Command>
          <CommandInput 
            placeholder="BUSCAR POR CÓDIGO O NOMBRE PUC..." 
            className="h-9 text-[10px] font-black uppercase"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList className="max-h-[350px]">
            {filteredAccounts.length === 0 && (
              <CommandEmpty className="py-12 text-center text-[10px] font-black text-slate-900 uppercase">
                {loading ? "Cargando Plan de Cuentas..." : "No se encontraron coincidencias"}
              </CommandEmpty>
            )}
            <CommandGroup>
              {filteredAccounts.map((acc) => (
                <CommandItem
                  key={acc.id}
                  value={acc.codigo + " " + acc.nombre}
                  onSelect={() => {
                    setSelectedAccount(acc);
                    onSelect(acc.id);
                    setOpen(false);
                  }}
                  className="p-3 cursor-pointer hover:bg-primary hover:text-white group border-b border-primary/5 last:border-none"
                >
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black uppercase tracking-tight group-hover:text-white">
                      {acc.nombre}
                    </span>
                    <span className="text-[9px] font-medium text-accent group-hover:text-white/60">
                      CÓDIGO: {acc.codigo} — TIPO: {acc.naturaleza}
                    </span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4 text-emerald-500",
                      selectedId === acc.id ? "opacity-100" : "opacity-0"
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
