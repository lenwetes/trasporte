"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { TerceroData, TerceroType, FinanceMetadata } from "./types";
import { 
    User, 
    Building2, 
    Check, 
    Plus, 
    Search,
    Loader2
} from "lucide-react";

interface TerceroFieldProps {
    terceroData: TerceroData | null;
    terceroType: TerceroType;
    setTerceroType: (type: TerceroType) => void;
    setTerceroData: (data: TerceroData | null) => void;
    setShowProviderDialog: (open: boolean) => void;
    metadata: FinanceMetadata | null;
    loadingMetadata: boolean;
}

/**
 * Campo de selección de tercero (usuario o proveedor) para un movimiento de caja.
 */
export function CashMovementTerceroField({
    terceroData,
    terceroType,
    setTerceroType,
    setTerceroData,
    setShowProviderDialog,
    metadata,
    loadingMetadata,
}: TerceroFieldProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <FormLabel className="text-[10px] font-black uppercase text-slate-900 tracking-widest flex items-center gap-2">
                    <Search size={14} className="text-slate-900" />
                    Responsabilidad de Tercero
                </FormLabel>
                {terceroData && (
                    <Badge variant="outline" className="h-5 text-[9px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700 border-emerald-100 gap-1 px-2">
                        <Check size={10} /> Vinculado
                    </Badge>
                )}
            </div>

            {/* Tabs usuario / proveedor */}
            <div className="flex p-1 bg-slate-100 rounded-lg">
                <button
                    type="button"
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all",
                        terceroType === "user" 
                            ? "bg-white text-slate-900 shadow-sm" 
                            : "text-slate-900 hover:text-slate-600"
                    )}
                    onClick={() => {
                        setTerceroType("user");
                        setTerceroData(null);
                    }}
                >
                    <User size={14} /> Personal Interno
                </button>
                <button
                    type="button"
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all",
                        terceroType === "provider" 
                            ? "bg-white text-slate-900 shadow-sm" 
                            : "text-slate-900 hover:text-slate-600"
                    )}
                    onClick={() => {
                        setTerceroType("provider");
                        setTerceroData(null);
                    }}
                >
                    <Building2 size={14} /> Aliados Externos
                </button>
            </div>

            {/* Select nativo + botón nuevo proveedor */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <select
                        id="tercero-select"
                        className="w-full h-11 bg-white border border-slate-200 rounded-lg pl-4 pr-10 text-xs font-bold appearance-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:bg-slate-50 disabled:text-slate-900"
                        value={terceroData?.id ?? ""}
                        onChange={(e) => {
                            const val = e.target.value;
                            setTerceroData(val ? { id: val, type: terceroType, nombres: "" } : null);
                        }}
                        disabled={loadingMetadata}
                    >
                        <option value="">
                            {loadingMetadata 
                                ? "— Sincronizando directorio... —" 
                                : terceroType === "user"
                                    ? "— Buscar en el escalafón de personal —"
                                    : "— Buscar en el directorio de aliados —"}
                        </option>
                        {terceroType === "user"
                            ? metadata?.usuarios.map((u) => (
                                  <option key={u.id} value={u.id}>
                                      {u.nombres?.toUpperCase()} {u.apellidos?.toUpperCase()} — {u.numeroDocumento ?? "S/N"}
                                  </option>
                              ))
                            : metadata?.proveedores.map((p) => (
                                  <option key={p.id} value={p.id}>
                                      {p.nombres?.toUpperCase()} — {p.numeroDocumento ?? "S/N"}
                                  </option>
                              ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-900">
                        {loadingMetadata ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                    </div>
                </div>

                {terceroType === "provider" && (
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 w-11 p-0 border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
                        onClick={() => setShowProviderDialog(true)}
                        title="Registrar nuevo proveedor"
                    >
                        <Plus size={18} />
                    </Button>
                )}
            </div>
        </div>
    );
}
