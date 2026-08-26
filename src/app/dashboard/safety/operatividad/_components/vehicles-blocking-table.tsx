"use client";

import { useState } from "react";
import { toggleVehicleBlockAction } from "@/actions/fleet/operability.actions";
import { useRouter } from "next/navigation";
import { formatPlaca } from "@/lib/utils";
import { SuperOverrideDialog } from "@/app/dashboard/vehiculos/[id]/_components/super-override-dialog";
import { toast } from "sonner";
import { Search, Car, User, Lock, Unlock, ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Vehicle {
    id: string;
    placa: string;
    marca: string | null;
    modelo: string | null;
    bloqueadoManualmente: boolean;
    razonBloqueo: string | null;
    estadoOperativo: string;
    propietario: string | null;
    overrideActivo?: boolean;
    justificacionOverride?: string | null;
}

interface VehiclesBlockingTableProps {
    initialVehicles: Vehicle[];
}

export function VehiclesBlockingTable({
    initialVehicles,
}: VehiclesBlockingTableProps) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [overrideDialogOpen, setOverrideDialogOpen] = useState(false);
    const [razon, setRazon] = useState("");
    const [loading, setLoading] = useState(false);

    const filteredVehicles = initialVehicles.filter(
        (v) =>
            v.placa.toLowerCase().includes(search.toLowerCase()) ||
            (v.propietario && v.propietario.toLowerCase().includes(search.toLowerCase())),
    );

    const handleToggle = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setRazon(vehicle.razonBloqueo || "");
        setOpen(true);
    };

    const confirmAction = async () => {
        if (!selectedVehicle) return;

        const isCurrentlyBlocked = selectedVehicle.bloqueadoManualmente;
        const willBlock = !isCurrentlyBlocked;

        if (willBlock && !razon.trim()) {
            toast.error("Debe especificar una razón para el bloqueo");
            return;
        }

        setLoading(true);
        try {
            const res = await toggleVehicleBlockAction(
                selectedVehicle.id,
                willBlock,
                razon,
            );
            if (res.success) {
                toast.success(willBlock ? `Vehículo ${selectedVehicle.placa} bloqueado` : `Vehículo ${selectedVehicle.placa} desbloqueado`);
                setOpen(false);
                router.refresh();
            } else {
                toast.error(res.error || "Error al procesar la acción");
            }
        } catch (error) {
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-secondary transition-colors" />
                <input
                    type="text"
                    placeholder="Filtrar por placa o propietario..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 h-12 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-0 focus:border-secondary transition-all shadow-sm"
                />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-bottom-2 border-slate-100">Identidad</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-bottom-2 border-slate-100">Estatus PESV</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-bottom-2 border-slate-100">Restricción</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-bottom-2 border-slate-100">Propietario</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-bottom-2 border-slate-100">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredVehicles.map((v) => (
                                <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm">
                                                <Car className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-slate-900">{formatPlaca(v.placa)}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{v.marca || "---"} • {v.modelo || "---"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                            v.estadoOperativo === "OPERATIVO" 
                                                ? "bg-emerald-100 text-emerald-700" 
                                                : v.estadoOperativo === "OPERATIVO_OVERRIDE" 
                                                    ? "bg-amber-100 text-amber-700 border border-amber-200"
                                                    : "bg-red-100 text-red-700"
                                        )}>
                                            {v.estadoOperativo === "OPERATIVO_OVERRIDE" ? "⚠️ Supervisión" : v.estadoOperativo}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    v.bloqueadoManualmente ? "bg-red-500" : "bg-emerald-500"
                                                )} />
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest",
                                                    v.bloqueadoManualmente ? "text-red-600" : "text-emerald-600"
                                                )}>
                                                    {v.bloqueadoManualmente ? "BLOQUEADO" : "LIBRE"}
                                                </span>
                                            </div>
                                            {v.razonBloqueo && (
                                                <div className="text-[10px] font-medium text-slate-400 italic bg-slate-50 px-2 py-0.5 rounded border border-slate-100 inline-block w-fit">
                                                    {v.razonBloqueo}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <User className="h-3.5 w-3.5 text-slate-400" />
                                            <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{v.propietario || "Sin titular"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Button 
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleToggle(v)} 
                                                className={cn(
                                                    "h-9 px-4 text-[10px] font-black uppercase tracking-widest rounded-lg gap-2",
                                                    v.bloqueadoManualmente ? "text-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 border-emerald-200" : "text-red-600 bg-red-50/50 hover:bg-red-50 border-red-200"
                                                )}
                                            >
                                                {v.bloqueadoManualmente ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                                                {v.bloqueadoManualmente ? "Liberar" : "Bloquear"}
                                            </Button>
                                            <Button 
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedVehicle(v);
                                                    setOverrideDialogOpen(true);
                                                }}
                                                className={cn(
                                                    "h-9 px-4 text-[10px] font-black uppercase tracking-widest rounded-lg gap-2",
                                                    v.overrideActivo ? "bg-amber-50 text-amber-700 border-amber-200" : ""
                                                )}
                                            >
                                                <ShieldCheck className="h-3 w-3" />
                                                {v.overrideActivo ? "Ver Override" : "Supervisión"}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Bloqueo */}
            {open && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[120] p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className={cn(
                                "h-12 w-12 rounded-xl flex items-center justify-center shadow-sm border",
                                selectedVehicle?.bloqueadoManualmente ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"
                            )}>
                                {selectedVehicle?.bloqueadoManualmente ? <Unlock className="h-6 w-6 text-emerald-600" /> : <Lock className="h-6 w-6 text-red-600" />}
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                    {selectedVehicle?.bloqueadoManualmente ? "Rehabilitar Unidad" : "Bloquear Unidad"}
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatPlaca(selectedVehicle?.placa || "")}</p>
                            </div>
                        </div>

                        {!selectedVehicle?.bloqueadoManualmente && (
                            <div className="mb-6 space-y-3">
                                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] block">
                                    Razón del Bloqueo Operativo
                                </label>
                                <textarea
                                    value={razon}
                                    onChange={(e) => setRazon(e.target.value)}
                                    placeholder="Especifique el motivo de la restricción..."
                                    className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-0 focus:border-red-400 transition-all resize-none outline-none"
                                />
                                <p className="text-[10px] text-red-500 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                                    <AlertTriangle className="h-3 w-3" />
                                    Acción Restrictiva Inmediata
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                            <Button 
                                variant="ghost" 
                                onClick={() => setOpen(false)}
                                className="font-black uppercase tracking-widest text-[10px] h-11 px-6"
                            >
                                Cancelar
                            </Button>
                            <Button 
                                onClick={confirmAction} 
                                disabled={loading}
                                className={cn(
                                    "font-black uppercase tracking-widest text-[10px] h-11 px-8 shadow-lg",
                                    selectedVehicle?.bloqueadoManualmente 
                                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200" 
                                        : "bg-red-600 hover:bg-red-700 text-white shadow-red-200"
                                )}
                            >
                                {loading ? "Procesando..." : "Confirmar Acción"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {selectedVehicle && (
                <SuperOverrideDialog
                    open={overrideDialogOpen}
                    onOpenChange={setOverrideDialogOpen}
                    vehiculoId={selectedVehicle.id}
                    placa={selectedVehicle.placa}
                    isOverrideActive={selectedVehicle.overrideActivo || false}
                />
            )}
        </div>
    );
}

