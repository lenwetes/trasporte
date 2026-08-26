"use client";

import { FileText, Truck, User, Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ManualTransactionFormData, FinanceMetadata } from "./use-transaction-form";

interface TransactionDetailPanelProps {
    formData: ManualTransactionFormData;
    setFormData: (val: ManualTransactionFormData) => void;
    metadata: FinanceMetadata | null;
    terceroType: "user" | "provider";
    setTerceroType: (val: "user" | "provider") => void;
    setProviderDialogOpen: (val: boolean) => void;
}

const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
        {children}
    </label>
);

const InputClass = "h-12 w-full rounded-none border-primary/10 bg-slate-50 px-4 text-xs font-bold uppercase tracking-widest focus:border-primary focus:ring-0 transition-all placeholder:text-primary/10";

export function TransactionDetailPanel({
    formData,
    setFormData,
    metadata,
    terceroType,
    setTerceroType,
    setProviderDialogOpen
}: TransactionDetailPanelProps) {
    return (
        <div className="space-y-10">
            {/* 1. Información de Encabezado */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="md:col-span-8 space-y-4">
                    <Label><FileText size={14} className="text-slate-900" /> Descripción Técnica del Movimiento</Label>
                    <input 
                        placeholder="DETALLE EXHAUSTIVO DE LA OPERACIÓN..."
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value.toUpperCase() })}
                        className="h-14 w-full rounded-none border-primary/20 bg-white px-6 text-xs font-black uppercase tracking-widest focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
                    />
                </div>
                <div className="md:col-span-4 space-y-4">
                    <Label><Truck size={14} className="text-slate-900" /> Vehículo Asociado (Opcional)</Label>
                    <select 
                        value={formData.metaVehiculoId}
                        onChange={(e) => setFormData({ ...formData, metaVehiculoId: e.target.value })}
                        className={cn(InputClass, "h-14 border-primary/20 bg-white font-black appearance-none pr-10")}
                    >
                        <option value="">FLOTA NO APLICA</option>
                        {metadata?.vehiculos.map((v) => (
                            <option key={v.id} value={v.id}>{v.placa} - {v.clase || 'UNIT'}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 2. Terceros / Interesados */}
            <div className="p-8 bg-white border border-primary/10 shadow-sm relative group overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="flex bg-slate-100 p-1 border border-primary/5">
                            <button 
                                type="button"
                                onClick={() => setTerceroType("user")}
                                className={cn(
                                    "p-3 transition-all",
                                    terceroType === "user" ? "bg-primary text-white shadow-xl" : "text-primary/20 hover:text-primary"
                                )}
                            >
                                <User size={18} />
                            </button>
                            <button 
                                type="button"
                                onClick={() => setTerceroType("provider")}
                                className={cn(
                                    "p-3 transition-all",
                                    terceroType === "provider" ? "bg-primary text-white shadow-xl" : "text-primary/20 hover:text-primary"
                                )}
                            >
                                <Building2 size={18} />
                            </button>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Entidad de Operación</h4>
                            <p className="text-[9px] font-bold text-primary uppercase tracking-widest italic">{terceroType === "user" ? "Gestión de Personal / Socios" : "Gestión de Proveedores / Terceros"}</p>
                        </div>
                    </div>

                    <div className="flex-1 max-w-md w-full relative">
                        {terceroType === "user" ? (
                            <select 
                                value={formData.terceroId}
                                onChange={(e) => setFormData({ ...formData, terceroId: e.target.value })}
                                className={cn(InputClass, "font-black appearance-none pr-10 border-primary/20")}
                            >
                                <option value="">SELECCIONE USUARIO/SOCIO...</option>
                                {metadata?.usuarios.map((u) => (
                                    <option key={u.id} value={u.id}>{u.nombres} {u.apellidos}</option>
                                ))}
                            </select>
                        ) : (
                            <div className="flex gap-2">
                                <select 
                                    value={formData.proveedorId}
                                    onChange={(e) => setFormData({ ...formData, proveedorId: e.target.value })}
                                    className={cn(InputClass, "font-black appearance-none pr-10 border-primary/20")}
                                >
                                    <option value="">SELECCIONE PROVEEDOR...</option>
                                    {metadata?.proveedores.map((p) => (
                                        <option key={p.id} value={p.id}>{p.nombres} {p.apellidos}</option>
                                    ))}
                                </select>
                                <Button 
                                    type="button"
                                    onClick={() => setProviderDialogOpen(true)}
                                    className="h-12 w-12 shrink-0 bg-primary/5 hover:bg-primary hover:text-white border-2 border-primary/5 transition-all rounded-none"
                                >
                                    <Plus size={20} />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
