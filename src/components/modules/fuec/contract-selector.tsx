"use client";

import * as React from "react";
import { ContratoDialog } from "./contrato-dialog";
import { FuecContrato } from "./fuec-form/types";
import { Briefcase, Search, Check, ChevronsUpDown, Calendar, Building2, Plus, Fingerprint, Hash, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteContrato } from "@/actions/fuec";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface ContractSelectorProps {
    contracts: FuecContrato[];
    value: string;
    onChange: (value: string) => void;
    isAdmin?: boolean;
    onContractCreated?: (contract: FuecContrato) => void;
    onContractUpdated?: (contract: FuecContrato) => void;
    onContractDeleted?: (id: string) => void;
}

export function ContractSelector({
    contracts,
    value,
    onChange,
    isAdmin,
    onContractCreated,
    onContractUpdated,
    onContractDeleted,
}: ContractSelectorProps) {
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false);
    const [contractToDelete, setContractToDelete] = React.useState<string | null>(null);

    const selectedContract = contracts.find((c) => c.id === value);

    const filteredContracts = React.useMemo(() => {
        let result = contracts;
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = contracts.filter((c) => {
                const year = c.fechaInicio ? new Date(c.fechaInicio).getFullYear().toString() : "";
                return (
                    (c.numeroContrato || "").toLowerCase().includes(lowerSearch) ||
                    (c.cliente || "").toLowerCase().includes(lowerSearch) ||
                    (c.objeto?.toLowerCase().includes(lowerSearch) ?? false) ||
                    year.includes(lowerSearch)
                );
            });
        }
        return result.slice(0, 4);
    }, [contracts, searchTerm]);

    const handleSelect = (id: string) => {
        onChange(id);
        setOpen(false);
        setSearchTerm("");
    };

    const handleDelete = async () => {
        if (!contractToDelete) return;
        setIsConfirmDeleteOpen(false);
        try {
            const res = await deleteContrato(contractToDelete);
            if (res.success) {
                toast.success("Contrato eliminado");
                if (onContractDeleted) onContractDeleted(contractToDelete);
                if (value === contractToDelete) onChange("");
            } else {
                toast.error(res.error || "Error al eliminar");
            }
        } catch (error) {
            toast.error("Error inesperado al eliminar");
        } finally {
            setContractToDelete(null);
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest pl-1">
                Vínculo de Contrato Operativo
            </label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between rounded-none border-primary/10 bg-white hover:bg-slate-50 h-14 px-4 transition-all shadow-sm group"
                    >
                        {selectedContract ? (
                            <div className="flex items-center gap-4 text-left overflow-hidden">
                                <div className="h-10 w-10 bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/5 transition-colors group-hover:bg-primary/10">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <div className="overflow-hidden space-y-0.5">
                                    <p className="font-black text-primary text-sm uppercase leading-tight truncate">
                                        {selectedContract.numeroContrato} — {selectedContract.cliente}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Hash className="h-2.5 w-2.5 text-accent" />
                                        <p className="text-[9px] text-slate-900 font-black uppercase tracking-widest truncate">
                                            {selectedContract.objeto || "Sin objeto definido"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Search className="h-4 w-4 text-primary/20" />
                                <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Vincular Contrato...</span>
                            </div>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-20" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-none border-primary/10 shadow-2xl overflow-hidden" align="start">
                    <div className="flex flex-col">
                        <div className="flex items-center border-b border-primary/5 px-4 bg-slate-50/50 gap-3">
                            <Search className="h-4 w-4 shrink-0 text-primary" />
                            <Input
                                placeholder="Buscar por número, cliente o año..."
                                className="flex h-14 w-full border-none bg-transparent py-4 text-xs font-bold uppercase outline-none focus-visible:ring-0"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                            <ContratoDialog
                                onCreated={(newContrato) => {
                                    if (onContractCreated) onContractCreated(newContrato);
                                    setOpen(false);
                                    setSearchTerm("");
                                }}
                            />
                        </div>
                        <div className="max-h-[350px] overflow-y-auto p-1 custom-scrollbar">
                            {filteredContracts.length === 0 ? (
                                <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-900 px-4">
                                    <Building2 className="h-8 w-8 opacity-20" />
                                    <div className="text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest italic">Base de Datos Sin Coincidencias</p>
                                        <p className="text-[9px] font-medium leading-tight mt-2 opacity-60">
                                            Use el botón <span className="text-accent font-bold">+</span> para registrar un nuevo contrato operativo.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-0.5">
                                    <div className="px-3 py-2 text-[9px] font-black text-primary/20 uppercase tracking-[0.2em] border-b border-primary/5 mb-1">
                                        Contratos (Mostrando 4 de {contracts.length})
                                    </div>
                                    {filteredContracts.map((contract) => (
                                        <div
                                            key={contract.id}
                                            className={cn(
                                                "flex w-full items-center justify-between transition-all hover:bg-primary/5 rounded-none group",
                                                value === contract.id ? "bg-primary/[0.03]" : "bg-transparent"
                                            )}
                                        >
                                            <button
                                                type="button"
                                                className="flex-1 px-3 py-3 flex items-center gap-4 overflow-hidden text-left"
                                                onClick={() => handleSelect(contract.id)}
                                            >
                                                <div className={cn(
                                                    "h-10 w-10 bg-primary/5 flex items-center justify-center transition-colors shrink-0 border border-primary/5",
                                                    value === contract.id ? "bg-accent text-white" : "text-primary/20 group-hover:bg-primary/20"
                                                )}>
                                                    <Briefcase className="h-5 w-5" />
                                                </div>
                                                <div className="overflow-hidden space-y-1">
                                                    <p className="font-black text-primary text-sm leading-none uppercase truncate">
                                                        {contract.numeroContrato}
                                                    </p>
                                                    <p className="text-[10px] text-primary/60 font-black uppercase truncate italic max-w-[280px]">
                                                        {contract.cliente}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-[9px] font-black text-primary/20 uppercase">
                                                        <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> AÑO {new Date(contract.fechaInicio).getFullYear()}</span>
                                                        {contract.nitCliente && <span className="flex items-center gap-1.5"><Fingerprint className="h-3 w-3" /> NIT: {contract.nitCliente}</span>}
                                                    </div>
                                                </div>
                                            </button>
                                            
                                            <div className="flex items-center px-3 shrink-0">
                                                {isAdmin ? (
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <ContratoDialog
                                                            initialData={contract}
                                                            onUpdated={onContractUpdated}
                                                            trigger={
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-900 hover:text-accent hover:bg-accent/10">
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            }
                                                        />
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-8 w-8 text-slate-900 hover:text-red-500 hover:bg-red-500/10"
                                                            onClick={(e) => { 
                                                                e.stopPropagation(); 
                                                                setContractToDelete(contract.id);
                                                                setIsConfirmDeleteOpen(true);
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : value === contract.id && (
                                                    <div className="h-6 w-6 bg-accent rounded-full flex items-center justify-center">
                                                        <Check className="h-3 w-3 text-primary" />
                                                    </div>
                                                )}
                                                {isAdmin && value === contract.id && (
                                                   <div className="h-6 w-6 bg-accent rounded-full flex items-center justify-center ml-2 group-hover:hidden">
                                                        <Check className="h-3 w-3 text-primary" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            <ConfirmDialog
                isOpen={isConfirmDeleteOpen}
                onClose={() => {
                    setIsConfirmDeleteOpen(false);
                    setContractToDelete(null);
                }}
                onConfirm={handleDelete}
                title="Eliminar Contrato"
                description="¿Está seguro que desea eliminar este contrato? Esta acción es irreversible y podría afectar planillas emitidas bajo este vínculo."
                variant="destructive"
            />
        </div>
    );
}
