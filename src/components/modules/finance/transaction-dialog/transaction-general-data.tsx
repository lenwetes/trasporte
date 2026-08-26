"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { FinanceMetadata } from "./use-transaction-form";
import { 
    FileText, 
    User, 
    Building2, 
    Car, 
    Tag,
    ChevronDown
} from "lucide-react";

type TipoTransaccion = "INGRESO" | "EGRESO" | "NOTA_CONTABLE";
type TerceroType = "user" | "provider";

interface FormData {
    descripcion: string;
    tipo: TipoTransaccion;
    terceroId: string;
    proveedorId: string;
    metaVehiculoId: string;
    asientos: { cuentaId: string; debito: number; credito: number }[];
}

interface GeneralDataProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    terceroType: TerceroType;
    setTerceroType: (t: TerceroType) => void;
    metadata: FinanceMetadata | null;
}

/**
 * Sección de datos generales: Tipo de operación, descripción, tercero y vehículo.
 */
export function TransactionGeneralData({
    formData,
    setFormData,
    terceroType,
    setTerceroType,
    metadata,
}: GeneralDataProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Columna izquierda: tipo + descripción */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="transaction-type" className="text-[10px] font-black uppercase text-slate-900 tracking-widest pl-1">
                        Tipo de Operación Contable
                    </Label>
                    <div className="relative">
                        <select
                            id="transaction-type"
                            className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-10 text-xs font-black uppercase tracking-widest appearance-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900"
                            value={formData.tipo}
                            onChange={(e) => setFormData({
                                ...formData,
                                tipo: e.target.value as TipoTransaccion,
                            })}
                        >
                            <option value="INGRESO">🔵 RECIBO DE CAJA (INGRESO)</option>
                            <option value="EGRESO">🔴 COMPROBANTE DE EGRESO</option>
                            <option value="NOTA_CONTABLE">⚪ NOTA DE CONTABILIDAD</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-900 pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="transaction-description" className="text-[10px] font-black uppercase text-slate-900 tracking-widest pl-1">
                        Glosa / Descripción General
                    </Label>
                    <div className="relative">
                        <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-900" />
                        <Input
                            id="transaction-description"
                            placeholder="Ej: Ajuste de saldos mes anterior..."
                            className="h-11 pl-10 bg-white border-slate-200 text-sm font-medium"
                            value={formData.descripcion}
                            onChange={(e) => setFormData({
                                ...formData,
                                descripcion: e.target.value,
                            })}
                        />
                    </div>
                </div>
            </div>

            {/* Columna derecha: tercero + vehículo */}
            <div className="space-y-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-[10px] font-black uppercase text-slate-900 tracking-widest pl-1">
                            Tercero / Responsable
                        </Label>
                        <div className="flex p-0.5 bg-slate-100 rounded-md">
                            {(["user", "provider"] as TerceroType[]).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    className={cn(
                                        "px-3 py-1 text-[9px] font-black uppercase tracking-[0.15em] rounded transition-all",
                                        terceroType === t 
                                            ? "bg-white text-slate-900 shadow-sm" 
                                            : "text-slate-900 hover:text-slate-600"
                                    )}
                                    onClick={() => setTerceroType(t)}
                                >
                                    {t === "user" ? "Personal" : "Aliado"}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <select
                            className="w-full h-11 bg-white border border-slate-200 rounded-lg pl-4 pr-10 text-xs font-bold appearance-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900"
                            value={terceroType === "user" ? formData.terceroId : formData.proveedorId}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (terceroType === "user") {
                                    setFormData({ ...formData, terceroId: val, proveedorId: "" });
                                } else {
                                    setFormData({ ...formData, proveedorId: val, terceroId: "" });
                                }
                            }}
                        >
                            <option value="">
                                {terceroType === "user" ? "— Seleccionar usuario interno —" : "— Seleccionar proveedor externo —"}
                            </option>
                            {terceroType === "user"
                                ? metadata?.usuarios.map((u) => (
                                      <option key={u.id} value={u.id}>
                                          {u.nombres?.toUpperCase()} {u.apellidos?.toUpperCase()} — {u.numeroDocumento}
                                      </option>
                                  ))
                                : metadata?.proveedores.map((p) => (
                                      <option key={p.id} value={p.id}>
                                          {p.nombres?.toUpperCase()} — {p.numeroDocumento}
                                      </option>
                                  ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-900 pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="transaction-vehicle" className="text-[10px] font-black uppercase text-slate-900 tracking-widest pl-1">
                        Vehículo de Operación (Opcional)
                    </Label>
                    <div className="relative">
                        <Car size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-900" />
                        <select
                            id="transaction-vehicle"
                            className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-10 text-xs font-bold appearance-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900"
                            value={formData.metaVehiculoId}
                            onChange={(e) => setFormData({
                                ...formData,
                                metaVehiculoId: e.target.value,
                            })}
                        >
                            <option value="">Ninguno (Gasto administrativo general)</option>
                            {metadata?.vehiculos.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.placa?.toUpperCase()} — {v.clase || "Vehículo"}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-900 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}
